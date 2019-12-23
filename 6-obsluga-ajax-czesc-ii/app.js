$(function () {
    console.info('DOM zaladowany!');

/* Zadanie 1
Pod adresem https://holidayapi.com/ przechowywana jest baza świąt państwowych różnych krajów.
Aby z niej skorzystać trzeba wygenerować swój klucz API - wejdź na stronę i wygeneruj swój klucz.

Za pomocą metody ajax() wczytaj do listy ul wszystkie świąteczne daty jako elementy li.

Aby poprawnie wczytać dane, należy przekazać wymagane parametry, o których mowa na stronie. Daty mogą być tylko historyczne, 
tj. sprawdzanie świąt w roku bieżącym jest niemożliwe.

Każdą nazwę święta wczytaj do elementu li, jego datę również wczytaj do elementu li jako span.

Uwaga
Sprawdź w konsoli jak wyglądają wczytywane dane, aby ułatwić sobie ich obróbkę. 
*/

    // rozumiane jako "ajax()" z polecenia
function odpytajOKalendarzSwiat( rokSprawdzany ) {

    function komunikacjaUdana ( listaSwiat ) {
        var $nowyLI = '',
            $dataSPAN = '',
            $nowyUL = $('<ul>', { id: nowyUlId });

        $.each( listaSwiat, function( i, swieto ) {
            $nowyLI = $( "<li>" ).text( swieto.name );
            $dataSPAN = $( "<span>" ).text( swieto.date );
            $nowyLI.prepend( $dataSPAN );
            $nowyUL.append( $nowyLI );
        });     
                    // (+) WYDAJNOŚĆ +++ jeden zapis do DOMu witryny z podelementami, zamiast ich zwielokrotnienie
    return $nowyUL; // zwróc skonstruowany element UL z poszczególnymi treściami jako LI 
    }

    function komunikacjaNieudana () {   // teraz bez paraetrów

        $actionButton.removeAttr('disabled');
        $powiadamiacz.addClass('ajax-status-bad').text('Komunikacja nieudana! Powtórz zapytanie.');      
    }


    var mojKlucz = 'b2c5c216-8a9d-4d69-b212-dee92b15d6ea',  // jak to zataić?!
        kluczAPI = '&key=' + mojKlucz,  
        adresAPI = 'https://holidayapi.com/v1/holidays/',
        parametryAPI = '?pretty',
        krajAPI = '&country=PL',
        jezykAPI = '&language=PL',  // ta funkcja jest płatna :/
        rokAPI = "&year=" + rokSprawdzany,
        wszystkieParametryAPI = parametryAPI + krajAPI + rokAPI,    // sumowanie ciągu
        pelnyAdresAPI = adresAPI + wszystkieParametryAPI + kluczAPI;    // większe sumowanie ciągu
        nowyUlId = 'holiday-dates';
        //$nowyUL = $('<ul>', { id: nowyUlId });

    // oczekiwany format: https://holidayapi.com/v1/holidays?pretty&country=PL&year=2018&key=KEY_HERE
        // docelowy adres API dla otrzymania pełnego JSONa
    //var oczekiwanyCiag = 'https://holiday.api.com/v1/holidays?pretty&country=PL&year=2018&key=b2c5c216-8a9d-4d69-b212-dee92b15d6ea';
    // console.info( "adres API: ", pelnyAdresAPI );
    // console.info( "oczekiwany:", oczekiwanyCiag );  // jest OK

    var zapytanieAJAX = $.getJSON( pelnyAdresAPI )
        .done(function( daneOtrzymane ) {
            var swietaWPolsce = daneOtrzymane.holidays,
                $pelnaListaSwiat = komunikacjaUdana( swietaWPolsce );
        console.log( $pelnaListaSwiat );
        
        $miejsceDocelowe.empty().append( $pelnaListaSwiat );    // od razu też czyszczenie z przycisku i statutu
        })
        .fail( function() {
            komunikacjaNieudana();
            console.log( "AWARIA! Coś zdechło w zapytaniu lub odpowiedzi." );
        })

}   // odpytajOKalendarzSwiat-END

function dodajPoprzedniRokDoNaglowkaStrony( rok ) {
var $naglowekH2 = $('h2'),
    trescTekstowa = $naglowekH2.text() + " (niekoniecznie dni wolnych) w roku " + rok,  // aktualizacja odczytanego o zadany tekst z parametru
    $nowyH4 = $('<h4>').text("API nie obsługuje listy po polsku. Bynajmniej nie za darmo, tylko za $$$.");

    $naglowekH2.text( trescTekstowa );
    $naglowekH2.after( $nowyH4 );
}

//  #####   START LOGIKI  ##### 

var dataDzis = new Date(),
    rokPoprzedni = dataDzis.getFullYear() - 1,    // odczyt roku wcześniejszego niż bieżący (tylko na niego zezwala API)
    $actionButton = $('#holiday-checker'),
    $miejsceDocelowe = $('#holidays-placeholder'),
    $powiadamiacz = $('#notifier');

dodajPoprzedniRokDoNaglowkaStrony( rokPoprzedni );

    // nasłuchiwacz na kliknięcie - pojedynczy wyzwalacz na żądanie (dla sukcesu)  
$actionButton.on('click', function(){
    $listaSwiat = odpytajOKalendarzSwiat( rokPoprzedni );
    $(this).attr('disabled', true);
    $(this).next().removeClass('ajax-status-bad').show(300);
});

});
