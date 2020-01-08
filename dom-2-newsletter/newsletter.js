/* 2. Newsletter
Stwórz dialog subskrypcji do newslettera; musi mieć miejsce na tytuł, treść, input na imię subskrybenta, 
input na e-mail subskrybenta, button "Subscribe" i miejsce na logo.
*/

var name = '',  // jako "globalne" pamiętanie wprowadzonych danych, co może być złudne!
    email = '',
    notificationElem,   // nie ma potrzeby tworzyć zmiennej, kosztowniejsze i prostsze jets każdorazowe zapytanie o ten element w DOMie
    nameInput = document.getElementById('any-name'),
    emailInput = document.getElementById('your-email'),
    submitBtn = document.getElementById('submit-subscr'),
    wholeForm = document.getElementById('subscription-form'),
    wholeSubscription = document.getElementsByClassName('subscription-container')[0];   // tylko pierwszy (jedyny) element listy! a nie całą kolekcję!!

//console.log("INPUT: " + nameInput + ", EMAIL: " + emailInput + ", SUBMIT: " + submitBtn + ", FORMA: " + wholeForm + ", DIV: " + wholeSubscription );

nameInput.value = '';   // zerowanie wpisanych wartości na starcie
emailInput.value = '';

wholeForm.addEventListener('submit', tryToSubmit, false);

function simpleHTMLInputParser( inputText ) {
    var trimmedText = inputText.trim();     // wywal wszelkie spacje i niedrukowalne przed i za tekstem z pole formularza 
    // return trimmedText.replace(/<[^>]*>?/gm, '');    // niestety nie przyjmuje tekstu za "<"
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

headerElem.appendChild( textElem );
notificationElem.classList.add('subscription-notification');    // to przypisanie zdefiniowanego wyglądu w CSSie 
notificationElem.appendChild( headerElem );

wholeSubscription.parentNode.appendChild( notificationElem );   // pośrednie przejście do rodzica i wstawienie za nim (na jego końcu) w DOMie strony
    
    // a teraz magia... czyli animacja w formie zmieniającego się tekstu .. ALE NIE DZIAŁA MECHANIZM OPÓŹNIEŃ jak oczekiwano (jeśli nie JEST ZMIENNY ;/ ) 

        for (var i = 0; i <= times; i++ ) {    // "i" jako  
        setTimeout(function() {
                if ( ( i % 2 ) == 0 ) postText += " ";  // coś się odstępy nie robią... i nie zorbią, bo to zawsze definicja dla 0 lub 6 :/
                else postText += ".";

            headerElem.innerText = textOfNotify + postText;
        }, delay + delay * i );     // "i" -- licznik , a nie ilość cykli! 
    }
                
    setTimeout(function() {
                            // usunięcie jakichkolwiek powiadomień oraz wcześniejszgo okna do wpisywania danych
    wholeSubscription.parentNode.removeChild( wholeSubscription );
    deleteNotifications();
    showNotification( subscriberData.name + ', dziękujemy Ci za zapisanie się do subskrybowania Naszych Powiadomień.', { text: 'Powrót do strony głównej', href: '#redirect-me'} );     // dodatkowy parametr!
    }, 
    2 * delay + delay * times); // czas odrobinę większy niż pętla z powiadomieniem powyżej... i tutaj łączna ilość razy jako opóźnienie
}

function showNotification( someText, anchorObj ) {
    //var existingErrorNotification = document.getElementsByClassName('error');

    // podejmij akcję ze wstawianiem elementu do DOMu, gdy nie istnieje ten element w strukturze  
    // if ( !existingErrorNotification || existingErrorNotification.length == 0 ) {  // z "var" nie ma blokowaści, ale już nie kopiuję powyżej pustych deklaracji zmiennych lokalnych poniżej
        //var textContent = "BŁĄD: nie podano wszystkich wymaganych danych dla subskrybcji lub dane nieoprawidłowe!"; // i tak są tworzone w tej funkcji, nie są zaś inicjowane
    var headerElem = document.createElement('h3'),
        textElem = document.createTextNode( someText ),
        notificationElem = document.createElement('div');

    headerElem.appendChild( textElem );
    notificationElem.classList.add('subscription-notification');    // to przypisanie zdefiniowanmego wyglądu w CSSie 
    // notificationElem.classList.add('error');    // a tu jako wyróżnik logiki, ale to chyba niepotrzebne skoro jeden cel powiadomień.. by zniknąć
    notificationElem.appendChild( headerElem ); 

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
    var existingErrorNotifications = document.getElementsByClassName('subscription-notification'),
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
                    location.reload(true);  // pobranie od nowa z serwera... ale to nie czyni tutaj za wiele zmian
                });
            }
        }
}

function tryToSubmit( evt ) {
    var personalData = {},
        goodFormData = true;

    evt.preventDefault();   // blokowanie przesłania danych na serwr, tu to wysłanie-do-siebie i odświeżenie TEJ strony

    name = simpleHTMLInputParser( nameInput.value );    // usuwanie ewentualnych tagów z treści, też skracanie długości pustych ciągów 
    email = simpleHTMLInputParser( emailInput.value );

    console.log("Odebrane treści: '" + name + "' i '" + email + "'");

    deleteNotifications(); // czyszczenie z poprzedniego komunikatu lub komunikatów o błędzie danych wejściowych

        if ( ( name == "" ) || ( email == "" ) ) {
        showNotification("BŁĄD: nie podano wszystkich wymaganych danych dla subskrybcji!");
        goodFormData = false;
        }
        
        // if ( email.indexOf('@') == -1 ) // niepełny i generalnie niewłaściwy warunek na istnienie prawidłowego adresu email.. ale uproszczenia bez regExpr 
            // a@b.cd ---> ( email.indexOf('@') < 1 ) || ( email.indexOf('.') < 3 ) ... )
        if ( ( email.indexOf('@') < 1 ) || ( email.lastIndexOf('.') < 3 ) || ( email.lastIndexOf('.') > (email.length - 3) ) ) {
        showNotification("BŁĄD: nieprawidłowy adres email!");
        goodFormData = false;
        }
        
        if ( goodFormData ) {       // założenie, że to są już prawidłowe dane... zatem jakieś działanie
        nameInput.setAttribute('disabled', true);   // blokowanie elementów formularza
        emailInput.setAttribute('disabled', true);
        submitBtn.setAttribute('disabled', true);
        submitBtn.blur();       // usunięcie focusu z "submita"... choć przy użytej palecie to wcale nie wygląda na sukces ;)

        personalData.name = name;
        personalData.email = email;

        showConfirmNotification( personalData );    // niby przesył wewnętrzny w oparciu o pozyskane konkretne dane
        sendToServer( personalData );     // jakaś funkcja, która przekaże powiadomienie o sukcesie działania oraz prześle dane na serwer
        }
}
