# MF Task Reference — Ocean Import

_Single source of truth for all Ocean Import task definitions in MyFreight._
_Replaces: Master_task_reference_04-05-2026.md and mf-task-faq-content.md_
_Last updated: 06 May 2026_

---

## How to read this file

Each task entry contains all fields needed for both operational use and system configuration:

- **Stage / Team / Automation / Deadline / Scope** — structural metadata
- **DEV NOTE** — system behaviour, automation logic, integration notes (developer-facing; omitted where not applicable)
- **Action** — what the operational user must do
- **Data to check** — checklist of fields to verify
- **Conditions & exceptions** — when behaviour differs or the task does not apply

**Automation types:** `full` (auto-completes without user action) · `api-automated` (auto-completes on API event) · `recurring` (resets on each trigger) · `manual` (user executes) · `exception` (conditional — only appears in specific circumstances)

---

## Changelog

### 06 May 2026
| Task | Field | Change |
|---|---|---|
| t26 Arrival Notice | New task | Added. Import Operations · DE only · Manual · 2 days before ATA |
| t27 Consol booking confirmation | New task | Added. Import Booking · All countries · Manual · 5 days before ETD · Consol shipments only |
| — | File structure | Merged Master_task_reference and mf-task-faq-content into single file |

### 04 May 2026
| Task | Field | Change |
|---|---|---|
| t2 Request booking confirmation | Data to check #2 | "Shipment reference and voyage details" → "Carrier shipment number and voyage details" |
| t7 Verify commercial invoice & packing list | Data to check #5 | "Package count and gross weight" → "Package count, net weight and gross weight" |
| t12 Send documents to Customs | Data to check | Removed "All STG-3 document tasks completed"; "No open items on the shipment" → "No Documentation related open items on the shipment" |
| t16 Request carrier release | Data to check | Removed "Customs clearance confirmed before requesting" |
| t16 Request carrier release | Conditions & exceptions | Full replacement — new text: "For some carriers a local invoice must be paid before receiving a release." |
| t17 Carrier release confirmed | Data to check #4 | "Any holds (customs, freight, lien)" → "Any holds (customs, freight, unpaid invoices)" |
| t25 Dev message log | Conditions & exceptions | Added: "Always set the Dev Message Log back to Completed (green) once you have addressed the described problem." |

---

## Open points

| Ref | Subject | Status |
|---|---|---|
| TBD-01 | t18 Delivery planning / Arrival notification — confirm whether task should be renamed to "Delivery planning" only given that arrival notification for DE is now handled by t26. Confirm whether any rename applies to all countries. | Pending confirmation |
| — | t10 Verify insurance certificate — MF configuration to drive task visibility via Compliance tab Insurance flag | Pending confirmation |
| — | t14 ETA Warning — confirm whether native MF ETA notifications are adequate or whether a daily pipeline is needed | Pending decision |
| — | t17 Carrier release confirmed — future auto-complete via S)One / Ci5 / Twiki integration | Long-term dependency |
| — | t26 / t27 — not yet reflected in task-reference-guide.js or mf-task-faq.html | Pending build |
| — | Country exception log — named owner and review cadence to be assigned | Pending assignment |
| — | Workshop parking lot items — proactive async check-in recommended | Pending action |
| — | GitHub → self-hosted migration | Not yet scheduled |

---

## STG-1 — Booking

---

### t1 — Validate booking
**Stage:** STG-1 · **Team:** Import Booking · **Automation:** full · **Deadline:** 5 days before ETD
**Scope:** FR ✓ · DE – · NL ✓ · IT ✓ · PL ✓
**DEV NOTE:** API bookings only. Auto-completes when all mandatory booking fields are populated. Mandatory fields: Customer Name, Load type (FCL/LCL), Movement type (Import/Export), Cargo ready date, Targeted arrival date, Customer reference, Agent reference, Incoterm, Origin port, Destination port. When FCL is selected, container type and count also become mandatory.

