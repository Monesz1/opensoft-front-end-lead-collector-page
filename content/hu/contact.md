---
page: contact
title: Kapcsolat
slug: /contact
lang: hu
meta_title: Kapcsolat az OpenSofttal — Budapesten vagyunk, keressen meg minket
meta_description: Írjon nekünk, hívjon minket, vagy találkozzunk Budapesten. A kezdéshez elég egy rövid üzenet; általában egy munkanapon belül válaszolunk.
last_updated: "{{LAST_UPDATED}}"
---

# Kapcsolat

## Köszönjön be

Nem kell specifikáció, költségvetés vagy kész döntés ahhoz, hogy beszélgessünk. A jó projektjeink
többsége három mondattal kezdődött valakitől, akinek enyhén elege lett egy táblázatból.

Mondja el nagyjából, mi a helyzet — mit értékesít, hányan nyúlnak hozzá a folyamathoz, és mi romlik el
a leggyakrabban —, mi pedig őszintén megmondjuk, tudunk-e segíteni, és melyik rendszerünk illik
Önhöz. Ha az a válasz, hogy egyelőre nincs ránk szüksége, azt is megmondjuk.

Minden üzenetre mi magunk válaszolunk. Nálunk semmi nem megy át ügyfélszolgálati központon.

---

## Hol vagyunk

**Itt élünk.** Nem „van itt egy irodánk” — az egész csapat Budapesten van, és ez tudatos döntés, nem
a toborzás véletlene.

Ez azt jelenti, hogy találkozhat azokkal, akik ténylegesen üzemeltetni fogják a rendszerét. Azt
jelenti, hogy egy időzónában vagyunk Önnel, ugyanazzal a naptárral dolgozunk, és tudjuk, mi történik
egy magyar céggel január második hetében. És azt jelenti, hogy amikor valamihez ember kell a szobában,
akkor lesz ott ember.

Ha szívesebben beszélne személyesen, mint hogy e-maileket váltsunk, csak szóljon. Javasolunk egy kávét
valahol a belvárosban, és viszünk laptopot.

---

## A városunk

Ésszerűtlenül szeretjük ezt a helyet, ezért bocsásson meg nekünk egy rövid kitérőt.

### A Lánchíd

Az állandó átkelők közül a legrégebbi, és máig ez az, amelyre az emberek gondolnak, amikor *a* hidat
mondják. Két-két kőoroszlán a hídfőknél, egy halvány hídszerkezet, amely a rakpartról nézve szinte
súlytalannak tűnik, és egy lassú gyalogos átkelés, amely az ötperces sétából tizenöt percest csinál,
mert mindenki megáll a közepén. Ez volt az első építmény, amely Budát és Pestet egyetlen gondolattá
tette ahelyett, hogy két város nézte volna egymást a víz két partjáról. Éjszaka kigyulladnak a
kábelekre szerelt fények, és az egész olyan, mintha krétával rajzolták volna.

*Képhelyőrző:* `{{GALLERY_IMAGE_CHAIN_BRIDGE}}` — alternatív szöveg: „A Széchenyi lánchíd
alkonyatkor, a pesti rakpartról nézve.”

### Az Országház

Hatalmas, valószerűtlen, és a túlpartról a legszebb, ahonnan egyszerre látszik a teljes kilencvenhat
méteres kupola és a hosszú neogótikus homlokzat. Kevésbé tűnik épületnek, mint kijelentésnek. Késő
délután a mészkő a gyenge tea színét veszi fel; sötétedés után a fényszórók csontszínűvé teszik, a
tükörkép pedig megkettőzi a folyóban. A helyiek minden nap elsétálnak mellette, és időnként még mindig
felnéznek rá.

*Képhelyőrző:* `{{GALLERY_IMAGE_PARLIAMENT}}` — alternatív szöveg: „A kivilágított Országház
éjszaka, tükröződve a Dunában.”

### A Halászbástya

Fent a budai oldalon fehér kőteraszok és hét hegyes tornyocska — egy-egy a honfoglaló magyar törzsek
mindegyikének —, amelyek úgy néznek ki, mintha egy meséhez rajzolták volna őket, aztán véletlenül
megépültek volna. Már a kilátásért is megéri felkapaszkodni: az egész Pest laposan elterülve odalent,
a folyó északnak kanyarodva, szemben, szemmagasságban az Országház. Menjen korán. Tizenegyre már
mindenkié.

*Képhelyőrző:* `{{GALLERY_IMAGE_FISHERMANS_BASTION}}` — alternatív szöveg: „A Halászbástya fehér
kőteraszai és tornyai, kilátással Pestre.”

### A Duna

Mindennek ez az oka. A folyó északról érkezik, tisztán kettévágja a várost, és megadja Budapestnek a
maga sajátos geometriáját: dombok és csendes utcák a budai oldalon, lapos körutak és zaj a pesti
oldalon, és nyolc-kilenc mód arra, hogy az ember átjusson egyikről a másikra. Nyáron esténként
megtelnek a rakpartok; télen a víz palaszürkévé válik, és délig ül rajta a köd. Ebben a városban
minden jó kilátás végső soron a Dunára néz.

*Képhelyőrző:* `{{GALLERY_IMAGE_DANUBE}}` — alternatív szöveg: „A Duna alkonyatkor, a túlparton a
budai hegyekkel.”

---

## Írjon nekünk

