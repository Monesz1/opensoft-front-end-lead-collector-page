---
page: contact
title: Kontakt
slug: /contact
lang: sk
meta_title: Kontaktujte OpenSoft — sme v Budapešti, príďte nás nájsť
meta_description: Napíšte nám, zavolajte nám alebo sa s nami stretnite v Budapešti. Na začiatok stačí krátka správa; zvyčajne odpovedáme do jedného pracovného dňa.
last_updated: "{{LAST_UPDATED}}"
---

# Kontakt

## Ozvite sa

Na to, aby ste sa s nami porozprávali, nepotrebujete špecifikáciu, rozpočet ani rozhodnutie. Väčšina
dobrých projektov tu začala tromi vetami od niekoho, koho mierne otravovala tabuľka.

Povedzte nám zhruba, čo sa deje — čo predávate, koľko ľudí sa dotýka daného procesu a čo sa
najčastejšie pokazí — a my Vám úprimne povieme, či vieme pomôcť a ktorý z našich systémov sa hodí. Ak
bude odpoveď znieť, že nás zatiaľ nepotrebujete, povieme aj to.

Na každú správu odpovedáme sami. Nič tu neprechádza cez call centrum.

---

## Kde nás nájdete

**Žijeme tu.** Nie „máme tu kanceláriu“ — celý tím je v Budapešti a je to zámerná voľba, nie náhoda
pri nábore.

Znamená to, že sa môžete stretnúť s ľuďmi, ktorí Váš systém budú naozaj prevádzkovať. Znamená to, že
sme vo Vašom časovom pásme, pracujeme podľa Vášho kalendára a rozumieme tomu, čo sa s maďarskou
firmou deje v druhom januárovom týždni. A znamená to, že keď je niekde potrebný človek v miestnosti,
človek v tej miestnosti byť môže.

Ak sa radšej porozprávate osobne, než by ste si vymieňali e-maily, dajte nám vedieť. Navrhneme kávu
niekde v centre a prinesieme notebook.

---

## Naše mesto

Máme toto miesto neprimerane radi, tak nám prepáčte krátku odbočku.

### Reťazový most

Najstarší zo stálych prechodov cez rieku a stále ten, ktorý ľudia myslia, keď povedia *ten* most. Na
oboch koncoch dva kamenné levy, svetlá konštrukcia, ktorá z nábrežia vyzerá takmer beztiažovo, a
pomalý peší prechod, ktorý z päťminútovej prechádzky urobí pätnásťminútovú, lebo každý sa zastaví
uprostred. Bola to prvá stavba, vďaka ktorej sa z Budína a Pešti stala jedna myšlienka namiesto dvoch
miest, ktoré na seba hľadia cez vodu. V noci sa laná rozsvietia a celé to vyzerá, akoby to bolo
nakreslené kriedou.

*Zástupný symbol obrázka:* `{{GALLERY_IMAGE_CHAIN_BRIDGE}}` — alternatívny text: „Széchenyiho
reťazový most za súmraku, pohľad z peštianskeho nábrežia.“

### Parlament

Obrovský, nepravdepodobný a najlepšie sa naň pozerá z protiľahlého brehu, odkiaľ naraz obsiahnete
celú deväťdesiatšesťmetrovú kupolu aj dlhé novogotické priečelie. Vyzerá skôr ako vyhlásenie než ako
budova. Neskoro popoludní má vápenec farbu slabého čaju; po zotmení ho reflektory sfarbia do kostenej
bielej a odraz ho v rieke zdvojí. Miestni okolo neho chodia každý deň a aj tak občas zdvihnú zrak.

*Zástupný symbol obrázka:* `{{GALLERY_IMAGE_PARLIAMENT}}` — alternatívny text: „Budova maďarského
parlamentu osvetlená v noci, s odrazom v Dunaji.“

### Rybárska bašta

Hore na budínskej strane súbor bielych kamenných terás a sedem špicatých vežičiek — jedna za každý zo
zakladajúcich maďarských kmeňov — ktoré vyzerajú ako niečo nakreslené do rozprávky a potom omylom
postavené. Výstup sa oplatí už len kvôli výhľadu: celá Pešť rozprestretá naplocho pod Vami, rieka sa
odkláňa na sever, parlament priamo oproti v úrovni očí. Choďte skoro ráno. O jedenástej už patrí
všetkým.

*Zástupný symbol obrázka:* `{{GALLERY_IMAGE_FISHERMANS_BASTION}}` — alternatívny text: „Biele kamenné
terasy a vežičky Rybárskej bašty s výhľadom na Pešť.“

### Dunaj

Dôvod toho všetkého. Rieka prichádza zo severu, čisto rozotne mesto na dve časti a dáva Budapešti jej
osobitú geometriu: kopce a tiché ulice na budínskej strane, rovné bulváre a hluk na peštianskej
strane a osem či deväť spôsobov, ako sa medzi nimi dostať. V lete sa nábrežia večer zaplnia; v zime
má voda farbu bridlice a hmla na nej sedí až do poludnia. Každý dobrý výhľad v tomto meste je napokon
výhľadom na Dunaj.

*Zástupný symbol obrázka:* `{{GALLERY_IMAGE_DANUBE}}` — alternatívny text: „Dunaj za súmraku s
budínskymi kopcami na druhom brehu.“

---

## Napíšte nám