**Action:** Confirm that all required booking fields are present and correct. For API bookings where all fields are populated, this task completes automatically. For manual or exception bookings, review the record and complete the task once validated.

**Data to check**
- Consignee and shipper details
- POL and POD
- ETD and ETA
- Carrier and service
- Container type and count
- Incoterm

---

### t2 — Request booking confirmation
**Stage:** STG-1 · **Team:** Import Booking · **Automation:** manual · **Deadline:** 14 days before ETD
**Scope:** FR ✓ · DE – · NL ✓ · IT ✓ · PL ✓

**Action:** Contact the carrier or agent to request formal confirmation that space has been allocated for this shipment.

**Data to check**
- Carrier or agent contact details
- Carrier shipment number and voyage details
- Container type and quantity

---

### t3 — Booking confirmation
**Stage:** STG-1 · **Team:** Import Booking · **Automation:** manual · **Deadline:** 5 days before ETD
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓

**Action:** Record and confirm that space has been formally released by the carrier. Complete this task once written confirmation is received.

**Data to check**
- Booking reference from carrier
- Vessel and voyage match
- Container type and count confirmed
- POL and POD match original booking

**Conditions & exceptions:** DE: always mandatory. FR and NL: conditional on the customer — check whether confirmation is required before marking complete. Where confirmation has not been received and the deadline is approaching, escalate to the carrier.

---

### t27 — Consol booking confirmation
**Stage:** STG-1 · **Team:** Import Booking · **Automation:** manual · **Deadline:** 5 days before ETD
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓

**Action:** Confirm that a slot has been allocated on the consol shipment by the carrier or consolidator. Complete this task once written confirmation is received.

**Data to check**
- Booking reference from carrier or consolidator
- Consol shipment reference
- Container or cargo slot confirmed
- POL and POD match original booking

**Conditions & exceptions:** Consol (LCL consolidation) shipments only. Not applicable for FCL shipments. Complete once written confirmation of the consol slot has been received. If confirmation is not received before the deadline, escalate to the carrier or consolidator.

---

## STG-2 — Departure

---

### t4 — Check agent update
**Stage:** STG-2 · **Team:** Import Booking · **Automation:** recurring · **Deadline:** 3 days before ETD
**Scope:** FR ✓ · DE – · NL ✓ · IT – · PL ✓
**DEV NOTE:** API shipments only. Resets to Pending on each agent update received via the SnapLogic API. DE and IT excluded — no agent integrations yet.

**Action:** Review the latest data pushed by the agent via the SnapLogic API and confirm it is correct. This task resets to Pending each time a new agent update is received — it does not need to be actioned if no update has come in.

**Data to check**
- ETD and ETA
- Vessel name
- Carrier shipment number
- Container number

**Conditions & exceptions:** Applies to API shipments only — not applicable for manual bookings. DE and IT are not yet live for this task due to no agent integrations. If data received from the agent contradicts what is in MF, do not overwrite — raise with your team lead.

---

### t5 — Departure shipment data
**Stage:** STG-2 · **Team:** Import Booking · **Automation:** api-automated · **Deadline:** 5 days before ETD
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓
**DEV NOTE:** For API shipments this task is automatically marked as Completed. For manual shipments, the user must verify and enter all fields.

**Action:** Manually enter or verify all departure shipment data fields in MF. Complete the task once all required fields are populated and confirmed.

**Data to check**
- POD and POL
- ETD and ETA
- Vessel name
- Carrier
- Carrier shipment number
- Contract number

**Conditions & exceptions:** Applies to non-API shipments only. If the shipment is agent-sourced via API, use the Check agent update task instead. If any field cannot be confirmed before the deadline, log this in the shipment notes and escalate.

---

### t6 — Agent Pre-alert
**Stage:** STG-2 · **Team:** Import Booking · **Automation:** full · **Deadline:** 2 days after ETD
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓
**DEV NOTE:** For API shipments, auto-completes when HBL, MBL and Container # are all present in the shipment.

