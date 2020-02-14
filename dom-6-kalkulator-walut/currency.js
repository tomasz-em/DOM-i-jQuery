/* 3. 6. Kalkulator walut
Stwórz kalkulator walut; musi mieć select umożliwiający wybór waluty źródłowej i select umożliwiający wybór waluty docelowej
 spośród złotych, euro, dolarów i funtów; kalkulator walut dokonuje przeliczeń w oparciu o ceny zwrócone z API fixer.io 
 Wejdź na stronę fixer.io/signup/free i zarejestruj się. Na potrzeby rejestracji możesz podać tymczasowy e-mail. 
 Celem jest uzyskanie klucza dostępu do API. Wykonaj zapytanie typu GET pod adres podany poniżej; pamiętaj, aby wstawić 
 we wskazane miejsce swój klucz API: http://data.fixer.io/api/latest?access_key=KLUCZ_DO_API&symbols=PLN,EUR,USD 
 W zależności od walut przekazanych do parametru symbols, serwer zwróci inną odpowiedź zawierającą ceny żądanych walut.
*/

var currenciesUsed = [
    { code: 'PLN', name: 'polski złoty', HTMLSymbol: 'zł'},
    { code: 'EUR', name: 'euro', HTMLSymbol: '&#x20AC;'},
    { code: 'USD', name: 'dolar amerykański', HTMLSymbol: '&#x24;'},
    { code: 'GBP', name: 'funt szterling', HTMLSymbol: '&#xA3;'},
    { code: 'CHF', name: 'frank szwajcarski', HTMLSymbol: 'CHF'},
    { code: 'JPY', name: 'jen japoński', HTMLSymbol: '&#xa5;'}
    ],
    
    currencyTable = {       // obiekt do przechowywania znanych konwersji walut
    /*  'GBP/PLN': {     // tego typu wartości wstawiać w ten obiekt-obiektów
            ratio: 5.03
        } */
    },     // globalna lista przeliczeń pomiędzy używanymi walutami 
    curenciesUsedCodes,     // "obiekt-tabela" na wszystkie znane do tej pory przekształcenia walutowe
    // currenciesString,    // "ciągo-lista" tekstowa, zawierająca postać tekstową wszystkich kodów walut 
    baseCurrencyCode = currenciesUsed[0].code,
        /*     APIkey = '86a253ac9fb654d2978a3db6e7a77107',     // przeniesione do funkcji od obsługi AJAKSa
        ajaxURL = 'http://data.fixer.io/api/', */
    separatorBetweenConvertedCurrencies = "/",

    leftCurrencyAmountInput = document.getElementById('input-amount'),
    leftCurrencyTypeSelect = document.getElementById('input-currency-name'),
    rightCurrencyAmountInput = document.getElementById('output-amount'),
    rightCurrencyTypeSelect = document.getElementById('output-currency-name'),
    leftCurrencyAmount = 0,
    rightCurrencyAmount = 0,
    selectedLeftCurency = null,
    selectedRightCurency = null,
    classOfCurrentSourceValue = "convertion-source",     // jako wyznacznik źródła "kierunku" konwersji (też w odniesieniu do aktywnego pola)
    isFreePlanOfAPI = true;   // określenie używanego API, wersja "free" nie pozwala zapytywać o kurs dowolnych walut między sobą
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

leftCurrencyAmountInput.addEventListener("focus", makeMeCurrentSourceValue, false);     // "click" też zapewnia "focus", nie ma więc potrzeby dokładać koljnego zdarzenia
rightCurrencyAmountInput.addEventListener("focus", makeMeCurrentSourceValue, false);

leftCurrencyTypeSelect.addEventListener("change", updateFromTheLeftOrRightSide, false); 
rightCurrencyTypeSelect.addEventListener("change", updateFromTheLeftOrRightSide, false);

leftCurrencyAmountInput.addEventListener("input", updateFromLeftValues, false);
rightCurrencyAmountInput.addEventListener("input", updateFromRightValues, false);

document.getElementsByClassName('https-info')[0].addEventListener("click", function( eventObj ) {
    document.body.removeChild( eventObj.target.parentNode );   // usuń rodzica dla naciśniętego przycisku
}, false);

// -----  funkcje  -----

