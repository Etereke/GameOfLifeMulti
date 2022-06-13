/* Ez a projekt a Pannon MIK Szoftverfejlesztés tantárgy keretein belül készült. A projektet egy 3 fős csapat valósította meg.*/

# GameOfLifeMulti

## Leírás

A GameOfLifeMulti projekt a híres Conway's Game of Life többjátékos verziója. A szabályok megegyeznek az eredeti játék szabályaival. Ami többjátékossá teszi, az a színek bevezetése. Minden játékosnak van egy saját területe a játék elején, és egy színe. A saját területén a saját színéből annyi sejtet tehet le, amennyit akar. A játék lefutása során az újonnan született mezők a következő szabályok alapján jönnek létre:

    - Ha a születéshez szükséges 3 mező közül legalább 2 megegyező színű, akkor az új mező annak a színével fog megegyezni
    - Ha mindhárom eltérő színű, akkor az új mező véletlenszerűen kap színt a három mező közül
    
A játék során az élő sejtek száma jelzi az egyes játékosok pontszámát. A játék kétféleképpen érhet véget: vagy csak egy játékosnak marad élő sejtje, vagy eltelik egy előre meghatározott számú generáció. A játékot a legtöbb pontszámmal rendelkező játékos nyeri.

## Az oldal használata

A website-ra belépve a felhasználónak meg kell adnia egy felhasználónevet és egy szobanevet. A bejelentkezés gombra kattintva a megadott szobanévvel ellátott szobába kerül, ahol látja, hogy kik vannak a szobában, valamint kap egy 15x15-ös gridet, amikbe kattintva elhelyezheti a sejtjeit. 

Ha elkészült a kezdeti pozíciójával, a Kész gombra kattintva elküldi azt a szervernek. Ha a szobában lévő összes játékos readyzett, a szerver az elküldött pozíciókat összeilleszti, és elkezdi futtatni a játékot. 

Ha a játék befejeződött, mindenkinél megjelenik a 'New game' gomb, amire rákattintva új kezdőpozíciót adhatnak még, és újrakezdhetik a játékot.


## Követelmények

        - A játékosok be tudjanak lépni szobákba, lássák egymást, egy szobában egyszerre 1-4 fő tartózkodhasson
        - A játékosok egy canvasra tudjanak lerakni élő sejteket
        - A játékosok egy szobában tudjanak több játékot lejátszani, ne kelljen újra belépni, ha új játékot akarnak kezdeni
        - A játék 2-4 játékossal legyen futtatható, vagyis ha csak ketten vannak egy szobában, és mindketten readyznek, akkor is fusson le a játék.

## Szekvencia diagram

![image](https://user-images.githubusercontent.com/98815314/168903655-f8d270db-8f5b-4bc2-99fc-a77fe3a38891.png)

## Használt eszközök, technológiák

    - HTML, CSS, Javascript
    - Node.js
    - Socket.io
    - Repl.it
    - Github
    
## Futtatás
    A server.js fájlt kell szerveren hostolni
    Repl.it link : https://replit.com/@MartinNagy3/GameOfLifeMulti#server.js
