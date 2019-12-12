$(function () {
    console.info('DOM właśnie zaladowany!');
/*  Zadanie 1
Stwórz element div z klasą panel i wstaw go za sekcją people. Przy pomocy jQuery wstaw w niego dowolny tekst. 
*/
var $nowyTwor = $('<div>', { class: 'panel'}).text('Jestem nową zawartością, utworzoną dynamicznie poprzez jQuery w zadaniu nr 1 :)');
$nowyTwor.insertAfter('.people');       // ewentualności to .after() 
    // ...(.append() się nie liczy, bo treść byłaby wewnątrz DIVa -- chyba, że poprzedzona .parent() )

/*  Zadanie 2
Znajdź w pliku index.html element z klasą people. Stwórz odpowiednią funkcję, wewnątrz której ustawisz event click na przycisku dodaj.

Po kliknięciu wykonaj następujące czynności:
* Pobierz do zmiennej wartość wpisaną w pole z id addUser
* Pobierz do zmiennej wartość wpisaną w pole z id age
* Wstaw nowy element na koniec listy, ustaw wprowadzony wiek jako atrybut data
Po każdym wstawieniu elementu wywołaj funkcję, która ustawi odpowiedni kolor dla elementu li w następujący sposób:
- zielony dla osób w wieku do 15 lat
- niebieski dla osób mających od 16 do 40 lat
- czerwony dla osób mających 41 lat i więcej
*/

var $przyciskDodaj = $('.people').find('input[type="submit"]');

    $przyciskDodaj.on('click', function(evt) {
    
    var ktos = $(this).parent().find('#addUser').val();   // albo po prostu przypisać: $('#addUser').val(); ... mimo wszystko warto by oczyścić tekst z bzdur, poleceń JS i tagów
    var wiek = parseInt( $(this).parent().find('#age').val(), 10 );     // albo po prostu przypisać: $('#age').val(); ... i tak póki co dane jako STRING
    var $listaOsobistosci = $('.people').find('ul.main');
    var $nowyElementLI;
        if ( ( ktos == 'Wpisz imię i nazwisko' ) || ( ktos == '' ) || ( isNaN(wiek) ) ) {
        evt.preventDefault();   // nie pozwala użyć tych wskazanych wartości do wpisania zawartości na stornir 
        $('input').css('backgroundClor', 'lightcoral');    
        } 
        else {
            if ( ( isNaN(wiek) ) || ( wiek < 0 ) ) wiek = 0;    // jeszcze raz prawie to samo, ale teraz może zmienić wartość z formulaza, gdy jest on błędna
            $('input').css('backgroundClor', '');  
        $nowyElementLI = $('<li>', { 'data-age': wiek }).text(ktos);     // tworzenie elementu z konkretną zawartością
        $listaOsobistosci.append( $nowyElementLI );     // do istniejącej listy przypięcie nowego LI  
        $('#addUser').val('');  // zerowanie zawartości pola, skąd pobrano już treść 
        $('#age').val('');      // zerowanie zawartości pola, czyści treść po użyciu bieżącej zawartości
        console.log("ktoś:", ktos, "wiek:", wiek);  // zrzut dodanego elementu
        }
            // modyfikacja dla wszystkich elementów, nie tylko właśnie wstawianych przy każdym dodaniu elementu :( 
        $listaOsobistosci.find('li').each(function() {  
            var wybranyKolor = '';
            var wartoscOdczytana = Math.abs( parseInt( $(this).data('age'), 10 ) ); // "taka se" weryfikacja wartości liczbowej
                if ( isNaN(wartoscOdczytana) ) wartoscOdczytana = 0;    // ...i jej ewentualna naprawa

                if ( wartoscOdczytana <= 15 ) wybranyKolor = 'lightgreen';
                else if ( ( wartoscOdczytana > 15 ) && ( wartoscOdczytana <= 40 ) ) wybranyKolor = 'lightblue';
                    else if ( wartoscOdczytana > 40 ) wybranyKolor = 'lightcoral';

            $(this).css( 'backgroundColor', wybranyKolor );
        }); // each-END
    });  // $przyciskDodaj.on('click'...-END  

/* Zadanie 3
Znajdź w pliku index.html element z klasą graphic. Napisz funkcję, która utworzy elementy span i doda je w odpowiednie miejsca według poniższego obrazka. 
Zastąp nazwy miesięcy nazwami poszczególnych funkcji, z których korzystasz, np. append.
<< OBRAZEK >>
*/

function utworzIWstawSPANY () {
var licznikWstawionychElem = 0,
    trescNowegoElem = 'append()',
    $elementRodzica = $('.graphic');
        // zadanie wymaga istnienie jeszcze jakiegoś elementu kontenerowego lub należy go dostawić dynamicznie samemu
        // ...najprościej to wykonać na samym początku, by nie owijać isteniejących elementów jakimś kontenerem, ale utworzyć go obok właśnie tworzonych SPANów

    // 0. append
var $nowyPojemnik = $('<p>', { class: "pojemnik" }) 
$elementRodzica.append( $nowyPojemnik );

    // 1. append
var $nowySpan = $('<span>', { class: "pasek" }).text( ++licznikWstawionychElem + ". " + trescNowegoElem );    
$elementRodzica.children('p').append( $nowySpan );      // ciągłe odwoiływanie się do nowoutworzonego dziecka konkretnego elmentu x3

    // 2. prepend
$nowySpan = $('<span>', { class: "pasek" }).text( ++licznikWstawionychElem + ". " + "prepend()" );
$elementRodzica.children('p').prepend( $nowySpan );

    // 3. before
$nowySpan = $('<span>', { class: "pasek" }).text( ++licznikWstawionychElem + ". " + "before()" );
$elementRodzica.children('p').before( $nowySpan );

    // 4. after
$nowySpan = $('<span>', { class: "pasek" }).text( ++licznikWstawionychElem + ". " + "after()" );
$elementRodzica.children('p').after( $nowySpan );
}    

utworzIWstawSPANY();   // wywołanie
    // UTWORZONO NOWE STYLE w CSS, aby SPANy nabyły blokowego charakteru i wyglądu oraz ich sąsiedzi/rodzice ewentualnie 

/* Zadanie 4
Zapoznaj się z plikiem index.html. Znajdź w nim elementy z klasą block, a następnie zapisz je do zmiennej. 
Napisz funkcję, która po kliknięciu elementu z klasą block usunie dany element z kolumny z klasą left i przeniesie go do kolumny z klasą right.
*/

//var $klikalneDivy = $('.block');    // (1) tego typu lista "przenosi" też zdarzenie ze sobą na prawo... zadziała kliknięcie celem przeszunięcia na ostatnią pozycję
var $klikalneDivy = $('.left').find('.block');    // (2) teraz też się przenosi na prawo RAZEM ZE ZDARZENIEM
var $docelowaPrawaLokalizacja = $('.right');
var $zrodlowaLewaLokalizacja = $('.left');  // (4) dodatkowa "niepotrzebna" deklaracja

    //$klikalneDivy.on('click', function() {  // (3) zatem coś z definicją tego zdarzenia trzeba zmienić
    $zrodlowaLewaLokalizacja.on('click', '.block', function() {   // (5) nowa definicja zdarzenia z DELEGACJĄ ZDARZEŃ -- zdarzenie zostaje w rodzicu, 
    $(this).appendTo( $docelowaPrawaLokalizacja );                  // ...a nie przeskakuje wraz z każdym klikniętym elementem, (+) nie reaguje z prawej strony
        // można też z .off(), czyli z usuwaniem podpiętego zdarzenia po kliknięciu... ale to więcej modyfikacji w DOMie; albo kopiować i kasować element też się da  
    });

});
