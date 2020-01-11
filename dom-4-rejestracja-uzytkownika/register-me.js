/* 4. Rejestracja użytkownika
Stwórz dialog rejestracji; musi mieć miejsce na logo, tytuł, input na login oraz input na
hasło ze wskaźnikiem siły hasła o trzech stopniach: weak (poziom startowy), average
(min. 8 znaków, min. 1 wielka litera) i strong (min. 12 znaków, min. 1 wielka litera, min.
1 cyfra). Przycisk Sign up ma być aktywny, gdy oba pola są wypełnione.
*/

var email = '',
    password = '',
    notificationElem,   // nie ma potrzeby tworzyć zmiennej, kosztowniejsze i prostsze jest każdorazowe zapytanie o ten element w DOMie
    submitDisabled = true,   // domyślna blokada na przesyłanie formularza (aby nie przekazać z kiepskim hasłem).. zwłaszcza poprzez [enter] w polu tekstowym 
    formRequiredFilledFields = {   // puste elementy ==> FALSE, blokujące wysłanie formularza jeśli nie posiadają treści
        emailField: false,
        passwordField: false
    },
    passwordQuality = {
        minLength: 6,       // minimalna długość
        maxLength: 35,      // maksymalna długość
        currentLength: 0,    // aktualna długość wpisanego ciągu znaków w pole tekstowe/hasła 
        smallLetter: false,     // czy użyto choć jednej MAŁEJ_LITERY
        uppercaseLetter: false, // czy użyto choć jednej WIELKIEJ_LITERY
        digitLetter: false,     // czy użyto co najmnniej jednej CYFRY
        specialCharLetter: false,    // wystąpił jakikolwiek ZNAK_SPECJALNY,
        passwordStage: 0    // status do powiadomienia graficznego, albo użyć zewnętrznej zmiennej
    },
    elemEmailId = 'your-email', // wartości pól z "*Id" używane w podległych zakresowi funkcjach
    elemPassId = 'your-pass',
    elemSubmitButtonId = 'register-me',
    elemFormID = 'registration-form',
    elemRegistartionComponentClass = 'registration-container',

    emailInput = document.getElementById( elemEmailId ),
    passInput = document.getElementById( elemPassId ),
    submitBtn = document.getElementById( elemSubmitButtonId ),
    allPasswordStrengthNotifierLamps = document.getElementsByClassName('password-strength')[0].getElementsByTagName('li'),  // wszystkie LI wewnątrz konkretnego kontenera  
    weakStrengthNotifierLamp = document.getElementsByClassName('weak')[0],
    averageStrengthNotifierLamp = document.getElementsByClassName('average')[0],
    strongStrengthNotifierLamp = document.getElementsByClassName('strong')[0],
    wholeForm = document.getElementById( elemFormID ),
    wholeRegistration = document.getElementsByClassName( elemRegistartionComponentClass )[0];   // tylko pierwszy (jedyny) element listy! a nie całą kolekcję!!

//console.log("INPUT: " + passInput + ", EMAIL: " + emailInput + ", SUBMIT: " + submitBtn + ", FORMA: " + wholeForm + ", DIV: " + wholeRegistration );


    // ======  STARTOWE DZIAŁANIE  ======

emailInput.value = '';  // zerowanie wpisanych wartości na starcie
passInput.value = '';
passInput.setAttribute('maxlength', passwordQuality.maxLength);     // na starcie  ograniczamy rozmiar wpisywanych danych do pola hasła 
submitBtn.setAttribute('disabled', true);   // oraz na starcie blokowanie wysłania formularza poprzez click.. co nie znaczy, ze [enetrem] lub [spacją] nie da się wysłać ;)

    // ======  ZDARZENIA  ======

emailInput.addEventListener('input', function( evt ) {
    checkInputLength( evt.target );   // weryfikacja długości/istnienia wpisango tekstu
}, false);

passInput.addEventListener('input', function( evt ) {
    checkInputLength( evt.target );   // jak długi jest wpisany tekst
    fixPasswordFieldMaxLength( evt.target ); 
    evaluatePassword( evt.target );     // <-- tu druga funkcja do sprawdzania jakości hasła, BEZ WYŚWIETLANIA jego stanu w formie graficznej 
        // kolejne też potrzebne, czy w poprzedniej budować rozbudowaną logikę? 
    turnOnLamp( passwordQuality.passwordStage );    // tu WIZUALIZACJA, przeniesione z funkcji powyższej, by "bardziej czyste funkcje były
                                                    // + operowanie na obiekcie globalnym, jako parametr
}, false);

