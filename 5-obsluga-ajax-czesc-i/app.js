$(function () {
    console.info('DOM zaladowany!');

/* Zadanie 1
Zapoznaj się z plikami HTML i JavaScript. Wczytaj dane z adresu: http://swapi.co/api/films/. Przejdź przez zadanie korzystając z debuggera. Zwróć uwagę na to kiedy filmy zostają wczytane.

Przydatne informacje:
* użyj odpowiedniej metody HTTP
* użyj odpowiednich funkcji informujących użytkownika o statusie żądania (metody done(), fail() lub always())
* sprawdź w konsoli, jak wyglądają wczytywane dane
* jeśli dane zostaną poprawnie wczytane, wywołaj odpowiednią funkcję np. insertContent(), do której jako argument przekaż wczytane dane
* wewnątrz funkcji insertContent() przeiteruj po tablicy wyników
* wewnątrz pętli stwórz dwa elementy li oraz h3
* ustaw odpowiednią klasę na elemencie li
* do elementu h3 dodaj tytuł filmu
* wstaw element h3 do li, a następnie wszystko do listy ul
*/


function zapytanieAJAX( adres, elementStatusu ) {

    function prawidlowaOdpowiedzSerwera( daneOtrzymane ) {
        console.log("Jest OK:\n", daneOtrzymane);
        var paczkaDanych = daneOtrzymane.results;

        $statusZapytania.addClass('status-dobry');
        $naglowekStatusu.text('Odczytano prawidłowe dane');

        insertContent( paczkaDanych );  // wstawiaeni zawartości do elementu kontenera
    }

    function nieprawidlowaOdpowiedzSerwera( daneOtrzymane) {
        $statusZapytania.addClass('status-zly');
        $naglowekStatusu.text('Nie udało się odczytać danych, błąd nr ' + daneOtrzymane.status + ': "' + daneOtrzymane.statusText + '"');
            // tu można odczytać i wyświetlić stan zapytania (kod błędu)...
        console.log("NIEDOBRZE:\n", daneOtrzymane); // całość obiektu zwracanego w nieudanym zapytaniu

        $('.show-dates-btn:disabled').removeAttr('disabled');   // uaktywnianie ewentualnych WSZYSTKICH przycisków akcji!   
    }

    function insertContent( daneAJAX ) {
        var ileDanych = daneAJAX.length,
            $nowyUl = $('<ul>'),
            $nowyLi,
            $nowyH3;

            for (var i = 0; i < ileDanych; i++) {
            $nowyH3 = $('<h3>');
            $nowyH3.text( daneAJAX[i].title );
            $nowyLi = $('<li>', { "class": 'klasa-tytulu' });   // przydzial "jakiejś-klasy" z zadania
            $nowyLi.append( $nowyH3 );
            $nowyUl.append( $nowyLi );
            // console.log(i, daneAJAX[i]);
            }

            // tu znów weryfikacja, którego elementu dotyczy zmieniony poprawnie status -- funkcja "potomna", ma dostęp do danych rodzica
            if ( elementStatusu == "pierwszy" ) $('.repertuar').first().empty().append( $nowyUl );
            if ( elementStatusu == "drugi" ) $('.repertuar').last().empty().append( $nowyUl );
    }

var trescStatusu = "wywołano zapytanie, w trakcie...",
    ileJestKomunikatowStatusu,  // ile razy (bardziej jako "CZY?") wyświetlony jest dany komunikat o statusie
    $naglowekStatusu;   // konkretna treść tekstowa wewnątrz komunkatu 

    elementStatusu = elementStatusu || "pierwszy";  // weryfikacja istnienia drugiego parametru funkcji

        if ( elementStatusu == "pierwszy" ) {
        ileJestKomunikatowStatusu = $('.status-ajaksa').length;  
        $statusZapytania = (ileJestKomunikatowStatusu > 0 ) ? $('.status-ajaksa').first() 
                                                                : $('<div>', { "class": 'status-ajaksa' } );
        $naglowekStatusu = (ileJestKomunikatowStatusu > 0 ) ? $('.status-ajaksa').first().find('h4').text( trescStatusu ) 
                                                                : $('<h4>').text( trescStatusu );
            // powyżej weryfikacja ilościowa elementów dla wyświetlania statusu zapytania

        console.info('(1)', $statusZapytania );    
        // usunięcie ewentualnych klas dla powtórki naciśnięcia przycisku , teraz otrzymane dane po prawidłowej odpowiedzi usuwają przycisk wyzwalajacy zapytanie 
        $statusZapytania.removeClass('status-dobry status-zly').append( $naglowekStatusu );
        $('.repertuar').first().after( $statusZapytania ); // ".after()" by nie usunąc tej treści poprzez zwrócone treści

        var obiektZapytaniaAJAX = $.get( {    // zapis do zmiennej nie jest potrzebny, dalej nie ma odwołania do tego
            url: adres,
            method: 'GET',
            dataType: 'json',   // tu jawnie określono, domyślnie jest autodetekcja typu zwracanego
            success: prawidlowaOdpowiedzSerwera,
            error: nieprawidlowaOdpowiedzSerwera    // "error", a nie "failure"!!!  
        } );

        } else if ( elementStatusu == "drugi" ) {

        ileJestKomunikatowStatusu = $('.status-ajaksa-2').length;  // tu nowa/inna klasa dla elementu statusu, by je odróżnić między sobą
        $statusZapytania = (ileJestKomunikatowStatusu > 0 ) ? $('.status-ajaksa-2').first() 
                                                                : $('<div>', { "class": 'status-ajaksa-2' } );
        $naglowekStatusu = (ileJestKomunikatowStatusu > 0 ) ? $('.status-ajaksa-2').first().find('h4').text( trescStatusu ) 
                                                                : $('<h4>').text( trescStatusu );

        console.info('(2)', $statusZapytania );                                                                  
          // usunięcie ewentualnych klas dla powtórki naciśnięcia przycisku , teraz otrzymane dane po prawidłowej odpowiedzi usuwają przycisk wyzwalajacy zapytanie 
        $statusZapytania.removeClass('status-dobry status-zly').append( $naglowekStatusu ); // ta powtórka treści określa konkretne pole statusu
        $('.repertuar').last().after( $statusZapytania );   // odwołanie się do drugiego zestawu 

        var obiektZapytaniaAJAXJSON = $.getJSON( adres )  // też brak późniejszego odczytania lub zmiany tej zmiennej
            .done(function( daneZZapytaniaJSON ) {      // "daneZZapytaniaJSON" to cała zawartość otrzymana zwrotnie z serwera
                prawidlowaOdpowiedzSerwera( daneZZapytaniaJSON );
          })
            .fail(function( daneZZapytaniaJSON ) {    // "daneZZapytaniaJSON" to zawartość otrzymana z serwera, tu raczej statusy błędów
                nieprawidlowaOdpowiedzSerwera( daneZZapytaniaJSON );
          })
            .always(function() {
            // nicNieZrobieTeraz();
          });
        } 
}   // zapytanieAJAX-END


    // ###  elementy i zdarzenia  ####

var $przyciskWyzwalacz = $('.show-dates-btn').first(),    // lepiej poprzez .first() i .last() zamiast "first-of-type" i "last-of-type"
    $przyciskWyzwalacz2 = $('.show-dates-btn').last();    // drugi przycisk, tylko dla pokazania innej składni zapytania $.AJAX 

$przyciskWyzwalacz.on('click', function() {
    //var adresUrl = 'https://swapi.co/api/films/?format=json'; // domyślnie dane tam zwracane jako "JSON", raczej nie potrzeba parametryzować ale można
    var adresUrl = 'https://swapi.co/api/films/';

    $(this).attr('disabled', true); // blokowanie przycisku wyzwalającego przed kolejnym naciśnięciem, zanim pierwsze zapytanie się "jakoś" nie ukończy 
    zapytanieAJAX( adresUrl );
});

$przyciskWyzwalacz2.on('click', function() {
    var adresUrl = 'https://swapi.co/api/films/';   // można dopisać coś do adresu (jako nieistniejacy), by zaobserwować błędny status

    $(this).attr('disabled', true);
    zapytanieAJAX( adresUrl, "drugi" ); // "drugi" wyzwalacz jako wyróżnik dla "drugich" treści
});
    

});
