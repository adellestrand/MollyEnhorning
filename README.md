# Molly och den magiska enhörningen

Ett spelbart svenskt plattformsspel i webbläsaren. Molly rider en vit enhörning med fjädervingar genom Regnbågsängen. En kort bana innehåller 15 stjärnor, raviner, magiska törnen och en regnbågsportal.

## Spela lokalt

Du behöver Node.js. Inga paket behöver installeras.

```powershell
cd C:\Users\ADell\OneDrive\Dokument\ChatGPT\molly-unicorn
npm start
```

Öppna **http://localhost:4173** och välj **Börja äventyret**. Avsluta servern med Ctrl+C. Om porten är upptagen: `$env:PORT=4174; npm start`. På en surfplatta i samma nätverk kan du öppna `http://DATORNS-IP:4173` om datorns brandvägg tillåter det. Liggande läge rekommenderas.

## Kontroller

| Handling | Tangentbord | Pekskärm |
|---|---|---|
| Rörelse | ← / → | Tryck på spelytan dit ni vill gå |
| Stanna | Släpp ← / → | Stanna, eller invänta destinationen |
| Hopp | Mellanslag | Hoppa |
| Kort flygning | Håll mellanslag | Håll Hoppa |
| Stjärnmagi | X | Magi |
| Paus | Esc eller pausknappen | Pausknappen |
| Snabb omstart | Omstartsknappen ↻ | Omstartsknappen ↻ |

Flygkraften räcker ungefär 1,3 sekunder och fylls på vid landning. Magin söker efter törnen framför er och återhämtar sig på 0,65 sekunder. Tre hjärtan ger utrymme att prova igen. Vid skada återvänder ni till en tidigare trygg plats. Alla stjärnor är valfria; målet är regnbågsportalen.

Spelet känner av pekskärm via pekdonets egenskaper (`any-pointer: coarse`, med `maxTouchPoints` och `hover: none` som reserv). En faktisk pekning eller penna aktiverar också pekläget. Det fungerar även på surfplatta med ansluten mus; ett smalt datorfönster växlar inte automatiskt till pekläge.

I pekläge ersätts pilknapparna med tryck på spelytan och Stanna. Molly går tills hon når den markerade platsen. Dra fingret för att ändra destinationen. Hoppa och Magi har större knappar och stödjer flera samtidiga pekningar med oberoende släpp och avbrott. Vid skada, paus, omstart och förlorat fokus rensas destinationen. Vid förlorat fokus pausas också spelet. A/D används inte.

## GitHub Pages

Repository: https://github.com/adellestrand/MollyEnhorning

Publicera från **Settings → Pages → Deploy from a branch → main → /(root) → Save**. Ingen byggprocess behövs. `.nojekyll` gör att filerna serveras direkt. När Pages är klar är speladressen **https://adellestrand.github.io/MollyEnhorning/**. GitHubs publicering kan ta några minuter.

## Verifiering

```powershell
npm test
```

Elva automatiserade tester kontrollerar pekskärmsdetektering, kollisioner, förbrukad flygkraft och påfyllning, magi, stjärnor, hälsa, förlust, paus och hela banan från start till mål utan att flytta spelaren med testkod.

Med servern igång: öppna **http://localhost:4173/tests/browser.html**. Arton browsertester kontrollerar start, tangentbordshändelser, X, hopp/flygning, tre samtidiga emulerade pekningar, oberoende släpp, avbruten pekning, förlorad pointer capture, fokusförlust, paus, omstart, förlust, stjärnor och fullständigt genomspel. De kontrollerar även tryck för att gå, automatisk stopp vid destinationen, drag, Stanna, kamerans koordinater och stopp vid skada. Layout kontrolleras i 768 × 1024, 834 × 1194, 1024 × 600, 1024 × 768 och 1366 × 1024: pekknappar ligger under canvas, träffytor är minst 44 px, och sidan har inget scrollområde.

Verifierat i Codex-webbläsarens Chromium den 8 oktober 2026: 11/11 automatiserade tester och 18/18 browsertester godkända. Ett automatiserat genomspel nådde portalen med tre hjärtan och minst fem stjärnor. Vanliga browserinteraktioner med höger piltangent, mellanslag och X verifierade rörelse, hopp och magi. Samtidig touch är emulerad med PointerEvent; fysisk iPad/Android-surfplatta och Safari har inte testats.

## Teknik och vidareutveckling

Ren JavaScript och Canvas, 120 fysiksteg per sekund, separat rendering och en liten statisk utvecklingsserver. Spelet fungerar utan AI-anrop, konton eller spelserver. Allt spelinnehåll laddas från lokala filer. Koden innehåller inga analysverktyg eller externa nätverksberoenden under spelandet.

- `core.js`: fysik, bana och spelregler; går att testa i Node.
- `control-mode.js`: detektering av pekskärmskontroller; går att testa i Node.
- `game.js`: bildrendering, animationer, UI och inmatning.
- `style.css` och `index.html`: responsiv svensk spelvy.
- `assets/`: referens, separata originalbilder och mindre WebP-versioner.
- `ASSETS.md`: bildprompter och spritearkets koordinater.
- `PLAN.md`: den godkända planen.

## Privat Git-identitet för denna mapp

Den lokala `.git/config` väljer `adellestrand`, GitHubs noreply-adress och remote med explicit kontonamn. Kontonamnet i remote-adressen väljer rätt sparad inloggning i Git Credential Manager. `credential.useHttpPath=false` låter GCM hitta den kontoinloggningen; det explicita användarnamnet skiljer kontona åt. Jobbets globala namn, e-post och inloggning ändras inte.

```powershell
git config --local user.name adellestrand
git config --local user.email 13117247+adellestrand@users.noreply.github.com
git config --local credential.https://github.com.username adellestrand
git config --local credential.useHttpPath false
git remote set-url origin https://adellestrand@github.com/adellestrand/MollyEnhorning.git
```

Git Credential Manager lagrar själva inloggningen i Windows Credential Manager. Kontoval är skilt från commit-namn och e-post. Spara aldrig lösenord eller token i projektets filer.

Den här mappen skapades av Codex sandboxkonto. Ett undantag för exakt denna mapp i Git `safe.directory` har därför lagts till efter användarens uttryckliga godkännande. Det gäller bara denna sökväg och ändrar inga jobbidentiteter.

