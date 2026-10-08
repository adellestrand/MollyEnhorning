# Spelbilder

Den godkända referensen är `assets/design-reference.png`. Två separata spelbilder skapades med den inbyggda imagegen-funktionen, inte med API/CLI. Spelet gör inga AI-anrop under spelandet.

- `assets/molly-sprites.png`: original, 1536 × 1024, alfakanal. Tre gångposer och tre flygposer.
- `assets/meadow.png`: separat bakgrund i referensens sagostil.
- `assets/molly-sprites.webp` och `assets/meadow.webp`: samma bilder kodade till mindre WebP-filer för webbläsaren. Originalen behålls.

Spritearket är tre kolumner à 512 pixlar. Gångraden använder y=0–480; flygraden y=480–1024, för att den upplyfta vingen inte ska läcka in i gånganimationen. Kollisionerna använder en egen kroppsyta, så fjädrar, man och svans fastnar inte i plattformskanter. Det här är en första animation med tre poser per rörelsetyp; naturligare övergångar kan vidareutvecklas.

## Slutlig prompt: karaktär

Use case: illustration-story. Asset type: 2D side-scrolling game character sprite sheet with transparent background. Input image is the approved style and character identity reference. Create a precisely aligned 3 columns by 2 rows sheet of SIX complete isolated side profile poses of Molly riding her white winged unicorn, all facing right, all at identical scale and with hooves at identical cell baseline. Entire horse, horn, tail, wings and rider fit inside each cell with padding. Natural realistic horse and child proportions, detailed fur and feather textures, painterly realistic fairy tale like reference. Molly is six years old, brown ponytail, purple shirt, blue trousers, riding boots. Row1: three different walking/galloping leg positions, wings folded. Row2: three airborne flying poses with feathered wings at raised, horizontal and lowered stroke, legs tucked. Character remains identical throughout. Crisp readable side-on profile with no perspective. Genuine transparent background, no scenery, ground, shadows, captions, grid lines, borders, text or watermark. Landscape sprite sheet.

## Slutlig prompt: miljö

Use case: illustration-story. Asset type: landscape background panorama for a side-scrolling fairy tale platform game. Reference image is approved lighting/style/material reference only. Create a detailed painterly naturalistic fairy-tale landscape of Rainbow Meadow, wide landscape ratio: pale blue sky, soft clouds, a delicate luminous rainbow, distant medieval castle to the right, mountains, misty waterfalls, flowering lilac trees, sunny spring green meadows. Distant scenery only: lower half is a misty open valley so separately rendered game platforms and character can be read clearly. No foreground cliffs, no playable platforms, no close large trees blocking action. No characters, no unicorns, no stars, no UI or text. Soft detailed naturalistic illustration matching reference and keeping a calm legible playfield.

## Nya spelbilder för den längre banan

Skapade med det inbyggda bildverktyget den 8 oktober 2026. Originalen sparas i projektet och används direkt av spelet. Båda bilderna har alfakanal; genomskinligheten har kontrollerats.

- `assets/pony-friend.png`: naturtrogen hästvän, 1536 × 1024, cirka 2,1 MB.
- `assets/icecream-cart.png`: glassvagn, 1312 × 1199, cirka 1,8 MB.

Godis, morötter, presenter, glassbelöning, blommor, vimplar och ridhinder är egna Canvas-former i `world-art.js`, anpassade till spelets färger. Ingen ny AI-generering sker under spelandet.

### Slutlig prompt: hästvän

Use case: illustration-story. Asset type: transparent cutout for a 2D side-scrolling fairy-tale game for a six-year-old. Create one complete friendly chestnut pony standing in strict side profile facing LEFT, head lowered slightly to accept a carrot, soft kind eyes, natural realistic horse proportions, glossy chestnut fur, flaxen mane and tail, simple lavender ribbon in mane. Detailed painterly naturalistic fairy-tale look, warm soft daylight, compatible with a white winged unicorn game in a spring meadow. No rider, no saddle, no wings, no horn. All four hooves, ears and tail visible; generous clear padding. Genuine transparent background, no ground, shadows, scenery, text, logo or watermark. Single isolated subject centered.

### Slutlig prompt: glassvagn

Use case: illustration-story. Asset type: transparent scenery cutout for a side-scrolling fairy-tale game. A single whimsical little wooden ice cream cart, side-on, with two wooden wheels, pastel pink and cream striped canopy, lavender trim, small brass bell, three ice cream cones with strawberry pink, vanilla cream and mint green scoops displayed on the counter, delicate flowers on the cart. Detailed painterly naturalistic fairy-tale materials, warm soft daylight; friendly and readable to a six-year-old. No vendor, no people, no horses, no environment. Entire canopy, wheels and cart fit in image with padding. Genuine transparent background, no cast shadow, no ground, no words or letters, no logos or watermark. One isolated complete cart centered.
