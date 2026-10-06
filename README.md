# Lärom

Hemsidan **Lärom** introducerar resursen med animerade förhandsvisningar av flaggor, kartor, matteuppställning och brobygge. Knappen **Läryta** leder till årskursvalet i `public/laryta/index.html`, med Årskurs 1–3, 4–6 och 7–9. Varje årskurs visar Språk, Samhälle, Historia, Matematik, Teknik och Roliga fakta. Årskurs 1–3 har nio spel under Språk och fem under Samhälle. Historia, Matematik och Teknik är också aktiva i årskurs 1–3. Roliga fakta har två aktiva spel: Kroppens klurigheter! och Varför är det så? De andra årskursernas nya innehåll är kommande. De tidigare 4–6-spelen finns kvar i filerna men länkas inte från menyerna. Domänen Lärom.se är inte ansluten eller publicerad genom denna ändring.

Logotypen i `public/assets/larom-logo.svg` kommer från den bifogade 2.svg, med tom yta runt motivet bortbeskuren genom SVG-filens viewBox.

Exempel på svenska spel för årskurs 1–3:

- **Vilket tecken?!** – 15 övningar med punkt, frågetecken och utropstecken.
- **Antonymer och synonymer** – tre nivåer med 15 övningar vardera, totalt 45.
- **Meningsbyggaren** – tre nivåer med 15 meningar vardera, totalt 45 meningar.
- **Så säger man ju inte!** – 35 verbövningar. Barnet läser en tokig form och skriver den rätta. 33 rättningsuppgifter och två luckmeningar ingår. För svälja accepteras både svalde/sväljde och svalt/sväljt; formerna sväljde/sväljt presenteras därför inte som fel.
- **Vokalverkstan** – 25 ordpar och 50 övningar om korta och långa vokaler.

I lärytan väljer barnet årskurs och sedan ämne. Logotypen inne i lärytan och spelen leder till årskursvalet. Där finns även länken ”Läroms hemsida” tillbaka till presentationen. Alla spelen har samma färger, IBM Plex Sans, stora bokstäver, animationer och en länk tillbaka till spelvalet. Knappen ”Visa ledtråden igen” är borttagen. Den nya knappen ”Ge mig en ledtråd” ger innehållshjälp och spelar inte om någon animation.

## Publicera från ditt befintliga repository

1. Öppna ditt lokala repository i Visual Studio Code. Om det bara finns på GitHub eller motsvarande: välj **Git: Clone** i kommandopaletten och öppna den klonade mappen.
2. Kopiera leveransmappens **innehåll till repositoryts rot**. `netlify.toml` ska alltså ligga direkt i roten, med `public/` bredvid. Om du har den tidigare Vokalverkstan-exporten ersätter du hela `public/` med den uppdaterade mappen, eftersom även navigeringen på befintliga sidor har ändrats.
3. Behåll repositoryts `.git`-mapp. Slå ihop eventuell befintlig `.gitignore`, README eller Netlify-konfiguration med det du vill använda här.
4. I **Source Control**, kontrollera och stagea webbplatsens ändringar. Gör en **Commit**, exempelvis `Lägg till spelval och oregelbundna verb`, och **Push** till den branch som Netlify ska publicera.
5. Om repositoryt inte redan är kopplat: välj **Add new project → Import an existing project** i Netlify och välj din Git-leverantör och ditt repository.
6. Kontrollera följande och starta publiceringen:

| Netlify-inställning | Värde |
| --- | --- |
| Base directory | Tomt, dvs. repositoryts rot |
| Package directory | Tomt |
| Build command | Tomt |
| Publish directory | `public` |

`netlify.toml` innehåller redan publiceringsmappen och ett tomt byggkommando. Är repositoryt redan anslutet räcker en push till den valda produktionsbranchen när inställningarna stämmer. Ingen installation eller byggprocess behövs.

## Filer

```text
netlify.toml
.gitignore
README.md
public/
  index.html                    # Läroms hemsida
  laryta/index.html             # Läryta: välj årskurs
  arskurs-1-3/index.html         # Ämnesval för 1–3
  arskurs-1-3/sprak/index.html   # Svenska och engelska
  arskurs-7-9/index.html         # Ämnesval för 7–9, inga spel ännu
  arskurs-4-6/index.html         # Ämnesval för 4–6, inga spel ännu
  meningsbyggaren-4-6/index.html # Längre meningar, 15 övningar
  textbyggaren/index.html        # Textordning och sambandsord, 15 övningar
  assets/
    site.css                    # Gemensam design och animationer
    choice-games.js              # Logik för Vilket tecken?!
    vilket-tecken.js             # Meningar, ledtrådar och skiljetecken
    tvartom.js                   # Data för tre nivåer med antonymer och synonymer
    word-relations.js            # Nivåval och logik för ordens betydelse
    sentences.js                # Meningsbyggarens övningar och ordbrickor
    verbs.js                    # Verbövningar och svarskontroll
    results.js                  # Poängräkning och gemensam resultatruta
  vilket-tecken/
    index.html                  # Välj punkt, frågetecken eller utropstecken
  tvartom/
    index.html                  # Hitta motsatsord
  meningsbyggaren/
    index.html                  # Bygg meningar med ordbrickor
  sasagermanjuinte/
    index.html                  # Skriv rätt verbform
  vokalverkstan/
    index.html                  # Välj mellan vokalord
```

