---
page: contact
title: Contact
slug: /contact
lang: en
meta_title: Contact OpenSoft — we are in Budapest, come and find us
meta_description: Write to us, call us, or meet us in Budapest. A short message is enough to start; we usually reply within one working day.
last_updated: "{{LAST_UPDATED}}"
---

# Contact

## Say hello

You do not need a specification, a budget or a decision to talk to us. Most good projects here
started as three sentences from someone who was mildly fed up with a spreadsheet.

Tell us roughly what is going on — what you sell, how many people touch the process, and what breaks
most often — and we will tell you honestly whether we can help, and which of our systems fits. If the
answer is that you do not need us yet, we will say that too.

We answer every message ourselves. Nothing here is routed through a call centre.

---

## Where we are

**We live here.** Not "we have an office here" — the whole team is in Budapest, and that is a
deliberate choice rather than an accident of hiring.

It means you can meet the people who will actually run your system. It means we are in your timezone,
work on your calendar, and understand what happens to a Hungarian company in the second week of
January. And it means that when something needs a person in a room, a person can be in the room.

If you would rather talk face to face than exchange emails, say so. We will suggest a coffee
somewhere central and bring a laptop.

---

## Our city

We are unreasonably fond of this place, so forgive us a short detour.

### The Chain Bridge

The oldest of the permanent crossings, and still the one people mean when they say *the* bridge. Two
stone lions at each end, a pale span that looks almost weightless from the embankment, and a slow
pedestrian crossing that turns a five-minute walk into a fifteen-minute one because everybody stops
in the middle. It was the first structure to make Buda and Pest a single idea rather than two towns
staring at each other across the water. At night the cables light up and the whole thing looks like
it is drawn in chalk.

*Image placeholder:* `{{GALLERY_IMAGE_CHAIN_BRIDGE}}` — alt text: "The Széchenyi Chain Bridge at
dusk, seen from the Pest embankment."

### The Parliament

Enormous, improbable, and best viewed from the opposite bank, where you can take in the whole
ninety-six-metre dome and the long neo-Gothic frontage at once. It looks less like a building than a
declaration. In the late afternoon the limestone goes the colour of weak tea; after dark the
floodlights turn it the colour of bone, and the reflection doubles it in the river. Locals walk past
it every day and still, occasionally, look up.

*Image placeholder:* `{{GALLERY_IMAGE_PARLIAMENT}}` — alt text: "The Hungarian Parliament Building
lit at night, reflected in the Danube."

### The Fisherman's Bastion

Up on the Buda side, a set of white stone terraces and seven pointed turrets — one for each of the
founding Magyar tribes — that look like something drawn for a story and then accidentally built. The
climb is worth it for the view alone: the whole of Pest laid out flat below, the river bending away
north, the Parliament directly opposite at eye level. Go early. By eleven it belongs to everybody.

*Image placeholder:* `{{GALLERY_IMAGE_FISHERMANS_BASTION}}` — alt text: "The white stone terraces and
turrets of the Fisherman's Bastion overlooking Pest."

### The Danube

The reason for all of it. The river arrives from the north, cuts the city cleanly in two, and gives
Budapest its particular geometry: hills and quiet streets on the Buda side, flat boulevards and noise
on the Pest side, and eight or nine ways to get between them. In summer the embankments fill up in
the evening; in winter the water goes slate grey and the mist sits on it until noon. Every good view
in this city is, ultimately, a view of the Danube.

*Image placeholder:* `{{GALLERY_IMAGE_DANUBE}}` — alt text: "The Danube at dusk with the Buda hills
on the far bank."

---

## Write to us

Send us an email and we will reply, usually within one working day. A couple of sentences is plenty —
tell us roughly what you are trying to fix and we will take it from there.

You can also reach us on the phone number below during office hours, or ask for a demonstration of
any of our systems from the main page.

---

## Implementation spec — editor only

*Everything below this heading is build documentation, not page copy. It is stripped automatically
when the page is generated.*

**Form fields**

| Field | Type | Required | Validation / behaviour |
|---|---|---|---|
| Email address | `email` | yes | Must contain a local part, `@`, a domain and a top-level domain. Validated on blur; the message is shown under the field, not as a browser popup. |
| Message | `textarea` | yes | Minimum 10 characters. Grows with the content; no hard maximum. |
| `website` | text, off-screen | — | **Honeypot.** `tabindex="-1"`, `aria-hidden`, `autocomplete="off"`. Never shown to a human; must arrive empty. |
| — | Spam protection | — | **Server-side. No CAPTCHA — this is decided, not a default.** Three layers run at the webhook before anything is stored: the honeypot above, a minimum completion time (2.5 s), and an `Origin`/`Referer` check. Failures get a normal-looking `200` so bots learn nothing. Reasoning in `server-side notes` §7; the `Policy check` step in `deploy.yml` fails the build if a third-party widget is ever added. |
| Send | `submit` | — | Label: **Send message**. Disabled until both fields are valid. Shows "Sending…" while in flight. |

**Microcopy**

- Above the form: *"A couple of sentences is plenty. We usually reply within one working day."*
- Under the email field: *"We will only use this to reply to you."*
- Under the button: *"We do not add you to a mailing list. See our data-handling policy."*
  → links to `adatkezeles.html` (relative — GitHub Pages serves the site from a sub-path, so a
  root-relative `/adatkezeles` would resolve to the wrong place)
- Success state: *"Thank you — your message has arrived. We usually reply within one working day."*
- Error state: *"Something went wrong and your message was not sent. Please try again, or email us
  directly at {{CONTACT_EMAIL}}."*

> **Note for the editor.** The error message names a fallback address on purpose. If the form is
> broken, telling somebody to "try again later" loses the enquiry; giving them an address does not.

---

## Direct details

| | |
|---|---|
| **Email** | {{CONTACT_EMAIL}} |
| **Phone** | {{CONTACT_PHONE}} |
| **Address** | {{COMPANY_ADDRESS}} |
| **Opening hours** | Monday to Friday, 09:00–17:00 (Central European Time) |
| **Company details** | {{COMPANY_LEGAL_NAME}} · Reg. no. {{COMPANY_REG_NUMBER}} · VAT {{COMPANY_TAX_NUMBER}} |

---

## Editable placeholders

| Placeholder | Purpose |
|---|---|
| — | *(No CAPTCHA placeholder. That question is settled: spam protection is server-side. See the form spec above.)* |
| `{{GALLERY_IMAGE_CHAIN_BRIDGE}}` | Gallery image 1 |
| `{{GALLERY_IMAGE_PARLIAMENT}}` | Gallery image 2 |
| `{{GALLERY_IMAGE_FISHERMANS_BASTION}}` | Gallery image 3 |
| `{{GALLERY_IMAGE_DANUBE}}` | Gallery image 4 |
| `{{CONTACT_EMAIL}}` · `{{CONTACT_PHONE}}` · `{{COMPANY_ADDRESS}}` | Direct contact details |
| `{{COMPANY_LEGAL_NAME}}` · `{{COMPANY_REG_NUMBER}}` · `{{COMPANY_TAX_NUMBER}}` | Statutory footer details |
| `{{LAST_UPDATED}}` | Date shown in the CMS footer |

> **Accessibility note.** Each gallery image needs the alt text given above, or better. Decorative
> treatment is not appropriate here — the images carry the content of the section.
