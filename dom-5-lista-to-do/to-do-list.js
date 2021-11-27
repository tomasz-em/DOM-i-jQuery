/* 5. Lista to-do (folder dom-5-lista-to-do)
Stwórz listę to-do; musi mieć input umożliwiający wprowadzanie zadań do wykonania oraz odpowiedni button; 
musi listować zapisane zadania do wykonania wraz z inputem typu checkbox, który ma służyć odznaczaniu wykonanych zadań. 
Ponadto, checkbox “show completed” ma powodować wylistowanie wszystkich wykonanych zadań.
*/

var existingToDos = [], // pusta lista na starcie
    displayingListMode = ['all', 'undone', 'done'], // lista trybów przeglądania listy
    currentDisplayingListMode = displayingListMode[0],  // "all" jako domyślny sposób; zmienialny przy naciśnięciu przycisku w dolnej belce
    notificationElem,   // nie ma potrzeby tworzyć zmiennej, kosztowniejsze i prostsze jest każdorazowe zapytanie o ten element w DOMie
    submitDisabled = true,   // domyślna blokada na przesyłanie formularza (aby nie przekazać z kiepskim hasłem).. zwłaszcza poprzez [enter] w polu tekstowym 
    toDoText = '',
    newToDoId = 'activity-name',
    newToDoInput = document.getElementById( newToDoId ),
    newToDoSubmitBtn = document.getElementById('add-activity'),
    wholeForm = document.getElementById('to-do-form'),
    wholeToDoList = document.getElementsByClassName('to-do-list')[0],  // to <ul> przechowuje aktualnie wyświetlaną listę (pełną lub wariant)
    deleteAllDoneBtn = document.getElementById('delete-completed'),
    // listTypeSelectorRadio = document.querySelectorAll('.bottom-menu input[type="radio"]');  // to nie ta kolekcja
    listTypeSelectorRadio = document.forms['selected-view'].elements['show-completed'], //']; selectingView.elements.showCompleted;  -- KOLEKCJA HTMLa, NIE_TABLICA! 
    //listTypeSelectorRadio = document.forms.selectingView.elements.showCompleted;
    newUnwantedForm = document.getElementById('selected-view'),
    loadTestDataBtn = document.getElementsByClassName('load-test-data')[0]; // 
    

    // ======  STARTOWE DZIAŁANIE  ======

newToDoInput.value = '';  // zerowanie ewentualnej wpisanej wartości na starcie
newToDoSubmitBtn.setAttribute('disabled', true);   // oraz na starcie blokowanie wysłania formularza poprzez click.. co nie znaczy, że [enterem] lub [spacją] nie da się wysłać ;)

currentDisplayingListMode = displayingListMode[0];  // kopia przypisania na wszelki wypadek
listTypeSelectorRadio[0].checked = true;   // auto-wybór pierwszego pola, jako narzucony wariant wywietlania; zawsze ustawiony po odświeżeniu strony...
    // dzięki czemu nie przenosi się uustawiony w formularzu stan sprzed odświeżenia zawartości okno
// listTypeSelectorRadio[0].click();   // symulacja naciskania pierwszego pola wyboru widoku
displayWholeToDoList( currentDisplayingListMode );

// displayWholeToDoList();  // ZAMIAST wyświetlenie wszystkich elementów listy
    //... lepiej wywołać zadanie naciskania danego elementu (lub przesyłania formularza)
    //... dzięki czemu od razu się zaznaczy "ZAWSZE TEN SAM WIDOK" przy odświeżaniu witryny
    //... ALE TO DODANO DOPIERO KILKANAŚCIE INSTRUKCJI DALEJ, PO PODPIĘCIU PRZECHWYTYWANIA ZDARZEŃ
    //... (-) różnice w działaniu w poszczególnych przeglądarkach... bo trudności z wywołaniem zdarzenia


    // ======  ZDARZENIA  ======

newToDoInput.addEventListener('input', function( evt ) {
    checkInputLength( evt.target );   // weryfikacja długości/istnienia wpisango tekstu
}, false);

wholeForm.addEventListener('submit', addNewItem, false);

deleteAllDoneBtn.addEventListener('click', function( evt ) {
    deleteAllDone( evt ); 
}, false);   // !!! dla wskazanego elementu a nie "=" !!!

newUnwantedForm.addEventListener('submit', function( evt ) {
    var elemName = evt.target.tagName;    
        evt.preventDefault();   // [!] to broni przed przesłaniem tej formy?!, kiedy klikniemy w "Usuń ukończone" ... czyżby NIEJAWNY <input type="submit"> w miejsce istniejącego <button>-a?!?!
        evt.stopPropagation();
        console.log("PRZESYŁANIE NIECHCIANEGO FORMULARZA zainicjowane przez...", elemName);
    
        // błąd tylko w IE i starych przeglądarkach
        // console.log("SUBMIT-CHANGE (OBJ):", evt);
        // selectTypeOfToDos( evt );   // co samo co przypisano w zmianie wartości - zdarzenie "change"
            // displayWholeToDoList( currentDisplayingListMode );   // to niepotrzebne, skoro wysłanie formy spowoduje automatyczne wyświetlenie 
            //... tego samego widoku (tylko jego odświeżenie; niepotrzebne?) 
    }, false);

    // 3 x kolejno po wszystkich przyciskach "radio" 
for (var i = 0; i < listTypeSelectorRadio.length; i++) {
    listTypeSelectorRadio[i].addEventListener('change', function( eventObj ) {  // zmiana wyboru zaznaczenia 
        selectTypeOfToDos( eventObj );   // tu cały obiekt zdarzenia wskakuje, bez zmniejszania zakresu 
    }, false);

    listTypeSelectorRadio[i].addEventListener('keydown', function( eventObj ) { // pomijanie niejawnej wysyłki "submit" dla Entera 
        if ( event.key == "Enter" ) {
            eventObj.preventDefault();
            return false;
        }
    }, false);
}
    // POWYŻSZY typ danych to nie jest do końca tablicą, dla daje się przejrzeć za pomocą FOR (zaś przez forEach już nie!)
/*     listTypeSelectorRadio.forEach( function( radioInput, indx ) {   // to nie jQ, trzeba każdemu przyciskowi z osobna jawnie przypisać obsługę zdarzenia 
    radioInput.addEventListener('change', selectTypeOfToDos, false);   
});  */

