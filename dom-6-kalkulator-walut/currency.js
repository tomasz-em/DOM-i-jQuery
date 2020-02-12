/* 3. 6. Kalkulator walut
Stwórz kalkulator walut; musi mieć select umożliwiający wybór waluty źródłowej i select umożliwiający wybór waluty docelowej
 spośród złotych, euro, dolarów i funtów; kalkulator walut dokonuje przeliczeń w oparciu o ceny zwrócone z API fixer.io 
 Wejdź na stronę fixer.io/signup/free i zarejestruj się. Na potrzeby rejestracji możesz podać tymczasowy e-mail. 
 Celem jest uzyskanie klucza dostępu do API. Wykonaj zapytanie typu GET pod adres podany poniżej; pamiętaj, aby wstawić 
 we wskazane miejsce swój klucz API: http://data.fixer.io/api/latest?access_key=KLUCZ_DO_API&symbols=PLN,EUR,USD 
 W zależności od walut przekazanych do parametru symbols, serwer zwróci inną odpowiedź zawierającą ceny żądanych walut.
*/

var currenciesUsed = [
    { code: 'PLN', name: 'polski złoty'},
    { code: 'EUR', name: 'euro'},
    { code: 'USD', name: 'dolar amerykański'},
    { code: 'GBP', name: 'funt szterling'},
    { code: 'CHF', name: 'frank szwajcarski'},
    { code: 'JPY', name: 'jen japoński'}
    ],
    
    currencyTable = {
        'PLN-GBP': {
            ratio: 5.5
        }
    },     // globalna lista przeliczeń pomiędzy używanymi walutami 
    curenciesUsedCodes,     // "obiekt-tabela" na wszystkie znane do tej pory przekształcenia walutowe
    // currenciesString,    // "ciągo-lista" tekstowa, zawierająca postać tekstową wszystkich kodów walut 
    baseCurrencyCode = currenciesUsed[0].code,
        /*     APIkey = '86a253ac9fb654d2978a3db6e7a77107',     // przeniesione do funkcji od obsługi AJAKSa
        ajaxURL = 'http://data.fixer.io/api/', */
    currencyOutput,     // ?

    leftCurrencyAmountInput = document.getElementById('input-amount'),
    leftCurrencyTypeSelect = document.getElementById('input-currency-name'),
    rightCurrencyAmountInput = document.getElementById('output-amount'),
    rightCurrencyTypeSelect = document.getElementById('output-currency-name'),
    leftCurrencyAmount = 0,
    rightCurrencyAmount = 0,
    selectedLeftCurency = null,
    selectedRightCurency = null,
    // firstConvertion = true, // wskaźnik, czy to pierwsze przeliczenie; by wskazać pierwszy "kierunek konwersji" (raczej "zwrot")
    //toggleBtn = document.getElementById('selector'),
    classOfCurrentSourceValue = "convertion-source",     // jako wyznacznik źródła "kierunku" konwersji (też w odniesieniu do aktywnego pola)
    freePlanOfAPI = true;   // określenie używanego API, wersja "free" nie pozwala zapytywać o kurs dowolnych walut między sobą
// !!! ...W API "fixer.io" NA SZTYWNO UŻYWANE JEST PRZELICZENIE DO EURO ("EUR") WZGLĘDEM WYBRANYCH WALUT WYJŚCIOWYCH !!!

    curenciesUsedCodes = currenciesUsed.map(function( currency ) {    // póki co zwraca TABELĘ, nie POSTAĆ TEKSTOWĄ (zawsze będą prawidłowe wartości tu)
        return currency.code;
    });
    // currenciesString = curenciesUsedCodes.join(',');   // teraz tabela kodów walut staje się tekstem, rozdzielonym przecinkami
        // STARTOWE MODYFIKACJE DOMu
    leftCurrencyAmountInput.value = leftCurrencyAmount;
    rightCurrencyAmountInput.value = rightCurrencyAmount;
    if ( !leftCurrencyAmountInput.classList.contains( classOfCurrentSourceValue ) 
        || !rightCurrencyAmountInput.classList.contains( classOfCurrentSourceValue ) ) {
        leftCurrencyAmountInput.classList.add( classOfCurrentSourceValue );
    }    
    createHTMLOptionsForBothSelects();


                
// -----  zdarzenia  -----

        // BYŁO
//leftCurrencyAmountInput.addEventListener("change", updateFromCelsius, false);
//leftCurrencyAmountInput.addEventListener("input", updateFromCelsius, false);   // ewentualnie do usunięcia obsługa tego zdarzenia
// leftCurrencyTypeSelect.addEventListener("change", convertCurrency, false);

//rightCurrencyAmountInput.addEventListener("change", updateFromFahrenheit, false);
//rightCurrencyAmountInput.addEventListener("input", updateFromFahrenheit, false);   // ewentualnie do usunięcia obsługa tego zdarzenia

//toggleBtn.addEventListener("click", toggleUnits, false);


leftCurrencyAmountInput.addEventListener("focus", makeMeCurrentSourceValue, false);     // "click" też zapewnia "focus", nie ma więc potrzeby dokładać koljnego zdarzenia
rightCurrencyAmountInput.addEventListener("focus", makeMeCurrentSourceValue, false);

leftCurrencyTypeSelect.addEventListener("change", function( event ) {
    // convertCurrencies( event ); // przekazanie obiektu zdarzenie do funkcji, która wcześniej obsługiwała zdarzenie 
    // updateFromLeftValues();     // wymusenie aktualizacji treści WE i przeliczenia
    updateFromTheLeftOrRightSide( event ); 
}, false );

rightCurrencyTypeSelect.addEventListener("change", function( event ) {
    // convertCurrencies( event );  // ...ALE W ZASADZIE TO I TAK JEST NIEPOTRZEBNE POWIELENIE ZAPYTANIA (PRZED PRZELICZENIEM)... w update() jest wywołanie convert()
    // updateFromRightValues();
    updateFromTheLeftOrRightSide( event ); 
}, false);

