# AdHelp.io UX Bug Report
**Date:** 2026-04-09  
**Reviewed page:** app.adhelp.io/companies — Company User Access form  
**Source:** Visual inspection of provided screenshot  
**Branch:** claude/adhelp-ux-review-xKGjl  

---

## Summary

This report documents UX bugs and issues found on the **Company User Access** page (`/companies`). Issues are categorised by severity: **Critical**, **High**, **Medium**, and **Low**. Each entry is formatted for direct copy-paste into a backlog.

---

## BUG-001 — Icon overlaps text in role card headers

**Page:** Company User Access — Select Access section  
**Severity:** High  
**Component:** Role selection cards ("Company Admin" / "Company Collaborator")

**Description:**  
The user/person icons inside the role card headers are visually overlapping with the first character of the card title text. The icon for "Company Admin" sits on top of the "C" in "Company Admin", and the same happens in the "Company Collaborator" card. This makes the heading look broken and is hard to read.

**Steps to reproduce:**  
1. Navigate to Companies → Add or edit a company user  
2. Observe the "Select Access" section  
3. Look at the headings of both role cards

**Expected behaviour:**  
The icon should be clearly separated from the label text — either placed to the right of the title with adequate spacing, or left-aligned as a standalone element with sufficient margin/padding so it never overlaps the text.

**Actual behaviour:**  
The icon is positioned directly over the first letter of the card title, creating a visual collision.

**Likely cause:**  
Incorrect CSS positioning (e.g. absolute/negative margin) on the icon element, or the icon and text are placed in a flex/grid row without adequate gap.

**Suggested fix:**  
- Add `gap` or `margin-right` between icon and text in the card header flex container  
- Or move the icon to the right side of the header row (away from the title text)

---

## BUG-002 — "Name" field uses an email address as placeholder text

**Page:** Company User Access — form fields at the top  
**Severity:** High  
**Component:** Name input field

**Description:**  
The **Name** field shows `julia@narokallan.se` as its placeholder text. This is an email address, not a name. The **Email** field directly below it also shows the same placeholder. This is confusing — users cannot tell what format the Name field expects, and may try to type an email address into it.

**Steps to reproduce:**  
1. Navigate to Company User Access (add or edit a user)  
2. Observe the placeholder in the "Name" field

**Expected behaviour:**  
Placeholder should reflect the expected input, e.g. `Full name` or `Julia Andersson`.

**Actual behaviour:**  
Placeholder shows an email address: `julia@narokallan.se`.

**Suggested fix:**  
Change the Name field placeholder to a realistic name string, e.g. `Julia Andersson` or simply `Full name`.

---

## BUG-003 — Name and Email fields have identical placeholder text

**Page:** Company User Access — form header  
**Severity:** Medium  
**Component:** Name + Email input fields

**Description:**  
Both the **Name** and **Email** fields display `julia@narokallan.se` as placeholder text. This duplication provides no guidance to the user on what each field expects and makes it look like the Name field is another email field.

**Steps to reproduce:**  
1. Open the Company User Access form  
2. Compare the placeholder text in "Name" vs "Email"

**Expected behaviour:**  
Each field should have a distinct, descriptive placeholder appropriate to the data type expected.

**Actual behaviour:**  
Both fields show the same email-format placeholder text.

**Suggested fix:**  
- Name: `Julia Andersson` (or `Full name`)  
- Email: `julia@narokallan.se` (keep as-is)

---

## BUG-004 — No required field indicators on the form

**Page:** Company User Access  
**Severity:** Medium  
**Component:** Form fields (Name, Email, Company Name)

**Description:**  
The form does not visually indicate which fields are required before submission. There are no asterisks (`*`), "required" labels, or inline validation hints. Users have no way to know which fields must be filled before clicking Save.

**Expected behaviour:**  
Required fields should be marked with a standard indicator (e.g. a red asterisk `*` next to the label, or a "(required)" annotation).

**Actual behaviour:**  
No required field indicators are present anywhere on the form.

**Suggested fix:**  
Add asterisk indicators (`*`) next to required field labels and include a legend note such as `* Required field` near the form heading or above the Save button.

---

## BUG-005 — Inconsistent card widths in the role selector

**Page:** Company User Access — Select Access section  
**Severity:** Medium  
**Component:** Role selection cards