**Action:** No action required. This task completes automatically when the agent pre-alert is received with all required data. If the task remains Pending after the expected pre-alert date, follow up with the agent.

**Data to check**
- HBL number
- MBL number
- Container number

**Conditions & exceptions:** If the pre-alert arrives without one or more of the required fields, the task will remain Pending. In this case, contact the agent to request the missing information before the arrival deadline.

---

## STG-3 — Documentation & Pre-arrival

---

### t7 — Verify commercial invoice & packing list
**Stage:** STG-3 · **Team:** Import Operations · **Automation:** manual · **Deadline:** 7 days before ETA
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓

**Action:** Retrieve the commercial invoice and packing list from the shipment documents and cross-check against MF shipment data. Complete the task once all fields are verified and consistent.

**Data to check**
- Consignee and shipper names
- Cargo description and HS code
- Declared value and currency
- Incoterm
- Package count, net weight and gross weight

**Conditions & exceptions:** If discrepancies are found between the invoice and MF data, do not complete the task — log the issue and contact the agent or customer to resolve. All fields must match before completion.

---

### t8 — Verify Seaway bill
**Stage:** STG-3 · **Team:** Import Operations · **Automation:** manual · **Deadline:** 5 days before ETA
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓

**Action:** Verify the seaway bill against the MF shipment record. For API shipments, this task may auto-complete when the document is received from the agent. For manual shipments, review the document and complete manually once verified.

**Data to check**
- Shipper and consignee parties
- POL and POD
- Container number
- Cargo description and weight
- Carrier and vessel details

**Conditions & exceptions:** If the seaway bill is not yet received by 5 days before ETA, follow up with the agent. If the document arrives via API, check auto-completion status — manual review may still be needed if the API data is incomplete.

---

### t9 — HBL / TLX release
**Stage:** STG-3 · **Team:** Import Operations · **Automation:** full · **Deadline:** 3 days before ETA
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓
**DEV NOTE:** Auto-completes when "Direct Master" is set on the shipment in MyFreight.

**Action:** No action required. This task completes automatically when the HBL or TLX release is provided by the agent via API. If the task remains Pending, contact the agent to confirm release status.

**Data to check**
- HBL or TLX release confirmation received
- Release method (OBL surrender / TLX / SeaWaybill)

**Conditions & exceptions:** If the release document arrives outside the API (e.g. via email), manually upload the document to the shipment record and complete the task.

---

### t10 — Verify insurance certificate
**Stage:** STG-3 · **Team:** Import Operations · **Automation:** exception · **Deadline:** 10 days after ATD
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓
**DEV NOTE:** Task appears only when Insurance has been enabled on the shipment in MyFreight. MF configuration to drive task visibility via the Compliance tab Insurance flag is pending confirmation.

**Action:** Check whether insurance applies to this shipment. If it does, retrieve the insurance certificate and verify it against the cargo details. Complete the task once verified, or mark not applicable if insurance is not required.

**Data to check**
- Incoterm (insurance typically required for CIF/CIP)
- Insured value and currency
- Coverage scope matches cargo
- Certificate validity dates

**Conditions & exceptions:** This task is conditional on incoterm and country-specific rules. Check the Compliance tab Insurance flag in MF to determine applicability. MF configuration to drive task visibility by this flag is pending confirmation.

---

## STG-4 — Customs

---

### t11 — Check / complete customs data
**Stage:** STG-4 · **Team:** Import Documentation · **Automation:** manual · **Deadline:** 7 days before ETA
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓

**Action:** Carry out a pre-arrival check to confirm that all data required for customs entry is complete and accurate in MF. Complete the task once all fields are confirmed ready. All fields must be resolved by 7 days before ETA to avoid delaying the customs submission.

**Data to check**
- HS codes
- Declared value and currency
- Country of origin
- Incoterm
- Package count, weight and dimensions
- Consignee EORI number

---