leftCurrencyAmountInput.addEventListener("input", updateFromLeftValues, false);
rightCurrencyAmountInput.addEventListener("input", updateFromRightValues, false);

// -----  funkcje  -----

function convertCelsiusTofahrenheit( unitsC ) {
    return (unitsC * 1.8 + 32).toFixed(2);
}

function convertFahrenheitToCelsius( unitsF ) {
    return ((unitsF - 32) / 1.8).toFixed(2);
}

function checkCurrencyOptionSelected ( selectElem ) {
var valueSelected = selectElem.value,
    arrayPosition = curenciesUsedCodes.indexOf( valueSelected );   // czy wybrano (wskazano) jedną z pozycji kodów walut?
    console.log("odczytano z listy rozwijanej, wartość:", valueSelected, "pozycja_w_tablicy:", arrayPosition, "dla elementu:", selectElem);
    if ( ( arrayPosition === -1 ) || ( selectElem.tagName.toLowerCase() !== 'select' )) return false;
return true;
}

function blockSelectElements() {
    leftCurrencyTypeSelect.setAttribute('disabled', true);
    rightCurrencyTypeSelect.setAttribute('disabled', true);
}

function unblockSelectElements() {
    leftCurrencyTypeSelect.removeAttribute('disabled');
    rightCurrencyTypeSelect.removeAttribute('disabled');
}

function makeMeCurrentSourceValue( evt ) {

    if ( !evt.target.classList.contains( classOfCurrentSourceValue ) ) {    
    // gdy NIE MA to zabierz z obu elementów (jeden MOŻE MIEĆ) bez weryfkacji który jets bieżącym
        leftCurrencyAmountInput.classList.remove( classOfCurrentSourceValue );
        rightCurrencyAmountInput.classList.remove( classOfCurrentSourceValue);
        evt.target.classList.add( classOfCurrentSourceValue );
    }
}

function convertCurrencies( eventObj ) {
var leftCurrencyTypeOK = checkCurrencyOptionSelected( leftCurrencyTypeSelect ),
    rightCurrencyTypeOK = checkCurrencyOptionSelected( rightCurrencyTypeSelect ),
    // inputValue = leftCurrencyTypeSelect.value, // odczyt wybranej wartości bazowej
    outputCurrencies,   // lista żądanych walut wynkowych
    selectedFrom,
    selectedTo,
    anyInputTextPreviouslySelected = false, // czy dowolne z pól tekstowych kwoty wejściowej zostało już wcześniej wskazane? 
    spanElem,
    currentRatio;

    if ( leftCurrencyTypeOK ) {    // gdy jest pierwszy z wyborów zatwierdzony
        spanElem = leftCurrencyTypeSelect.parentNode.getElementsByTagName('span')[0];
        spanElem.textContent = "OK";
    } 
    else {
        spanElem = leftCurrencyTypeSelect.parentNode.getElementsByTagName('span')[0];
        spanElem.textContent = " ";
    }

    if ( rightCurrencyTypeOK ) {    // gdy jest pierwszy z wyborów zatwierdzony
        spanElem = rightCurrencyTypeSelect.parentNode.getElementsByTagName('span')[0];
        spanElem.textContent = "OK";
    }
    else {
        spanElem = rightCurrencyTypeSelect.parentNode.getElementsByTagName('span')[0];
        spanElem.textContent = " ";
    }

    if ( leftCurrencyTypeOK && rightCurrencyTypeOK ) {            // select#1 selected OK && select#2 selected OK --> ajax()
        if ( leftCurrencyTypeSelect.value != rightCurrencyTypeSelect.value ) {    // ale UWZGLĘDNIĆ poprawność konwersji, czyli nie dla DWÓCH TAKICH SAMYCH danych!

            // usuń poprzednie powiadomienia
            deleteNotifications();

            if ( leftCurrencyAmountInput.classList.contains( classOfCurrentSourceValue ) ) {
                selectedFrom = leftCurrencyTypeSelect.value;
                selectedTo = rightCurrencyTypeSelect.value;
                anyInputTextPreviouslySelected = true;
            }

            if ( rightCurrencyAmountInput.classList.contains( classOfCurrentSourceValue ) ) {
                selectedFrom = rightCurrencyTypeSelect.value;
                selectedTo = leftCurrencyTypeSelect.value;
                anyInputTextPreviouslySelected = true;
            }

            // wykonaj zapytaniue do API, zależnie od wybranego "zwrotowi konwersji", czyli która waluta jest wzięta za bazową
            // TE WARUNKI PONIŻEJ MOGĄ WYDAWAĆ SIĘ NA ODWRÓT USTALONE, ALE W RZECXYWISTOŚCI TAK WŁAŚNIE WYBIERAMY "PIERWSZE PRZELICZNIE"...
            // ...NAJPIERW WALUTA BAZOWA I JEJ WARTOŚĆ, BY "NA KOŃCU" WSKAZAĆ CEL PRZELICZENIA... zatem lista wyboru zmieniona jako "DRUGA" potwierdza wybór konwersji 
            // ...(przynajmniej tak w pierwszym przeliczneiou powinien działać algorytm; może jakąś zmienną sygnałową dać?) 
/*             if ( eventObj.target == rightCurrencyTypeSelect ) {     // TO PONIŻEJ MOŻNA UPROŚCIĆ DO DWÓCH WARUNKÓW!!!
                // jeśli jest to PRAWY, to wykonaj przeliczenie WZGLĘDEM waluty wybranej z LEWEJ!... ale TYLKO za PIERWSZYM RAZEM
                if ( firstConvertion ) {    // pierwsze przeliczenie?
                    // ZAMIANA: wycięcie wejściowej waluty z listy przekształcanych; druga waluta jako "docelowe" przeliczenie, zatem na początku
                    selectedFrom = leftCurrencyTypeSelect.value;
                    selectedTo = rightCurrencyTypeSelect.value;
                } else {
                    // JAK_ZWYKLE: wycięcie wejściuowej waluty z listy przekształcanych; druga waluta jako "docelowe" przeliczenie, zatem na początku
                    selectedFrom = rightCurrencyTypeSelect.value;
                    selectedTo = leftCurrencyTypeSelect.value;
                }
            }

            if ( eventObj.target == leftCurrencyTypeSelect ) {  // da się użyć prostszego warunku z połączeniem obu (istniejące 2x2 w jeden pojedynczy, bo i tak to się wywołanie powtarza)  
                // jeśli jest to LEWY <select>, to wykonaj przeliczenie WZGLĘDEM waluty wybranej z PRAWEJ!... ale TYLKO za PIERWSZYM RAZEM
                if ( firstConvertion ) {    // pierwsze przeliczenie?
                    selectedFrom = rightCurrencyTypeSelect.value;
                    selectedTo = leftCurrencyTypeSelect.value; */
/*                  outputCurrencies = makeOutputCurrenciesWithoutSpecified( rightCurrencyTypeSelect.value, leftCurrencyTypeSelect.value,  );   
                    currentRatio = askForConvertingCurrencyRatio( rightCurrencyTypeSelect.value, outputCurrencies );    // przygotowanie ajaksa */
/*                 } else {
                    selectedFrom = leftCurrencyTypeSelect.value;
                    selectedTo = rightCurrencyTypeSelect.value;
                }
            } */

            // "później" odblokuj te oba pola wyboru, niezależnie od powodzenia tej opearacji zapytania
            // też usuń tą informację, skoro sukces... lub porażka  
            if ( anyInputTextPreviouslySelected ) {
                outputCurrencies = makeOutputCurrenciesWithoutSpecified( selectedFrom, selectedTo );   
                currentRatio = askForConvertingCurrencyRatio( selectedFrom, outputCurrencies );    // przygotowanie ajaksa

                if ( currentRatio ) {

                    if ( eventObj.target == leftCurrencyTypeSelect ) {
                        // updateFromLeftValues();
                        console.log("Otrzymano <<jakieś>> dane dla konwersji WZGLĘDEM LEWEJ:", currentRatio);
                    }
/*                     if ( eventObj.target == rightCurrencyTypeSelect ) {
                        updateFromRightValues();
                        console.log("Otrzymano <<jakieś>> dane dla konwersji WZGLĘDEM PRAWEJ:", currentRatio);
                    } */
                    
                return currentRatio;    // zwróć przelicznik 
                }                
            }
            else {
                return null;    // NIE KONWERTUJ, SKORO NIE OKREŚLONO CO ŹRÓŁEM, A CO CELEM
                // w takim wypadku najlepeiej  wcześniej jedno z pól formularza WYBRAĆ ŹRÓDŁEM na sztywno, by tu nie trafił nigdy warunek 
            }   // if-( anyInputTextPreviouslySelected )-END
        }   // if-( leftCurrencyTypeSelect.value != rightCurrencyTypeSelect.value )-END
        else {  // ... są IDENTYCZNE waluty wybrane w obu listach
            console.log('IDENTYCZNE POLA w listach wyboru', leftCurrencyTypeSelect.value);  // LEWYinput == PRAWYinput I DWROTNIE 
            return 1;   // jako ratio - TE SAME WARTOŚCI w obu listach wyboru
        }
    } // if-( leftCurrencyTypeOK && rightCurrencyTypeOK )-END {
return null;        
}   // convertCurrencies-END