loadTestDataBtn.addEventListener('click', function( evt ) {     

    loadTestData();
    
    console.log("'Click' na DODATKOWYCH DANYCH");

/*     loadTestDataBtn.removeEventListener('click', deleteLoadTestDataBtn, false);   // usunięcie obsługi zdarzenia 'click' na tym elemencie
    // usunięcie elementu 
*/

    document.getElementsByClassName('to-do-container')[0].style.marginBottom = '1.5em';
    loadTestDataBtn.parentNode.removeChild(loadTestDataBtn);    // nie chcesz się wywalić, to spadaj

    // loadTestDataBtn.click();
    displayWholeToDoList( currentDisplayingListMode );  // aktualizacja widoku

}, false);


    // ======  "PO-STARTOWE" DZIAŁANIE  ======

/* 
currentDisplayingListMode = displayingListMode[0];  // kopia przypisania na wszelki wypadek
listTypeSelectorRadio[0].checked = true;   // auto-wybór pierwszego pola, jako narzucony wariant wywietlania
listTypeSelectorRadio[0].click();   // symulacja naciskania pierwszego pola wyboru widoku

newUnwantedForm.submit();   // mimo wszystko to dobry autostart
*/

    // ======  FUNKCJE  ======

function simpleHTMLInputParser( inputText ) {
    var trimmedText = inputText.trim();     // wywal wszelkie spacje i niedrukowalne przed i za tekstem z pole formularza 
    // return trimmedText.replace(/<[^>]*>?/gm, '');    // nie przyjmuje tekstu za "<"
    return trimmedText.replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;');     // po prostu zastąp wszystkie znaczkiki tagów treścią bezpieczną dla HTMLa  
}

