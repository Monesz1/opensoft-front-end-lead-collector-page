---
page: contact
title: Kontakt
slug: /contact
lang: de
meta_title: OpenSoft kontaktieren — wir sind in Budapest, besuchen Sie uns
meta_description: Schreiben Sie uns, rufen Sie an oder treffen Sie uns in Budapest. Eine kurze Nachricht genügt als Anfang; wir antworten in der Regel innerhalb eines Arbeitstages.
last_updated: "{{LAST_UPDATED}}"
---

# Kontakt

## Sagen Sie Hallo

Sie brauchen weder ein Lastenheft noch ein Budget noch eine Entscheidung, um mit uns zu sprechen. Die
meisten guten Projekte hier begannen mit drei Sätzen von jemandem, der von einer Tabellenkalkulation
mäßig genervt war.

Erzählen Sie uns grob, worum es geht — was Sie verkaufen, wie viele Menschen den Prozess anfassen und
was am häufigsten kaputtgeht — und wir sagen Ihnen ehrlich, ob wir helfen können und welches unserer
Systeme passt. Wenn die Antwort lautet, dass Sie uns noch nicht brauchen, sagen wir auch das.

Wir beantworten jede Nachricht selbst. Nichts hier läuft über ein Callcenter.

---

## Wo wir sind

**Wir leben hier.** Nicht „wir haben hier ein Büro“ — das ganze Team ist in Budapest, und das ist eine
bewusste Entscheidung, kein Zufall der Personalsuche.

Das bedeutet, dass Sie die Menschen treffen können, die Ihr System tatsächlich betreiben werden. Es
bedeutet, dass wir in Ihrer Zeitzone sind, nach Ihrem Kalender arbeiten und verstehen, was in der
zweiten Januarwoche mit einem ungarischen Unternehmen passiert. Und es bedeutet: Wenn irgendwo ein
Mensch im Raum gebraucht wird, kann ein Mensch im Raum sein.

Wenn Sie lieber von Angesicht zu Angesicht sprechen als E-Mails auszutauschen, sagen Sie es. Wir
schlagen einen Kaffee irgendwo im Zentrum vor und bringen einen Laptop mit.

---

## Unsere Stadt

Wir hängen unvernünftig an diesem Ort, verzeihen Sie uns also einen kleinen Umweg.

### Die Kettenbrücke

Die älteste der festen Verbindungen und noch immer die, die man meint, wenn man *die* Brücke sagt.
Zwei steinerne Löwen an jedem Ende, ein blasses Tragwerk, das vom Ufer aus fast schwerelos wirkt, und
ein gemächlicher Fußgängerübergang, der aus einem Fünf-Minuten-Weg einen Fünfzehn-Minuten-Weg macht,
weil alle in der Mitte stehen bleiben. Sie war das erste Bauwerk, das aus Buda und Pest einen einzigen
Gedanken machte statt zweier Städte, die einander über das Wasser hinweg anstarren. Nachts leuchten
die Seile auf, und das Ganze sieht aus, als wäre es mit Kreide gezeichnet.

*Bildplatzhalter:* `{{GALLERY_IMAGE_CHAIN_BRIDGE}}` — Alternativtext: „Die Széchenyi-Kettenbrücke in
der Abenddämmerung, gesehen vom Pester Donauufer.“

### Das Parlament

Riesig, unwahrscheinlich und am besten vom gegenüberliegenden Ufer aus zu betrachten, wo Sie die
gesamte sechsundneunzig Meter hohe Kuppel und die lange neugotische Fassade auf einmal aufnehmen
können. Es sieht weniger nach einem Gebäude aus als nach einer Erklärung. Am späten Nachmittag nimmt
der Kalkstein die Farbe von dünnem Tee an; nach Einbruch der Dunkelheit färben ihn die Scheinwerfer
knochenweiß, und die Spiegelung verdoppelt ihn im Fluss. Einheimische gehen jeden Tag daran vorbei —
und schauen trotzdem gelegentlich hinauf.