function updateFromLeftValues ( eventObj ) {
var fakeEmptyObjAsEventObj = { target: leftCurrencyTypeSelect },
    resultRatio; 

    if ( eventObj === leftCurrencyTypeSelect ) {    // ??? dla prawidłowości działania zdarzenia z LEWĄ listą rozwijaną
        fakeEmptyObjAsEventObj = { target: eventObj };
    }

    leftCurrencyAmount = evaluateToNumber( leftCurrencyAmountInput.value );
    // leftCurrencyAmountInput.value = leftCurrencyAmount;  // aktualizacja wartości, gdyby wynik po konwersji był inny od źródła.. ale to pomija części dziesiętne
    if ( leftCurrencyAmount === null ) {  // !!! TA KOREKTA JEST ZBYT RESTRYKCYJNA ZE ZDARZENIEM "INPUT"!!! 
                    // ...ale "nie pozwala wpisać" znaku innego, niż tworzącego poprawnny zapis tekstowy liczby całkowitej lub rzeczywistej
        leftCurrencyAmount = 0;       // zamiast "nieoczekiwanego" nadpisywania ZEREM można użyć CSSa, by przekazać że dane wejściowe są złe
        leftCurrencyAmountInput.value = 0;  // ...ale to wymaga też blokowania działania, póki te dane nie zostaną naprawione (tu zdarznie INPUT mogłoby być okresowo wyłączane 
                                 // ...lub jakiś parametr dla funkcji, by nie przetwarzać wartości pole formularza od razu)
        rightCurrencyAmountInput.value = "NIEPRAWIDŁOWA WARTOŚĆ";    // nie uda się zobaczyć, za szybka podmieniany jest tam wynik przekształceń dla 0^C
    }
    else {
        leftCurrencyAmountInput.value = leftCurrencyAmount;     // przekelejenie tej skonwertowanej liczby do tego pola (np. pozbycie się wiodącego zera)
    }
        // BEZ reszty w "else", BO TO NIE SĄ WYKLUCZAJĄCE SIĘ PRZYPADKI! (tzn. błędna wartość w polu tekstowym, a przelieczenie (do zapytania lub istniejące))
    // else {  // są prawidłowe dane liczbowe w polach wpisywania formularzach
    
    if ( leftCurrencyAmountInput.classList.contains( classOfCurrentSourceValue ) ) {
        resultRatio = convertCurrencies( fakeEmptyObjAsEventObj );
        console.log("PRZELICZENIA względem LEWEJ strony, współczynnik konwersji:", resultRatio);
    
        if ( resultRatio ) {
            rightCurrencyAmount = leftCurrencyAmount * resultRatio;   // wykonaj przeliczenie, ewentualnie dla (0C)
            rightCurrencyAmountInput.value = rightCurrencyAmount.toFixed(2);   // odświeżenie zawartości drugiego pola (wyjścowy format walutowy)
        }
        else {
            rightCurrencyAmountInput.value = "WARTOŚĆ NIEPRZELICZONA"
        }
    }

/*         if ( eventObj.target == leftCurrencyTypeSelect ) {  // względem lewej listy wyboru (lewej STRONY ogólnie)
        leftCurrencyAmount = evaluateToNumber( leftCurrencyAmountInput.value );
        leftCurrencyAmountInput.value = leftCurrencyAmount;
        rightCurrencyAmountInput.value = leftCurrencyAmount;    // tę samą wartość wpisać w oba pola, skoro przekztałecnie TEJ SAMEJ waluty (1:1)
    }

    if ( eventObj.target == rightCurrencyTypeSelect ) {  // względem PRAWEJ listy wyboru (PRAWEJ STRONY ogólnie)
        rightCurrencyAmount = evaluateToNumber( rightCurrencyAmountInput.value );
        rightCurrencyAmountInput.value = rightCurrencyAmount;
        leftCurrencyAmountInput.value = rightCurrencyAmount;    // tę samą wartość wpisać w oba pola, skoro przekztałecnie TEJ SAMEJ waluty (1:1)
    } */
//} // to do "else" od NULLa
}   // updateFromLeftValues-END