function showNotification( someText, anchorObj ) {
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
    // notificationElem.classList.add('error');    // a tu jako wyróżnik logiki, ale to chyba niepotrzebne skoro jeden cel powiadomień... by zniknąć
    notificationElem.appendChild( headerElem ); 
        if ( positionOfErrorText >= 0 ) notificationElem.style.borderColor = 'red'; // wstawi w czerwonej ramce każdy tekst "polskiego błędu:.. 
            // ...gdy to ma być komunikat o błędzie, a nie po prostu powiadomienie o jakimś działaniu

    document.body.appendChild( notificationElem );   // pośrednie przejście do rodzica i wstawienie za nim (na jego końcu) w DOMie strony
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

        // enableRefreshByRedirectionEvent();   // ustawione jest tu zdarzenie na kliknięcie w odnośnik
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

function sendToServer( someData ) {
    // zrób coś z wpisanymi danymi i przekaż je serwerowi

    // ... tutaj właściwa pseudo wysyłka się właśnie odbyła :)
}

function checkInputLength( eventElem ) {    // blokowanie
    if ( eventElem.value.length > 0 ) {
    newToDoSubmitBtn.removeAttribute('disabled');
    submitDisabled = false;    
    }
    else {
    newToDoSubmitBtn.setAttribute('disabled', true);
    submitDisabled = true;    
    }
return !submitDisabled;     // knowania odwrotnej logiki; przez zawiłość może być prostsze w przypisaniu/warunku... o ile będzie użyte 
}

function buildLiItemFromToDoList( oneToDo ) {
    var newLiElem = document.createElement('li'),
        pElem = document.createElement('p'),
        textElem = document.createTextNode( oneToDo.name ),
        spanElem = document.createElement('span'),
        checkboxElem = document.createElement('input'),
        removingBtn = document.createElement('button');

pElem.appendChild( textElem );  // dodanie samego tekstu do elementu z tablicy
    if ( oneToDo.done ) pElem.classList.add('done');   // dodanie zdefiniownej klasy dla tekstu - inny wygląd

removingBtn.textContent = 'Usuń';  
removingBtn.addEventListener('click', deleteThisToDo);        // + zdarzenie 'click'
spanElem.appendChild( removingBtn );

checkboxElem.setAttribute('type', 'checkbox');      // dodanie atrybutu, jako określenie typu tego przycisku  
checkboxElem.addEventListener('change', toggleDoneUndone);        // + zdarzenie 'click/change'
    if ( oneToDo.done ) {
        checkboxElem.setAttribute('checked', true);    // warunkowe zaznacznie lub nie (odczyt )
        checkboxElem.setAttribute('title', 'ukończone: TAK');    // ale ten opisowy atrybut jest zawsze dodawany
    }
    else {
        checkboxElem.setAttribute('title', 'ukończone: NIE');    // przeciwna treść atrybutu opisowego
    }
spanElem.appendChild( checkboxElem );

pElem.appendChild( spanElem );
newLiElem.appendChild( pElem );  // przypisanie zawartości tekstowej dla nowego obiektu tekstowego w <li> 

return newLiElem;   // zwróć to. co tutaj zbudowano dla jednej pozycji listy
}

function buildTemporaryListFromDisplayedElments( eventElem, eventElemOffset ) {
var temporaryList = [],
    // tempElem = { name: "", done: false },    //... to nie zadziała, bo to CIĄGLE TA SAMA REFERECJA by wskakiwała do tablicy w kolejne elementy
    readedTitle = "",
    readedDoneStatus = false,
    currentElems = wholeToDoList.getElementsByTagName('p');
    // console.log("lista <p>:", currentElems);

        // PONIŻSZA PĘTLA DZIAŁA PRAWIDŁOWO (dla <button>a)... ALE DOCHODZI DO ANOMALII ODCZYTU WARTOŚĆ W DOMie, KIEDY JEST KOLEJNY ODCZYT STANU ELEMENTU, 
        // KTÓREGO DOTYCZY ZDARZENIE "CHANGE" NA CHECKBOKSIE - ODCZYTYWANE JEST NIEJAKO STAN "PO"

/*         // zakładam, że ta lista elementów jest wyświetlona... w końcu jak wywołano tę funkcję po naciśnięciu przycisku, którego nie widać?
    for (var i = 0, maxI = currentElems.length; i < maxI; i++ ) {
        readedTitle = currentElems[i].firstChild.textContent;   // pobranie tekstu z pierwszego elementu
        readedDoneStatus = !!currentElems[i].lastChild.lastChild.checked;  // a tu statusu zaznaczenia z ostatniego elementu (w jego ostatnim elemencie)
        // console.log("obiekt #" + i + " - ", readedTitle, readedDoneStatus); 
        // temporaryList.push( tempElem ); // !!! DODAWAĆ KOPIĘ, a nie TĘ SAMĄ REFERENCJĘ na ostatni element!?!?!?
        temporaryList.push({ name: readedTitle, done: readedDoneStatus });  // DYNAMICZNE DODAWANIE NOWYCH OBIEKTÓW
            // IDENTYCZNĄ strukturę z określonymi kluczami ma obiekt danych w tablicy źródłowej z logiki
    }
console.log("BUDOWANA_LISTA_DOM:", temporaryList); */

    var currentElemType = eventElem.tagName.toLowerCase(),
        currentTitle = eventElem.parentNode.parentNode.firstChild.textContent,
        currentCheck,
        currentCheckStatus;

        if ( currentElemType === "button" ) {
            currentCheck = eventElem.parentNode.getElementsByTagName('input')[0];
        }
        if ( currentElemType === "input" ) {
            currentCheck = eventElem;
        }
        currentCheckStatus = !!currentCheck.getAttribute('checked');

        // temporaryList = []; // zawartość od nowa

        for ( var i = 0, maxI = currentElems.length; i < maxI; i++ ) {
            readedTitle = currentElems[i].firstChild.textContent;   // pobranie tekstu z pierwszego elementu
            readedDoneStatus = !!currentElems[i].lastChild.lastChild.checked;  // a tu statusu zaznaczenia z ostatniego elementu (w jego ostatnim elemencie)
            if ( i === eventElemOffset ) {   // naprawa dla BIEŻĄCEJ GRUPY ELEMENTÓW
                readedTitle = currentTitle;
                readedDoneStatus = currentCheckStatus;
            }
            // console.log("obiekt #" + i + " - ", readedTitle, readedDoneStatus); 
            // temporaryList.push( tempElem ); // !!! DODAWAĆ KOPIĘ, a nie TĘ SAMĄ REFERENCJĘ na ostatni element!?!?!?
            temporaryList.push({ name: readedTitle, done: readedDoneStatus });  // DYNAMICZNE DODAWANIE NOWYCH OBIEKTÓW
                // IDENTYCZNĄ strukturę z określonymi kluczami ma obiekt danych w tablicy źródłowej z logiki
        }
    // console.log("BUDOWANA_LISTA_DOM + FIX:", temporaryList);
    // fixEventTargetValuesAfterReadingDOM(...);    // wsatwiono działania naprawcze już powyżej

return temporaryList;
}

function fixEventTargetValuesAfterReadingDOM( actionElem, currentToDoOffset, theList ) {
    // CELEM POPRAWY WARTOŚCI ODCZYTYWANYCH Z OBSŁUGIWANEGO NA BIEŻĄCO ZDARZENIA "CHANGE" NA ELEMENCIE <input> TYPU CHECKBOX

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // !!!!! LIKWIDUJE ANOMALIĘ ODCZYTU STANU ELEMENTU W TRAKCIE OBSŁUGI JEGO ZDARZENIA !!!!!
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    
    // PRZENIESIONO CIAŁO WEWENĄTRZ buildTemporaryListFromDisplayedElments(), której bezpośreni odotyczy - by NIE POWIELAĆ CZĘŚCI tego samego kodu!
};

function countOffsetOfCurrentElementFromAllDisplayedElements( actionElem ) {
var offsetOfCurrentElement = 0,    // który element, spośród wyświetlonych został naciśnięty/aktywowany
    actionElemType = actionElem.tagName.toLowerCase(),  // tu te same treści, do wyboru: .tagName == .nodeName; też (+) za ogólną postać elementu źródłowego
    displayedCollectionOfElems = wholeToDoList.getElementsByTagName( actionElemType );  // listowanie względem takiego samego typu wewnątrz <ul> 
        //... przydaje to się dla ogólnego działania, ma obsługiwać: <button> i <input type="checkbox">
    // console.log("Aktywowany element:", actionElemType);
    // if ( actionElemType)

    for ( var i = 0, maxI = displayedCollectionOfElems.length; i < maxI; i++ ) {
        if ( displayedCollectionOfElems[i] === actionElem ) {  // porównanie referencji na obiekty DOMu, aż trafi się ten ze zdarzenia (sposród aktualnie wyświetlanych jako kolejne elementy listy)
            offsetOfCurrentElement = i;    // przypisanie tego indeksu, jako odniesienie który to przycisk względem listy 
            break;  // po co preszukiwać dalej, skoro mamy JEDYNE PASUJĄCE do wzorca
        } 
    }
return offsetOfCurrentElement;
}

    // "oryginał"
/* function findIndexOfNthOccurence( searchedItem, whichOccurence ) {   // "czegoSzukamy", "któregoPowtórzenia"
    var totalLength = existingToDos.length,
        i = -1; // początkowa wartość, ale będzie od razu zamienione na "0" - początek tablicy, aby zacząć przeglądać rekordy od 0-wego indeksu

    console.log("FIND_Nth: ", "poszukiwany:", searchedItem, "któreWystąpienie:", whichOccurence, "długość:" , totalLength);
    while( whichOccurence-- && ( i++ < totalLength ) ) {     // tu jest zawsze "+1", zatem dopasowanie zaczyna się od "0" indeksu 
    console.log("FIND_Nth iteracja#", i, "któreWystąpienie:", whichOccurence);
        i = existingToDos.indexOf( searchedItem, i );    // ale też "-1" lub "0" dla pierwszej  !!! OBIEKTY !!!
        if ( i < 0 ) break;
    }
    return i;   // zwróc indeks tego N-tego
}  */

function findIndexOfNthOccurence( searchedItem, whichOccurence ) {   // "czegoSzukamy", "któregoPowtórzenia"
    var totalToDosLength = existingToDos.length,
        startIndx = 0,  // ppotrzebne do przeglądania od początku 
        foundIndx = -1, // (chyba) przy każdej zewnętrznej itereacji trzeba zerować (dla każdego duplikatu od nowa, by potwierdzić szukaną krotność) 
        i,
        j;

    for ( j = 0, startIndx = 0; j < whichOccurence; j++ ) { // powtarzamy tyle razy, aż się nie trafi na N-te wystąpienie
    // startIndx = ???;
    foundIndx = -1; // zerowanie przed każdym sprawdzeniem... może być źle krotność przekazana 
    
        for ( i = startIndx; i < totalToDosLength; i++ ) {
            if ( ( existingToDos[i].name === searchedItem.name ) && ( existingToDos[i].done === searchedItem.done ) ) { // !!! uwaga na nazwy kluczy i ich wartości
                foundIndx = i;
                startIndx = i + 1;
                // console.log("FIND_Nth: #", i, "znaleziony:", foundIndx, "któreWystąpienie:", (j+1), ". Szukamy:", searchedItem );
                break;  // wyjście z wewnątrznej pętli
            }
        }   // for(i...)-END (wewnątrzna)
    }   // FOR(j...)-END (zewnątrzna) 

    return foundIndx;   // zwróc indeks tego N-tego
}


function displayWholeToDoList( allOrDoneOrUndone ) {
var fragment = document.createDocumentFragment(),   // nowy fragment dokumentu do zapełnienia 
    liElem; // kontener na element listy, jedna pozycja
allOrDoneOrUndone = allOrDoneOrUndone || 'all';   // 'all' | 'undone' | 'done' -- domyślnie "all" jest widocznością wszystkich elementów 

var isAnyDone = existingToDos.some( function( toDo ) {  // weryfikacja istnienie DOWOLNEGO "wykonanego" zadania na liście 
    return toDo.done === true;
});

var isAnyUndone = existingToDos.some( function( toDo ) {    // weryfikacja istnienie DOWOLNEGO zadania "w trakcie"
    return toDo.done === false;
});

console.log('PODSUMOWANIE ISTNIENIA KATEGORII "wykonane":', isAnyDone, ', "w trakcie":', isAnyUndone);

        // wyświetlenie informacji o braku elementów do wyświetlenia, albo wygeneruj te elementy z listy
            // pierwszy warunek "zachowawczo" zostaje (pierwszy się sprawdził), bo pusta lista nie spełni zadania!
    if ( ( existingToDos.length <= 0 ) || ( !isAnyDone && ( allOrDoneOrUndone == 'done' ) ) 
            || ( !isAnyUndone && ( allOrDoneOrUndone == 'undone' ) ) ) {

        // wyświetlenie informacji o braku elementów, zamiast zostawiania pustego tła o określonej wysokości
        wholeToDoList.innerHTML = '<p>Brak wpisów</p>';
    }
    else {  // wyświetlenie zawartości listy, jako poszczególne elementy <li> ze złożoną zawartością

console.log('PEŁNA LISTA: ', existingToDos, ", tryb: '" + allOrDoneOrUndone + "'");  // dla jasności przy kasowaniu

    existingToDos.forEach( function( toDo, indx ) { // tablica globalna

        if ( allOrDoneOrUndone == 'all' ) {  // dopisanie KAŻDEGO bieżącego elementu <li> do fragmentu 
            liElem = buildLiItemFromToDoList( toDo );
            fragment.appendChild( liElem );    // PRZYPISANIE TREŚCI Z OSOBNA
        }   
        if ( ( allOrDoneOrUndone == 'done' ) && toDo.done ) {  // dopisanie TYLKO "ZAKOŃCZONYCH" elementów  
            liElem = buildLiItemFromToDoList( toDo );
            fragment.appendChild( liElem );   
        }
        if ( ( allOrDoneOrUndone == 'undone' ) && !toDo.done ) {  // dopisanie TYLKO "TRWAJĄCYCH" elementów  
            liElem = buildLiItemFromToDoList( toDo );
            fragment.appendChild( liElem );  
        }
        // console.log('FRAGMENT <LI>: ', liElem);
        // fragment.appendChild( liElem );   // !!! jedno przypisanie po warunkach TO NIE TO SAMO, MIMO WSZYSTKO TAK NIE DZIAŁA!
            // ... jeśli to TU damy to przypisanie zawartości do fragmentu nie jest jednakowe, w IE to wygeneruje "HierarchyRequestError" :/ 
        // DZIURA W ALGORYTMIE MYŚLOWYM ... jedno dopisanie elementu do tymczasowej "listy"; któryś powyższy wariant musi się wykonać (NIET!!!!) 
    }); // forEach-END

    wholeToDoList.innerHTML = '';   // zerowanie zawartości kontenera przed wstawieniem zgrupowanej treści
    
    //if ( existingToDos.length > 0 ) // ... potrzebne TO WARYNKOWANIE?!
    wholeToDoList.appendChild( fragment );   // W IE i tak się pokazuje od nowa przy kasowaniu wszytkich ukończonych
     // wstawienie całego fragmentu wewnątrz istniejącego <ul>... ZAWSZE czy WARUNKOWAĆ 
    }   // if-( existingToDos.length <= 0 )-END
}   // displayWholeToDoList-END

function findIndexOfCurrentElement ( actionElem ) {
    var 
    //actionElem = someElem.target,   // przycisk "Usuń" || chceckbox [ ] | [x]

    actionElemType = actionElem.tagName.toLowerCase(),  // tu te same treści, do wyboru: .tagName == .nodeName; też (+) za ogólną postać elementu źródłowego
    
    parentPElem = actionElem.parentNode.parentNode,  // dwa razy w górę, by dotrzeć do przodka-<p>, względem bieżącego checkboksa lub buttona 
    currentToDoName = parentPElem.firstChild.textContent,    // treść tekstowa bieżącego zadania: dwukrotna podróż w górę do kontenera-rodzica, by odczytać TYLKO treść tekstową 
    currentToDoCheckboxState,   // stan "zaznaczenia" przycisku
    // currentBtn,     // wyzwlacz kasowania bieżącego zadania
    currentCheckbox,  // przycisk [X] lub [ ], który określa stan zadania
    currentToDoOffset,    // indeks wciśniętego przycisku "Usuń" względem wszystkich wyświetlonych przyciskó usuwania (stan przed lub w chwili naciskania!)
    matchedList,
    indexFound;

        if ( actionElemType === "button" ) {    // względem naciśniętego przycisku "Usuń"
            currentCheckbox = actionElem.parentNode.getElementsByTagName('input')[0];  // wyszukiwanie sąsiedniego przycisku [X], by następnie odczytać jego status
            // if ( currentCheckbox ) currentToDoCheckboxState = !!currentCheckbox.getAttribute('checked'); // !!!: "!!" & "checked" != "selected"
        }
        if ( actionElemType === "input" ) {     // z powodu zaznacznie lub odznaczenia "checkboksa" - akcji zmiany stanu na tym elemencie 
            currentCheckbox = actionElem;
            // currentToDoCheckboxState = !!currentCheckbox.getAttribute('checked'); // !!!: "!!" & "checked"
         }
         currentToDoCheckboxState = !!currentCheckbox.getAttribute('checked'); // !!!: "!!" & "checked"
        
    // console.log("SZUKANIE - rodzic <p>:", parentPElem, ", sąsiad [ ]:", currentCheckbox, "stan:", currentToDoCheckboxState, "EVT_ELEM:", evt.target);
    currentToDoOffset = countOffsetOfCurrentElementFromAllDisplayedElements( actionElem ); // po prostu KTÓRY Z KOLEI jest "klinięty", względem pierwszego ze wszytkich wyświetlonych
    console.log("SZUKANIE: naciśnięto element '" + actionElemType + "' (status_done: " + currentToDoCheckboxState + "), który jest +", 
        currentToDoOffset, "względem początku wyświetlonej listy.");

/* TRZEBA: poszukiwać tekst, by wykryć pasujący element, by wykryć jego indeks w spisie, ALE nie operować tylko indeksem PIERWSZEGO ZNALEZIONEGO...
gdyż można kilka o identycznych treściach wprowadzić; wtedy zweryfikować zwracaną ilość... i odwołać się do kolejności przycisków "Usuń" 
(-) trochę kosztowniejsze, i wymaga dobrego algorytmu dopasowania (+) prawidłowe dopasowanie 
... (!) jednak dodatkowy atrybut jak "index" ZNACZNIE ułatwiłby robotę  
*/    
    matchedList = existingToDos.filter( function( toDoFromList ) {  // (+): bez problemu przeszukuje tablicę obiektów i zwraca pasujĄCY lub pasuJĄCE do wzorca
        return ( ( toDoFromList.name === currentToDoName ) && ( toDoFromList.done === currentToDoCheckboxState ) );    // gdy nazwa się zgadza wraz ze stanem zadania
        // ...lub "zgadzają", dla kilku IDENTYCZNIE wpisanych treści - może się pokrywać z kilkoma wpisami  
    });

        if ( matchedList.length == 1 ) {
            // usunięcie tego jednego elementu
        indexFound = existingToDos.indexOf( matchedList[0] );  // wyszukiwanie treścią jedynego zgodnego, by odnaleźć jego globalny indeks
        // existingToDos.splice( indexFound, 1 );   // USUNIĘCIE tego jednego rekordu z pamięci (listy)

// RETURN!!!
        return indexFound;  // zwróć wartość dla dowolnego elementu, jeśli NIE ISTNIEJE jego duplikat (ten sam OPIS TEKSTOWY oraz STAN WYKONANIA)
        }

        if ( matchedList.length > 1 ) { // kiedy są duplikaty (taka sama treść oraz ten sam stan wykonania)
            // uzwględnienie kolejności dla naciśniętego przycisku "Usuń" względem listy... 
            // ...przeszukanie każdego rekordu dla aktualnie wyświetlanej listy elmentów z wprowadzonymi identycznymi tekstami..,
            // ...by znaleźć tylko jeden pasujący --- szereg porówanań ODCZYTANEGO_BIEŻĄCEGO_ELEMENTU z każdym, aż znajdzie się pasujaca referencja!

            // !!! PONIŻEJ UŻYTA FUNKCJA WPROWADZIŁA MNÓSTO ZAMEISZANIA W ODSZUKANIU DOPASOWAŃ DLA WYŚWIETLONYCH ELEMENTÓW !!!
            // !!! "anomalia" odczytu zawartości podczas obsługi zdarzenia 'change" dla <inputa-checkbox>
            // !!! wartości odczytane RÓŻNIĄ SIĘ od ODCZYTANEGO W FUNKCJI RODZICA STANU <input>  
                    // parametry: eventElem, eventElemOffset, theList
            var additionalList = buildTemporaryListFromDisplayedElments( actionElem, currentToDoOffset ),  // tworzenie pomocniczej listy z zawartością z DOMu, dla łatwiejszego przelicznia 
                // elemText = additionalList[currentToDoOffset].name,    // treść znana z numer offsetu względem przycisków... ale to JUŻ ODCZYWANO WCZEŚNIEJ
                // elemStatus = additionalList[currentToDoOffset].done,
                identicalArrayPositions = [],
                // matchFound = false,
                // positionX,
                i,
                maxI,
                occurenceIndex;

            if ( actionElemType === "input" ) {
                // fixEventTargetValuesAfterReadingDOM(additionalList, actionElem, currentToDoOffset); // !!! BEZWZGLĘDNIE POTRZEBNE W NIEKTÓRYCH PRZEGLĄDARKACH
                ///... BO PO ODCZYCIE DOMu W RAMACH OBSŁUGI ZDARZENIA DOSTAJEMY JUŻ ZMIENIONY STAN ELEMENTU "PO" ZDARZENIU "CHANGE"!!! 
            }

// !!! BEZWZGLĘDNIE WYMAGANE Z UWAGI NA PRZESZUKIWANIE ELEMENTÓW, KTÓRE SĄ JUŻ W NOWYM STATUSIE WYKONANIA ZADANIA, TZN. JUŻ SĄ ZMIENIONE
// PO KLIKNIĘCIU NA TEN ELEMENT !!!
            // if ( actionElemType === "input" ) currentToDoCheckboxState = !currentToDoCheckboxState;     // !!! INFO POWYŻEJ !!!

            // wyszukiwanie "bieżącej wartości" w istniających elementach, czyli na których który z duplikatów został wskazany i aktywowany (wybrany)...
            for ( i = 0, maxI = additionalList.length; i < maxI; i++ ) { // poszukiwanie wszystkich duplikatów
                // if ( i === currentToDoOffset ) continue;
                // positionX = additionalList.indexOf( matchedList[0], startIndx );    // wyszukiwanie całego pasującego rekordu... ale to są inne obiekty 
                // positionX = additionalList.indexOf( { name: currentToDoName, done: currentToDoCheckboxState }, startIndx );  // też NIE_DOPASWOUJE... NIE_TE_SAME_OBIEKTY (!==)
                if ( ( additionalList[i].name === currentToDoName ) && ( additionalList[i].done === currentToDoCheckboxState ) ) {
                    identicalArrayPositions.push(i); // budowanie tablicy na listę indeksów, jako kolenych pozycji, gdzie występuje wielkrotnie ta szukana wartość
                    //positionX = i;
                    // if ( identicalArrayPositions.length === matchedList.length ) {   // numer klikniętego "Usuń" w wyświetlanej liście
                }
        //console.log("ZLICZANIE_DUPLIKATÓW dla danego {'" + currentToDoName + "', " + currentToDoCheckboxState + "} - FOR #" 
        //     + i + "/" + matchedList.length, additionalList[i] );   // "matchedList[0]" KŁAMIE!!! to WYGLĄDA tak samo, ale NIE JEST taki sam (NIE_IDENTYCZNY!!!)
            }
                // teraz porównywanie wartości offsetu względem istnienia jej wewnątrz zbudowanej krotności tablicy
            for (i = 0, maxI = identicalArrayPositions.length, occurenceIndex = -1; i < maxI; i++ ) {

                if ( identicalArrayPositions[i] == currentToDoOffset ) { // ?!
                    occurenceIndex = i + 1; // zwiększ o jeden, by operować jako N-tym wystąpieniem spośród wszystkich pozycji
                    break;
                }
            }
            
            // console.log("KROTNOŚĆ_ODNALEZIONA, (POZYCJA ostatniego elementu tablicy): ", identicalArrayPositions.length-1 );
            console.log("KROTNOŚĆ_ODNALEZIONA, (POZYCJA ostatniego elementu tablicy): ", occurenceIndex );
            console.log("DOPASOWANIA_DUPLIKATÓW:", identicalArrayPositions, "odnaleziona krotność (dł.tablicy):", identicalArrayPositions.length,
                     ", dodatkowa tablica:", additionalList);

                /* if ( identicalArrayPositions.length === 1 ) {    // gdy naciśnięto PIERWSZY przycisk, będący duplikatem
                currentPosition = existingToDos.indexOf( matchedList[0] );  // wyszukiwanie treścią PIERWSZEGO zgodnego, by odnaleźć jego globalny indeks
 
                var firstElem = wholeToDoList.getElementsByTagName('p')[currentToDoOffset];
                // firstElem.style.backgroundColor = "#cc9999";   // test działania dla tego wyboru - NIE WIDAĆ reakcji, bo JEST NADPISYWANIE WIDOKU na koniec 
                console.log("DOPASOWANO do PIERWSZEGO wystąpienia w głównej tablicy:", currentPosition, "przesunięcie +", currentToDoOffset,
                         "elem:", firstElem, "w <ul>", wholeToDoList);
                // existingToDos.splice(currentPosition, 1);   // usunięcie tego jednego rekordu z pamięci (listy)

                }
                else { */
            indexFound = findIndexOfNthOccurence( { name: currentToDoName, done: currentToDoCheckboxState }, occurenceIndex );   // !!! konkretne N-te wstąpienie, bez -1
            console.log("! DOPASOWANO do indeksu głównej tablicy:", indexFound);
                if ( indexFound !== -1 ) {  // zrób to tak, jak dla zwykłego przeglądania, czyli USUŃ TEN WSKAZANY PRZYCISKIEM ELEMENT  
                    // currentPosition = existingToDos.indexOf( matchedList[0] );  // wyszukiwanie treścią jedynego zgodnego, by odnaleźć jego globalny indeks
                    console.log("!!! DOPASOWANIE ZDUPLIKOWANEGO ELEMENTU", existingToDos[indexFound] , "o globalnym indeksie", indexFound);

                    return indexFound;  // zwrot KONKRETNEJ wartości indeksu globalnego, odwołując się do pozycji w spisie, gdy ISTNIEJE TAKIE SAMO ZADANIE wiele razy
                }
                /* }  */

/*                                                      // ( i <= maxI ) && ( i <= currentToDoOffset ) 
            for ( i = 1, maxI = matchedList.length; ( i <= maxI ) ; i++ ) {
                // if ( matchFound ) break;   // wyjście z pętli głównej, jeśli odnaleziono element, który pasuje do 
//                indexFound = findIndexOfNthOccurence( matchedList[0], maxI );    // i tak TE SAME WARTOŚCI w każdym polu tej tabeli  
                indexFound = findIndexOfNthOccurence( matchedList[0], i );    // i tak TE SAME WARTOŚCI w każdym polu tej tabeli  
                console.log("USUWANIE PO FILTROWANIU #", i, "elementNr:", indexFound); 
                // if ( ... ) break;
            }   */


/*         var matchFound = false;
            for ( var i = 0, maxI = matchedList.length; i < maxI; i++ ) {
                if ( matchFound ) break;   // wyjście z pętli głównej, jeśli odnaleziono element, który pasuje do 
                for ( var j = 0, maxJ = existingToDos.length; j < maxJ; j++ ) {
                    // if (   ) ....
                }

            }
            matchedList.forEach( function( matchElem, indx ) {

            });
            // ...
             */

        }
    console.log("DOPASOWANO:", matchedList, " (dla <p>:", parentPElem, " treść ", currentToDoName, ")" );
     
return -1;  // wystąpił "jakiś błąd", choć nie powinien się wydarzyć, skoro prędzej musi dojść do dopasowania przycisku względem jednego z wyświetlonych elementów        
}   // findIndexOfCurrentElement-END

function deleteThisToDo( evt ) {    // teraz gdy istnieje findIndexOfCurrentElement() to "używanie tego API to bajka..." ;)
var currentIndex = findIndexOfCurrentElement( evt.target );

    if ( currentIndex !== -1 ) existingToDos.splice(currentIndex, 1);   // !!! usunięcie tego jednego rekordu z pamięci (listy)
    else {
        // ...
    showNotification("BŁĄD: nie udało się USUNĄĆ elementu! Wystąpił nieokreślony błąd.");
    }
        // USUNIĘCIE W ZBIORZE i ponowne wyświetlenie całości
displayWholeToDoList( currentDisplayingListMode );  // wzięcie pod uwagę aktualnego trybu wyświetlania
}   // deleteThisToDo-END

function toggleDoneUndone( evt ) {  // z użyciem findIndexOfCurrentElement() dbamy o "środowisko programisty", poprzez użycie czystego kodu ;)
var currentIndex;

console.log("OBSŁUGA_CHANGE:", !!evt.target.getAttribute('checked') );
currentIndex= findIndexOfCurrentElement( evt.target );

    if ( currentIndex !== -1 ) existingToDos[ currentIndex ].done = !existingToDos[ currentIndex ].done; // zmiana - NEGACJA statusu aktualnego elementu listy na przeciwny
    else {
        // ...
    showNotification("BŁĄD: nie udało się ZMIENIĆ STANU elementu! Wystąpił nieokreślony błąd.");
    }
        // USUNIĘCIE W ZBIORZE i ponowne wyświetlenie całości
    // nie potrzeba odświeżać stanu całej listy TYLKO, gdy są wyświetlane WSZYSTKIE elementy! w innym wypadku powinny zniknąć, poprzez odświeżenie tego widoku 
    //... dla uproszczenia i małej liczby elementów to nie problem póki co, więc nie ma po co DODATKOWO WARUNKOWAĆ
displayWholeToDoList( currentDisplayingListMode );  // WYMAGA wzięcia pod uwagę aktualnego trybu wyświetlania, ale to chyba nie problem!
  
    // TYMCZASOWO CIAŁO TEJ FUNKCJI ZOSTAJE DO WERYFIKACJI, ALE PATRZĄC Z BOKU TO PODLEGA TO POD TEN SAM SZABLON "ZNAJDŹ POZYCJĘ I DZIAŁAJ", 
    // ...tak samno jak deleteThisToDo()

    /* var currentCheckbox = evt.target,
        parentPElem = currentCheckbox.parentNode.parentNode,  // dwa razy w górę, by dotrzeć do przodka-<p>, względem bieżącego checkboksa
        currentToDoName = parentPElem.firstChild.textContent, // TYLKO pierwsza napotkana treść tekstowa, bez innych dodatków tego kontenera 
        currentToDoCheckboxState = !!currentCheckbox.getAttribute('checked'), // !!!: "!!" & "checked"
        matchedList,
        currentPosition;

        console.log("ZMIANA STANU - rodzic <p>:", parentPElem, "stan:", currentToDoCheckboxState); */    
    /* TRZEBA: poszukiwać tekst, by wykryć pasujący element, by wykryć jego indeks w spisie, ALE nie operować tylko indeksem PIERWSZEGO ZNALEZIONEGO...
    gdyż można kilka o identycznych treściach wproawdzić; wtedy zweryfikować zwracaną ilość... i odwołać się do kolejności przycisków "Usuń" 
    (-) trochę kosztowniejsze, ale (+) prawidłowe dopasowanie 
    ... (!) jednak dodatkowy atrybut jak "index" ZNACZNIE ułatwiłby robotę */

    /*     matchedList = existingToDos.filter( function( toDoFromList ) {
            return ( ( toDoFromList.name == currentToDoName ) && ( toDoFromList.done == currentToDoCheckboxState ) );    // gdy nazwa się zgadza wraz ze stanem zadania
            // ...lub "zgadzają", dla kilku IDENTYCZNIE wpisanych treści - może się pokrywać z kilkoma wpisami  
        });

            if ( matchedList.length == 1 ) {
                // zmiana dla tego jednego elementu
            currentPosition = existingToDos.indexOf( matchedList[0] );  // wyszukiwanie treścią jedynego zgodnego, by odnaleźć jego globalny indeks
            existingToDos[ currentPosition ].done = !existingToDos[ currentPosition ].done; // zmiana statusu aktualnego elementu listy na przeciwny
                    // ustawić zmianę w konkretnym elemencie na globalnej liście -- bo inaczej widok odświeżony nie odnotuje tej zmiany
        */
            // PONIŻSZE JEST ZBYTECZNE Z UWAGI NA WYMUSZENIE ODŚWIEŻANIE CAŁEGO WIDOKU PO TEJ OPERACJI
        /*     if ( parentPElem.classList.contains('done') ) parentPElem.classList.remove('done');
            else parentPElem.classList.add('done');  */
    /*         }

            if ( matchedList.length > 1 ) {
                // uzwględnienie kolejności dla naciśniętego przycisku "Usuń" względem listy... 
                // ...przeszukanie każdego rekordu dla posiadanej listy elmentów z wprowadzonymi identycznymi tekstami

                // ...
            }
    */
        // nie potrzeba odświeżać stanu całej listy TYLKO, gdy są wyświetlane WSZYSTKIE elementy! w innym wypadku powinny zniknąć, poprzez odświeżenie tego widoku 
    // displayWholeToDoList( currentDisplayingListMode );  // WYMAGA wzięcia pod uwagę aktualnego trybu wyświetlania!
}   // toggleDoneUndone-END

function selectTypeOfToDos( evt ) {
var selectedTypeValue = evt.target.value;

    switch ( selectedTypeValue ) {      // displayingListMode = ['all', 'undone', 'done'] -- tryby przeglądania listy
        case 'done':
            currentDisplayingListMode = displayingListMode[2];  // 'done'
            break;
        case 'undone':
            currentDisplayingListMode = displayingListMode[1];  // 'undone'
            deleteNotifications();  // też usuń komunikaty, o ile jakiś się pojawił  
            break;
        case 'all':    
        default:    // na równi z "all" oraz każdą inną zmienioną w DOMie wartością (haker, chakier, czy inna bestia)
            currentDisplayingListMode = displayingListMode[0];  // wartość neutralna
            deleteNotifications();  // też usuń komunikaty, o ile jakiś się wcześniej pojawił
    }   
displayWholeToDoList( currentDisplayingListMode );  // zmień globalny tryb i odśwież listę widoku
}

function deleteAllDone( evtEl ) {
        // NIE POTRZEBA ROBIĆ TEJ "POPRAWKI" NA BLOKOWANIE TYPU INICJATORA, SKORO I TAK STUCZNIE JEST WYMUSZANE "kliknięcie"" <button> 
        //... PRZY "submicie" DRUGIEGO FORMULARZA - NIEZALEŻNIE CZY ENTER NA <input-radio> CZY na <button>ie
var evtElName = evtEl.target.tagName.toLowerCase();

   /* if ( evtElName === 'button') {  */   // poprawka na wyzwalacz kasowania... ma się wywoływać tylko na <button>, 
                    // ...a nie na "submit" formularza lub jego dowolny <input-radio> 
        console.log("!!! UWAGA ROZPOCZĘTO KASOWANIE ZAWARTOŚCI WSZYSTKICH ZADAŃ UKOŃCZONYCH !!! - wyzwalacz '" + evtElName + "'");
        // najłatwiej OD KOŃCA wywalać elementy (mniejsdzy wpływ na wydajność przy przeklejaniu dalszych elementów, ZA tym usuwanym) 
        for (var i = existingToDos.length - 1; i >= 0; i-- ) {
            if ( existingToDos[i].done ) existingToDos.splice(i, 1);   // gdy jest już coś wykonanego/ukończonego 
        }
        // PROBLEM Z KASOWANIEM... POKAZUJE SIĘ OD NOWA PEŁNA LISTA w IE i starych przeglądarkach... niejawny przycisk "submit" z <buttona> jest robiony
        // dlatego jego naciśnięcie jets traktowane jako "submit" dla drugiego formularza... po zablokowaniu reakacji na to zdarzenie jest OK  
    displayWholeToDoList( currentDisplayingListMode );  // po prostu wyświetl wynik po operacji usuwania
    /* } */
}

function addNewItem( evt ) {
    var newToDo = { name: "", done: false },   // kontener na przekazanie nowej wartości do listy zadań; + domyślne NIEUKOŃCZENIE na starcie dla nowych pozycji
        goodFormData = true;

    evt.preventDefault();   // blokowanie przesłania danych na serwer, tu to wysłanie-do-siebie i odświeżenie TEJ strony

        // submitDisabled = isDisabledStateOfSubmitBtn();  // tu weryfikacja na żądanie, która też może odblokować/zablokować wysyłanie formularza w logice JS 

        if ( !submitDisabled ) {    // checkInputLength() po każdym zmienianym znaku ustwia lub zeruje tę wartość   
        toDoText = simpleHTMLInputParser( newToDoInput.value );

            if ( toDoText === "" ) {  // to się nie ma prawa pokazać, poprzednia logika nie zezwala na wypuszczenie pustych pól 
            showNotification("BŁĄD: brak treści dla nowo wprowadzanej pozycji!");
            goodFormData = false;
            }

            if ( goodFormData ) {       // założenie, że to są już prawidłowe dane... zatem jakieś działanie
            newToDoInput.value = '';    // zerowanie pola wpisywanie treści 
            newToDoSubmitBtn.setAttribute('disabled', true);   // blokowanie elementów formularza
            // newToDoSubmitBtn.blur();       // usunięcie focusu z "submita"... choć przy użytej palecie to wcale nie wygląda na sukces ;)

            newToDo.name = toDoText;    // wprowadzenie pozyskanej nazwy (+ ewentualne podmianki treści) do nowego obiektu
            existingToDos.unshift( newToDo );   // wstawienie na początek listy    

                if ( currentDisplayingListMode == displayingListMode[2] ) { // 'done'
        // po dodaniu nie pojawi się na "filtrowanej liście", gdyż KAŻDE NOWE ZADANIE ma domyślny status FALSE! 
        // ... trzeba PODKREŚLIĆ PRAWIDŁOWĄ OPERACJĘ DODAWANIA NOWYCH TREŚCI dla niekompatybilnego widoku
                showNotification('Nową pozycję do zrobienia dodano, ale zobaczyć ją można dopiero po przełączniu się na każdy inny widok listy.');
                }
                else {
                displayWholeToDoList( currentDisplayingListMode );  // odświeżenie widoku
                deleteNotifications(); // czyszczenie z poprzedniego komunikatu lub komunikatów o błędzie danych wejściowych (o ile był wyświetlony)
                }
            }   // if-( goodFormData )-END
        }   // if-( !submitDisabled )-END
}   // addNewItem-END

function loadTestData() {
var testData = [
    { name: 'Nowy i zbędny zapychacz pierwszego miejsca ;)', done: false },
    { name: 'TEST IDENTYCZNEJ ZAWARTOŚCI', done: true },
    { name: 'TEST IDENTYCZNEJ ZAWARTOŚCI', done: true },
    { name: 'TEST IDENTYCZNEJ ZAWARTOŚCI', done: false },
    { name: 'TEST IDENTYCZNEJ ZAWARTOŚCI', done: true },
    { name: 'Spożywczak: chleb, nabiał, drożdże, sałata', done: false },
    { name: 'Stomatolog w poniedziałek (19:30!)', done: false },
    { name: 'Prezent dla Maćka na urodziny :)', done: true },
    { name: 'Ukończyć kurs GITa', done: false },
    { name: 'Wykonać projekt JS z rezerwacją miejsca w samolocie', done: true },
    { name: 'Kupić bilety do kina (seans na sobotę)', done: true },
    { name: 'Przepalona żarówka w lampce pokojowej, wybrać ciepłe światło', done: false },
    { name: 'TEST IDENTYCZNEJ ZAWARTOŚCI', done: true },
    { name: 'Sprawdzić auto, skonsultować pracę silnika z mechanikiem', done: false }
];

existingToDos = existingToDos.concat( testData );   // przypisanie do już istniejacych, by je... ZASTĄPIĆ przypisaniem 
}

function deleteLoadTestDataBtn() {      // jest funkcja nazwana, ale nie "trybi" w czasie pierwszej obsługi zdarzenia na tym samym elemencie  
    console.log("WYŁĄCZONO 'click' na DODATKOWYCH DANYCH");
    // i nie rób niczego więcej tu

    document.getElementsByClassName('to-do-container')[0].style.marginBottom = '1.5em';
    loadTestDataBtn.parentNode.removeChild(loadTestDataBtn);    // nie chcesz się wyrejestrować ze zdarzeń przed usunięciem... zatem znikaj! 
}