**Description:**  
The two role cards ("Company Admin" and "Company Collaborator") are rendered at visually different widths. The selected card ("Company Collaborator", blue) appears wider than the unselected "Company Admin" card, despite both being options in the same selection group. This inconsistency suggests a layout issue (e.g. the selected state is adding padding or border that is not accounted for in the card's box model).

**Steps to reproduce:**  
1. Open Company User Access  
2. Select "Company Collaborator"  
3. Compare the widths of both cards side by side

**Expected behaviour:**  
Both cards should be equal in width regardless of selection state.

**Actual behaviour:**  
The selected card appears wider than the unselected card.

**Likely cause:**  
A border or outline added on selection is not using `box-sizing: border-box`, causing the card to expand when selected. Or the selected card has additional padding applied via the active CSS class.

**Suggested fix:**  
Use `box-sizing: border-box` on the card element, or use `outline` instead of `border` for the selection indicator so it does not affect layout dimensions.

---

## BUG-006 — Highly inconsistent content density between role cards

**Page:** Company User Access — Select Access section  
**Severity:** Low  
**Component:** Role card permission lists

**Description:**  
The "Company Admin" card contains a notably verbose description for Feed Management: *"Create, Edit & Delete all projects, Feeds, Actions, Filters, Schedule"* — which wraps to three lines. In contrast, "Company Collaborator" shows *"View"* for the same permission. This creates a large height imbalance between the two cards. The Company Admin card becomes much taller, making the layout look unbalanced and harder to scan for comparison.

**Expected behaviour:**  
Permission descriptions should follow a consistent length/style across both role cards so users can easily compare them at a glance.

**Actual behaviour:**  
Permission descriptions are inconsistently verbose, causing significant height differences between cards.

**Suggested fix (two options):**  
1. Standardise the description format: e.g. use short action verbs only — "Create, Edit & Delete" for Admin and "View" for Collaborator — removing the object list.  
2. Use a tooltip or expandable detail to show the full description on hover/click, keeping the card compact.

---

## BUG-007 — Role card selection state is colour-only (accessibility risk)

**Page:** Company User Access — Select Access section  
**Severity:** Low  
**Component:** Role selection cards

**Description:**  
The currently selected role is indicated solely by a change in background colour (white → blue). There is no secondary indicator (checkmark icon, border, tick, or "Selected" label) to communicate the selected state. This is a potential accessibility issue for users with colour-vision deficiency, and may also be unclear to sighted users unfamiliar with the pattern.

**Expected behaviour:**  
Selection state should be communicated through at least two visual cues — colour + shape/icon.

**Actual behaviour:**  
Selection is indicated by background colour change only.

**Suggested fix:**  
Add a checkmark icon (e.g. top-right corner of the card) or a "Selected" badge that appears when the card is active. This makes the selection state unambiguous regardless of colour perception.

---

## BUG-008 — Navigation bar overflow risk on smaller screens

**Page:** All pages (global nav)  
**Severity:** Low  
**Component:** Top navigation bar

**Description:**  
The top navigation bar contains 8 items: Companies, Accounts, Dashboard, Feed Management, Data Flow, MCP, Users, Profile. All are displayed as inline text links with no visible overflow handling. On smaller viewport widths (e.g. 1280px or below), these items will likely wrap or overflow, breaking the layout. No hamburger menu or responsive collapse behaviour is visible in the screenshot.

**Expected behaviour:**  
Navigation should collapse gracefully on smaller screens — either via a hamburger/drawer menu, or by truncating lower-priority items into a "More" dropdown.

**Actual behaviour:**  
All 8 nav items appear as horizontal text links with no responsive fallback visible.

**Suggested fix:**  
Implement a responsive navigation pattern — e.g. collapse the nav into a drawer or "More" dropdown at breakpoints below 1400px.

---

## BUG-009 — "Company Name" dropdown label is very small and easy to miss

**Page:** Company User Access  
**Severity:** Low  
**Component:** Company Name dropdown field

**Description:**  
The label "Company Name" above the dropdown is visually very small compared to the other field labels ("Name", "Email"). It appears to use a lighter font weight or smaller font size, reducing its visual prominence. This creates inconsistency in the form's visual hierarchy.

**Expected behaviour:**  
All form field labels should share a consistent typography style (same size, weight, and colour).

**Actual behaviour:**  
"Company Name" label appears smaller/lighter than the sibling labels above it.

**Suggested fix:**  
Ensure all form field labels use a consistent CSS class/style token. Audit the label styles for `Name`, `Email`, and `Company Name` and normalise them.

---

## Summary Table

| ID       | Description                                      | Severity | Component               |
|----------|--------------------------------------------------|----------|-------------------------|
| BUG-001  | Icon overlaps text in role card headers          | High     | Role card header        |
| BUG-002  | Name field uses email as placeholder             | High     | Name input              |
| BUG-003  | Name + Email have identical placeholder text     | Medium   | Form fields             |
| BUG-004  | No required field indicators                     | Medium   | Form                    |
| BUG-005  | Inconsistent card widths (selection state)       | Medium   | Role cards              |
| BUG-006  | Inconsistent content density between role cards  | Low      | Role card permissions   |
| BUG-007  | Selection state is colour-only (a11y risk)       | Low      | Role cards              |
| BUG-008  | Nav bar overflow risk on smaller screens         | Low      | Global navigation       |
| BUG-009  | "Company Name" label inconsistent typography     | Low      | Form label              |

---

*Report generated from screenshot review. Further issues may exist on other pages (Accounts, Dashboard, Feed Management, Data Flow, MCP, Users) and on mobile viewports. A full audit with live browser access and mobile emulation is recommended.*