function updateFromRightValues ( eventObj ) {
    var fakeEmptyObjAsEventObj = { target: rightCurrencyTypeSelect },
        resultRatio; 

            // testowo póki co wyłączono...
        if ( eventObj === rightCurrencyTypeSelect ) {    // ??? dla prawidłowości działania zdarzenia z PRAWĄ listą rozwijaną
            fakeEmptyObjAsEventObj = { target: eventObj };
        }
    
        rightCurrencyAmount = evaluateToNumber( rightCurrencyAmountInput.value );
        // rightCurrencyAmountInput.value = rightCurrencyAmount;  // aktualizacja wartości, gdyby wynik po konwersji był inny od źródła.. ale to pomija części dziesiętne
        if ( rightCurrencyAmount === null ) {  // !!! TA KOREKTA JEST ZBYT RESTRYKCYJNA ZE ZDARZENIEM "INPUT"!!! 
                        // ...ale "nie pozwala wpisać" znaku innego, niż tworzącego poprawnny zapis tekstowy liczby całkowitej lub rzeczywistej
            rightCurrencyAmount = 0;       // zamiast "nieoczekiwanego" nadpisywania ZEREM można użyć CSSa, by przekazać że dane wejściowe są złe
            rightCurrencyAmountInput.value = 0;  // ...ale to wymaga tez blokowania działania, póki te dane nie zostaną naprawione (tu zdarznie INPUT mogłoby być okresowo wyłączane 
                                     // ...lub jakiś parametr dla funkcji, by nie przetwarzać wartości pole formularza od razu)
            leftCurrencyAmountInput.value = "NIEPRAWIDŁOWA WARTOŚĆ";    // nie uda się zobaczyć, za szybka podmieniany jest tam wynik przekształceń dla 0^C
        }
        else {  // są prawidłowe dane liczbowe w polach wpisywania formularzach
            rightCurrencyAmountInput.value = rightCurrencyAmount;     // przekelejenie tej skonwertowanej liczby do tego pola (np. pozbycie się wiodącego zera)
        }

    if ( rightCurrencyAmountInput.classList.contains( classOfCurrentSourceValue ) ) {
        resultRatio = convertCurrencies( fakeEmptyObjAsEventObj );
        console.log("PRZELICZENIA względem PRAWEJ strony, współczynnik konwersji:", resultRatio);

        if ( resultRatio ) {
            leftCurrencyAmount = rightCurrencyAmount * resultRatio;   // wykonaj przeliczenie, ewentualnie dla (0C)
            leftCurrencyAmountInput.value = leftCurrencyAmount.toFixed(2);   // odświeżenie zawartości drugiego pola (wyjścowy format walutowy)
        }
        else {
            leftCurrencyAmountInput.value = "WARTOŚĆ NIEPRZELICZONA"
        }
    }

    // }
}   // updateFromRightValues-END

function updateFromTheLeftOrRightSide( event ) {
var leftInputIsSelected = leftCurrencyAmountInput.classList.contains( classOfCurrentSourceValue ),
    rightInputIsSelected = rightCurrencyAmountInput.classList.contains( classOfCurrentSourceValue );

    console.log('UPDATE-LEFT-RIGHT, lewy:', leftInputIsSelected, "prawy:", rightInputIsSelected);

    if ( leftInputIsSelected && !rightInputIsSelected ) {
        console.log("Odpalono z wyborem wg pól LEWEJ strony...");
        updateFromLeftValues( /* event */ ); // z obiektem zdarzenie puścić?
    }
    if ( !leftInputIsSelected && rightInputIsSelected ) {
        console.log("Odpalono z wyborem wg pól PRAWEJ strony...");
        updateFromRightValues( /* event */ ); // a obiekt zdarzenia?
    }
}