Öppna `public/index.html` i en vanlig webbläsare för lokal förhandsvisning. Navigeringen använder relativa länkar och fungerar även lokalt. IBM Plex Sans hämtas från Google Fonts; utan internet visas ett reservtypsnitt. Emojiillustrationerna kan se olika ut på olika enheter.

## Uppdatera innehållet

Arbeta i filerna under `public/` i ditt repository. Verbövningarna finns i listan `verbItems` i `assets/verbs-data.js`. Varje post anger exempelmening, ursprungsform, facit och animation. Vid ändrat antal övningar uppdateras räknaren automatiskt; uppdatera även de fasta antalen i startsidan och verbsidans etiketter/beskrivning.

Vokalverkstans ordpar och bilder finns i `assets/vowels-data.js`; logiken finns i `assets/vowels.js`. Gemensam design ändras i `assets/site.css`. Gör commit och push för att publicera uppdateringar.

## Resultat efter varje spel

När alla unika övningar är avklarade visas **Visa resultat**. Resultatrutan anger hur många rätt barnet fick på första försöket: av 50 i Vokalverkstan, av 35 i Så säger man ju inte! av 15 per nivå i Meningsbyggaren samt av 15 i vardera Vilket tecken?! och per nivå i Antonymer och synonymer. Barnet får fortsätta försöka tills ordet är rätt. Tomma textsvar räknas inte som försök. Upprepade svar ger inte extra poäng och ordvalsväljaren nollställer inte tidigare försök. Nästa ord går till nästa oavklarade övning, även om man har hoppat direkt till slutet.

**Spela igen** nollställer omgången. Resultaten finns bara i den pågående sidan; omladdning eller navigation bort från spelet startar om. Inga resultat skickas till en server.

De fem nya k/ck-paren är baka/backa, haka/hacka, läka/läcka, vika/vicka och vek/veck. Tak/tack finns kvar sedan tidigare.

## Meningsbyggaren

Spelet öppnar med ett val mellan tre nivåer, med 15 meningar på varje nivå:

- **Nivå 1:** befintliga korta meningar, med första ordet redan på plats.
- **Nivå 2:** längre meningar. Alla ord går att flytta och stor bokstav visar vilket ord som ska stå först.
- **Nivå 3:** mer avancerade meningar med bland annat bisatser, omvänd ordföljd och uttryck som ”Anna befann sig på fel buss”. Även ”Fastän jag är hungrig åt jag inte så mycket” ingår.

Tryck eller klicka på orden i rätt ordning. Valda ord går att lägga tillbaka genom att trycka på dem. Ordbrickorna fungerar även med Tab och Enter. Använd alla brickor och tryck på **Kolla meningen**. Ofullständiga meningar och flyttade brickor räknas inte som försök; det är första kontrollen av en hel mening som avgör poängen.

Varje nivå har sin egen poängräkning. **Byt nivå** öppnar nivåvalet och behåller genomförda uppgifter och tidigare försök. Om nivån är färdig visas dess resultat när den väljs igen. **Spela nivån igen** återställer bara den aktuella nivån. En mening som inte var klar byggs från början när nivån väljs igen, men felaktiga kontroller finns kvar. Allt är tillfälligt och nollställs vid omladdning.

Meningarna finns i listan `levels` i `public/assets/sentences-data.js`. Nivå 1 använder `start` för det fasta startordet. Nivå 2 och 3 har tom `start` och alla ord i `words`. Upprepade ord är separata brickor men kan byta plats med varandra. `alternatives` innehåller ytterligare accepterade ordföljder med samma ord. Efter två fel visas början på en rätt mening och efter tre visas hela meningen att bygga.

## Vilket tecken?!

Fem övningar vardera tränar punkt, frågetecken och utropstecken. En situationsbeskrivning anger om barnet ska tänka på en fråga, ett lugnt påstående eller ett utrop. Uppgiften gäller det tecken som passar den angivna tonen bäst; en mening kan i andra sammanhang avslutas på andra sätt. Efter rätt svar visas meningen med valt tecken. Knapparna fungerar med tryck, klick och tangentbord.

## Antonymer och synonymer

Det tidigare Tvärtom! har bytt namn och har nu tre nivåer med 15 övningar vardera. Adressen `tvartom/index.html` behålls så att befintliga länkar fungerar.

- **Antonym:** ett ord som betyder motsatsen, till exempel varm och kall.
- **Synonym:** ett ord som betyder ungefär samma sak, till exempel glad och lycklig.
- **Nivå 1:** 15 enkla antonymer, med de tidigare bildbytena.
- **Nivå 2:** 15 synonymer i tydliga sammanhang.
- **Nivå 3:** 15 lite svårare uppgifter som blandar båda relationerna.

Varje uppgift anger om barnet ska hitta en antonym eller synonym. Ledtrådarna avgränsar betydelsen. Varje nivå räknar rätt på första försöket. Byte av nivå behåller poängen under samma besök; omstart nollställer bara vald nivå. En färdig nivå visar resultatet när den väljs igen. Omladdning nollställer allt.

Nivådata finns i `assets/tvartom.js` och logiken i `assets/word-relations.js`. Vilket tecken?! använder fortsatt `assets/vilket-tecken.js` och `assets/choice-games.js`.

## Pedagogik och språk

