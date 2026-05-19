/* ============================================================
   GloForEx — Master Article Data
   master-article-data.js
   ============================================================ */

/*
  FAQ data structure:
  Each entry in FAQS represents one accordion section.

  {
    id:       string   — unique identifier (used as DOM id)
    question: string   — the header label shown in the accordion button
    blocks:   array    — ordered content blocks rendered inside the answer

    Block types:
      { type: "text",    content: "<p>HTML string</p>" }
      { type: "image",   src: "assets/filename.png", alt: "Caption text" }
      { type: "gif",     src: "assets/filename.gif", alt: "Caption text" }
      { type: "callout", icon: "ℹ️", content: "HTML string" }
      { type: "callout", icon: "⚠️", content: "HTML string", warn: true }
  }
*/

const FAQS = [
  // ── Add FAQ entries below ──────────────────────────────────
  // Example (remove or replace once real content is added):
  {
    id: "faq-example",
    question: "Example: How do I navigate to Master Article Data?",
    blocks: [
      {
        type: "text",
        content: "<p>This is a placeholder entry. Replace the <code>FAQS</code> array in <strong>js/master-article-data.js</strong> with real content once the instructions are ready.</p>"
      },
      {
        type: "callout",
        icon: "ℹ️",
        content: "Add <strong>image</strong> or <strong>gif</strong> blocks alongside text blocks to include screenshots and animations."
      }
    ]
  }
  // ── End of FAQ entries ─────────────────────────────────────
];

/* ── Render ─────────────────────────────────────────────────── */

function buildBlock(block) {
  switch (block.type) {

    case "text": {
      const div = document.createElement("div");
      div.className = "faq-text";
      div.innerHTML = block.content;
      return div;
    }

    case "image":
    case "gif": {
      const wrap = document.createElement("div");

      const media = document.createElement("div");
      media.className = "faq-media";
      media.onclick = () => openLightbox(block.src);

      const img = document.createElement("img");
      img.src = block.src;
      img.alt = block.alt || "";
      media.appendChild(img);

      if (block.type === "gif") {
        const badge = document.createElement("span");
        badge.className = "gif-badge";
        badge.textContent = "GIF";
        media.appendChild(badge);
      }

      wrap.appendChild(media);

      if (block.alt) {
        const caption = document.createElement("div");
        caption.className = "faq-media-caption";
        caption.textContent = block.alt;
        wrap.appendChild(caption);
      }

      return wrap;
    }

    case "callout": {
      const div = document.createElement("div");
      div.className = block.warn ? "faq-callout warn" : "faq-callout";

      const icon = document.createElement("span");
      icon.className = "faq-callout-icon";
      icon.textContent = block.icon || "ℹ️";

      const text = document.createElement("span");
      text.innerHTML = block.content;

      div.appendChild(icon);
      div.appendChild(text);
      return div;
    }

    default:
      return null;
  }
}

function buildFaqItem(faq) {
  const item = document.createElement("div");
  item.className = "faq-item";
  item.id = faq.id;

  /* Question button */
  const btn = document.createElement("button");
  btn.className = "faq-question";
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", faq.id + "-answer");

  const label = document.createElement("span");
  label.className = "faq-question-text";
  label.textContent = faq.question;

  const chevron = document.createElement("span");
  chevron.className = "faq-chevron";
  chevron.setAttribute("aria-hidden", "true");
  chevron.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 5L7 10L12 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  btn.appendChild(label);
  btn.appendChild(chevron);

  /* Answer body */
  const answer = document.createElement("div");
  answer.className = "faq-answer";
  answer.id = faq.id + "-answer";
  answer.setAttribute("role", "region");

  const inner = document.createElement("div");
  inner.className = "faq-answer-inner";

  faq.blocks.forEach(block => {
    const el = buildBlock(block);
    if (el) inner.appendChild(el);
  });

  answer.appendChild(inner);

  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    item.classList.toggle("open", !isOpen);
    btn.setAttribute("aria-expanded", String(!isOpen));
  });

  item.appendChild(btn);
  item.appendChild(answer);
  return item;
}

/* ── Lightbox ───────────────────────────────────────────────── */

window.openLightbox = function(src) {
  const lb    = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  lbImg.src = src;
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
};

window.closeLightbox = function(e) {
  if (e && e.target === document.getElementById("lightbox-img")) return;
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
};

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeLightbox();
});

/* ── Init ───────────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("faqContainer");
  FAQS.forEach(faq => container.appendChild(buildFaqItem(faq)));
});