function updateFromCelsius() {
leftCurrencyAmount = evaluateToNumber( leftCurrencyAmountInput.value );
// leftCurrencyAmountInput.value = leftCurrencyAmount;  // aktualizacja wartości, gdyby wynik po konwersji był inny od źródła.. ale to pomija części dziesiętne
    if ( leftCurrencyAmount === null ) {  // !!! TA KOREKTA JEST ZBYT RESTRYKCYJNA ZE ZDARZENIEM "INPUT"!!! 
                // ...ale "nie pozwala wpisać" znaku innego, niż tworzącego poprawnny zapis tekstowy liczby całkowitej lub rzeczywistej
    leftCurrencyAmount = 0;       // zamiast "nieoczekiwanego" nadpisywania ZEREM można użyć CSSa, by przekazać że dane wejściowe są złe
    leftCurrencyAmountInput.value = 0;  // ...ale to wymaga tez blokowania działania, póki te dane nie zostaną naprawione (tu zdarznie INPUT mogłoby być okresowo wyłączane 
                             // ...lub jakiś parametr dla funkcji, by nie przetwarzać wartości pole formularza od razu)
    rightCurrencyAmountInput.value = "NIEPRAWIDŁOWA WARTOŚĆ";    // nie uda się zobaczyć, za szybka podmieniany jest tam wynik przekształceń dla 0^C
    }

rightCurrencyAmount = convertCelsiusTofahrenheit( leftCurrencyAmount );   // wykonaj przeliczenie, ewentualnie dla (0C)
rightCurrencyAmountInput.value = rightCurrencyAmount;
}

function updateFromFahrenheit() {
rightCurrencyAmount = evaluateToNumber( rightCurrencyAmountInput.value );
// rightCurrencyAmountInput.value = rightCurrencyAmount;  // aktualizacja wartości, gdyby wynik po konwersji był inny od źródła
    if ( rightCurrencyAmount === null ) {   // BARDZO RESTRYKCYJNE razem ze zdarzeniem "INPUT" - uwagi jak w "updateFromCelsius()"
    rightCurrencyAmount = 0;
    rightCurrencyAmountInput.value = 0;
    leftCurrencyAmountInput.value = "NIEPRAWIDŁOWA WARTOŚĆ";   // nie uda się tego zobaczyć, za szybka podmieniany jest tam wynik przekształceń dla 0^F
    }
leftCurrencyAmount = convertFahrenheitToCelsius( rightCurrencyAmount );   // wykonaj przeliczenie, możliwa konwersja wartości naprawionej (0F)
leftCurrencyAmountInput.value = leftCurrencyAmount;
}

function toggleUnits() {
    // toggleAttribute() bez wsparcia dla IE, zatem standardową drogą, po kolei negować stan obu pól wpisywania
    if ( leftCurrencyAmountInput.hasAttribute('disabled') ) {
    rightCurrencyAmountInput.setAttribute('disabled', true); // zamiana wyłączonych pól pomiędzy sobą
    leftCurrencyAmountInput.removeAttribute('disabled');

    updateFromCelsius();    // przeliczenie wartości we właśnie aktywowanym polu, wynik wyświetlany we wcześniej aktywnym polu  
    
    leftCurrencyAmountInput.focus();   // automatyczna aktywacja pola takstowego po zamianie
    toggleBtn.classList.remove('animate-rotation-180');     // zabranie klasy - odwrotna animacja odwracania elementu w pionie
    }
    else {
    leftCurrencyAmountInput.setAttribute('disabled', true);
    rightCurrencyAmountInput.removeAttribute('disabled');

    updateFromFahrenheit();     // przeliczenie wartości z właśnie aktywowanego pola, wynik wyświetlany we wcześniej aktywnym polu

    rightCurrencyAmountInput.focus();
    toggleBtn.classList.add('animate-rotation-180');
    }
}

function simpleHTMLInputParser( inputText ) {
    var trimmedText = inputText.trim();     // wywal wszelkie spacje i niedrukowalne przed i za tekstem z pole formularza 
    // return trimmedText.replace(/<[^>]*>?/gm, '');    // nie przyjmuje tekstu za "<"
    trimmedText.replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;');     // po prostu zastąp wszystkie znaczniki tagów treścią bezpieczną dla HTMLa  
return trimmedText.replace(/,/, '.');   // ale gdy napotkano "," to zamień go na "." 
}

function evaluateToNumber ( inputText ) {
    var numerically = Number( simpleHTMLInputParser( inputText ) ); // użycie wewnętrznej funkcji do weryfikacji wartości przed przetworzeniem na liczbę

    if ( isNaN( numerically ) ) return null;    // return "BŁĘDNA WARTOŚĆ";
return numerically; // zwróć wartość po przetworzeniu lub <null> jako wartość nieliczbową
}

