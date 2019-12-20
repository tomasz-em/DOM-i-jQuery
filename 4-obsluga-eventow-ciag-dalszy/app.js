$(function () {
    console.info('DOM zaladowany!');

/*  Zadanie 1
Stwórz element div z klasą panel i wstaw go za sekcją people. Dodaj mu dowolny tekst, a następnie ukryj ten tekst. 
Ustaw na elemencie event, który po najechaniu na ten div pokaże ukryty tekst.
*/

    // bez kombinowania z bezwzględnym pozycjonowaniem i odczytywaniem pozycji kursora
$tresciWstepnieUkryte = $('<div>', { class: 'ukryte' });   // nowa klasa, domyślnie niewidoczny element od razu
$tresciWstepnieUkryte.html('<h3>... nic z tego nie będzie! Nie podam jak trafić w Tajemnicze Miejsce!</h3><p>No dobra - mała podpowiedź, że trzeba iść 127 kroków prosto od Złamanego Drzewa w kierunku Wyschniętej Studni ;)</p>')
$panel = $('<div>', { class: 'panel' }).html('<h2>Mapa do skarbu jest ukryta w ... <span>(wskaż mnie kursorem) [mouseenter i mouseleave]</span></h3>');
$elementWczesniejszy = $('.people');

    // budowanie całości elementów krok po kroku (mnóstwo wariantów dla kolejności, ważne by na końcu do istniejącego elementu strony dodać jeden element z zawartością) 
    $( $tresciWstepnieUkryte ).appendTo( $panel );
    $( $elementWczesniejszy ).after( $panel );
    $panel.on('mouseenter', function(evt) {    // zdarzenie 'MOUSEENTER' na WEJŚCIE kursora w  obszar elementu rodzica

        $tresciWstepnieUkryte.show(100);
        console.log( "pokazuję się", $tresciWstepnieUkryte );
        // evt.stopPropagation();   // teraz to niczemu nie służy (podejrzenie wielkorotności wywoływania zdarzeń)

    /*      if ( !($panel.is(':animated') ) )   // to nie jest CHYBA poprawny warunek na "nieskakanie", które może zaistnieć w pewnych ruchach kursora i pozycji względem elementu rozwijanego
                // dodatkowym WIELKIM (-) jest DODANIE KOLEJNEJ "KOPII" WYWOŁANIA ZDARZENIA "mouseleave", za każdym pokazaniem elemeentu 
                // --- WIELOKROTNE WYWOŁANIE po zabraniu kursora z elementu!!!             
            $panel.on('mouseleave', function(e) {    // zdarzenie 'MOUSELEAVE' na WYJŚCIE kursora w  obszar elementu rodzica (+ obszar dzicka się wlicza)
                $tresciWstepnieUkryte.hide(100); 
                console.log( "ukrywam się", $tresciWstepnieUkryte );
                e.stopPropagation();
            });        */
    });

        // naprostsza definicja zdarzenia z zabraniem kursora myszy
    $panel.on('mouseleave', function(e) {    // zdarzenie 'MOUSELEAVE' na WYJŚCIE kursora w  obszar elementu rodzica (+ obszar dzicka się wlicza)
        $tresciWstepnieUkryte.hide(100); 
        console.log( "ukrywam się", $tresciWstepnieUkryte );
        // e.stopPropagation();
    });

// ---- to samo, ale poprzez funkcję dla zdarzenia HOVER() ----

    $tresciWstepnieUkryte2 = $('<div>', { class: 'ukryte' });   // nowa klasa, domyślnie niewidoczny element od razu
    $tresciWstepnieUkryte2.html('<h3>... w Ruinach Zamczyska ani na wyspie Bagnistego Jeziora, ani w Żelaznej Jaskini</h3><p>Nic więcej z siebie nie wyduszę, ni grama pomocy!</p>')
    $panel2 = $('<div>', { class: 'panel' }).html('<h2>Tej mapy nie odnajdziesz w ... <span>(wskaż mnie kursorem) [hover()]</span></23>');
    // $elementWczesniejszy = $('.people');
    $( $tresciWstepnieUkryte2 ).appendTo( $panel2 );
    $( $panel ).after( $panel2 );   // wstaw drugi "tymczasowy" panel, za już wygenerowanym

    $panel2.hover(function () {     // jedna definicja, ale dwa stany obejmuje (PIERWSZY dla kursora wchdzącego w element, DRUGI gdy opuszcza go)
        $tresciWstepnieUkryte2.show(100);
        console.log( "HOVER (1) pokazuję się", $tresciWstepnieUkryte2 );
    }, 
    function() {
        $tresciWstepnieUkryte2.hide(100); 
        console.log( "HOVER (2) ukrywam się", $tresciWstepnieUkryte2 );
    });

/*  Zadanie 2
Znajdź w pliku index.html element o klasie people. Wykonaj w niej następujące czynności:
* dodaj przycisk Usuń do wszystkich istniejących i nowo powstałych elementów li
* napisz funkcję, która po kliknięciu w przycisk Usuń – usunie element z listy
* dodaj przycisk Edytuj do wszystkich istniejących i nowo powstałych elementów li
* napisz funkcję, która po kliknięciu w przycisk Edytuj umożliwi edycję elementu. W trakcie edycji zmień tekst przycisku z Edytuj na Zatwierdź.
     Po klinięciu w Zatwierdź zakończ edycję.    
*/

function utworzPrzyciskUsun () {
    return $('<button>', { class: klasaPrzyciskuUsun }).text('Usuń');   // brak odniesienia do CSS, klasa pod logikę JS
}

function utworzPrzyciskEdytuj ( etykietaPrzycisku ) {
var etykietaPrzycisku = etykietaPrzycisku || 'Edytuj';  // sposób na parametry wg Starego Dobrego JS
$nowyPrzyciskEdytuj = $('<button>', { class: klasaPrzyciskuEdytuj });   // brak odniesienia do CSS, klasa tylko pod logikę JS
$nowyPrzyciskEdytuj.text(etykietaPrzycisku);
    return $nowyPrzyciskEdytuj;
}

function wstawPrzyciskUsunWewnatrzLI( kontekst ) {
    if ( !kontekst ) kontekst = document;
var $elementyListy = $(kontekst).find('ul.main').find('li');    // bezpieczne wyszukiwanie
console.log("kontekst", $elementyListy);

    if ( $elementyListy ) {
        $elementyListy.each( function (indeks, elementLi) {
            var ilePrzyciskowUsun = $( elementLi ).find( 'button.' + klasaPrzyciskuUsun ).length;
            console.log(indeks, elementLi);
                if ( ilePrzyciskowUsun === 0 ) {  // ma NIE WSTAWIAĆ, gdy już istnieje przycisk wewnątrz
                // var $nowyPrzyciskUsun = $('<button>', { class: klasaPrzyciskuUsun }).text('Usuń');  // brak odniesienia do CSS, klasa pod logikę JS
                var $nowyPrzyciskUsun = utworzPrzyciskUsun();  // podpięcie poprzez dedykowaną funkcję
                $(elementLi).append( $nowyPrzyciskUsun );   
                }
        }); // each-END    
    }
 }
        // warto TĘ i POPRZEDNIĄ funkcję zrobić jako JEDNĄ, ale z dodatkowymi PARAMETREM (lub dwoma powiązanymi)
function wstawPrzyciskEdytujWewnatrzLI( kontekst ) {     // na wzór poprzenika: "wstawPrzyciskUsunWewnatrzLI()"
    if ( !kontekst ) kontekst = document;
var $elementyListy = $(kontekst).find('ul.main').find('li');    // bezpieczne wyszukiwanie
console.log("kontekst", $elementyListy);

    if ( $elementyListy ) {
        $elementyListy.each( function (indeks, elementLi) {
            var ilePrzyciskowEdytuj = $( elementLi ).find( 'button.' + klasaPrzyciskuEdytuj ).length;
            // console.log(indeks, elementLi);
            if ( ilePrzyciskowEdytuj === 0 ) {  // ma NIE WSTAWIAĆ, gdy już istnieje przycisk wewnątrz
            // var $nowyPrzyciskEdytuj = $('<button>', { class: klasaPrzyciskuEdytuj }).text('Edytuj');  // brak odniesienia do CSS, klasa pod logikę JS
            var $nowyPrzyciskEdytuj = utworzPrzyciskEdytuj();  // dedykowana funkcja tworzy element
            $(elementLi).append( $nowyPrzyciskEdytuj );   
            }
        }); // each-END    
    }
}

/* function pobierzTekstZElementu (element) {       // dodatkowa funkcji do odczytu samego tekstu z danego elementu (tekst musi być na początku, przed "niechcianymi" elementami!)
element = $(element);   // konwersja na jQuery, gdyby 
var tekstElementu = element.text();
var dlugoscTekstuPodelementow = element.children().text().length;
    return tekstElementu.slice(0, tekstElementu.length - dlugoscTekstuPodelementow);    // zwrot tylko istotnego początku, bez treści tekstowych dzieci
} */

// =========== START WYWOŁANIA: ===========

var $kontenerOsob = $('.people'),
    klasaPrzyciskuUsun = 'usunMnie',   // sama nazwa klasy, bo bardziej użyteczne (i też kłopotliwe z ewentualnym doklejaniem kropki później)
    klasaPrzyciskuEdytuj = 'edytujMnie',   // j.w.
    klasaEdycjiLI = 'edycjaTeraz',     // j.w. - notyfikacja stanu edytowania dla elementu li
    $przyciskiUsun = $kontenerOsob.find( klasaPrzyciskuUsun );

wstawPrzyciskEdytujWewnatrzLI( $kontenerOsob ); // na starcie wymuszone wywołanie funkcji na rzecz już istniejących elementów - najpierw [Edytuj]

wstawPrzyciskUsunWewnatrzLI( $kontenerOsob ); // na starcie wywołanie funkcji na rzecz już istniejących elementów, po [Edytuj] będzie [Usuń] 

$kontenerOsob.on('click', '.' + klasaPrzyciskuUsun, function() {  // tu sparametryzowano delegację zdarzeń -- dotyczy przycisku USUŃ z '.usunMnie'
    $(this).parent().remove();
});

    // zdarzenie na kliknięcie konkretnego przycisku EDYTUJ wewnątrz jakiegoś LI - tu dwi ewersje postępowania:
    // ...zależnie, czy element LI jest wyświetlany do edycji, czy te ewewntualne zmiany są przyjmowane do DOMu 
$kontenerOsob.on('click', '.' + klasaPrzyciskuEdytuj, function() {  // delegację zdarzeń jako parametr -- EDYTUJ z '.edytujMnie'
    var $biezacyLi = $(this).parent(),
    // nazwaOsoby = $biezacyLi.text(),  // !!! to zwrócui tekst wraz z tekstem przycisków (dzieci z tekstem względem LI)
    nazwaOsoby = $biezacyLi.contents().not( $biezacyLi.children() ).text(),   // niby jako lepszy wariant... zwróci same teksty bez tekstów pomiędzy BUTTON 
    // nazwaOsoby = pobierzTekstZElementu( $biezacyLi ), // tu wywoływana specjlana funkcja, la eniepotzrebna bo można prościej (linijka ppowyżej)
    wiekOsoby = $biezacyLi.attr('data-age'), // może być nawet jako string, i tak do pola formularza trafi
    $poleNazwyOsoby = $('<input>', { type: 'text', class: 'nazwa-osoby-edycja' } ),     // wszystkie atrybuty i wartości albo w elemencie...
    $poleWiekuOsoby = $('<input>', { type: 'text', class: 'wiek-osoby-edycja' } ),      // ...albo osobno (nie mieszczać, bo tylko z elementu przejdą!)
    czyEdycjaElementu = $biezacyLi.hasClass( klasaEdycjiLI );   // wyróżnik stanu dla EDYCJI (false) lub ZATWIERDZENIA (true)

    $poleNazwyOsoby.val( nazwaOsoby );
    $poleWiekuOsoby.val( wiekOsoby );

    if ( !czyEdycjaElementu ) {     // najpierw tworzenie struktury do edycji i wpisanych już treści
    // console.log( "treści tekstowe przed modyfikacją LI:", nazwaOsoby );    
        if ( $biezacyLi.find( $poleNazwyOsoby ).length < 1 ) {   // nie do tej pory nie istnieje element INPUT.nazwaOsobyEdycja wewnątrz tego_LI  
            // zerowanie zawartości LI, wstawianie dwóch INPUTów, oraz OD NOWA dwóch przycisków sterujących 
        $biezacyLi.empty().append( $poleNazwyOsoby, $poleWiekuOsoby );     // kolejność wstwiania jest zachowana, zgodnie z oczekiwaną na stronie
        $biezacyLi.append( utworzPrzyciskEdytuj('Zatwierdź'), utworzPrzyciskUsun() ); // tworzenie i wstawiaeni OD NOWA dwóch przycisków,
            //pierwszy z nowych przycisków dostaje zmienioną etykietę
        //$biezacyLi.text('');    // pusty napis jako treść
        $biezacyLi.addClass( klasaEdycjiLI );   // nadawanie stanu
        }

    } else {    // drugi etap, posiadając tę klasę to zezwalamy na zapis elementu z bieżącymi wartościami i wyjście z tryby edytowania
        // pobranie zawartości pól tekstowych i wstawienie ich wartości do elementu LI (tekst + atrybut)  
        nazwaOsoby = $('input.nazwa-osoby-edycja').val();
        wiekOsoby = $('input.wiek-osoby-edycja').val();
        console.log("odczytano przy zapisie wartości:", nazwaOsoby, "i" , wiekOsoby );
        $biezacyLi.empty().text( nazwaOsoby );
        $biezacyLi.attr('data-age', wiekOsoby );
        $biezacyLi.append( utworzPrzyciskEdytuj(), utworzPrzyciskUsun() );  // to są własne funkcje, pamiętać o ich wywołaniu! 
        $biezacyLi.removeAttr('class');    // odbieranie stanu edycji, tu całkiem klasa wylatuje 
    } //if-(!czyEdycjaElementu)-END
});



    // ---> DODAWANIE NOWYCH TREŚCI: odtąd SKOPIOWANE Z POPRZEDNIEGO FOLDERU ZADAŃ -- lista nr 3, zadanie 2. --->
var $przyciskDodaj = $('.people').find('input[type="submit"]');

    $przyciskDodaj.on('click', function(evt) {
    
    var ktos = $('#addUser').val();   // albo po prostu przypisać: $('#addUser').val(); ... mimo wszystko warto by oczyścić tekst z bzdur, poleceń JS i tagów
    var wiek = parseInt( $('#age').val(), 10 );     // albo po prostu przypisać: $('#age').val(); ... i tak póki co dane jako STRING
    var $listaOsobistosci = $('.people').find('ul.main');
    var $nowyElementLI;
        if ( ( ktos == 'Wpisz imię i nazwisko' ) || ( ktos == '' ) || ( isNaN(wiek) ) ) {
        evt.preventDefault();   // nie pozwala użyć tych wskazanych wartości do wpisania zawartości na stronie 
            // nie rób nic dalej, skoro niewłaściwe dane WE  
        } 
        else {
            if ( ( isNaN(wiek) ) || ( wiek < 0 ) ) wiek = 0;    // jeszcze raz prawie to samo, ale teraz może zmienić wartość z formulaza, gdy jest on błędna
            //$('input').css('backgroundClor', '');  
        $nowyElementLI = $('<li>', { 'data-age': wiek }).text(ktos);     // tworzenie elementu z konkretną zawartością
        $listaOsobistosci.append( $nowyElementLI );     // do istniejącej listy przypięcie nowego LI  
        $('#addUser').val('');  // zerowanie zawartości pola, skąd pobrano już treść 
        $('#age').val('');      // zerowanie zawartości pola, czyści treść po użyciu bieżącej zawartości
        console.log("ktoś:", ktos, "wiek:", wiek);  // zrzut dodanego elementu

        wstawPrzyciskEdytujWewnatrzLI( $(this).parent() );   // jawne wywołanie, najpierw przycisk [Edytuj], po nim [Usuń] w ramach LI    

        wstawPrzyciskUsunWewnatrzLI( $(this).parent() );    // od razu dostawianie wewnątrz przycisku USUŃ -- jawne wywołanie i odwołanie się do kontekstu
        }
    });  // $przyciskDodaj.on('click'...-END  
    // <--- dotąd skopiowano kod z poprzedniego zadania (lista 3, zadanie 2), ale wyrzucono część kodu, odpowiadającej za kolorowanie LI <---



});