wholeForm.addEventListener('submit', tryToSubmit, false);


    // ======  FUNKCJE  ======

function simpleHTMLInputParser( inputText ) {
    var trimmedText = inputText.trim();     // wywal wszelkie spacje i niedrukowalne przed i za tekstem z pole formularza 
    // return trimmedText.replace(/<[^>]*>?/gm, '');    // nie przyjmuje tekstu za "<"
    return trimmedText.replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;');     // po prostu zastąp wszystkie znaczkiki tagów treścią bezpieczną dla HTMLa  
}

function showConfirmNotification( subscriberData ) {
var headerElem = document.createElement('h3'),
    textOfNotify = "Trwa wysyłanie żądania",
    textElem = document.createTextNode( textOfNotify ),
    notificationElem = document.createElement('div'),
    times = 6,
    delay = 500,
    postText = ".";
//    i = 0;  // licznik iteracji do pętli wewnętrznej!!!

headerElem.appendChild( textElem ),
notificationElem.classList.add('notification');    // to przypisanie zdefiniowanmego wyglądu w CSSie 
notificationElem.appendChild( headerElem );

wholeRegistration.parentNode.appendChild( notificationElem );   // pośrednie przejście do rodzica i wstawienie za nim (na jego końcu) w DOMie strony
    
    // a teraz magia... czyli animacja w formie zmieniającego się tekstu .. ALE NIE DZIAŁA MECHANIZM OPÓŹNIEŃ jak oczekiwano :/ !!!!!! 
            //  podobno LET i CONST rozwiązują ten probem :)

        for (var i = 0; i <= times; i++ ) {    // "i" jako  
        setTimeout(function() {
                if ( ( i % 2 ) == 0 ) postText += " ";  // coś się odstępy nie robią... i nie zorbią, bo to zawsze definicja dla 0 lub 6 :/
                else postText += ".";

            headerElem.innerText = textOfNotify + postText;
        }, delay + delay * i );     // "i" -- licznik , a nie ilość cykli! 
    }
                
    setTimeout(function() {
                            // usunięcie jakichkolwiek powiadomień oraz wcześniejszgo okna do wpisywania danych
    wholeRegistration.parentNode.removeChild( wholeRegistration );
    deleteNotifications();
    showNotification('Dziękujemy za rejestrację w Naszym Serwisie. ', { text: 'Powrót do strony głównej', href: '#redirect-me'} );     // dodatkowy parametr!
    }, 
    2 * delay + delay * times); // czas odrobinę większy niż pętla z powiadomieniem powyżej... i tutaj łączna ilość razy jako opóźnienie
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
    // notificationElem.classList.add('error');    // a tu jako wyróżnik logiki, ale to chyba niepotrzebne skoro jeden cel powiadomień.. by zniknąć
    notificationElem.appendChild( headerElem ); 
        if ( positionOfErrorText >= 0 ) notificationElem.style.borderColor = 'red'; // wstawi w czerwonej ramce każdy tekst polskiego błędu

    document.documentElement.appendChild( notificationElem );   // pośrednie przejście do rodzica i wstawienie za nim (na jego końcu) w DOMie strony
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

function sendToServer( someData ) {
    // zrób coś z wpisanymi danymi i przekaż je serwerowi

    // ... tutaj właściwa pseudo wysyłka się właśnie odbyła :)
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

function checkInputLength( eventElem ) {    // ustawianie bądź zerowanie wskaźnika uzupełnienia elementu treścią
                                // ...operuje na wyższych w hierarchii zmiennych (tu odwołanie do dwóch globalnych) 
    if ( eventElem.id == elemEmailId ) {     // pole emaila/loginu
    console.log("Pole '" + eventElem.id + "' zajmuje " + eventElem.value.length + " znaków (zawartość: '" + eventElem.value + "').");
        if ( eventElem.value.length > 0 ) formRequiredFilledFields.emailField = true;
        else  formRequiredFilledFields.emailField = false;
    }

    if ( eventElem.id == elemPassId ) {      // pole hasła
    console.log("Pole '" + eventElem.id + "' zajmuje " + eventElem.value.length + " znaków (zawartość: '" + eventElem.value + "').");
        if ( eventElem.value.length > 0 ) formRequiredFilledFields.passwordField = true;
        else  formRequiredFilledFields.passwordField = false;
    }
            // !!! poniżej od razu kolejny etap weryfikacji: globalna_zmienna_statusowa się ustawia/zeruje, gdy uzupełnimy znakiem drugie z pól formularza 
    submitDisabled = isDisabledStateOfSubmitBtn();   // sprawdź, czy przycisk submit może być aktywawany/de~ i ustal mu właściwy atrybut
            // wywołanie modyfikuje też zmienną statusową, która blokuje lub nie zdarzenie "submit" (z klawiatury, będąc w dowolnym z pól formularza)
}

function fixPasswordFieldMaxLength( passwordInputElem ) {
var passwordInputMaxLength = Number( passwordInputElem.getAttribute('maxlength') ) || 1;    // odczytana wartość lub jakaś wartość mniejsza od zadanego maksimum 
    // warunkowe nadanie atrybutu "maxlength" z odpowiednią wartością, gdyby został usunięty w DOMie (w narzędziach administracyjnych przez usera) 
    if ( ( !passwordInputElem.hasAttribute('maxlength') ) || ( passwordInputMaxLength < passwordQuality.maxLength ) ) passwordInputElem.setAttribute('maxlength', passwordQuality.maxLength);
}

function isDisabledStateOfSubmitBtn() { // tylko odniesienie graficzne oraz ewentualna zmiana stanu przycisku (nie całej formy)
var stillDisabledSubmitStatus;

    if ( formRequiredFilledFields.emailField && formRequiredFilledFields.passwordField ) {
    submitBtn.removeAttribute('disabled');
    stillDisabledSubmitStatus = false;
    }
    else {
    submitBtn.setAttribute('disabled', true);
    stillDisabledSubmitStatus = true;
    }
return stillDisabledSubmitStatus;    // na stronie przycisk staje się aktywny/zablokowany oraz zwracany wynik tego zapytania
} 

function testForLowercaseChar( someText ) {
    var lowercase = /.*[a-z]/;
    return lowercase.test( someText );
}

function testForUppercaseChar( someText ) {
    var uppercase = /.*[A-Z]/;
    return uppercase.test( someText );
}

function testForDigitChar( someText ) {
    var digit = /.*\d/;
    return digit.test( someText );
}

function testForSpecialChar( someText ) {
    var special = /[^\w\*]/;    // !!! nie przyjmuje "*" jako znaku specjalnego, ale całą resztę oraz polskie "ogonki" jak najbardziej 
    return special.test( someText );
}

function evaluatePassword( passwordInputElem ) {    // tu pozwalamy na dowolną zawartość, ale tylko w założonym zakresie długości tekstu
/*  passwordQuality = {
        minLength: 6,       // minimalna długość
        maxLength: 20,      // maksymalna długość
        currentLength: 0,    // aktualna długość wpisanego ciągu znaków w pole tekstowe/hasła 
        smallLetter: false,     // czy użyto choć jednej MAŁEJ_LITERY
        uppercaseLetter: false, // czy użyto choć jednej WIELKIEJ_LITERY
        digitLetter: false,     // czy użyto co najmnniej jednej CYFRY
        specialCharLetter: false,    // wystąpił jakikolwiek ZNAK_SPECJALNY
        passwordStage: 0        // status do powiadomienia graficznego, albo użyć zewnętrznej zmiennej
    }  */
var passwordText = passwordInputElem.value;     // przejęcie wartości tekstu z bieżącego formularza

passwordQuality.currentLength = passwordText.length;     // wpisanie bieżącej długości znaków z pola formularza
                    // tutaj więcej operacji na tekście, aby ustawić hasłu wszystkie statusy
passwordQuality.smallLetter = testForLowercaseChar(passwordText );
passwordQuality.uppercaseLetter = testForUppercaseChar( passwordText );
passwordQuality.digitLetter = testForDigitChar( passwordText );
passwordQuality.specialCharLetter = testForSpecialChar( passwordText );

    if ( isRightPasswordLength() ) {     // [6..35] i nie więcej znaków i zaświecanie pierwszej "lampki"; warunek wcześniej: ' || ( passwordQuality.currentLength > passwordQuality.maxLength ) ) {' 
        // ZMIENIĆ WARUNEK NA WYŻSZY ZAKRES< ALE ŻEBY GO NIE WYDŁUŻAŁ PONAD PRZEDZIAŁ 
            //... dwa razy jest weryfikowany warunek: najpierw na status, później względme statusu się zapala lub gaśnie wizualizacja :/

    passwordQuality.passwordStage = 1;  // jesli coś wpisano na minimum (6 znaków), to próg +1 względem niczego
 
            // operowanie na wartościach atrybutów statusu, nie na wywoływaniu funcji tutaj
                // ...by nie przeszukiwać podobnego zakresu dwa razy -- ale jednak trzeba, bo się wyklucza złożoność z mniejszym zakresem
                //...i mniejszy musi być najpierw, bo zakrywa szerszy zakres (albo zanegować warunki) 
        if ( passwordQuality.currentLength >= 8 ) {     // i po dwie dowolne grupy z czterech możliwych (warianty w parach każdy z każdym == 6 w tej KOMBINACJI)
            // if ( passwordQuality.smallLetter && passwordQuality.uppercaseLetter && passwordQuality.digitLetter ) // <-- to stary warunek 
            if ( ( passwordQuality.smallLetter && passwordQuality.uppercaseLetter )     // "kombinacja" - bo kolejność nieistotna w regule
                || ( passwordQuality.smallLetter && passwordQuality.digitLetter )       // ...choć "optymalnie" by było, gdy pierwsza część warunku "()" się od razu spełni dla OR 
                || ( passwordQuality.smallLetter && passwordQuality.specialCharLetter )
                || ( passwordQuality.uppercaseLetter && passwordQuality.digitLetter ) 
                || ( passwordQuality.uppercaseLetter && passwordQuality.specialCharLetter )
                || ( passwordQuality.digitLetter && passwordQuality.specialCharLetter ) )
            passwordQuality.passwordStage = 2;     // !!! - ale lepiej powyższy warunek zapisać za wariantami grup, bo ni łapie znaków specjalnych
        }

        if ( passwordQuality.currentLength >= 12 ) {    //tu łatwiej określić, bo wszystkie grupy mają być 
            if ( passwordQuality.smallLetter && passwordQuality.uppercaseLetter && passwordQuality.digitLetter && passwordQuality.specialCharLetter )
            passwordQuality.passwordStage = 3;      // !!!
        }   // czy hasło zawiera jakieś małe/duże/ litery, ma zmieniony zakres i jest w "globalnym" zakresie

    // turnOnLamp( passwordQuality.passwordStage );    // NIE-"czyty kod", lepiej przenieść wizualizację do osobnej funkcji... czyli uruchomić jawnie po określeniu stanów 
    }
    else {  // gaszenie wszystkich "kontrolek"
    passwordQuality.passwordStage = 0;
    // turnOffLamps();      // wywołania wbrew metodyce "czystego kodu"    
    }
    console.log(passwordQuality);
}

function turnOnLamp( status ) {

    switch (status) {
        case 0:
                turnOffLamps();     // "zgaś" wszystkie
            break;
    
        case 1:
                turnOffLamps();     // "zgaś" wszystkie, by od razu zapalić pierwszą z nich (może być zmniejszenie poziomu!)
                weakStrengthNotifierLamp.classList.add('ok');
            break;

        case 2:
                turnOffLamps();
                weakStrengthNotifierLamp.classList.add('ok');
                averageStrengthNotifierLamp.classList.add('ok');
            break;

        case 3:
                    // tu nic nie gasimy, tylko zapalamy wszystkie wskaźniki od razu
                weakStrengthNotifierLamp.classList.add('ok');   // ...mimo wszystko dwa pierwsze elementy powinny zawierać już tą klasę  
                averageStrengthNotifierLamp.classList.add('ok');
                strongStrengthNotifierLamp.classList.add('ok'); // zasadnicze dodanie
            break;

        default: 
                turnOffLamps();
            break;
    }
}

function turnOffLamps() {
    var three = allPasswordStrengthNotifierLamps.length;    // gdyby ktoś usuwał elementy w narzędziach administartorskich...

    for (var i = 0;  i < three; i++ ) {
        allPasswordStrengthNotifierLamps[i].classList.remove('ok');
    }
}


function isRightPasswordLength() {
    if ( ( passwordQuality.currentLength >= passwordQuality.minLength ) 
        && ( passwordQuality.currentLength <= passwordQuality.maxLength ) ) return true; 
return false;
}

function tryToSubmit( evt ) {
    var personalData = {},
        goodFormData = true;

    evt.preventDefault();   // blokowanie przesłania danych na serwer, tu to wysłanie-do-siebie i odświeżenie TEJ strony

        submitDisabled = isDisabledStateOfSubmitBtn();  // tu weryfikacja na żądanie, która też może odblokować/zablokować wysyłanie formularza w logice JS 

        if ( !submitDisabled ) {   
        email = simpleHTMLInputParser( emailInput.value );
        // password = simpleHTMLInputParser( passInput.value );    // usuwanie ewentualnych tagów z treści, też skracanie długości pustych ciągów 
            // nie można użyć skracania tekstów z pustych znaków != NIERÓWNOWAŻNE z tym, co się wcześniej podało znak po znaku 
            //  (-) ewidentnie się zmieni długośc tekstu: podmina tagów na bezpieczne wydłuży, obcięcie odstępów skróci tekst wynikowy
            //  (-) jakoś przyjąć wszystko od usera (źle!), lepiej je włączyć do hasła... ale ograniczyć wielkość przyjmowanego ciągu tekstowego
            //...i tak nie są te dane póki co używane, nigdzie się ich nie umieszcza i nie przetwarza (jeszcze!)   
        password = passInput.value.substring(0, passwordQuality.maxLength);     // zastanowić się nad warunkiem, tu ewentualnie skróci tekst do maksimum akceptowalnego poziomu

        console.log("Odebrane treści - email: '" + email + "' i pass: '" + password + "'");

        deleteNotifications(); // czyszczenie z poprzedniego komunikatu lub komunikatów o błędzie danych wejściowych (o ile był wyświetlony)

            if ( ( email == "" ) || ( password == "" ) ) {  // to się nie ma prawa pokazać, poprzednia logika nie zezwala na wypuszczenie pustych pól 
            showNotification("BŁĄD: nie podano wszystkich wymaganych danych dla rejestracji w serwisie!");
            goodFormData = false;
            }

            // if ( email.indexOf('@') == -1 ) // niepełny i generalnbie niewłaściwy warunek na istnienie prawidłowego adresu email.. ale uproszczenia bez regExpr 
                // a@b.cd ---> ( email.indexOf('@') < 1 ) || ( email.indexOf('.') < 3 ) ... )
            if ( ( email.indexOf('@') < 1 ) || ( email.lastIndexOf('.') < 3 ) || ( email.lastIndexOf('.') > (email.length - 3) ) ) {
            showNotification("BŁĄD: nieprawidłowy adres email!");
            goodFormData = false;
            }

            if ( !isRightPasswordLength() ) {   // ma być w zakresie
            showNotification("BŁĄD: nieprawidłowa długość hasła (wpisano " + passwordQuality.currentLength + " znak/znaki/znaków)!");
            goodFormData = false;
            }

            if ( goodFormData ) {       // założenie, że to są już prawidłowe dane... zatem jakieś działanie
            passInput.setAttribute('disabled', true);   // blokowanie elementów formularza
            emailInput.setAttribute('disabled', true);
            submitBtn.setAttribute('disabled', true);
            submitBtn.blur();       // usunięcie focusu z "submita"... choć przy użytej palecie to wcale nie wygląda na sukces ;)

            personalData.password = password;
            personalData.email = email;

            showConfirmNotification( personalData );    // niby przesył wewnętrzny w oparciu o pozyskane konkretne dane
            sendToServer( personalData );     // jakaś funkcja, która przekaże powiadomienie o sukcesie działania oraz prześle dane na serwer
            }
        }
}   // tryToSubmit-END