function showNotification( someText, someExtraInfo, anchorObj ) {
    //var existingErrorNotification = document.getElementsByClassName('error');

    // podejmij akcję ze wstawianiem elementu do DOMu, gdy nie istneje ten element w strukturze  
    // if ( !existingErrorNotification || existingErrorNotification.length == 0 ) {  // z "var" nie ma blokowaści, ale już nie kopiuję powyżej pustych deklaracji zmiennych lokalnych poniżej
        //var textContent = "BŁĄD: nie podano wszystkich wymaganych danych dla subskrybcji lub dane nieoprawidłowe!"; // i tak są tworzone w tej funkcji, nie są zaś inicjowane
    var headerElem = document.createElement('h3'),
        textElem = document.createTextNode( someText ),
        notificationElem = document.createElement('div'),
        positionOfErrorText = someText.indexOf('BŁĄD');    // wyróznik, czy komunkat jest błędem, czy inną wiadomścią

    headerElem.appendChild( textElem );
    notificationElem.classList.add('notification');    // to przypisanie zdefiniowanmego wyglądu w CSSie 
    // notificationElem.classList.add('error');    // a tu jako wyróżnik logiki, ale to chyba niepotrzebne skoro jeden cel powiadomień.. by zniknąć
    notificationElem.appendChild( headerElem ); 
        if ( positionOfErrorText >= 0 ) {
        notificationElem.style.borderColor = 'red'; // wstawi w czerwonej ramce każdy tekst polskiego błędu
        notificationElem.style.borderWidth = '3px';

            if ( someExtraInfo ) {  // jeśli przekazano jakiś dodatkowy komunikat... ale tylko w błędzie!
            var h5elem = document.createElement('h5'),
                extraInfoText = document.createElement('p');

            h5elem.textContent = "Szczegóły";
            extraInfoText.textContent = someExtraInfo;
            notificationElem.appendChild( h5elem );
            notificationElem.appendChild( extraInfoText ); 
            }
        }

    document.body.appendChild( notificationElem );   // pośrednie przejście do <body> - GŁÓWNEGO RODZICA i wstawienie za nim (na jego końcu) w DOMie strony
    // }

    if ( anchorObj ) {  // powtórzenie warunku, ale element musi być wstawiony w DOM, aby podpiąć mu zdarzenie
        var anchorElem = document.createElement('a'),
            anchorText = document.createTextNode( anchorObj.text ),
            nextLine = document.createElement( 'br' ); // nowa linia

        headerElem.appendChild( nextLine );  // wstawienie nowej linii
        nextLine = document.createElement( 'br' );  // trzeba ponowić tworzenie obiektu, by dodać go do istniejącego DOMu --
                                            // !!! NIE ZADZIAŁA poprzednia REFERENCJA, gdyby próbować wstawić poprzednio utworzony obiekt elementu!!! 
        headerElem.appendChild( nextLine ); // tak, dwa odstępy pomiędzy tekstem potwierdzajacym OK, a odnośnikiem; z użyciem dwóch obiektów (jako nowych referencji dla <br>)

        anchorElem.appendChild( anchorText );   // generownie odnośnika
        anchorElem.setAttribute('href', anchorObj.href);
        anchorElem.classList.add('page-refresh');  // celem przekierowania do stanu początkowego.. niejako odświeżenia dla elementu dynamicznego (wygenerowanego później)
        headerElem.appendChild( anchorElem );   // i w końcu wstawienie go ZA nowymi liniami (pojedynczy odstęp pomiędzy tekstem nagłówka, a odnośnikiem)

        enableRefreshByRedirectionEvent();   // ustawione jest tu zdarzenie na kliknięcie w odnośnik
        }
}

function deleteNotifications() {
    var existingErrorNotifications = document.getElementsByClassName('notification'),
        notificationCounter = existingErrorNotifications.length;

        if ( notificationCounter > 0 ) {   // są jakieś powiadomienia, zatem je usunąć
        console.log("ZNALEZIONE komunikaty:", existingErrorNotifications );
        var parentElem = existingErrorNotifications[0].parentNode;    
            for ( var i = notificationCounter -1 ; i >= 0; i-- ) {  // usuwanie od końca, pamiętaj o prawidłowym zakresie!!!
            parentElem.removeChild( existingErrorNotifications[i] );    // usuwanie ZAWSZE wględem rodzica!
            }
        }
}

function enableRefreshByRedirectionEvent() {
    var classNameOfRefresh = 'page-refresh',
        elems = document.getElementsByClassName( classNameOfRefresh );

        if ( elems ) {
            for (var i = 0, len = elems.length | 0; i < len; i++ ) {
                elems[i].addEventListener('click', function() {
                    location.reload(true);  // pobranie z serwera... ale to nie czyni tutaj wielu zmian
                });
            }
        }
}

function createHTMLOptionsForBothSelects() {
var newInputOptionElement,
    newOutputOptionElement;

    currenciesUsed.forEach( function( currency, indx ) {
        newInputOptionElement = document.createElement('option');
        newInputOptionElement.textContent = currency.code.toUpperCase() + " - " + currency.name;
        newInputOptionElement.setAttribute('value', currency.code);
        leftCurrencyTypeSelect.appendChild( newInputOptionElement );

        newOutputOptionElement = document.createElement('option');
        newOutputOptionElement.textContent = currency.code.toUpperCase() + " - " + currency.name;
        newOutputOptionElement.setAttribute('value', currency.code);
        rightCurrencyTypeSelect.appendChild( newOutputOptionElement );
    });
}

function makeOutputCurrenciesWithoutSpecified ( specifiedCurrencyCode, targetCurrency ) {
var newOutputCurrenciesString = '',
    newOutputCurrencies; // ,
    // currencyPosition = currenciesString.indexOf( specifiedCurrencyCode ),
    // totalLengthCurrenciesString = currenciesString.length;
 
// ALBO POPRZEZ PRZESZUKIWANIE Z BUDOWANIEM NOWEGO STRINGU (I WYCINANIEM NIEPASUJĄCEGO) [1] albo ODWOŁANIE SIĘ DO ELEMENETÓW TABELI WALUT [2]
    /* if ( currencyPosition === -1 ) return null;  // SPOSÓB (#1)
    if ( currencyPosition === 0 ) { // na początku ciągu-listy
        newOutputCurrenciesString = currenciesString.substr(4); // z pominieciem kodu pierwszej waluty i przecinka za nią
    }
    else {  // gdzieś między drugim, środkiem, a końcem
        if ( currencyPosition ) {

        } else {

        }
    }
 */     // SPOSÓB #2 - PRACE NA TABLICY ELEMENTÓW, by pobrać tablicę która NIE ZAWIERA "źródłowego elementu"
    newOutputCurrencies = currenciesUsed
        .filter( function ( currency ) {    // ".filter" zamiast .map() -- by najupierw dostać roboczą tablicę pozbawioną jednego "źródłowego elemnetu"
            // if ( currency.code !== specifiedCurrencyCode ) return currency.code; //.. dla wariantu .MAP() .. ale jest UNDEFINED na tej pozycji, co "nie bierzemy"
            return ( currency.code !== specifiedCurrencyCode ) && ( currency.code !== targetCurrency );
        })  //;
            //console.log("dane WY pozbawione konkretnej waluty:", newOutputCurrencies);
        .map( function (currency) {    // .map() w drugim kroku, po wyrzuceniu jednego z elementów źródła
            return currency.code;
        });

    if ( newOutputCurrencies.length <= 0 ) return null; // wyjście dla ewentualnego błędu
    newOutputCurrenciesString = targetCurrency + ',' + newOutputCurrencies.join(',');    // złączenie w jeden ciąg
console.log("dane WY jako TEKST:", newOutputCurrenciesString);    

    return newOutputCurrenciesString;
}   // makeOutputCurrenciesWithoutSpecified-END

