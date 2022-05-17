# GameOfLifeMulti

## Leírás

A GameOfLifeMulti projekt a híres Conway's Game of Life többjátékos verziója. A szabályok megegyeznek az eredeti játék szabályaival. Ami többjátékossá teszi, az a színek bevezetése. Minden játékosnak van egy saját területe a játék elején, és egy színe. A saját területén a saját színéből annyi sejtet tehet le, amennyit akar. A játék lefutása során az újonnan született mezők a következő szabályok alapján jönnek létre:

    -Ha a születéshez szükséges 3 mező közül legalább 2 megegyező színű, akkor az új mező annak a színével fog megegyezni
    -Ha mindhárom eltérő színű, akkor az új mező véletlenszerűen kap színt a három mező közül
    
A játék során az élő sejtek száma jelzi az egyes játékosok pontszámát. A játék kétféleképpen érhet véget: vagy csak egy játékosnak marad élő sejtje, vagy eltelik egy előre meghatározott számú generáció. A játékot a legtöbb pontszámmal rendelkező játékos nyeri.

## Az oldal használata

A website-ra belépve a felhasználónak meg kell adnia egy felhasználónevet és egy szobanevet. A bejelentkezés gombra kattintva a megadott szobanévvel ellátott szobába kerül, ahol látja, hogy kik vannak a szobában, valamint kap egy 15x15-ös gridet, amikbe kattintva elhelyezheti a sejtjeit. 

Ha elkészült a kezdeti pozíciójával, a Kész gombra kattintva elküldi azt a szervernek. Ha a szobában lévő összes játékos readyzett, a szerver az elküldött pozíciókat összeilleszti, és elkezdi futtatni a játékot. 

Ha a játék befejeződött, mindenkinél megjelenik a 'New game' gomb, amire rákattintva új kezdőpozíciót adhatnak még, és újrakezdhetik a játékot.


## Követelmények

        -A játékosok be tudjanak lépni szobákba, lássák egymást, egy szobában egyszerre 1-4 fő tartózkodhasson
        -A játékosok egy canvasra tudjanak lerakni élő sejteket
        -A játékosok egy szobában tudjanak több játékot lejátszani, ne kelljen újra belépni, ha új játékot akarnak kezdeni
        -A játék 2-4 játékossal legyen futtatható, vagyis ha csak ketten vannak egy szobában, és mindketten readyznek, akkor is fusson le a játék.

## Contributing


## License