*Bildplatzhalter:* `{{GALLERY_IMAGE_PARLIAMENT}}` — Alternativtext: „Das ungarische Parlamentsgebäude
bei Nacht beleuchtet, gespiegelt in der Donau.“

### Die Fischerbastei

Oben auf der Budaer Seite eine Reihe weißer Steinterrassen und sieben spitze Türmchen — eines für
jeden der gründenden Magyarenstämme —, die aussehen, als wären sie für ein Märchen gezeichnet und
dann versehentlich gebaut worden. Der Aufstieg lohnt sich allein wegen der Aussicht: ganz Pest flach
darunter ausgebreitet, der Fluss, der sich nach Norden fortkrümmt, das Parlament genau gegenüber auf
Augenhöhe. Gehen Sie früh. Ab elf gehört sie allen.

*Bildplatzhalter:* `{{GALLERY_IMAGE_FISHERMANS_BASTION}}` — Alternativtext: „Die weißen Steinterrassen
und Türmchen der Fischerbastei mit Blick über Pest.“

### Die Donau

Der Grund für alles. Der Fluss kommt aus dem Norden, schneidet die Stadt sauber in zwei Teile und gibt
Budapest seine besondere Geometrie: Hügel und stille Straßen auf der Budaer Seite, flache Boulevards
und Lärm auf der Pester Seite, und acht oder neun Wege, um zwischen beiden zu wechseln. Im Sommer
füllen sich abends die Uferpromenaden; im Winter wird das Wasser schiefergrau, und der Nebel liegt bis
mittags darauf. Jede gute Aussicht in dieser Stadt ist letztlich eine Aussicht auf die Donau.

*Bildplatzhalter:* `{{GALLERY_IMAGE_DANUBE}}` — Alternativtext: „Die Donau in der Abenddämmerung mit
den Budaer Bergen am gegenüberliegenden Ufer.“

---

## Schreiben Sie uns

Senden Sie uns eine E-Mail, und wir antworten, in der Regel innerhalb eines Arbeitstages. Ein paar
Sätze genügen völlig — sagen Sie uns grob, was Sie in Ordnung bringen wollen, und wir übernehmen von
dort.

Sie erreichen uns während der Bürozeiten auch unter der untenstehenden Telefonnummer, oder Sie fragen
über die Hauptseite eine Vorführung eines beliebigen unserer Systeme an.

---

## Implementierungsspezifikation — nur für die Redaktion

*Alles unterhalb dieser Überschrift ist Build-Dokumentation, kein Seitentext. Es wird bei der
Erzeugung der Seite automatisch entfernt.*

**Formularfelder**

| Feld | Typ | Pflicht | Validierung / Verhalten |
|---|---|---|---|
| E-Mail-Adresse | `email` | ja | Muss einen lokalen Teil, ein `@`, eine Domain und eine Top-Level-Domain enthalten. Wird beim Verlassen des Feldes geprüft; die Meldung erscheint unter dem Feld, nicht als Browser-Popup. |
| Nachricht | `textarea` | ja | Mindestens 10 Zeichen. Wächst mit dem Inhalt; kein hartes Maximum. |
| `website` | Text, außerhalb des Sichtbereichs | — | **Honeypot.** `tabindex="-1"`, `aria-hidden`, `autocomplete="off"`. Wird einem Menschen nie angezeigt; muss leer ankommen. |
| — | Spamschutz | — | **Serverseitig. Kein CAPTCHA — das ist entschieden, keine Voreinstellung.** Drei Schichten laufen am Webhook, bevor irgendetwas gespeichert wird: der Honeypot oben, eine Mindestausfüllzeit (2,5 s) und eine `Origin`/`Referer`-Prüfung. Fehlschläge erhalten ein normal aussehendes `200`, damit Bots nichts lernen. Begründung in `server-side notes` §7; der Schritt `Policy check` in `deploy.yml` lässt den Build scheitern, sobald jemals ein Widget eines Drittanbieters hinzugefügt wird. |
| Senden | `submit` | — | Beschriftung: **Nachricht senden**. Deaktiviert, bis beide Felder gültig sind. Zeigt „Wird gesendet…“ während der Übertragung. |