function askForConvertingCurrencyRatio( fromCurrencyCode, toCurrencyCodesString ) {
var newValues,  // tablica zawierajaca przeliczenia, zwraca jako odpowiedź z API
    wantedConversionRatio = "" + fromCurrencyCode + "-" + toCurrencyCodesString.substr(0,3),    // sklejanie "klucza" jako zbitka wartości (na sztywno dla WPROST WSKAZANEGO przeliczenia z wywołania funkcji)
    counterConversionRatio; // to WARTOŚĆ ODWROTNA (stosunek drugiej waluty do pierwszej) -- WYLICZANA na podstawie zapytania o DANY przelicznik waluty  

    console.log("wysłano zapytanie o przeliczenie", fromCurrencyCode, "na", toCurrencyCodesString);
    if ( wantedConversionRatio in currencyTable ) {     // jesli treść szukana znajduje się już w obiekcie
        console.log("(+) Odczytano z CACHE!", wantedConversionRatio);
        return currencyTable[ wantedConversionRatio ].ratio;   // wartość konkretnego atrybutu w otrzymanym obiekcie
    }
    else {
        console.log("(-) Wysłano żądanie API (wartość nieznana póki co)...");
                    // zablokuj OBA menu wyboru do czasu uzyskania odpowiedzi
        blockSelectElements();  // efektywnie to TUTAJ należy blokwać listy wyboru
        prepareXMLHttpRequestForCurrency( fromCurrencyCode, toCurrencyCodesString );
        // TO PONIŻEJ PRZENIEŚĆ JAKOŚ DO FUNKCJI ZWROTNEJ "SUKCES"... ALE JAK TO PÓŻNIEJ ZWRÓCIĆ.. czyżby wywołać ponownie tę "funkcję-matkę"?! 

        showNotification('Wykonano zapytanie o przeliczenie ' + fromCurrencyCode + ' na ' + toCurrencyCodesString.substr(0,3) ); // 

    }
    // return null; // CO ZWRÓCIĆ, SKORO AJAX WŁAŚNIE WYSTARTOWAŁ?!

// sprawdź, czy znasz już przelicznik waluty?

    // TAK, zwróc

    // NIE: zrób zapytanie, zapamiętaj wynik i zwróc wartość z zapytania 

return null;    
}


function prepareXMLHttpRequestForCurrency( inputCurrencyCode, outputCurrenciesString ) {
var APIkey = '86a253ac9fb654d2978a3db6e7a77107',

    // APIkey = 'aaa666aaa', // TO JEST SPECJALNIE ZEPSUTY CIĄG KLUCZA DO APLI, NA WCZENSE TESTY 
    apiServer = 'http://data.fixer.io/api/',
    apiQuery,
    ajaxURL,    // końcowa postać.. suma sklejonych danych
    ajax = new XMLHttpRequest,  // w tej stosownej funkcji czy w globalu?

                    /* PRZYKŁAD BUDOWY ZAPYTANIA "GET" ZE STRONY DOKUMENTACJI API (FAQ):
                    http://data.fixer.io/api/latest
                        ? access_key = API_KEY
                        & base = USD
                        & symbols = GBP,JPY,EUR
                    */
    // apiQuery = 'latest?access_key=' + APIkey + '&base=' + inputCurrencyCode + '&symbols=' + outputCurrenciesString;

// -------------------------------------------------------------------------------------------------------- //
//    
// !!!!!"FREE API" nie obsługuje ZMIANY parametru "BASE", który jest NA SZTYWNO OKREŚLONY JAKO "EUR" !!!!!! //
//
// -------------------------------------------------------------------------------------------------------- //

apiQuery = 'latest?access_key=' + APIkey + /* '&base=' + inputCurrencyCode + */ '&symbols=' + outputCurrenciesString;   // BEZ "BASE" !!!

    // NIE OBSŁUGUJE też przelicznika względem DOWOLNEJ WALUTY BAZOWEJ na rzcz listy walut docelowych (ale lista względme EURo jest OK!)   
            /* http://data.fixer.io/api/convert
                ? access_key = API_KEY
                & from = GBP
                & to = JPY
                & amount = 25
            */
    // apiQuery = 'convert?access_key=' + APIkey + '&from=' + inputCurrencyCode + '&to=' + outputCurrenciesString.substr(0,3) + '&amount=1';
    // & amount = 25

// PRZELICZNIK HISTORYCZNY TAKŻE **NIE DZIAŁA** DLA DOWOLNEJ WALUTY WEJŚCIOWEJ -- 'base=XYZ' <-- ten parametr określa wartość "Pr0" | VIP | $$$
        /* http://data.fixer.io/api/2013-12-24
            ? access_key = API_KEY
            & base = GBP
            & symbols = USD,CAD,EUR */
    // apiQuery = '2020-02-01?access_key=' + APIkey + '&base=' + inputCurrencyCode + '&symbols=' + outputCurrenciesString;        

    ajaxURL = apiServer + apiQuery;

    // sprawdzić, czy już istnieje takowe przeliczenia zapamiętane...

   console.log("PEŁNY CIĄG ZAPYTANIA:", ajaxURL);
   ajax.open('GET', ajaxURL, true);
   ajax.addEventListener("load", currencyExchanged, false);
   ajax.addEventListener("error", currencyExchangedError, false);
   ajax.send();

    // warunkowanie


    // wysłanie zapytania
}


