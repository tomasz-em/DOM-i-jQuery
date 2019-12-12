# DOM i jQuery
### _Wstęp do DOM oraz biblioteka jQuery_, **zjazd 3** `2019 XII 08`

___

### Używanie biblioteki jQuery do przeprowadzania podstawowych operacji na elementach HTML
* wyszukiwanie
* modyfikowanie (treść, atrybuty oraz własności CSS)
* wstawianie nowych elementów wraz z przygotowaną zawartością i ich parametrami (jak modyfikacja) 
* obsługa zdarzeń dla działań _systemowych_ oraz poczynań użytkownika
  - przypisywanie
  - usuwanie
  - interakcja z elementami (elementy aktywne formularzy, wskaźnik myszki a dowolne elementy) 
* komunikacja poprzez AJAX
* użycie w REST API

___

## Wyszukiwanie elementów - lista nr 1 (folder `1-wyszukiwanie-elementow`) 

### Zadanie 1
Dołącz do swojego pliku bibliotekę jQuery. W pliku **app.js** umieść kod sprawdzający, czy DOM został załadowany.
Następnie wyszukaj elementy ```section``` i ustaw im **klasę** ```backgroundElement```. Stwórz nową funkcję, w której
wykonasz te czynności.

### Zadanie 2
Wyszukaj element ```nav``` wewnątrz **sekcji** ```links```. Nadaj mu **klasę** ```hover-effect```.

### Zadanie 3
Zapoznaj się z plikiem **index.html** oraz **style.css**. Dodaj **klasę** ```borderClass``` do każdego elementu
**li** (uwzględnij tylko **sekcję** o **klasie** ```main```).

### Zadanie 4
Ustaw każdemu elementowi **li** (tylko te w **sekcji** o **klasie** ```main```) dodatkowe dwie **klasy**:
* ```colorText```,
* ```backgroundElement```.
Znajdziesz je w pliku **style.css** pod odpowiednim komentarzem.
Łącznie z poprzednią **klasą** ```borderClass``` będą to trzy **klasy** ustawione dla każdego **li**.

### Zadanie 5
Za pomocą jQuery wykonaj następujące czynności:

1. Wyszukaj wszystkie linki i ustaw im czerwony kolor za pomocą funkcji ```css()```.
2. Zmodyfikuj kod tak, aby kolor czerwony miały linki tylko z menu.
3. Dodaj **klasę** ```redLinks``` w pliku **style.css** (ustaw w niej kolor tekstu na czerwony) i za pomocą ```addClass``` nadaj ją elementom **li** w menu (zmodyfikuj kod z podpunktów 1. i 2 czyli zamień funkcje css() na addClass() ).
4. Spraw, aby pierwszy element menu miał większy font niż inne. Stwórz odpowiednią **klasę** w pliku **style.css**.

### Zadanie 6
Dodaj do elementu **h1**  **klasę** ```creepyHeader```, a następnie:
* jego rodzicowi (wyszukaj go za pomocą parent() ) ustaw dowolne obramowanie za pomocą funkcji css() )
* następnemu elementowi po nim (po h1) dodaj klasę ```crazy```. Sprawdź czy na pewno została dodana.

### Zadanie 7
Wypisz w konsoli pierwszy, trzeci i ostatni element menu. Użyj odpowiednich funkcji. Dodaj do znalezionych elementów **klasę** ```menuLinks```.

### Zadanie 8
W pliku ```index.html``` znajdziesz sekcję o klasie ```form```. Znajdują się w niej dwa pola ```input```. Pobierz wartości, które są w nich ustawione i wyświetl je w konsoli.

### Zadanie 9
W pliku ```index.html``` znajdziesz link o id ```googleLink```. Zapisz  jego atrybut href do zmiennej i wypisz w konsoli. Nastepnie podmień go na inny dowolny.

### Zadanie 10
W pliku ```index.html``` znajdziesz sekcję o klasie ```links```. Pobierz atrybut data-hover do zmiennej i wypisz go w konsoli. Spróbuj za pomocą funkcji ```data``` oraz ```attr```.
Jak widzisz są one źle wpisane w html, spróbuj je podmienić za pomocą funkcji data().