Küldjön nekünk egy e-mailt, és válaszolunk, jellemzően egy munkanapon belül. Néhány mondat bőven elég
— mondja el nagyjából, mit szeretne megjavítani, a többit már mi visszük tovább.

Munkaidőben a lenti telefonszámon is elérhet minket, vagy a főoldalról bármelyik rendszerünkhöz kérhet
bemutatót.

---

## Megvalósítási specifikáció — csak a szerkesztőnek

*Az e cím alatti teljes tartalom fejlesztői dokumentáció, nem oldalszöveg. Az oldal generálásakor
automatikusan eltávolítjuk.*

**Űrlapmezők**

| Mező | Típus | Kötelező | Ellenőrzés / működés |
|---|---|---|---|
| E-mail cím | `email` | igen | Tartalmaznia kell egy helyi részt, egy `@` jelet, egy domainnevet és egy legfelső szintű domaint. Az ellenőrzés a mezőből való kilépéskor fut; az üzenet a mező alatt jelenik meg, nem böngészőbuborékban. |
| Üzenet | `textarea` | igen | Legalább 10 karakter. A tartalommal együtt nő; nincs kemény felső korlát. |
| `website` | szöveg, a képernyőn kívül | — | **Csapdamező.** `tabindex="-1"`, `aria-hidden`, `autocomplete="off"`. Ember számára soha nem látszik; üresen kell érkeznie. |
| — | Spamvédelem | — | **Szerveroldali. Nincs CAPTCHA — ez döntés, nem alapértelmezés.** A webhookon három réteg fut le, mielőtt bármi tárolásra kerülne: a fenti csapdamező, egy minimális kitöltési idő (2,5 s), és egy `Origin`/`Referer` ellenőrzés. A fennakadt küldések szokásos kinézetű `200` választ kapnak, így a robotok semmit nem tanulnak belőle. Az indoklás az `server-side notes` 7. pontjában olvasható; a `deploy.yml` `Policy check` lépése megbuktatja a buildet, ha valaha külső widget kerülne az oldalra. |
| Küldés | `submit` | — | Felirat: **Üzenet küldése**. Amíg mindkét mező nem érvényes, inaktív. Küldés közben „Küldés…” felirat látszik. |

**Mikroszövegek**

- Az űrlap fölött: *„Néhány mondat bőven elég. Általában egy munkanapon belül válaszolunk.”*
- Az e-mail mező alatt: *„Ezt kizárólag arra használjuk, hogy válaszoljunk Önnek.”*
- A gomb alatt: *„Nem kerül fel semmilyen levelezőlistára. Lásd az adatkezelési tájékoztatónkat.”*
  → az `adatkezeles.html` fájlra mutat (relatív hivatkozás — a GitHub Pages alkönyvtárból szolgálja
  ki a webhelyet, így egy gyökérhez viszonyított `/adatkezeles` rossz helyre mutatna)
- Sikeres állapot: *„Köszönjük — az üzenete megérkezett. Általában egy munkanapon belül
  válaszolunk.”*
- Hibaállapot: *„Valami hiba történt, és az üzenete nem ment el. Kérjük, próbálja újra, vagy írjon
  nekünk közvetlenül a {{CONTACT_EMAIL}} címre.”*

> **Megjegyzés a szerkesztőnek.** A hibaüzenet szándékosan nevez meg egy tartalék címet. Ha az űrlap
> elromlik, a „próbálja meg később” mondattal elveszítjük az érdeklődést; egy címmel nem.

---

## Közvetlen elérhetőségek

| | |
|---|---|
| **E-mail** | {{CONTACT_EMAIL}} |
| **Telefon** | {{CONTACT_PHONE}} |
| **Cím** | {{COMPANY_ADDRESS}} |
| **Nyitvatartás** | Hétfőtől péntekig, 09:00–17:00 (közép-európai idő) |
| **Cégadatok** | {{COMPANY_LEGAL_NAME}} · Cégjegyzékszám: {{COMPANY_REG_NUMBER}} · Adószám: {{COMPANY_TAX_NUMBER}} |

---

## Szerkeszthető helyőrzők

| Helyőrző | Mire való |
|---|---|
| — | *(Nincs CAPTCHA-helyőrző. Ez a kérdés eldőlt: a spamvédelem szerveroldali. Lásd a fenti űrlap-specifikációt.)* |
| `{{GALLERY_IMAGE_CHAIN_BRIDGE}}` | 1. galériakép |
| `{{GALLERY_IMAGE_PARLIAMENT}}` | 2. galériakép |
| `{{GALLERY_IMAGE_FISHERMANS_BASTION}}` | 3. galériakép |
| `{{GALLERY_IMAGE_DANUBE}}` | 4. galériakép |
| `{{CONTACT_EMAIL}}` · `{{CONTACT_PHONE}}` · `{{COMPANY_ADDRESS}}` | Közvetlen elérhetőségek |
| `{{COMPANY_LEGAL_NAME}}` · `{{COMPANY_REG_NUMBER}}` · `{{COMPANY_TAX_NUMBER}}` | Kötelező cégadatok a láblécben |
| `{{LAST_UPDATED}}` | A CMS láblécében megjelenő dátum |

> **Akadálymentességi megjegyzés.** Minden galériaképhez a fent megadott alternatív szöveg kell, vagy
> annál jobb. A dekoratív kezelés itt nem megfelelő — a képek hordozzák a szakasz tartalmát.