function currencyExchanged( evt ) {
var resolvedData = JSON.parse( evt.target.response ),  // zamiana tekstowej treści odpowiedzi na postać obiektu
    // requestedData = JSON.parse( evt.target.responseURL ),
    baseCurrency,
    targetCurrency,
    ratio,
    targetRatioName,
    targetRatioValue,
    timestamp,
    newCurrencyRatio = {},
    notifyText,
    temp;   // pozystkiwanie połóżenia symboli walut w ciągu tekstowym, gdy błąd


unblockSelectElements();
console.log("ZAPYTANIE AJAX - SUKCES:", evt);

    if ( resolvedData.success ) {
        baseCurrency = resolvedData.base;
        targetCurrency = resolvedData.rates;    // to jest obiekt z poszczególnymi przelicznikami względem waluty bazowej
            // od teraz na pierwszym miejscu zwrócenego ciągu jest docelowa konwersja

        // DODAJ NOWE PRZELICZNIKI DO BAZY
    
        for ( ratio in resolvedData.rates ) {
            if (resolvedData.rates.hasOwnProperty( ratio )) {
                targetRatioName = "" + baseCurrency + "-" + ratio;  // łączenie ciągów, np.  "COŚ-DWA"
                targetRatioValue = resolvedData.rates[ ratio ];     // notacja "z kropką" też zadziała?
                timestamp = resolvedData.timestamp;
                currencyTable[ targetRatioName ] = {
                    ratio: targetRatioValue,
                    timestamp: timestamp
                };

                targetRatioName = "" + ratio + "-" + baseCurrency;  // np. "DWA-COŚ".. jako odwrotność poprzednio utworzonego
                    if ( targetRatioValue != 0 ) targetRatioValue = 1 / targetRatioValue;    // obliczenie "odwrotnego współczynnika" dla walut
                    else targetRatioValue = 0;
                currencyTable[ targetRatioName ] = {
                    "ratio": targetRatioValue,
                    "timestamp": timestamp
                };
            }
        }   // for-IN-END

/*             for (var i = 0; i < newValues.length; i++ ) {   // zmienne z RODZICA
                wantedConversionRatio = "" + fromCurrencyCode + "-" + toCurrencyCodesString[i];    // każde kolejne 
                currencyTable[ wantedConversionRatio ] = newValues[i];
                counterConversionRatio = "" + toCurrencyCodesString[i] + "-" + fromCurrencyCode;  // też utworzenie przelicznika dla "wartości odwrotnej" 
                currencyTable[ counterConversionRatio ] = 1 / newValues[i];  // przeliczana "WARTOŚĆ ODWROTNA"
            }
 */
        showNotification('Sukces, konwersja ' + baseCurrency + " na " + resolvedData.rates[0] + " to kurs ...");   // nie moa dosępu do rodzica-rodzica

        console.log("zaktualizować JAKOŚ GDY: baza", baseCurrency, "resolvedData.rates[0]", resolvedData.rates[0], 
        "targetCurrency[0]", targetCurrency[0], "targetCurrency", targetCurrency );    

            // WYMUŚ AKTUALIZACJĘ WARTOŚCI... słabe warunki:
        if ( ( baseCurrency == leftCurrencyTypeSelect.value ) && ( baseCurrency != rightCurrencyTypeSelect.value ) 
            && ( targetCurrency[0] == rightCurrencyTypeSelect.value ) && ( targetCurrency[0] != leftCurrencyTypeSelect.value ) ) {
            updateFromLeftValues();     // wywołaj aktualizację na rzecz wartości z LEWEJ części formularza   
        }

        if ( ( baseCurrency == rightCurrencyTypeSelect.value ) && ( baseCurrency != leftCurrencyTypeSelect.value ) 
            && ( targetCurrency[0] == leftCurrencyTypeSelect.value ) && ( targetCurrency[0] != rightCurrencyTypeSelect.value ) ) {
            
            updateFromRightValues();    // wywołaj aktualizację na rzecz wartości z LEWEJ części formularza   
        }

        updateFromTheLeftOrRightSide();
    } 
    else {
        notifyText = resolvedData.error.info;
        temp = evt.target.responseURL.indexOf('&base=');
        console.log("temp #1 - base:", temp);
        baseCurrency = evt.target.responseURL.substr(temp+6, 3);    // 'EUR'/'PLN'/'USD'/ itd. -- .substr() !== .substring() 
        temp = evt.target.responseURL.indexOf('&symbols=');
        console.log("temp #2 - target:", temp);
        targetCurrency = evt.target.responseURL.substr(temp+9, 3);  // też symbol waluty winien być zwrócony 
        
        console.log('evt.target.responseURL:', evt.target.responseURL);
        showNotification('BŁĄD: Wystąpił problem w przetwarzaniu żądania konwersji (' + baseCurrency + ' na ' + targetCurrency + '):',
             'BŁĄD API nr ' + resolvedData.error.code + ": " + notifyText);


    }



}   // currencyExchanged-END

function currencyExchangedError( evt ) {

    unblockSelectElements();
    console.log("ZAPYTANIE AJAX - BŁĄD!:", evt);
}   // currencyExchangedError-END

// ! BRAK AKTUALIZACJI "NA BIEŻĄCO" DLA OPCJI "FREE" i innych "mało-płatnych" pakietów, wyniki zwracane przez serwis są aktualizowane... 
// w zależności od wykupionego planu (koszt rosnący): co 60 minut (darmowy), 10 minut lub 60 sekund... zatem nie ma sensu odpytywać ciągle o to samo serwer