function checkCurrencyOptionSelected ( selectElem ) {
var valueSelected = selectElem.value,
    arrayPosition = curenciesUsedCodes.indexOf( valueSelected );   // czy wybrano (wskazano) jedną z pozycji kodów walut?

    // console.log("odczytano z listy rozwijanej, wartość:", valueSelected, "pozycja_w_tablicy:", arrayPosition, "dla elementu:", selectElem);
    if ( ( arrayPosition === -1 ) || ( selectElem.tagName.toLowerCase() !== 'select' )) return false;
return true;
}

function blockSelectElements() {
    leftCurrencyTypeSelect.setAttribute('disabled', true);
    leftCurrencyAmountInput.setAttribute('disabled', true);

    rightCurrencyTypeSelect.setAttribute('disabled', true);
    rightCurrencyAmountInput.setAttribute('disabled', true);
}

function unblockSelectElements() {
    leftCurrencyTypeSelect.removeAttribute('disabled');
    leftCurrencyAmountInput.removeAttribute('disabled');

    rightCurrencyTypeSelect.removeAttribute('disabled');
    rightCurrencyAmountInput.removeAttribute('disabled');
}

function makeMeCurrentSourceValue( evt ) {

    if ( !evt.target.classList.contains( classOfCurrentSourceValue ) ) {    
    // gdy NIE MA to zabierz z obu elementów (jeden MOŻE MIEĆ) bez weryfkacji który jets bieżącym
        leftCurrencyAmountInput.classList.remove( classOfCurrentSourceValue );
        rightCurrencyAmountInput.classList.remove( classOfCurrentSourceValue);
        evt.target.classList.add( classOfCurrentSourceValue );
    }
}

function convertCurrencies( readyToCallAPI ) {
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
        spanElem.textContent = " OK ";
    } 
    else {
        spanElem = leftCurrencyTypeSelect.parentNode.getElementsByTagName('span')[0];
        spanElem.textContent = " ";
    }

    if ( rightCurrencyTypeOK ) {    // gdy jest pierwszy z wyborów zatwierdzony
        spanElem = rightCurrencyTypeSelect.parentNode.getElementsByTagName('span')[0];
        spanElem.textContent = " OK";
    }
    else {
        spanElem = rightCurrencyTypeSelect.parentNode.getElementsByTagName('span')[0];
        spanElem.textContent = " ";
    }

    if ( leftCurrencyTypeOK && rightCurrencyTypeOK ) {            // select#1 selected OK && select#2 selected OK --> ajax()
        if ( leftCurrencyTypeSelect.value != rightCurrencyTypeSelect.value ) {    // ale UWZGLĘDNIĆ poprawność konwersji, czyli nie dla DWÓCH TAKICH SAMYCH danych!

                                    // usuń poprzednie powiadomienia
            // deleteNotifications();   // !!!!! WYŁĄCZONO USUWANIE (POPRZEDNICH) KOMUNIKATÓW   

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

            // "później" odblokuj te oba pola wyboru, niezależnie od powodzenia tej opearacji zapytania
            // też usuń tą informację, skoro sukces... lub porażka  
            if ( anyInputTextPreviouslySelected ) {
                outputCurrencies = makeOutputCurrenciesWithoutSpecified( selectedFrom, selectedTo );   
                currentRatio = askForConvertingCurrencyRatio( selectedFrom, outputCurrencies, readyToCallAPI );    // przygotowanie ajaksa

                if ( currentRatio ) {
                    return currentRatio;    // zwróć POSIADANY i POPRAWNY przelicznik 
                }                
            }
            else {
                return null;    // !!! NIE KONWERTUJ, SKORO NIE OKREŚLONO CO ŹRÓDŁEM, A CO CELEM !!!
                // w takim wypadku najlepeiej  wcześniej jedno z pól formularza WYBRAĆ ŹRÓDŁEM na sztywno, by tu nie trafił nigdy warunek 
            }   // if-( anyInputTextPreviouslySelected )-END
        }   // if-( leftCurrencyTypeSelect.value != rightCurrencyTypeSelect.value )-END
        else {  // ... są IDENTYCZNE waluty wybrane w obu listach
            console.log('IDENTYCZNE POLA w listach wyboru', leftCurrencyTypeSelect.value);  // LEWYinput == PRAWYinput I ODWROTNIE 
            return 1;   // jako ratio - TE SAME WARTOŚCI w obu listach wyboru
        }
    } // if-( leftCurrencyTypeOK && rightCurrencyTypeOK )-END {