### t12 — Send documents to Customs
**Stage:** STG-4 · **Team:** Import Documentation · **Automation:** manual · **Deadline:** 2 days before ETA
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓
**DEV NOTE:** Executing this task triggers the webhook that submits the customs package to the Customs system. A failed submission resets this task to Pending and also sets the Dev Message Log to Pending. Failure details are available in the Dev Message Log.

**Action:** Execute this task in MF to trigger the webhook that sends the customs package to the Customs system. Do not send documents outside MF — the task execution is the trigger for the automated submission.

**Data to check**
- Customs data check completed
- No Documentation related open items on the shipment

**Conditions & exceptions:** If Customs rejects the submission, the task will automatically reset to Pending and the Dev Message Log will also be set to Pending. Review the rejection reason in the Dev Message Log, correct the data, and re-execute the task.

---

### t13 — Customs clearance received
**Stage:** STG-4 · **Team:** Import Documentation · **Automation:** full · **Deadline:** On ATA
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓
**DEV NOTE:** Automatically set to Completed upon receipt of customs clearance confirmation from the Customs API. Prerequisite gate — STG-6 (Carrier Release) cannot begin until this task is complete.

**Action:** No action required. This task is created and immediately completed automatically when clearance confirmation is received from the Customs API.

**Data to check**
- Clearance reference number
- Clearance date and time

**Conditions & exceptions:** If customs clearance is not received within the expected window after submission, check the Dev Message Log for any errors. If no error is logged, contact the customs broker or authority directly.

---

## STG-5 — Pre-arrival Operations

---

### t14 — ETA Warning _(inactive — not in scope for current phase)_
**Stage:** STG-5 · **Team:** Import Operations · **Automation:** recurring · **Deadline:** No fixed deadline
**Scope:** FR – · DE – · NL – · IT – · PL –
**DEV NOTE:** Can be handled by native MyFreight ETA change notifications. If the native feature is inadequate, a daily pipeline will be needed to check for significant ETD/ETA deviations and update task status accordingly. Decision pending.

**Action:** Review the ETA deviation and assess operational impact. Coordinate with the customer and any delivery partners to adjust planning. Complete the task once the situation has been assessed and the customer informed.

**Data to check**
- Revised ETA from MF live tracking
- Original planned ETA
- Deviation in days (early or late)
- Downstream impact: carrier release, delivery planning, warehouse booking

**Conditions & exceptions:** This task becomes Pending automatically when MF live tracking shows the container arriving 7 or more days earlier or later than planned. It does not trigger for smaller deviations. If the deviation changes again, the task may reset.

---

### t15 — Terminal update
**Stage:** STG-5 · **Team:** Import Operations · **Automation:** manual · **Deadline:** No fixed deadline
**Scope:** FR ✓ · DE – · NL – · IT ✓ · PL –
**DEV NOTE:** Syncs data with the Fos-sur-Mer terminal system. Ensure webhook data is being sent to S)One and Ci5.

**Action:** Check the terminal system for the latest container status and update MF accordingly. Confirm port availability, berthing, and discharge information where available.

**Data to check**
- Terminal arrival / discharge status
- Container availability for pickup
- Terminal reference or PIN if required
- Any demurrage or free time implications

**Conditions & exceptions:** Applicable for FCL shipments entering via the ports of Marseille or Fos-sur-Mer (FR). Not applicable for DE, NL, or PL.

---

## STG-6 — Carrier Release

---

### t16 — Request carrier release
**Stage:** STG-6 · **Team:** Import Operations · **Automation:** manual · **Deadline:** 7 days before ETA
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓

**Action:** Send a release request by email to the carrier. Complete this task in MF once the request has been sent.

**Data to check**
- Carrier contact details
- Container number(s)
- MBL reference

**Conditions & exceptions:** For some carriers a local invoice must be paid before receiving a release.

---

### t17 — Carrier release confirmed
**Stage:** STG-6 · **Team:** Import Operations · **Automation:** manual · **Deadline:** 3 days before ETA
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓
**DEV NOTE:** Future integration with S)One, Ci5, or Twiki planned to auto-complete this task — out of scope for current phase.