Pošlite nám e-mail a my odpovieme, zvyčajne do jedného pracovného dňa. Pár viet úplne stačí — napíšte
nám zhruba, čo sa snažíte vyriešiť, a my sa toho chytíme.

Počas úradných hodín nás zastihnete aj na telefónnom čísle nižšie alebo si na hlavnej stránke môžete
vyžiadať ukážku ktoréhokoľvek z našich systémov.

---

## Špecifikácia implementácie — len pre redaktora

*Všetko pod týmto nadpisom je dokumentácia k zostaveniu, nie text stránky. Pri generovaní stránky sa
automaticky odstráni.*

**Polia formulára**

| Pole | Typ | Povinné | Validácia / správanie |
|---|---|---|---|
| E-mailová adresa | `email` | áno | Musí obsahovať lokálnu časť, `@`, doménu a doménu najvyššej úrovne. Validuje sa pri opustení poľa; hlásenie sa zobrazí pod poľom, nie ako vyskakovacie okno prehliadača. |
| Správa | `textarea` | áno | Minimálne 10 znakov. Rastie s obsahom; bez pevného maxima. |
| `website` | text, mimo obrazovky | — | **Pasca na roboty (honeypot).** `tabindex="-1"`, `aria-hidden`, `autocomplete="off"`. Človeku sa nikdy nezobrazí; musí prísť prázdne. |
| — | Ochrana proti spamu | — | **Na strane servera. Žiadna CAPTCHA — je to rozhodnutie, nie prednastavená hodnota.** Na webhooku bežia pred akýmkoľvek uložením tri vrstvy: vyššie uvedená pasca na roboty, minimálny čas vyplnenia (2,5 s) a kontrola hlavičiek `Origin`/`Referer`. Neúspešné pokusy dostanú normálne vyzerajúcu odpoveď `200`, aby sa roboty nič nedozvedeli. Zdôvodnenie v `server-side notes` §7; krok `Policy check` v `deploy.yml` zhodí zostavenie, ak by niekedy pribudol widget tretej strany. |
| Odoslať | `submit` | — | Označenie: **Odoslať správu**. Neaktívne, kým nie sú platné obe polia. Počas odosielania zobrazuje „Odosielam…“. |

**Mikrotexty**

- Nad formulárom: *„Pár viet úplne stačí. Zvyčajne odpovedáme do jedného pracovného dňa.“*
- Pod poľom pre e-mail: *„Použijeme ju výhradne na to, aby sme Vám odpovedali.“*
- Pod tlačidlom: *„Nepridávame Vás do žiadneho zoznamu adresátov. Pozrite si naše zásady spracúvania
  údajov.“*
  → odkazuje na `adatkezeles.html` (relatívne — GitHub Pages obsluhuje web zo sub-cesty, takže od
  koreňa relatívne `/adatkezeles` by sa vyhodnotilo na nesprávne miesto)
- Stav úspechu: *„Ďakujeme — Vaša správa dorazila. Zvyčajne odpovedáme do jedného pracovného dňa.“*
- Stav chyby: *„Niečo sa pokazilo a Vaša správa sa neodoslala. Skúste to prosím znova alebo nám
  napíšte priamo na {{CONTACT_EMAIL}}.“*

> **Poznámka pre redaktora.** Chybová správa zámerne uvádza náhradnú adresu. Ak je formulár pokazený,
> odkázať niekoho na to, aby to „skúsil neskôr“, znamená stratiť dopyt; dať mu adresu nie.

---

## Priame kontaktné údaje

| | |
|---|---|
| **E-mail** | {{CONTACT_EMAIL}} |
| **Telefón** | {{CONTACT_PHONE}} |
| **Adresa** | {{COMPANY_ADDRESS}} |
| **Otváracie hodiny** | Pondelok až piatok, 09:00–17:00 (stredoeurópsky čas) |
| **Údaje o spoločnosti** | {{COMPANY_LEGAL_NAME}} · Reg. č. {{COMPANY_REG_NUMBER}} · IČ DPH {{COMPANY_TAX_NUMBER}} |

---

## Editovateľné zástupné symboly

| Zástupný symbol | Účel |
|---|---|
| — | *(Žiadny zástupný symbol pre CAPTCHA. Táto otázka je uzavretá: ochrana proti spamu je na strane servera. Pozrite špecifikáciu formulára vyššie.)* |
| `{{GALLERY_IMAGE_CHAIN_BRIDGE}}` | Obrázok galérie 1 |
| `{{GALLERY_IMAGE_PARLIAMENT}}` | Obrázok galérie 2 |
| `{{GALLERY_IMAGE_FISHERMANS_BASTION}}` | Obrázok galérie 3 |
| `{{GALLERY_IMAGE_DANUBE}}` | Obrázok galérie 4 |
| `{{CONTACT_EMAIL}}` · `{{CONTACT_PHONE}}` · `{{COMPANY_ADDRESS}}` | Priame kontaktné údaje |
| `{{COMPANY_LEGAL_NAME}}` · `{{COMPANY_REG_NUMBER}}` · `{{COMPANY_TAX_NUMBER}}` | Povinné údaje v päte |
| `{{LAST_UPDATED}}` | Dátum zobrazený v päte v CMS |

> **Poznámka k prístupnosti.** Každý obrázok galérie potrebuje alternatívny text uvedený vyššie, alebo
> lepší. Dekoratívne spracovanie tu nie je namieste — obrázky nesú obsah tejto sekcie.