**Mikrotexte**

- Über dem Formular: *„Ein paar Sätze genügen völlig. Wir antworten in der Regel innerhalb eines
  Arbeitstages.“*
- Unter dem E-Mail-Feld: *„Wir verwenden diese Adresse ausschließlich, um Ihnen zu antworten.“*
- Unter der Schaltfläche: *„Wir nehmen Sie in keine Verteilerliste auf. Siehe unsere Information zur
  Datenverarbeitung.“*
  → verweist auf `adatkezeles.html` (relativ — GitHub Pages liefert die Website aus einem Unterpfad
  aus, ein wurzelrelatives `/adatkezeles` würde daher an der falschen Stelle landen)
- Erfolgsmeldung: *„Danke — Ihre Nachricht ist angekommen. Wir antworten in der Regel innerhalb eines
  Arbeitstages.“*
- Fehlermeldung: *„Etwas ist schiefgegangen, und Ihre Nachricht wurde nicht gesendet. Bitte versuchen
  Sie es erneut oder schreiben Sie uns direkt an {{CONTACT_EMAIL}}.“*

> **Hinweis für den Redakteur.** Die Fehlermeldung nennt bewusst eine Ausweichadresse. Wenn das
> Formular kaputt ist, verliert man die Anfrage, indem man jemandem sagt, er solle „es später noch
> einmal versuchen“; gibt man ihm eine Adresse, verliert man sie nicht.

---

## Direkte Kontaktdaten

| | |
|---|---|
| **E-Mail** | {{CONTACT_EMAIL}} |
| **Telefon** | {{CONTACT_PHONE}} |
| **Anschrift** | {{COMPANY_ADDRESS}} |
| **Öffnungszeiten** | Montag bis Freitag, 09:00–17:00 Uhr (Mitteleuropäische Zeit) |
| **Firmenangaben** | {{COMPANY_LEGAL_NAME}} · Reg.-Nr. {{COMPANY_REG_NUMBER}} · USt-Nr. {{COMPANY_TAX_NUMBER}} |

---

## Bearbeitbare Platzhalter

| Platzhalter | Zweck |
|---|---|
| — | *(Kein CAPTCHA-Platzhalter. Diese Frage ist entschieden: Der Spamschutz läuft serverseitig. Siehe die Formularspezifikation oben.)* |
| `{{GALLERY_IMAGE_CHAIN_BRIDGE}}` | Galeriebild 1 |
| `{{GALLERY_IMAGE_PARLIAMENT}}` | Galeriebild 2 |
| `{{GALLERY_IMAGE_FISHERMANS_BASTION}}` | Galeriebild 3 |
| `{{GALLERY_IMAGE_DANUBE}}` | Galeriebild 4 |
| `{{CONTACT_EMAIL}}` · `{{CONTACT_PHONE}}` · `{{COMPANY_ADDRESS}}` | Direkte Kontaktdaten |
| `{{COMPANY_LEGAL_NAME}}` · `{{COMPANY_REG_NUMBER}}` · `{{COMPANY_TAX_NUMBER}}` | Pflichtangaben in der Fußzeile |
| `{{LAST_UPDATED}}` | Datum, das in der CMS-Fußzeile angezeigt wird |

> **Hinweis zur Barrierefreiheit.** Jedes Galeriebild braucht den oben angegebenen Alternativtext oder
> einen besseren. Eine Behandlung als rein dekoratives Bild ist hier nicht angemessen — die Bilder
> tragen den Inhalt des Abschnitts.
