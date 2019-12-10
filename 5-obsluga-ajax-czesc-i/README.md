# Obsługa AJAX cz. I

## Zadanie 1
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