**Action:** Check the port or carrier system to confirm that the container release has been granted. Complete this task in MF once release is confirmed.

**Data to check**
- Release status in port/carrier system
- PIN or release code if applicable
- Free time start and end dates
- Any holds (customs, freight, unpaid invoices)

**Conditions & exceptions:** Currently manual — future integration with S)One, Ci5, or Twiki is planned to auto-complete this task, but is out of scope for the current phase. If release is refused or delayed, log the reason and escalate to the carrier account manager.

---

## STG-7 — Delivery & Transport

---

### t18 — Delivery planning / Arrival notification
> **TBD-01:** Confirm whether this task should be renamed to "Delivery planning" only, given that arrival notification for DE is now handled by t26 Arrival Notice. Confirm whether any rename applies to all countries. No change until confirmed.

**Stage:** STG-7 · **Team:** Import Operations · **Automation:** manual · **Deadline:** 7 days before ETA
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓
**DEV NOTE:** Initial planning executed in the OutSystems bulk data updater, which pushes planned date, time, and locations to MF. Planning can be done in bulk but the transport order is per shipment.

**Action:** Plan and coordinate the delivery ahead of the shipment's arrival. Notify the customer of the imminent arrival and confirm the estimated delivery date and time window. Use the OutSystems bulk tool to push the planned delivery date, time, and locations to MF.

**Data to check**
- Customer contact and preferred notification method
- Planned delivery date and time window
- Delivery address in MF
- Any special delivery instructions on the shipment

**Conditions & exceptions:** If the customer has specific notification requirements (e.g. pre-advice window, delivery slot booking), check the customer profile before sending. If delivery cannot be planned within 2 days of ATA, log the reason and notify the customer of the delay.

---

### t19 — Transport Delivery Order
**Stage:** STG-7 · **Team:** Import Operations · **Automation:** manual · **Deadline:** 2 days before ATA
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓
**DEV NOTE:** Executing this task triggers an API call that pushes planned delivery data to Qargo and creates a PDF for the trucker. Task turns green on successful push. Unplanned containers are shown in the dashboard.

**Action:** Execute the Transport Delivery Order task in MF. This triggers an API call to push the planned delivery data to Qargo or the assigned trucker. The task turns green on a successful push.

**Data to check**
- Delivery address and contact
- Planned delivery date and time
- Container number(s)
- Trucker or transport partner assigned in MF

**Conditions & exceptions:** If the task does not turn green after execution, the API push has failed. Check the Dev Message Log for an error entry and resolve before retrying. Do not contact the trucker directly to communicate delivery details — MF is the system of record.

---

### t20 — Warehouse Inbound Order
**Stage:** STG-7 · **Team:** Import Operations · **Automation:** exception · **Deadline:** 3 days before ATA
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓
**DEV NOTE:** Task should be set to Pending automatically when one of the delivery addresses on the shipment is identified as a GDB warehouse location — implementation pending confirmation.

**Action:** Create and submit a Warehouse Inbound Order to the receiving warehouse. Coordinate with the warehouse to confirm the inbound slot and any handling requirements.

**Data to check**
- Warehouse name and address
- Inbound booking reference
- Cargo description, weight, and dimensions
- Handling instructions (hazardous, temperature, fragile)

**Conditions & exceptions:** This task only applies where cargo is delivered to a warehouse before final delivery to the end customer. If the shipment goes direct to consignee, this task is not required.

---

### t21 — LCL Devanning
**Stage:** STG-7 · **Team:** Import Operations · **Automation:** manual · **Deadline:** 5 days after ATA
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓

**Action:** Coordinate the devanning of the LCL container at the CFS or terminal. Confirm that all cargo for this shipment has been identified and separated correctly. Complete the task in MF once devanning is confirmed.

**Data to check**
- CFS or terminal contact and location
- LCL cargo description and marks
- Number of packages and weight
- Any cargo condition issues noted during devanning

