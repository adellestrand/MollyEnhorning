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