return null;        
}   // convertCurrencies-END

function updateFromLeftValues ( readyToCallAPI  /* eventObj */ ) {
var /* fakeEmptyObjAsEventObj = { target: leftCurrencyTypeSelect }, */
    resultRatio; 

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
    
    if ( leftCurrencyAmountInput.classList.contains( classOfCurrentSourceValue ) ) {

        resultRatio = convertCurrencies( readyToCallAPI );

        console.log("PRZELICZENIA względem LEWEJ strony, współczynnik konwersji:", resultRatio);
    
        if ( resultRatio ) {
            rightCurrencyAmount = leftCurrencyAmount * resultRatio;   // wykonaj przeliczenie, ewentualnie dla (0C)
            rightCurrencyAmountInput.value = rightCurrencyAmount.toFixed(2);   // odświeżenie zawartości drugiego pola (wyjścowy format walutowy)
        }
        else {
            rightCurrencyAmountInput.value = "WARTOŚĆ NIEPRZELICZONA"
        }
    }

}   // updateFromLeftValues-END

function updateFromRightValues ( readyToCallAPI ) {
    var /* fakeEmptyObjAsEventObj = { target: rightCurrencyTypeSelect }, */
        resultRatio; 

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

        resultRatio = convertCurrencies( readyToCallAPI );

        console.log("PRZELICZENIA względem PRAWEJ strony, współczynnik konwersji:", resultRatio);

        if ( resultRatio ) {
            leftCurrencyAmount = rightCurrencyAmount * resultRatio;   // wykonaj przeliczenie, ewentualnie dla (0C)
            leftCurrencyAmountInput.value = leftCurrencyAmount.toFixed(2);   // odświeżenie zawartości drugiego pola (wyjścowy format walutowy)
        }
        else {
            leftCurrencyAmountInput.value = "WARTOŚĆ NIEPRZELICZONA"
        }
    }

}   // updateFromRightValues-END