[Rozwiązania dla tej listy zadań (10/10)](https://tomasz-em.github.io/DOM-i-jQuery/1-wyszukiwanie-elementow/index.html)
|
[Plik JS z poleceniami i rozwiązaniami](https://tomasz-em.github.io/DOM-i-jQuery/1-wyszukiwanie-elementow/app.js)

---

## Obsługa eventów - lista nr 2 (folder `2-obsluga-eventow`) 

### Zadanie 1
Ustaw event na elemencie **dt**, którego zadaniem jest wyświetlenie w konsoli informacji o elemencie, na który najechaliśmy.

### Zadanie 2
Znajdź w pliku **index.html** trzy **buttony** w elemencie z **klasą** ```hero-buttons```. Dla każdego elementu ustaw event ```click```, który po kliknięciu pobierze wartość znajdującą się w atrybucie data-feature i wyświetli ją w konsoli.

### Zadanie 3
Znajdź w pliku **index.html** **sekcję** z **klasą** ```superhero-description```, a następnie napisz funkcję, która:
1. Ukryje domyślnie wszystkie elementy **dd**
2. Po kliknięciu w element **dt** sprawi, że elementy **dd** będą rozwijały się, jeśli są ukryte i _vice versa_.
Do znalezienia najbliższego rodzeństwa danego elementu użyj funkcji ```.next()```.

### Zadanie 4
Znajdź w pliku **index.html** element z **klasą** ```shopping```. Wykonaj następujące czynności:
* Po kliknięciu w **button** ```Dodaj``` &ndash; ustaw mu **klasę** ```added``` oraz pojedynczemu elementowi zawierającemu produkt zmień obramowanie na zielone.
* Podmień tekst przycisku na ```Dodano```.
* Po ponownym kliknięciu zresetuj ustawienia elementu ```cart-item```.

[Rozwiązania dla tej listy zadań (4/4)](https://tomasz-em.github.io/DOM-i-jQuery/2-obsluga-eventow/index.html)
|
[Plik JS z poleceniami i rozwiązaniami](https://tomasz-em.github.io/DOM-i-jQuery/2-obsluga-eventow/app.js)

---

## Modyfikowanie elementów - lista nr 3 (folder `3-modyfikowanie-elementow`)

### Zadanie 1
Stwórz element ```div``` z **klasą** ```panel``` i wstaw go za sekcją ```people```. Przy pomocy jQuery wstaw w niego dowolny tekst.

### Zadanie 2
Znajdź w pliku **index.html** element z **klasą** ```people```. Stwórz odpowiednią funkcję, wewnątrz której ustawisz event ```click``` na przycisku ```dodaj```.

Po kliknięciu wykonaj następujące czynności:
1. Pobierz do zmiennej wartość wpisaną w pole z **id** ```addUser```
2. Pobierz do zmiennej wartość wpisaną w pole z **id** ```age```
3. Wstaw nowy element na koniec listy, ustaw wprowadzony wiek jako atrybut ```data```
4. Po każdym wstawieniu elementu wywołaj funkcję, która ustawi odpowiedni kolor dla elementu **li** w następujący sposób:
  * zielony dla osób w wieku do 15 lat
  * niebieski dla osób mających od 16 do 40 lat
  * czerwony dla osób mających 41 lat i więcej

### Zadanie 3
Znajdź w pliku **index.html** element z **klasą** ```graphic```. Napisz funkcję, która utworzy elementy **span** i doda je w odpowiednie miejsca według poniższego obrazka.
Zastąp nazwy miesięcy nazwami poszczególnych funkcji, z których korzystasz, np. ```append```.

![schemat układu elementów](https://tomasz-em.github.io/DOM-i-jQuery/3-modyfikowanie-elementow/graphic.png "schemat układu elementów")

### Zadanie 4
Zapoznaj się z plikiem **index.html**. Znajdź w nim elementy z **klasą** ```block```, a następnie zapisz je do zmiennej. Napisz funkcję, która po kliknięciu elementu z **klasą** ```block``` usunie dany element z kolumny z **klasą** ```left``` i przeniesie go do kolumny z **klasą** ```right```.

[Rozwiązania dla tej listy zadań (4/4)](https://tomasz-em.github.io/DOM-i-jQuery/3-modyfikowanie-elementow/index.html)
|
[Plik JS z poleceniami i rozwiązaniami](https://tomasz-em.github.io/DOM-i-jQuery/3-modyfikowanie-elementow/app.js)

---

## Obsługa eventów (cd.) - lista nr 4 (folder `4-obsluga-eventow-ciag-dalszy`)

### Zadanie 1
Stwórz element ```div``` z **klasą** ```panel``` i wstaw go za sekcją ```people```.
Dodaj mu dowolny tekst, a następnie ukryj ten tekst.
Ustaw na elemencie event, który po najechaniu na ten ```div``` pokaże ukryty tekst.

### Zadanie 2
Znajdź w pliku **index.html** element o **klasie** ```people```. Wykonaj w niej następujące czynności:
* dodaj przycisk ```Usuń``` do wszystkich istniejących i nowo powstałych elementów **li**
* napisz funkcję, która po kliknięciu w przycisk ```Usuń``` &ndash; usunie element z listy
* dodaj przycisk ```Edytuj``` do wszystkich istniejących i nowo powstałych elementów **li**
* napisz funkcję, która po kliknięciu w przycisk ```Edytuj``` umożliwi edycję elementu
W trakcie edycji zmień tekst przycisku z ```Edytuj``` na ```Zatwierdź```. Po klinięciu w ```Zatwierdź``` zakończ edycję.

[Rozwiązania dla tej listy zadań (2/2)](https://tomasz-em.github.io/DOM-i-jQuery/4-obsluga-eventow-ciag-dalszy/index.html)
|
[Plik JS z poleceniami i rozwiązaniami](https://tomasz-em.github.io/DOM-i-jQuery/4-obsluga-eventow-ciag-dalszy/app.js)

---

## Obsługa AJAX cz. I - lista nr 5 (folder `5-obsluga-ajax-czesc-i`)

### Zadanie 1
Zapoznaj się z plikami HTML i JavaScript. Wczytaj dane z adresu: http://swapi.co/api/films/.
Przejdź przez zadanie korzystając z **debuggera**. Zwróć uwagę na to kiedy filmy zostają wczytane.

Przydatne informacje:
* użyj odpowiedniej metody HTTP
* użyj odpowiednich funkcji informujących użytkownika o statusie żądania (metody ```done()```, ```fail()``` lub ```always()```)
* sprawdź w konsoli, jak wyglądają wczytywane dane
* jeśli dane zostaną poprawnie wczytane, wywołaj odpowiednią funkcję np. ```insertContent()```, do której jako argument przekaż wczytane dane
* wewnątrz funkcji ```insertContent()``` przeiteruj po tablicy wyników
* wewnątrz pętli stwórz dwa elementy **li** oraz **h3**
* ustaw odpowiednią **klasę** na elemencie **li**
* do elementu **h3** dodaj tytuł filmu
* wstaw element **h3** do **li**, a następnie wszystko do listy **ul**

[Rozwiązanie (przyszłe) dla tej listy zadań (0/1)](https://tomasz-em.github.io/DOM-i-jQuery/5-obsluga-ajax-czesc-i/index.html)
|
[Plik JS z poleceniem i rozwiązaniem](https://tomasz-em.github.io/DOM-i-jQuery/5-obsluga-ajax-czesc-i/app.js)

---

## Obsługa AJAX cz. II - lista nr 6 (folder `6-obsluga-ajax-czesc-ii`)

### Zadanie 1
Pod adresem https://holidayapi.com/ przechowywana jest baza świąt państwowych różnych krajów.
Aby z niej skorzystać trzeba wygenreować swój klucz API - wejdź na stronę i wygeneruj swój klucz.

Za pomocą metody ```ajax()``` wczytaj do listy **ul** wszystkie świąteczne daty jako elementy **li**.

Aby poprawnie wczytać dane, należy przekazać wymagane parametry,
o których mowa na stronie. Daty mogą być tylko historyczne, tj. sprawdzanie świąt w roku bieżącym jest niemożliwe.

Każdą nazwę święta wczytaj do elementu **li**, jego datę również wczytaj do elementu **li** jako **span**.

### Uwaga
Sprawdź w konsoli jak wyglądają wczytywane dane, aby ułatwić sobie ich obróbkę.

[Rozwiązanie (przyszłe) dla tej listy zadań (0/1)](https://tomasz-em.github.io/DOM-i-jQuery/6-obsluga-ajax-czesc-ii/index.html)
|
[Plik JS z poleceniem i rozwiązaniem](https://tomasz-em.github.io/DOM-i-jQuery/6-obsluga-ajax-czesc-ii/app.js)