**Conditions & exceptions:** LCL shipments only. Devanning is a prerequisite to customs clearance in the standard LCL flow — do not proceed to Send documents to Customs until devanning is complete and the cargo is confirmed.

---

### t22 — Request TCT + ERC (Le Havre only)
**Stage:** STG-7 · **Team:** Import Operations · **Automation:** manual · **Deadline:** On customs clearance
**Scope:** FR ✓ · DE – · NL – · IT ✓ · PL –

**Action:** Submit requests for the TCT (PCR) and ERC (leeg retour) to the relevant port authority or terminal at Le Havre. Complete the task in MF once both requests have been submitted.

**Data to check**
- Container number(s)
- Customs clearance reference
- Terminal or port authority contact at Le Havre
- Return depot details for empty container

**Conditions & exceptions:** Le Havre port operations only. This task is triggered on customs clearance. Not applicable for FR shipments entering through other ports (e.g. Marseille, Fos-sur-Mer).

---

### t23 — Return empty container monitoring
**Stage:** STG-7 · **Team:** Import Operations · **Automation:** manual · **Deadline:** No fixed deadline
**Scope:** FR – · DE ✓ · NL ✓ · IT – · PL ✓

**Action:** Confirm that the empty container has been returned to the carrier depot and update MF accordingly. Complete the task once return is confirmed.

**Data to check**
- Return depot location
- Return reference or gate-out confirmation
- Return deadline / last free day
- Container condition at return

**Conditions & exceptions:** NL: mandatory. DE: recommended for record completeness. If the container is not returned by the carrier's free time deadline, detention charges will apply — monitor proactively.

---

### t26 — Arrival Notice
**Stage:** STG-7 · **Team:** Import Operations · **Automation:** manual · **Deadline:** 2 days before ATA
**Scope:** FR – · DE ✓ · NL – · IT – · PL –

**Action:** Send a manual arrival notice to the customer confirming imminent arrival of the shipment. Complete this task in MF once the notification has been sent.

**Data to check**
- Customer contact and preferred notification method
- Shipment reference
- Estimated arrival date
- Any special delivery or notification requirements

**Conditions & exceptions:** DE only. Send the arrival notice once the ATA is confirmed or imminent. If the customer has a preferred notification lead time or format, check the customer profile before sending.

---

## STG-8 — Financial Handling

---

### t24 — Create invoice
**Stage:** STG-8 · **Team:** Financial Handling · **Automation:** manual · **Deadline:** No fixed deadline
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓

**Action:** Create the outbound invoice to the customer in the financial system. Ensure all charges are captured correctly before issuing.

**Data to check**
- All cost lines posted to the shipment
- Customer billing details and purchase order reference
- Applicable charge codes and VAT treatment
- Agreed rates and any surcharges

**Conditions & exceptions:** Do not issue the invoice until all cost lines are confirmed and the shipment is operationally complete. If any charges are pending (e.g. detention, waiting time), decide whether to hold the invoice or issue with a supplementary charge later.

---

## Error Handling (parallel — all stages)

---

### t25 — Dev message log
**Stage:** Parallel · **Team:** Error Handling · **Automation:** recurring · **Deadline:** No fixed deadline
**Scope:** FR ✓ · DE ✓ · NL ✓ · IT ✓ · PL ✓
**DEV NOTE:** Becomes Pending when a problem is detected with one or more integrated systems. A problem description with timestamp is provided in the log entry.

**Action:** Monitor the Dev Message Log on every shipment throughout the lifecycle. A Completed status is informational. A Pending status means an integration error or missing data requires your attention — review the log entry and resolve the issue.

**Data to check**
- Log entry type (error / warning / info)
- Affected task or integration point
- Timestamp of the issue
- Any related task that has also been reset to Pending

**Conditions & exceptions:** This log is persistent on every shipment and runs in parallel to all operational stages. It does not follow a sequential order. If multiple log entries are Pending simultaneously, prioritise those related to customs or carrier release as these are on the critical path. Always set the Dev Message Log back to Completed (green) once you have addressed the described problem.