Verbövningen tränar vanligt skriftspråk och använder meningar som skiljer mellan exempelvis ”jag bar” och ”jag har burit”. Barnet kan försöka flera gånger. Efter två felaktiga försök visas första bokstaven och ordets längd; efter tre visas facit som barnet får skriva. Stora bokstäver, omgivande blanksteg och avslutande punkt accepteras. Å, ä och ö räknas som egna bokstäver.

Talspråk och dialekter kan ha andra böjningar. Därför förklaras för vuxna att övningen gäller skriftspråk. Fryste behandlas i meningen ”Jag frös när jag glömde jackan”: fryste kan vara korrekt vid infrysning av mat, vilket förklaras i informationen till den vuxne. I dyka-övningen används skriftspråkets dök.

Källor för dessa språkval:

- [Svenska Akademiens grammatik, volym 2, verb §64: frysa](https://svenska.se/SAG_Volym_2.pdf)
- [Språkrådets frågelåda: dök eller dykte](https://frageladan.isof.se/faqs/26589)
- [SAOL: dölja, dolde, dolt](https://svenska.se/saol/?sok=d%C3%B6lja)

## Netlify-dokumentation

- [Publicera från ett Git-repository](https://docs.netlify.com/start/quickstarts/deploy-from-repository/)
- [Filbaserade inställningar](https://docs.netlify.com/build/configure-builds/file-based-configuration/)

## Bevarade spel för senare arbete med årskurs 4–6

Dessa spel ligger kvar på sina tidigare adresser men är inte tillgängliga via de nya menyerna.

**Meningsbyggaren 4–6** har 15 längre meningar med bisatser, sambandsord och varierad ordföljd. Alla ord flyttas med klick eller Tab/Enter. Stor bokstav visar början. Vissa uppgifter accepterar flera ordföljder.

**Textbyggaren** har 15 texter med fyra meningsbrickor vardera. Ordna dem efter ledtråden och välj ett sambandsord. Övningarna tränar tidsföljd, orsak och följd, jämförelse och argumentation. Ordningen bedöms utifrån uppgiftens ledtråd.

Båda spelen ger förklaringar efter rätt svar, extra stöd efter två fel och ett lösningsförslag efter tre. Första kontrollen av en komplett uppgift avgör poängen; ofärdiga svar räknas inte. Resultatet visar rätt av 15. Tidigare försök behålls vid övningsbyte. Spela igen eller omladdning återställer resultatet.

Innehållet finns i `assets/meningsbyggaren-4-6.js` och `assets/textbyggaren.js`. Gemensam spellogik finns i `assets/upper-builders.js`.

## Hörde jag rätt? och Engelska

Hörde jag rätt? innehåller 15 diktamensord med meningar. Uppläsningen använder färdiga MP3-filer med ElevenLabs Alice i det godkända lugna tempot (speed 0.75). Barnet kan lyssna igen; efter två fel visas en ledtråd och efter tre stavningen. Resultatet räknar första inskickade, icke-tomma svaret efter uppläsning.

Data: `public/assets/listening-data.js`. Logik: `public/assets/listening.js`. Svenska och Engelska har egna avsnitt på språksidan. Engelska innehåller tre spel: Presentera dig, Hälsa på andra och Beställ en dricka. Varje spel har tio vardagsdialoger, svenska situationsbeskrivningar, två engelska svarsalternativ, förklaringar och resultat. Frågan och det rätta svaret spelas upp från färdiga MP3-filer med samma lugna Alice-röst. Ingen installerad systemröst behövs. Ingen mikrofon eller uttalsbedömning används. Gemensam logik finns i assets/english-dialogues.js och innehållet i respektive spels datafil.

## Färdiga röster

68 unika ljudklipp i `public/assets/audio/` används i Hörde jag rätt? och de tre engelska spelen. `audio-manifest.js` kopplar replikerna till ljudfilerna och `audio-player.js` sköter uppspelning. Ljudet stoppar vid byte av uppgift eller sida. Alice, Eleven Multilingual v2, speed 0.75. Besökarnas uppspelning gör inga API-anrop till ElevenLabs. API-nyckeln ingår inte i leveransen. Vid nya eller ändrade repliker behöver motsvarande ljud genereras på nytt.

## Samhälle: flaggor och huvudstäder

`arskurs-1-3/samhalle/index.html` samlar Gissa flaggan! och Kan du huvudstaden?. Båda använder samma 30 länder i `assets/countries.js`; Gissa flaggan! använder `assets/flag-game.js` och huvudstadsspelet `assets/geography.js`. Ordningen blandas inför varje omgång. Länderna är ett pedagogiskt urval med tyngdpunkt på Norden och Europa, inte en rangordning eller en lista som läroplanen kräver.

Barnet skriver svar, får grön/röd återkoppling och kan få ledtrådar. Visa svaret räknas som hjälp och ger ingen poäng på uppgiften. Tomma svar räknas inte. Vedertagna alias och variation i versaler, accenter och skiljetecken godtas. Resultatet visas efter alla 30 uppgifter.

Länder: Sverige, Norge, Danmark, Finland, Island, Frankrike, Tyskland, Italien, Storbritannien, USA, Kanada, Kina, Ryssland, Japan, Spanien, Portugal, Nederländerna, Belgien, Irland, Schweiz, Österrike, Polen, Estland, Lettland, Litauen, Ukraina, Grekland, Turkiet, Australien, Brasilien.

Flaggorna följer med lokalt under assets/flags och kommer från https://github.com/lipis/flag-icons (MIT, licens medföljer). Schweiz använder en kvadratisk flagga. Huvudstäder kontrollerade mot https://en.wikipedia.org/wiki/List_of_national_capitals. Kursplansanknytning: https://syllabuswebb.skolverket.se/compulsorycw/jsp/subject.htm?subjectCode=GRGRGEO01&tos=gr.

## Kartspelen

Var ligger landet? (`var-ligger-landet/index.html`) har två kartor: Norden med 5 länder och Europa med 15 länder. Upptäck världsdelarna! (`upptack-varldsdelarna/index.html`) tränar de sju världsdelarna med klickbara, numrerade markörer. Markörerna visar ungefärliga lägen, inte världsdelsgränser.

Båda spelen har blandad frågeordning, tangentbordsstöd (Tab, Enter eller mellanslag), ledtrådar, hjälpmarkeringar och slutresultat. Varje karta har en separat tillfällig poängräkning. Visa var ger ingen poäng på uppgiften. Byte av karta behåller resultatet; Spela igen återställer bara den valda kartan.

Data och ledtrådar: `assets/map-data.js`. Spellogik: `assets/map-games.js`. Kartornas SVG ligger direkt i respektive HTML-fil så de fungerar även när filerna öppnas lokalt. Kartunderlag: Natural Earth, public domain; se `assets/map-sources.txt`. Kartorna är förenklade och inte ytriktiga.

I båda kartspelen blir avklarade områden grå och inaktiva till omstart. Kartorna visas i ett fast, anpassat startläge utan zoomknappar.

## Vem bestämmer?

15 frågor om Sveriges demokrati, konstitutionella monarki, riksdag, regering, talman, statsminister och statschef. Frågorna och de tre svarsalternativen blandas. Första försöket räknas, förklaringar visas efter rätt svar och hjälp ges efter två fel. Navigering behåller tidigare resultat. Innehåll: `assets/civics-data.js`. Logik: `assets/civics.js`.

Källor finns även i spelets vuxeninformation: Sveriges riksdag (https://www.riksdagen.se/sv/sa-fungerar-riksdagen/), Regeringskansliet (https://regeringen.se/lattlast-information-om-regeringen-och-regeringskansliet/den-svenska-samhallsmodellen/) och Kungahuset (https://www.kungahuset.se/sveriges-monarki). Demokrati anknyter till SO 1–3; institutionernas uppgifter och statsskicksbegrepp är allmänbildande fördjupning för denna målgrupp.

## Historia

Historia för årskurs 1–3 finns i `public/arskurs-1-3/historia/index.html`. Vem var det? har 12 personer med tre namn att välja mellan. Vad hände först? har 12 jämförelser med två alternativ och en tidslinje efter rätt svar. När hände det? har 12 årtalsfrågor. Riken på kartan har sex historiska riken att känna igen.

Frågor och svar blandas. Första försöket räknas, fel får rättas, och resultat visas när alla frågor är klara. Källor visas efter rätt svar. Personer och händelser är delvis allmänbildande fördjupning utöver SO 1–3; vuxeninformationen förklarar kursplansanknytningen. Tidslinjer visar ordning, inte skalenligt avstånd i tid.

Data: `assets/vem-var-det-data.js` och `assets/vad-hande-forst-data.js`. Gemensam logik: `assets/history-quiz.js`. Inga nya ljudfiler eller API-anrop används.

### Årtal och historiska kartor

`nar-hande-det/index.html`: 12 frågor med tre årtal eller tidsperioder att välja mellan, inklusive världskrigen. Data i `assets/nar-hande-det-data.js`.

`riken-pa-kartan/index.html`: Romarriket omkring år 100, Sverige och Osmanska riket omkring 1650, Forntida Egypten omkring 1500 f.Kr., Perserriket omkring 500 f.Kr. samt Inkariket omkring 1500. Tre alternativ, geografiska ledtrådar, kompakta kartor utan zoom. Data i `assets/riken-pa-kartan-data.js`.

När hände det? använder `assets/history-quiz.js`; Riken på kartan använder `assets/empire-game.js`. Frågor och alternativ blandas; första försöket räknas och omstart återställer resultatet. Kartor lagras lokalt som SVG och fungerar utan externa karttjänster. Gränser är ungefärliga, kustlinjer moderna och kartornas skala varierar. Kartunderlag från Historical Basemaps (GPL-3.0) och Natural Earth (public domain). Attribution, licens och GeoJSON-källor följer med i `assets/historical-maps/`. Spelens övriga kod är separat från kartunderlaget.

## Matematik för årskurs 1–3

`arskurs-1-3/matematik/index.html` har sju spel. De första två är:

- Tiokompisarna: 11 uppgifter med alla tal 0–10. Barnet skriver det saknade talet. Frukter under båda talen visar antalen, med samma sort inom varje uppgift. Päron, äpplen, apelsiner, jordgubbar och citroner varierar mellan uppgifterna. Noll visas som inga frukter.
- Bygg talet!: 15 tvåsiffriga tal. En riktig HTML-tabell har röda tiotalsrutor och blå entalsrutor med textetiketter. Barnet använder plus/minus eller skriver siffrorna. Varje röd stav innehåller tio små rutor; varje blå ruta är ett ental. Tal med noll ental ingår.

Båda har metodexempel, slumpad uppgiftsordning, återkoppling, ledtråd efter två fel och slutresultat. Endast första giltiga inskickade svaret påverkar poängen; tomma, negativa, decimala och ogiltiga svar räknas inte. Bildstödet får användas utan poängavdrag. Byte av uppgift behåller resultat; omstart återställer omgången. Övriga matematikspel, inklusive växling, beskrivs nedan.

Gemensam logik: `assets/math-games.js`. Formgivning: `assets/math.css`. Allt fungerar lokalt utan API-anrop.

### Över tiotalet! och Ställ upp och räkna!

Två nya kort i Matematik: `over-tiotalet/index.html` och `stall-upp-och-rakna/index.html`. Vardera har 16 uppgifter (åtta additioner och åtta subtraktioner) i blandad ordning. Gemensam logik och uppgifter finns i `assets/math-methods.js`, formgivning i `assets/math.css`.

Över tiotalet! arbetar inom talområdet 0–20: barnet räknar till tio, delar upp det andra talet och räknar resten. Tallinjen visar hoppen efter avklarade steg. Ställ upp och räkna! använder riktiga HTML-tabeller med röda tiotalsrutor och blå entalsrutor. Barnet räknar entalen först, därefter tiotalen. Alla uppställningar är utan växling. Den aktuella svarsrutan markeras och andra rutor är låsta.

Alla steg måste vara rätt på första giltiga försöket för att hela uppgiften ska ge ett rätt i slutresultatet. Fel i senare steg räknas också. Tomma och ogiltiga svar påverkar inte poängen. Efter två fel visas en uträkning för steget. Byte av uppgift behåller färdiga steg; omstart återställer allt. Metodexempel och bildstöd får användas fritt.

### Växla och räkna!

16 uppgifter med fri inmatning direkt i uppställningstabellen. Alla rutor är tomma och öppna samtidigt. Vid addition fylls det överförda tiotalet i den lilla röda rutan; vid subtraktion fylls det nya antalet tiotal i ovanför det första talet. Svarssiffrorna skrivs längst ned. Ingen stegstyrning eller växlingsknapp. Hela tabellen kontrolleras med Kolla svaret. Första kompletta giltiga kontrollen räknas i resultatet. Ofullständiga och ogiltiga svar räknas inte. Påbörjade svar sparas vid byte av uppgift. Logik: assets/math-exchange.js.

### Vad är klockan? och Matte i vardagen

`vad-ar-klockan/index.html`: analog klocka med tre nivåer, åtta frågor vardera. Hela/halva timmar, kvart över/kvart i och femminuterssteg. Kort röd timvisare, lång blå minutvisare. Timvisaren flyttas kontinuerligt med minuterna. Tre slumpade textsvar per fråga. Övningsklocka med reglage i femminuterssteg finns under Visa hur. Nivåernas resultat sparas separat under besöket. Välj nivå på resultatsidan byter utan att återställa poäng; Spela igen återställer aktuell nivå. Logik: `assets/vad-ar-klockan.js`.

`matte-i-vardagen/index.html`: 16 problem om antal, inköp, delning, grupper, längd, volym och tid. Barnet skriver ett heltal med enheten bredvid. Faktarutor lyfter fram uppgiftens givna uppgifter. Första giltiga svaret räknas. Efter två fel visas uträkning. Data: `assets/daily-data.js`, logik: `assets/matte-i-vardagen.js`. Priserna är påhittade övningspriser.

Matematikmenyn innehåller sju spel och använder tre kolumner över 1000 px, två kolumner på mellanstora skärmar och en kolumn på mobil.

## Teknik för årskurs 1–3

`arskurs-1-3/teknik/index.html` samlar två teknikspel och sektionen Datorn och du:

- Hur fungerar det? (`hur-fungerar-det/index.html`): sex interaktiva modeller av gungbräda, kugghjul, fast linhjul, hjul och axel, gångjärn och ramp. Ett reglage styr varje modell. Varje exempel har en fråga med tre slumpade alternativ. Första försöket räknas; efter två fel visas förklaring.
- Kan du bygga en bro? (`bygg-och-forbattra/index.html`): ersätter Bygg och förbättra! och behåller adressen. Sex uppdrag med begränsade vägdelar och balkar. Barnet väljer material och två ändpunkter, bygger sin egen bro och testar med en bil. Flera lösningar godtas. Ångra, ta bort, töm och hämta senaste fungerande bygge finns. Resultatet visar klarade broar och genomförda tester, utan avdrag för misslyckade försök. Byggen och resultat finns bara under sidbesöket.

Brotestet använder en förenklad elastisk modell: förbindelsernas läge, fasta stöd och bilens last avgör deformationen. Den är inte en hållfasthetsberäkning för verkliga broar. Vägbanan har förenklad böjstyvhet; knäckning, egenvikt och verklig kollisionsdynamik modelleras inte. Bilen animeras genom en följd av statiska lastlägen. Vid minskad rörelse visas testets slutläge direkt. Hur fungerar det? behåller sina illustrativa modeller.

Brospelet: `assets/bridge-model.js`, `assets/bridge-builder.js`, `assets/bridge-builder.css`. Mekanismer: `assets/mechanisms-data.js`, `assets/mechanisms.js`, `assets/tech-diagrams.js` och `assets/technology.css`. Bilderna är egna SVG-illustrationer. Inga externa spelmotorer, ljudtjänster eller API-nycklar behövs.

Källor och kursplansanknytning finns i vuxeninformationen. Enkla modeller, undersökning och förbättring hör till teknik i 1–3. Hållfasta konstruktioner och fackverk tas uttryckligen upp i 4–6 och introduceras i brospelet som allmänbildande fördjupning för yngre barn.

## Datorn och du

Egen sektion under Teknik: `arskurs-1-3/teknik/datorn-och-du/index.html`, med sex aktiva kort.

- Lär dig tangentbordet!: 20 uppgifter med svensk bokstavsuppsättning, siffror och Mellanslag, Enter, Backsteg, Skift och vänsterpil. Fysisk tangenthantering är begränsad till övningsytan; Tab/Escape, kortkommandon, IME och upprepade händelser ignoreras. Skift ignoreras när det används för en annan uppgift så att versaler kan skrivas. Klickbart skärmtangentbord stöder touch. Ingen insamling eller överföring av tangenttryck.
- Datorns delar: åtta utforskningsknappar med markering av delen i en förenklad datorbild och åtta frågor. RAM, processor och lagring hålls isär.
- Vad får plats?: tolv frågor och en övningslagring på 1 GB = 1 000 MB. Lägg till/ta bort text-, bild-, musik- och filmexempel. Filstorlekarna är påhittade exempel och inga verkliga filer hanteras. NIST:s decimalenheter används; binärenheter förklaras bara i vuxeninformationen.

Skriv och redigera!, Vad är AI? och Trygg på nätet! är också aktiva; se nedan.

Kod: `assets/keyboard-game.js`, `assets/computer-quiz.js`, `assets/computer.css`. Data: `assets/computer-parts-data.js`, `assets/storage-data.js`. Quizfrågor och alternativ blandas; första svaret räknas, ledtråd efter två fel, slutresultat och omstart ingår.

### Skriv och redigera!, Vad är AI? och Trygg på nätet!

- `skriv-och-redigera/index.html`: tio uppgifter i en vanlig textruta. Skriva, versal, mellanrum, sudda, ersätta, infoga, punkt och radbrytning. Svaren bedöms utifrån sluttexten, inte vilka tangenter som användes. Inledande/avslutande blanksteg ignoreras, men interna mellanrum och radbrytningar spelar roll. Tom eller oförändrad starttext räknas inte som försök. Textutkast bevaras vid uppgiftsbyte. Återställ texten behåller tidigare försök.
- `vad-ar-ai/index.html`: tio påhittade scenarier om vad AI är, träningsexempel, felaktiga svar, genererade bilder, tydliga instruktioner och privat information. Ingen riktig AI-tjänst används.
- `trygg-pa-natet/index.html`: tio scenarier om lösenord, länkar, bilder, elaka meddelanden, personuppgifter, spelköp, källkritik och hjälp från en trygg vuxen. Ingen personlig information efterfrågas.

Data: `writing-data.js`, `vad-ar-ai-data.js`, `trygg-pa-natet-data.js`. Logik: `writing-game.js` och `digital-scenarios.js`, allt i `public/assets/`. Första giltiga svaret räknas; efter två fel visas hjälp. Slutresultat och omstart ingår. Text och svar hanteras lokalt i sidans arbetsminne utan överföring eller permanent lagring. Skrivspelet länkar till kursplanen i svenska; AI-/nätspelen har underlag från UNICEF och Internetstiftelsen.


## Fördjupning – omgång A, 6 oktober 2026

Vokalverkstan och Växla och räkna! har tydligare mål, innehållsledtrådar, separata repetitionsomgångar och vardera tre nya tillämpningsuppgifter. Ursprungligt resultat bevaras när barnet väljer Öva vidare eller Prova i ett nytt exempel. Alla resultat ligger i minnet under sidbesöket. Starta första omgången igen eller omladdning återställer; inga elevuppgifter lagras eller skickas.

Vokalverkstan erbjuder även Välj omgång → Starta kortpass: åtta unika ordpar, fyra långa/fyra korta vokaler, fyra k/ck-par och fyra andra par. Alla 50 ord finns kvar. Förloppsindikatorn visar avklarade uppgifter. Bildbeskrivningarna beskriver betydelsen utan att stava ut svarsalternativen. Ny funktion i `assets/practice-rounds.js`, avgränsad formgivning för de förbättrade sidorna i `assets/practice-refinements.css`.

Växla och räkna! behåller fri samtidig inmatning i tre fält och endast en liten ruta ovanför tiotalen. Felmeddelanden namnger berörda fält; efter två fel visas förklaringen med facit. Ledtrådar och facitstöd redovisas separat. Ordinarie bilder och Visa hur ger inget stödavdrag. Poängen beskriver första försöket i omgången, inte självständighet eller bestående kunskap.

`assets/results.js` har bakåtkompatibelt utökats med valfri stödredovisning. Övriga spels poängmodell är oförändrad. Språk- och matematikmenyernas länkar är desamma.

Validering: 21 kontrollskript passerade, inklusive nya fall för kortpass, stöd, separata resultat, alla tillämpningar och befintliga spel som delar resultatkod. HTML-kontrollen omfattar 45 sidor. Visuell webbläsargranskning, verklig skärmläsarkontroll och elevpilot återstår; den automatiserade webbläsaren blockerade lokala filadresser. Ingen publicering till Netlify har gjorts.


## Fördjupning – omgång B, 6 oktober 2026

Så säger man ju inte!, Hörde jag rätt? och Meningsbyggaren har nu separata repetitions- och tillämpningsomgångar med bevarat ursprungsresultat. Nio nya tillämpningar totalt: tre verbmeningar, tre skrivna ordanvändningsuppgifter och en ny mening per nivå i Meningsbyggaren.

Verbövningarna tydliggör standardskriftspråk och visar tids-/variationsförklaringar efter rätt svar. De 35 övningarna finns kvar, men svälja-uppgifterna är nu luckmeningar som accepterar svalde/sväljde respektive svalt/sväljt enligt SAG. Data finns i `assets/verbs-data.js`. Meningsbyggarens 45 meningar och tre nivåer behålls; data finns i `assets/sentences-data.js`. Fem nya alternativa ordföljder i nivå 3 accepteras. Lösta uppgifter förblir lösta vid återbesök.

Diktamensröst, taltexter, ljudfiler och tempo är oförändrade. Ljudrepetition ger inget stödavdrag. Nya stavningsledtrådar kan användas efter lyssning; hjälp och facitstöd redovisas separat. Tillämpningen med soffa, nyckel och vatten använder synlig ordbank och räknas som ordanvändning, inte hörförståelse.

22 funktions-/strukturkontroller passerade. Manuell visuell granskning och skärmläsarkontroll återstår. Språkgranskningen är intern och särskilda normfall har kontrollerats mot tillgängliga primärkällor; samtliga former är ännu inte verifierade mot separata aktuella ordboksartiklar. Ingen publicering har utförts.


## Fördjupning – omgång C, 6 oktober 2026

Gissa flaggan!, Riken på kartan och Vad är klockan? har tydligare mål, frivilliga exempel, mer specifik återkoppling samt separat repetition och tillämpning. Första omgångens poäng bevaras. Hjälp/facit redovisas separat. Inga resultat lagras efter sidbesöket.

- **Flaggor:** alla 30 länder finns kvar. En explicit liten lista med tillåtna stavfel och namnvarianter finns i `assets/flag-data.js`; rätt stavning visas efter svaret. England/Holland förklaras som del av ett större land. Tre tillämpningar kopplar Norge till Norden, Japan till Asien och Kanada till Nordamerika. Huvudstadsspelets svarskontroll är oförändrad.
- **Historiska kartor:** samma sex kartor, med tydligare datum och en kort tidslinje efter rätt svar. Tre tillämpningar tränar tidsjämförelse, Medelhavet och föränderliga gränser. Karttidpunkterna avser valda ögonblick, inte rikenas maximala utbredning. Faktakällor och kartunderlag skiljs åt. Data i `assets/riken-pa-kartan-data.js`, logik i `assets/empire-game.js`.
- **Klockan:** samma 24 frågor i tre nivåer. Felåterkoppling skiljer mellan timmar, minuter och kvart i/över. Varje nivå har ett nytt vardagsexempel där barnet ställer klockan med ett reglage: 08.30, 14.45 respektive 10.05. Repetition och tillämpning räknas separat; omstart påverkar bara vald nivå.

23 funktions-/strukturkontroller passerade. Visuell webbläsargranskning, faktisk touch-/skärmläsarkontroll och fullständig oberoende kart-/flagggranskning återstår. Kartornas underlag och datumkoppling är kontrollerade; varje historisk gränslinje är inte verifierad mot en oberoende atlas. Kartorna är förenklade och använder moderna kustlinjer. Ingen Netlify-publicering har utförts.


## Fördjupning – omgång D, 6 oktober 2026

Historik: byggspelet nedan har därefter ersatts av **Kan du bygga en bro?** på användarens begäran. Den aktuella funktionen beskrivs under Teknik ovan; tidigare jämförelse- och tornövningar ingår inte i ersättaren.

**Bygg och förbättra!** behåller sex uppdrag och samma modellregler. En frivillig förutsägelse och en öppningsbar jämförelse av de två senaste testerna visar val och utfall. Jämförelsen skiljer mellan ingen, en och flera ändringar. Det går att fortsätta undersöka efter löst uppdrag utan poängavdrag. Resultatet räknar lösta uppdrag och tester. Tre praktiska undersökningar finns efter omgången: pappersbro, tornfot och flyttad last. Barnets ”Jag har provat” innebär inte automatisk kunskapsbedömning. Modellernas stabilitetsprinciper är allmänbildande fördjupning för 1–3; hållfasta konstruktioner nämns uttryckligen i kursplanens 4–6-innehåll.

**Skriv och redigera!** behåller tio uppgifter och vanlig textarea. Hjälpen pekar på rader, mellanrum, bokstavsstorlek, punkt eller uppgiftens ändring. Texten skrivs inte om av programmet vid inmatning eller felaktig kontroll. Eleven väljer redigeringsmetod. Repetition och tre tillämpningar – inbjudan, packlista och meddelande – får egna resultat. Den första omgångens poäng finns kvar. Packlistan godtar stor eller liten första bokstav på varje rad enligt instruktionen. Data: `assets/writing-data.js`, logik: `assets/writing-game.js` och `assets/practice-rounds.js`.

Alla tio planerade aktivitetsförbättringar är nu implementerade. 24 funktions-/strukturkontroller passerar. Manuell webbläsar-, touch- och skärmläsarkontroll, faktisk ångra/urklippshantering, provbyggande samt fullständig extern ämnesgranskning återstår. Denna export är inte en uppgift om att elevpilot eller all kvalitetsgranskning är slutförd. Ingen publicering har utförts.


## Ny broverkstad – 6 oktober 2026

Kan du bygga en bro? ersätter det tidigare byggspelet. Sex uppdrag går från två vägdelar med mittstöd till en längre bro och en tyngre last. Man placerar delar genom att välja två punkter med klick, tryck eller tangentbord. Ingen dragning krävs. Egna broar beräknas med en förenklad elastisk modell; det finns ingen lista med förutbestämda rätta byggen. Kontrollerna är avgränsade till spelet och övriga aktiviteter behåller sin kod och sina ljud.

25 kontrollskript passerade, inklusive nya modelltester och gränssnittstester med mock-DOM. Bland annat kontrollerades övre/undre balklösningar i samtliga uppdrag, 480 varierade konstruktioner, materialgränser, lastens påverkan, avbrutna animationer, ombyggnad, omstart och minskad rörelse. HTML/länkkontrollen omfattar 45 sidor. Dessa tester ersätter inte visuell granskning eller verkliga touch-/skärmläsartester, som återstår eftersom lokal filvisning blockerades i den automatiserade webbläsaren. Ingen publicering har gjorts.


## Roliga fakta för årskurs 1–3

`arskurs-1-3/roliga-fakta/index.html` är en ny ämnesmeny med två aktiva kort:

- **Kroppens klurigheter!** (`kroppens-klurigheter/index.html`): sex upptäckter om hjärta, lungor, armbågsled, matsmältning, pupill och sömn. Barnet ändrar bilder med knappar/reglage, svarar på en fråga och får en förklaring samt ett frivilligt förslag att prova eller prata om utanför skärmen. Faktaunderlag från 1177 är länkat vid varje upptäckt.
- **Varför är det så?** (`varfor-ar-det-sa/index.html`): sex upptäckter om skuggor, smältning, magnetiska material, ljudvibrationer, flytande båtar och kondensering. Animationerna är egna förenklade SVG-modeller. De visar exempel och samband, inte exakta mätvärden eller en generell fysiksimulering. Faktaunderlag från Science Buddies, NOAA och American Chemical Society är länkat i respektive uppgift.

Kod och innehåll: `assets/discoveries-data.js`, `assets/discovery-scenes.js`, `assets/discovery-game.js`, `assets/discoveries.css`. Befintlig `results.js` används oförändrad. Inga bildlicenser, spelmotorer eller API-nycklar tillkommer. Google Fonts används liksom på övriga sidor.

Frågor och svarsalternativ blandas vid start/omstart; ordningen är stabil medan barnet undersöker en bild eller provar ett nytt svar. Första svaret räknas. Efter två olika fel visas facit med förklaring och stödet redovisas på resultatsidan. Utforskande före svar är tillåtet och förklaras i poängtexten. Det går att återvända till bilderna efter resultatet utan att ändra poängen. Spela igen återställer omgången. Svar och bildval ligger bara i sidans arbetsminne.

Alla kontroller är vanliga knappar och range-reglage, med textbeskrivningar av bildläget. Pausa rörelser samt systemets minskad-rörelse-inställning stoppar animationerna men behåller reglagens funktion. Ljudövningen visar vibrationer i långsam rörelse; den spelar inte upp ljud.

Lgr22-koppling: NO:s gemensamma innehåll i 1–3 om organ, sinnen, sömn, materialegenskaper och vattnets former. Skuggors geometri, vibrationer och lyftkraft ges som enkel allmänbildande fördjupning. Kursplanslänk finns i vuxeninformationen.

Verifiering 6 oktober 2026: 26 kontrollskript godkända, inklusive hela omgångar i båda spelen med mock-DOM, varierad svarsplacering, återbesök, stöd, poäng, slutresultat, omstart och samtliga bildkontroller. 33 SVG-lägen är validerade som XML. HTML-kontrollen omfattar nu 48 sidor. Detta är inte visuell webbläsargranskning: lokal filvisning är blockerad i den automatiserade webbläsaren. Faktisk touch, skärmläsare, layout på olika skärmar och elevpilot återstår. Ingen Netlify-publicering har gjorts.


## Läroms hemsida och läryta – 6 oktober 2026

Hemsidan använder en egen responsiv formgivning i `assets/landing.css` och beteende i `assets/landing.js`. Färger, logotyp och IBM Plex Sans anknyter till lärytan. Förhandsvisningarna är egna SVG/CSS-animationer, inte inbäddade spel. Länkar öppnar de riktiga spelen. Europakartan bygger på samma Natural Earth-underlag som kartspelen; källor finns i `assets/landing/SOURCES.txt`.

En versionslåst Lenis 1.3.26 laddas asynkront från UNPKG på hemsidan. Biblioteket används inte i lärytan. Om nätverket eller CDN-resursen saknas fungerar sidan med vanlig rullning. Lenis behöver internet för att laddas. Touch använder vanlig rullning. Knappen ”Pausa rörelser” stänger av animationer och Lenis; systemets inställning för minskad rörelse respekteras också.

49 HTML-sidor och 236 webbplatsfiler ingår i denna export. 27 automatiska kontrollskript passerar. De nya kontrollerna verifierar navigering, Lenis-avgränsning och livscykel med en simulerad DOM, pauser och reservbeteende när biblioteket saknas. HTML-struktur, lokala länkar och SVG-syntax har kontrollerats. Visuell kontroll på dator/mobil samt verklig Lenis- och touchkörning i webbläsare återstår. Webbplatsen är inte publicerad av denna ändring.