function updateFromTheLeftOrRightSide( eventOrValue ) {
var leftInputIsSelected = leftCurrencyAmountInput.classList.contains( classOfCurrentSourceValue ),
    rightInputIsSelected = rightCurrencyAmountInput.classList.contains( classOfCurrentSourceValue );

    console.log('UPDATE-LEFT-RIGHT, lewy:', leftInputIsSelected, "prawy:", rightInputIsSelected);

    if ( leftInputIsSelected && !rightInputIsSelected ) {
        console.log("Odpalono z wyborem wg pól LEWEJ strony...");
        updateFromLeftValues( eventOrValue ); // z obiektem zdarzenie puścić?
    }
    if ( !leftInputIsSelected && rightInputIsSelected ) {
        console.log("Odpalono z wyborem wg pól PRAWEJ strony...");
        updateFromRightValues( eventOrValue ); // a obiekt zdarzenia?
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
} // showNotification-END

function deleteNotifications() {
    var existingErrorNotifications = document.getElementsByClassName('notification'),
        notificationCounter = existingErrorNotifications.length;

        if ( notificationCounter > 0 ) {   // są jakieś powiadomienia, zatem je usunąć
        // console.log("ZNALEZIONE komunikaty:", existingErrorNotifications );
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
        newInputOptionElement.innerHTML = currency.code.toUpperCase() + " - " + currency.name + " [" + currency.HTMLSymbol + "]";
        newInputOptionElement.setAttribute('value', currency.code);
        leftCurrencyTypeSelect.appendChild( newInputOptionElement );

        newOutputOptionElement = document.createElement('option');
        newOutputOptionElement.innerHTML = currency.code.toUpperCase() + " - " + currency.name + " [" + currency.HTMLSymbol + "]";
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

    if ( targetCurrency == "" ) newOutputCurrenciesString = newOutputCurrencies.join(','); // bez początkowej DOCELOWEJ wartości i bez "wiodącego" przecinka za tą wartością
    else newOutputCurrenciesString = targetCurrency + ',' + newOutputCurrencies.join(',');    // złączenie w jeden ciąg
    // console.log("Wywal", specifiedCurrencyCode, "wstaw na początek", targetCurrency, "- otrzymano WY jako TEKST:", newOutputCurrenciesString);    

    return newOutputCurrenciesString;
} // makeOutputCurrenciesWithoutSpecified-END

function moveSelectedSubstringAtTheBeginning( wholeText, substring ) {
var outputText,         // wynikowy np. "PLN,USD,GBP,CHF,JPY"
    substringPosition = wholeText.indexOf( substring ),
    totalLength = wholeText.length;

    if ( totalLength <= 0 ) return wholeText;
    if ( ( substringPosition < 0 ) || ( substringPosition < 2 ) ) return wholeText;    // nie znaleziono lub JUŻ na początku 
    else {
        if ( substringPosition == (totalLength - 1 - 2) ) { // -3 bo: -1 to długość bezwzględna i -2 poza pierwszą literą
            // na końcu 
            outputText = substring + "," + wholeText.substr(0, substringPosition - 1);    // ma zabrać z końca TEN ciąg oraz PRZECINEK przed nim
         }
        else {  // gdzieś w środku ciągu
            outputText = substring + "," + wholeText.substr(0, substringPosition - 1) + wholeText.substr(substringPosition + substring.length);
        }
    }
return outputText;
}

function askForConvertingCurrencyRatio( fromCurrencyCode, toCurrencyCodesString, callExternalAPIorNOT ) {
var newValues,  // tablica zawierajaca przeliczenia, zwraca jako odpowiedź z API
    wantedConversionRatio = "" + fromCurrencyCode + separatorBetweenConvertedCurrencies + toCurrencyCodesString.substr(0,3);    // !!! ZGODNY SEPARATOR
        // sklejanie "klucza" jako zbitka wartości (na sztywno dla WPROST WSKAZANEGO przeliczenia z wywołania funkcji)
    // console.log("przygotowanie zapytanie o przeliczenie", fromCurrencyCode, "na", toCurrencyCodesString);

    if ( wantedConversionRatio in currencyTable ) {     // jesli treść szukana znajduje się już w obiekcie
        console.log("(+) Odczytano z ZAPAMIĘTANYCH już przeliczników!", wantedConversionRatio);
        return currencyTable[ wantedConversionRatio ].ratio;   // ZAPAMIĘTANA JUŻ wartość KONKRETNEGO ATRYBUTU w obiekcie
    }
    else {
        if ( callExternalAPIorNOT ) {  // wysłanie zapytania do API tylko gdy tak określono w przekazwywanych stopniowo z "góry" kolejnych wywołaniach
            // console.log("(-) Wysłano żądanie API (wartość nieznana póki co)...");
                        // zablokuj OBA menu wyboru do czasu uzyskania odpowiedzi
            blockSelectElements();  // efektywnie to TUTAJ należy blokować listy wyboru
            prepareXMLHttpRequestForCurrency( fromCurrencyCode, toCurrencyCodesString );
            // TO PONIŻEJ PRZENIEŚĆ JAKOŚ DO FUNKCJI ZWROTNEJ "SUKCES"... ALE JAK TO PÓŻNIEJ ZWRÓCIĆ.. czyżby wywołać ponownie tę "funkcję-matkę"?! 

            showNotification('Wysłano zapytanie o przeliczenie ' + fromCurrencyCode + ' na ' + toCurrencyCodesString.substr(0,3) + '.'); // 
        }
        else {
            console.log("BRAK zapytania do API zewnętrznego, ZABRONIONO wysyłki!");   // tylko cele informacyjne, brak działań w tym 
        }
    }
    // return null; // CO ZWRÓCIĆ, SKORO AJAX WŁAŚNIE WYSTARTOWAŁ?!

return null;    
} // askForConvertingCurrencyRatio


function prepareXMLHttpRequestForCurrency( inputCurrencyCode, outputCurrenciesString ) {
var // APIkey = '86a253ac9fb654d2978a3db6e7a77107',     // @gmail.com, chwilowo zużyty !!!
    APIkey = 'c5af33fb536e4dbd613b7ed2f8d19bd7',    // "....@wp.pl"

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

// ------------------------------------------------------------------------------------------------------------- //
//    
// !!!!!"FREE API" nie obsługuje ZMIANY parametru "BASE", który jest NA SZTYWNO OKREŚLONY WARTOŚCIĄ "EUR" !!!!!! //
//
// ------------------------------------------------------------------------------------------------------------- //

apiQuery = 'latest?access_key=' + APIkey + /* '&base=' + inputCurrencyCode + */ '&symbols=' + outputCurrenciesString;   // BEZ "BASE" !!!

// **NIE OBSŁUGUJE** też przelicznika względem DOWOLNEJ WALUTY BAZOWEJ na rzcz listy walut docelowych (ale lista względme EURo jest OK!)   
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

// ---------------------------------------------------------------------------------------------------
/*  te powyższe przekształcenia pozostają do wykonywania "na próżnicę" i ZOSTANĄ zaraz PODMIENIONE przez działania, 
    wykonywanena na "darmowym API", które zezwala tylko na zapytanie względem EURO - "EUR" jest bazowym kodem, 
    którego NIE MOŻNA UŻYĆ ZAMIENNIE Z DOWOLNĄ INNĄ WALUTĄ;
    poza tym dowolna lista używanych walut może być pozyskana z przelicznika danej waluty do euro, zatem można przyrównywać
    ...wartości 1E w różnych znanych walutach, by na tej podstawie obliczyć wartość X/Y lub Y/X z tej proporcji z euro
*/
    if ( isFreePlanOfAPI ) {        // wariant póki co w ciągłej eksploatacji za darmo
        var allCurrencies = makeOutputCurrenciesWithoutSpecified( "EUR", "EUR"), // pozyskanie całej listy z zamianą "EUR" na to samo 
            inputCodeString = inputCurrencyCode,
            outputCodeString = outputCurrenciesString.substr(0, 3); // jawne to co na WEJŚCIU funkcji
            // inputCodeString = ( inputCurrencyCode == 'EUR' ) ? "" : inputCurrencyCode,
            // outputCodeString = ( outputCurrenciesString.substr(0, 3) == 'EUR' ) ? "" : outputCurrenciesString.substr(0, 3);

            // dla API nie ma znaczenia kolejność walut wynikowych, ale dobrze by było zapytać się o nie w kolejności...
            // ...takiej, jak użyto w listach rozwijanych (żądany, wynikowy, ...pozostałe) - by określać kierunek konwersji 
                // najpierw wynikowy symbol (waluty docelowej), ewentualnie wskoczy na początek
        allCurrencies = moveSelectedSubstringAtTheBeginning( allCurrencies, outputCodeString );
                // teraz liderem ustaw to co w "źródłowej" liście rozwijanej 
        allCurrencies = moveSelectedSubstringAtTheBeginning( allCurrencies, inputCodeString );

        apiQuery = 'latest?access_key=' + APIkey + '&symbols=' + allCurrencies;   // BEZ "BASE", który jest "EUR" !!!
        ajaxURL = apiServer + apiQuery;
    }   

    console.log("PEŁNY CIĄG ZAPYTANIA:", ajaxURL);      
    try {
        // !!! HTTPS vs HTTP
        // "github pages" nie działa w oparciu o protokół "http" (tylko httpS), nie można więc wysłać zapytania http (albo jakieś inne blokowanie treści w przeglądarce)
        // zaś "httpS" nie jest dostępne w API za "Free"... więc konflikt nierozwiązany
        // ...tak chociaż jakiś komunikat wyskoczy, że się nie udało wysłać żądania zamiast ciągłego patrzenia na szare pole formularza...  
        ajax.open('GET', ajaxURL, true);
    }
    catch ( error ) {
        showNotification("Wystąpił BŁĄD z użyciem API zewnętrznego. Prawdopodobnie żądanie do 'fixer.io' zostało zablokowane przez serwer lub przeglądarkę.", error);
        currencyExchangedError();
    }

    ajax.addEventListener("load", currencyExchanged, false);
    ajax.addEventListener("error", currencyExchangedError, false);
    ajax.send();
} // prepareXMLHttpRequestForCurrency-END


function currencyExchanged( evt ) {
var resolvedData = JSON.parse( evt.target.response ),  // zamiana tekstowej treści odpowiedzi na postać obiektu
    // requestedData = JSON.parse( evt.target.responseURL ),
    baseCurrency,
    baseCurrencyFromInput,
    targetCurrencyFromInput,
    i = -1, // indeks na minusie, każda iteracja to +1, więc będzie od "0" szło  
    targetCurrency,
    targetRatioName,
    targetRatioValue,
    timestamp,
    notifyText,
    temp;   // pozyskiwanie położenia symboli walut w ciągu tekstowym, gdy błąd


unblockSelectElements();
// console.log("ZAPYTANIE AJAX - SUKCES:", evt);

    if ( resolvedData.success ) {
        baseCurrency = resolvedData.base;   // ma być [0],
        target_Currency_3 = resolvedData.rates;    // to jest obiekt z poszczególnymi przelicznikami względem waluty bazowej
            // od teraz na pierwszym miejscu zwrócenego ciągu jest docelowa konwersja

        // DODAJ NOWE PRZELICZNIKI DO BAZY
    
        for ( targetCurrency in resolvedData.rates ) {
            if (resolvedData.rates.hasOwnProperty( targetCurrency )) {
                i++;    
                if ( i == 0 ) baseCurrencyFromInput = targetCurrency;    // łopatologiczne pozyskanie ;)
                if ( i == 1 ) targetCurrencyFromInput = targetCurrency;

                targetRatioName = "" + baseCurrency + separatorBetweenConvertedCurrencies + targetCurrency;  // TEN SAM SEPARATOR! łączenie ciągów, np.  "COŚ-DWA"
                targetRatioValue = resolvedData.rates[ targetCurrency ];     // notacja "z kropką" też zadziała?
                timestamp = resolvedData.timestamp;
                currencyTable[ targetRatioName ] = {
                    ratio: targetRatioValue,
                    timestamp: timestamp
                };

                // "counterConversionRatio" -- to WARTOŚĆ ODWROTNA (stosunek drugiej waluty do pierwszej)
                    //   -- WARTOŚĆ WYLICZANA na podstawie zapytania o DANY przelicznik waluty (już poznany)  
                targetRatioName = "" + targetCurrency + separatorBetweenConvertedCurrencies + baseCurrency;  // np. "DWA-COŚ".. jako odwrotność poprzednio utworzonego
                    if ( targetRatioValue != 0 ) targetRatioValue = 1 / targetRatioValue;    // obliczenie "odwrotnego współczynnika" dla walut
                    else targetRatioValue = 0;
                currencyTable[ targetRatioName ] = {
                    "ratio": targetRatioValue,
                    "timestamp": timestamp
                };
            }
        }   // for-IN-END

        extendCurrencyTableByKnownEuroRatios();     // rozbudowa tablicy walut o wzajemne relacje, w oparciu o przelicznik do "euro"

        // nie ma dostępu do rodzica-rodzica, zatem nie można się wprost odwołać do wartości w wysłanym formularzu (które teraz mogą być inne!)
        showNotification("Sukces konwersji. Otrzymano współczynniki żądanej zamiany " + baseCurrencyFromInput + " na "
                 + targetCurrencyFromInput + " oraz pozostałych używanych walut.");   

        // console.log("zaktualizować JAKOŚ GDY: baza", baseCurrencyFromInput, "na", targetCurrencyFromInput );    

            // wymuś aktualizaję zawartości na ekranie (pola formularzy!) o poznane właśnie przeliczniki
       
        updateFromTheLeftOrRightSide( false );  // WYWOŁYWANIE SAMEGO SIEBIE (funkcja rodzica!), ALE BEZ XHR ma to być !!!
        printCurrencyTable();       // wyświetl zawartość istniejącej tabeli walut (w kosoli, docelowo na stronie)

    } // 
    else {
        notifyText = resolvedData.error.info;
        temp = evt.target.responseURL.indexOf('&symbols='); //"...&symbols=EUR,USD,..."
        baseCurrency = evt.target.responseURL.substr(temp+9, 3);  // symbol waluty źrółowej winien być zwrócony, a za nią docelowej 
        targetCurrency = evt.target.responseURL.substr(temp + 9 + 4, 3);  // 4 = długość poprzednika + przecinek   
        
        console.log('evt.target.responseURL:', evt.target.responseURL);
        showNotification('BŁĄD: Wystąpił problem w przetwarzaniu żądania konwersji (' + baseCurrency + ' na ' + targetCurrency + '):',
             'BŁĄD API nr ' + resolvedData.error.code + ": " + notifyText);
    }

} // currencyExchanged-END

function currencyExchangedError( evt ) {

    // ...

    unblockSelectElements();
    console.log("ZAPYTANIE AJAX - BŁĄD!:", evt);

    // ...

}   // currencyExchangedError-END

// ! BRAK AKTUALIZACJI "NA BIEŻĄCO" DLA OPCJI "FREE" i innych "mało-płatnych" pakietów, wyniki zwracane przez serwis są aktualizowane... 
// w zależności od wykupionego planu (koszt rosnący): co 60 minut (darmowy), 10 minut lub 60 sekund... zatem nie ma sensu odpytywać ciągle o to samo serwer


function printCurrencyTable() {
var mainElem = document.getElementsByClassName('currency-table-status')[0],
    innerElem = document.getElementsByClassName('currency-table')[0],
    fragment = document.createDocumentFragment(),
    newLi,
    newSpan,
    newText;

    mainElem.style.display = 'block';
    innerElem.innerHTML = "";  // zerowanie zawartości <ul> przed każdym wyświetleniem... aby nie dodawać wieokrotnie tych samych elementów
                                                    // ( key, value )
    Object.keys( currencyTable ).forEach( function( key, counter ) {   // iterowanie po istniejących elementach zbioru
        //console.log(key,":", key.ratio, "(", value, ")" );
        // console.log( "(", counter, ")", key,":", currencyTable[ key ], "przelicznik", currencyTable[ key ].ratio );
   
        newSpan = document.createElement('span');
        newSpan.textContent = "" + key + ": ";
        newLi = document.createElement('li');
        newLi.appendChild( newSpan );
        newText = document.createTextNode( "" + currencyTable[ key ].ratio );
        newLi.appendChild( newText );
        fragment.appendChild( newLi );    // PRZYPISANIE TREŚCI Z OSOBNA
    });

    document.body.style.paddingBottom = '8em';
    innerElem.appendChild( fragment );
} // printCurrencyTable-END

function extendCurrencyTableByKnownEuroRatios() {
var currenciesLength = currenciesUsed.length,
    currentRatio,
    valueFromInEuro,
    valueToInEuro,
    newCurrencyRatioValue,
    i,
    j,
    newElementsCounter = 0,
    copiedTimestamp = currencyTable['EUR/USD'].timestamp;   // dowolny już istniejący (z zapytania o przeliczenie Z/NA "euro")

            // seria porówniań każdy z każdym, by zweryfikować istnienie "klucza" w tabeli przeliczników walut
    for ( i = 0; i < currenciesLength; i++ ) {
        for ( j = 0; j < currenciesLength; j++) {
            if ( i == j ) continue;     // przejdź do kolejnego, nie buduj przeliczników "1:1"
            currentRatio = "" + currenciesUsed[ i ].code + separatorBetweenConvertedCurrencies + currenciesUsed[ j ].code;

            if ( currentRatio in currencyTable ) {  // jeśłi istnieje już takowy w tablicy to ZAKOŃCZ bieżącą iterację
                // console.log( "'" + currentRatio + "' już istnieje w tabeli przeliczników" );
                continue;   // wyjście z tej pętli
            }

            valueFromInEuro = askForConvertingCurrencyRatio( "EUR", currenciesUsed[ i ].code ); // przelicznik 1E w innej walucie
            valueToInEuro = askForConvertingCurrencyRatio( "EUR", currenciesUsed[ j ].code );   // inna waluta

            newCurrencyRatioValue = valueToInEuro / valueFromInEuro;

            currencyTable[ currentRatio ] = {   // !!! MUSI BYĆ BUDOWANY OBIEKT (klucz + wartość), a nie same wartości wstawiać!
                ratio: newCurrencyRatioValue,
                timestamp: copiedTimestamp  
            };

            newElementsCounter++;
            // console.log("Dodano klucz '" + currentRatio + "' do tablicy przeliczników");
            // ...
        }

    }
// console.log("OBIEKT ROZBUDOWANY:", currencyTable, "odnaleziono", newElementsCounter, "nowych kluczy do wstawienia" );
}