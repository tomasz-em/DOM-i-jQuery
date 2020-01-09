/* 3. Konwerter temperatur
Stwórz konwerter temperatur; musi umożliwiać przeliczanie stopni Celsjusza na stopnie Fahrenheita i odwrotnie;
musi mieć guzik do szybkiego odwrócenia konwersji.
*/

var celsiusValue = 0,
    fahrenheitValue = 0,
    celsiusInput = document.getElementById('celsius'),
    fahrenheitInput = document.getElementById('fahrenheit'),
    toggleBtn = document.getElementById('selector'),
    classOfCelsius = "now-celsius";     // był zamiar użycia wraz z wyznaczniem "kierunku" konwersji (też w odniesieniu do aktywnego pola),  
                // ...ale przyjęta logika nie wykorzystuje tej zmiennej; przy innym warunku warto się trzymać bardziej logiki JS, 
                // ...a nie atrybutów formularza (co może być złudne)

                
// -----  zdarzenia  -----

celsiusInput.addEventListener("change", updateFromCelsius, false);
celsiusInput.addEventListener("input", updateFromCelsius, false);   // ewentualnie do usunięcia obsługa tego zdarzenia

fahrenheitInput.addEventListener("change", updateFromFahrenheit, false);
fahrenheitInput.addEventListener("input", updateFromFahrenheit, false);   // ewentualnie do usunięcia obsługa tego zdarzenia

toggleBtn.addEventListener("click", toggleUnits, false);


// -----  funkcje  -----

function convertCelsiusTofahrenheit( unitsC ) {
    return (unitsC * 1.8 + 32).toFixed(2);
}

function convertFahrenheitToCelsius( unitsF ) {
    return ((unitsF - 32) / 1.8).toFixed(2);
}

function updateFromCelsius() {
celsiusValue = evaluateToNumber( celsiusInput.value );
// celsiusInput.value = celsiusValue;  // aktualizacja wartości, gdyby wynik po konwersji był inny od źródła.. ale to pomija części dziesiętne
    if ( celsiusValue === null ) {  // !!! TA KOREKTA JEST ZBYT RESTRYKCYJNA ZE ZDARZENIEM "INPUT"!!! 
                // ...ale "nie pozwala wpisać" znaku innego, niż tworzącego poprawnny zapis tekstowy liczby całkowitej lub rzeczywistej
    celsiusValue = 0;       // zamiast "nieoczekiwanego" nadpisywania ZEREM można użyć CSSa, by przekazać że dane wejściowe są złe
    celsiusInput.value = 0;  // ...ale to wymaga tez blokowania działania, póki te dane nie zostaną naprawione (tu zdarznie INPUT mogłoby być okresowo wyłączane 
                             // ...lub jakiś parametr dla funkcji, by nie przetwarzać wartości pole formularza od razu)
    fahrenheitInput.value = "NIEPRAWIDŁOWA WARTOŚĆ";    // nie uda się zobaczyć, za szybka podmieniany jest tam wynik przekształceń dla 0^C
    }

fahrenheitValue = convertCelsiusTofahrenheit( celsiusValue );   // wykonaj przeliczenie, ewentualnie dla (0C)
fahrenheitInput.value = fahrenheitValue;
}

function updateFromFahrenheit() {
fahrenheitValue = evaluateToNumber( fahrenheitInput.value );
// fahrenheitInput.value = fahrenheitValue;  // aktualizacja wartości, gdyby wynik po konwersji był inny od źródła
    if ( fahrenheitValue === null ) {   // BARDZO RESTRYKCYJNE razem ze zdarzeniem "INPUT" - uwagi jak w "updateFromCelsius()"
    fahrenheitValue = 0;
    fahrenheitInput.value = 0;
    celsiusInput.value = "NIEPRAWIDŁOWA WARTOŚĆ";   // nie uda się tego zobaczyć, za szybka podmieniany jest tam wynik przekształceń dla 0^F
    }
celsiusValue = convertFahrenheitToCelsius( fahrenheitValue );   // wykonaj przeliczenie, możliwa konwersja wartości naprawionej (0F)
celsiusInput.value = celsiusValue;
}

function toggleUnits() {
    // toggleAttribute() bez wsparcia dla IE, zatem standardową drogą, po kolei negować stan obu pól wpisywania
    if ( celsiusInput.hasAttribute('disabled') ) {
    fahrenheitInput.setAttribute('disabled', true); // zamiana wyłączonych pól pomiędzy sobą
    celsiusInput.removeAttribute('disabled');

    updateFromCelsius();    // przeliczenie wartości we właśnie aktywowanym polu, wynik wyświetlany we wcześniej aktywnym polu  
    
    celsiusInput.focus();   // automatyczna aktywacja pola takstowego po zamianie
    toggleBtn.classList.remove('animate-rotation-180');     // zabranie klasy - odwrotna animacja odwracania elementu w pionie
    }
    else {
    celsiusInput.setAttribute('disabled', true);
    fahrenheitInput.removeAttribute('disabled');

    updateFromFahrenheit();     // przeliczenie wartości z właśnie aktywowanego pola, wynik wyświetlany we wcześniej aktywnym polu

    fahrenheitInput.focus();
    toggleBtn.classList.add('animate-rotation-180');
    }
}

function simpleHTMLInputParser( inputText ) {
    var trimmedText = inputText.trim();     // wywal wszelkie spacje i niedrukowalne przed i za tekstem z pole formularza 
    // return trimmedText.replace(/<[^>]*>?/gm, '');    // nie przyjmuje tekstu za "<"
    trimmedText.replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;');     // po prostu zastąp wszystkie znaczkiki tagów treścią bezpieczną dla HTMLa  
return trimmedText.replace(/,/, '.');   // ale gdy napotkano "," to zamień go na "." 
}

function evaluateToNumber ( inputText ) {
    var numerically = Number( simpleHTMLInputParser( inputText ) ); // użycie wewnętrznej funkcji do weryfikacji wartości przed przetworzeniem na liczbę

    if ( isNaN( numerically ) ) return null;    // return "BŁĘDNA WARTOŚĆ";
return numerically; // zwróć wartość po przetworzeniu lub <null> jako wartość nieliczbową
}
