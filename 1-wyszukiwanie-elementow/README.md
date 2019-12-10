# Wyszukiwanie elementów

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
