#!/usr/bin/env python3
"""
Build script to generate tasks.json from the master markdown reference.

Usage:
    python build_docs.py                          # auto-discovers the .md file in docs/
    python build_docs.py docs/my-reference.md     # explicit path
"""

import re
import sys
import json
from pathlib import Path

VALID_STATUSES = {'confirmed', 'draft'}

STAGE_MAP = {
    'STG-1': 'booking',
    'STG-2': 'departure',
    'STG-3': 'pre-arrival',
    'STG-4': 'arrival',
    'STG-5': 'clearance',
    'STG-6': 'delivery',
    'STG-7': 'post-arrival',
    'STG-8': 'financial',
    'Parallel': 'parallel',
}

STAGE_LABEL_MAP = {
    'STG-1': 'Stage 1',
    'STG-2': 'Stage 2',
    'STG-3': 'Stage 3',
    'STG-4': 'Stage 4',
    'STG-5': 'Stage 5',
    'STG-6': 'Stage 6',
    'STG-7': 'Stage 7',
    'STG-8': 'Stage 8',
    'Parallel': 'Parallel',
}

TEAM_MAP = {
    'Import Booking': 'booking',
    'Import Operations': 'operations',
    'Import Documentation': 'documentation',
    'Financial Handling': 'financial',
    'Error Handling': 'error',
}

AUTO_MAP = {
    'full': 'Auto-complete',
    'api-automated': 'API-automated',
    'recurring': 'Recurring',
    'manual': 'Manual',
    'exception': 'Exception',
}


def find_markdown(docs_dir: Path) -> Path:
    files = list(docs_dir.glob('*.md'))
    if not files:
        raise FileNotFoundError(f"No .md file found in {docs_dir}")
    if len(files) > 1:
        names = [f.name for f in files]
        raise ValueError(
            f"Multiple .md files found in {docs_dir}: {names}\n"
            "Pass the target file path as an argument: python build_docs.py <path>"
        )
    return files[0]


def parse_markdown_to_tasks(markdown_path: Path) -> list[dict]:
    content = markdown_path.read_text(encoding='utf-8')

    ocean_import_match = re.search(r'# MF Task Reference — Ocean Import', content)
    if not ocean_import_match:
        raise ValueError("Could not find '# MF Task Reference — Ocean Import' heading")

    tasks_content = content[ocean_import_match.end():]
    task_pattern = r'### (t\d+) — ([^\n]+)\n(.*?)(?=\n### t\d+ — |\n## |\Z)'

    tasks = []
    warnings = []

    for match in re.finditer(task_pattern, tasks_content, re.DOTALL):
        task_id, task_name, task_body = match.groups()

        stage_match     = re.search(r'\*\*Stage:\*\* ([^·\n]+)',               task_body)
        team_match      = re.search(r'\*\*Team:\*\* ([^·\n]+)',                task_body)
        auto_match      = re.search(r'\*\*Automation:\*\* ([^·\n]+)',          task_body)
        deadline_match  = re.search(r'\*\*Deadline:\*\* ([^·\n]+)',            task_body)
        scope_match     = re.search(r'\*\*Scope:\*\* ([^\n]+)',                task_body)
        status_match    = re.search(r'\*\*Status:\*\* ([^·\n]+)',              task_body)
        action_match    = re.search(r'\*\*Action:\*\* ([^\n]+)',               task_body)
        data_match      = re.search(r'\*\*Data to check\*\*\n((?:- [^\n]+\n)*)', task_body)
        cond_match      = re.search(r'\*\*Conditions & exceptions:\*\* ([^\n]+)', task_body)

        stage_raw    = stage_match.group(1).strip()    if stage_match    else ''
        team_raw     = team_match.group(1).strip()     if team_match     else ''
        auto         = auto_match.group(1).strip()     if auto_match     else ''
        deadline_lbl = deadline_match.group(1).strip() if deadline_match else ''
        scope_line   = scope_match.group(1).strip()    if scope_match    else ''
        status_raw   = status_match.group(1).strip()   if status_match   else 'confirmed'
        action       = action_match.group(1).strip()   if action_match   else ''
        conditional  = cond_match.group(1).strip()     if cond_match     else None

        data_to_check = []
        if data_match:
            for line in data_match.group(1).strip().split('\n'):
                item = line.lstrip('- ').strip()
                if item:
                    data_to_check.append(item)

        # Validate required fields
        missing = [f for f, v in [('stage', stage_raw), ('team', team_raw), ('action', action)] if not v]
        if missing:
            warnings.append(f"  {task_id}: missing {', '.join(missing)}")

        # Validate status value
        status = status_raw.lower()
        if status not in VALID_STATUSES:
            warnings.append(f"  {task_id}: unknown status '{status_raw}' — defaulting to 'confirmed'")
            status = 'confirmed'

        # Warn on unmapped stage/team so gaps are visible
        if stage_raw and stage_raw not in STAGE_MAP:
            warnings.append(f"  {task_id}: unmapped stage '{stage_raw}'")
        if team_raw and team_raw not in TEAM_MAP:
            warnings.append(f"  {task_id}: unmapped team '{team_raw}'")

        stage_key   = STAGE_MAP.get(stage_raw, stage_raw.lower())
        stage_label = STAGE_LABEL_MAP.get(stage_raw, stage_raw)
        team_key    = TEAM_MAP.get(team_raw, team_raw.lower())
        auto_label  = AUTO_MAP.get(auto, auto)

        # Scope: "FR ✓ · DE – · NL ✓" → ["FR", "NL"]
        scope_countries = []
        for part in scope_line.split(' · '):
            m = re.match(r'([A-Z]{2}) [✓–]', part.strip())
            if m and '✓' in part:
                scope_countries.append(m.group(1))

        tasks.append({
            "id":         task_id,
            "stage":      stage_key,
            "stageLabel": stage_label,
            "task":       task_name,
            "team":       team_key,
            "teamLabel":  team_raw,
            "auto":       auto,
            "autoLabel":  auto_label,
            "deadline":   {"label": deadline_lbl},
            "scope":      scope_countries,
            "status":     status,
            "nonOps":     False,
            "action":     action,
            "dataToCheck": data_to_check,
            "conditional": conditional,
        })

    if warnings:
        print("WARNINGS — review before deploying:")
        for w in warnings:
            print(w)

    return tasks


def main():
    docs_dir = Path(__file__).parent / 'docs'

    if len(sys.argv) > 1:
        markdown_path = Path(sys.argv[1])
        if not markdown_path.exists():
            print(f"Error: file not found: {markdown_path}", file=sys.stderr)
            sys.exit(1)
    else:
        markdown_path = find_markdown(docs_dir)

    output_path = Path(__file__).parent / 'data' / 'ocean' / 'import' / 'tasks.json'

    print(f"Source : {markdown_path}")
    tasks = parse_markdown_to_tasks(markdown_path)
    tasks.sort(key=lambda t: int(t['id'][1:]))

    output_path.write_text(json.dumps(tasks, indent=2, ensure_ascii=False), encoding='utf-8')

    confirmed = sum(1 for t in tasks if t['status'] == 'confirmed')
    draft     = sum(1 for t in tasks if t['status'] == 'draft')
    print(f"Output : {output_path}")
    print(f"Tasks  : {len(tasks)} total  ({confirmed} confirmed · {draft} draft)")


if __name__ == '__main__':
    main()
