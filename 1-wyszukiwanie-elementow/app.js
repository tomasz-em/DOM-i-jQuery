/*  Zadanie 1
 Dołącz do swojego pliku bibliotekę jQuery. W pliku app.js umieść kod sprawdzający, czy DOM został załadowany. 
 Następnie wyszukaj elementy section i ustaw im klasę backgroundElement. 
 Stwórz nową funkcję, w której wykonasz te czynności.
 */


$(function () {
    console.info('DOM już załadowany!');
    $('section').addClass('backgroundElement');

/*  Zadanie 2
Wyszukaj element nav wewnątrz sekcji links. Nadaj mu klasę hover-effect.
 */
    var $mojNaw = $('.links').find('nav').addClass('hover-effect');  // działa OK, wynikiem w zmiennej jest ten wstępnie wyszukiwany obiekt; 
        // 'hover-effect' to specjalna klasa przodka, używany w zdefiniowanych już regułach CSS dla odnośników -- dzięki czemu większa interaktywność 
    // mojNaw.addClass('hover-effect'); // to też zadziała, dla bezpieczństwa testowania warto rozbić, gdy dziwne operacje
    console.log("element NAW z modyfikacją ", $mojNaw );    // nie zawsze wynikiem ostatecznym jest obiekt_jQuery, 
                                                            //... czasem jakaś wartość atrybutu lub status operacji

/*  Zadanie 3
Zapoznaj się z plikiem index.html oraz style.css. 
Dodaj klasę borderClass do każdego elementu li (uwzględnij tylko sekcję o klasie main).
 */
    var $liBorderowe =  $('section.main').find("li").addClass('borderClass');
    console.log( "elementy LI wewnątrz '.main'", $liBorderowe );

/*  Zadanie 4
Ustaw każdemu elementowi li (tylko te w sekcji o klasie main) dodatkowe dwie klasy:
* colorText,
* backgroundElement. Znajdziesz je w pliku style.css pod odpowiednim komentarzem. 
Łącznie z poprzednią klasą borderClass będą to trzy klasy ustawione dla każdego li. */

        // to było przed chwilą określane i modyfikowane.. zatem kolejna akcja na tych elementach
    $liBorderowe.addClass('colorText backgroundElement');   // zapis przydzielania wielu klas od razu, bez osobnych pojedynczych przypisań
    //console.log( $('section.main') );

/*  Zadanie 5
Za pomocą jQuery wykonaj następujące czynności:
* Wyszukaj wszystkie linki i ustaw im czerwony kolor za pomocą funkcji css().
* Zmodyfikuj kod tak, aby kolor czerwony miały linki tylko z menu.
* Dodaj klasę redLinks w pliku style.css (ustaw w niej kolor tekstu na czerwony) i za pomocą addClass nadaj ją 
    elementom li w menu (zmodyfikuj kod z podpunktów 1. i 2 czyli zamień funkcje css() na addClass() ).
* Spraw, aby pierwszy element menu miał większy font niż inne. Stwórz odpowiednią klasę w pliku style.css.
*/
    var $czerwoneLinki = $('.menu').find('a').css("color", "red");
    //var $czerwoneLinki = $('.menu').find('a').addClass('redLinks');
    $czerwoneLinki.first().css('fontSize', '1.5em');    // bez tworzenia klasy

/*  Zadanie 6
Dodaj do elementu h1 klasę creepyHeader, a następnie:
* jego rodzicowi (wyszukaj go za pomocą parent() ) ustaw dowolne obramowanie za pomocą funkcji css() )
* następnemu elementowi po nim (po h1) dodaj klasę crazy. Sprawdź czy na pewno została dodana.    
*/
    var $straszliwy = $('h1').addClass('creepyHeader');
    $straszliwy.parent().css('border', '2px dashed red');
    $straszliwy.addClass('crazy');  // dodaje bez problemu, ale jest ona niezdefioniowana w CSS, 
                            // ...zatem poza wartością atrybutu 'class' nic to nie wnosi -- brak widocznego efektu
    // console.log( "jaki element tu?", $straszliwy );  // po rozbiciu to H1, ale przed to już kontekst przeglądania pierwotnego selektora (tu: rodzic)

/*  Zadanie 7
Wypisz w konsoli pierwszy, trzeci i ostatni element menu. Użyj odpowiednich funkcji. 
Dodaj do znalezionych elementów klasę menuLinks.
*/
    console.log(
        $czerwoneLinki.eq(0).addClass('menuLinks').text(),  // .eq() adresuje elementy jak w dowolnej tablicy JS (od 0)
        $czerwoneLinki.eq(2).addClass('menuLinks').text(),
        $czerwoneLinki.last().addClass('menuLinks').text()
    );

    //alternatywnie można wyszukać wskazane elementy wewnątrz selektora (operując po jednym elemencie wraz z eparatorem ','), by dostać KONKRETNĄ listę elementów
    // var $wybraneLinki = $('.main li:nth-child(3), .main li:nth-child(1), .main li:last-child').addClass('menuLinks');
    // console.log( $wybraneLinki );

/*  Zadanie 8
W pliku index.html znajdziesz sekcję o klasie form. Znajdują się w niej dwa pola input. Pobierz wartości, 
które są w nich ustawione i wyświetl je w konsoli.
*/
    var $poleImie = $('.form').find('#name');
    var $poleEmail = $('.form').find('#email');
console.info('wartość pola "imię":', $poleImie.val(), 'wartość pola "email":', $poleEmail.val() );

/*  Zadanie 9
W pliku index.html znajdziesz link o id googleLink. Zapisz jego atrybut href do zmiennej i wypisz w konsoli. 
Nastepnie podmień go na inny dowolny.
    */
    var $linkGoogla = $('#googleLink');
    console.log( "Adres odnośnika #googleLink PRZED: ", $linkGoogla.attr('href') );
    $linkGoogla.attr('href', 'http://localhost/');
    console.log( "... i już PO zmianach: ", $linkGoogla.attr('href') );


/*  Zadanie 10
W pliku index.html znajdziesz sekcję o klasie links. Pobierz atrybut data-hover do zmiennej i wypisz go w konsoli. 
Spróbuj za pomocą funkcji data oraz attr. Jak widzisz są one źle wpisane w html, spróbuj je podmienić za pomocą funkcji data().
*/

    var napisA = $('.links').find('a').text();
    var napisDataAttr = $('.links').find('a').attr('data-hover');
    var napisData = $('.links').find('a').data('hover');

    console.log("Poszczególne napisy lub RAZEM!!!", napisA, napisDataAttr, napisData);

    var $podmianka = $('.links').find('a');
    var atrybutJakoObiekt = { nazwa: 'wartość', innaNazwa: 66.6 };

    $podmianka.each( function() {
        $(this).data('hover', $(this).text());   // nie działa?! ... ZMIANA JEST WYKONYWANA, ale PRZEGLĄDARKA NIC Z TYM NIE ROBI!!! (nie aktualizuje zmiany!) 
                                                // ... nawet zrzut CAŁEGO ELEMENTU NIE WYKAŻE różnicy, ale odczyt tego ATRYBUTU to ujawni !!! 
        var atrybut = $(this).data('hover');

        $(this).data('nowyData', atrybutJakoObiekt);  // dodawanie elementu o zawartośi obiektu -- tego NIE będzie widać w przeglądarce
        $(this).attr('data-nowy-attr', atrybutJakoObiekt);  // ale TEN atrybut ZMIENI OD RAZU STAN swojego ELEMENTU (tu: w dev tools)

        console.log( this, "DATA-HOVER jest zmieniany przez .data(), ale nie renderuje on zmiany:", atrybut, 
                    '\nDOWÓD (odczytany atrybut z obiektemJS):', $(this).data('nowyData'), "\nZauważalnie zmieniono poprzez .attr()", 
                    "\nNIE DA SIĘ PRZESŁAĆ OBIEKTU W ELEMENCIE POPRZEZ: attr(data-nowy-attr):", $(this).attr('data-nowy-attr') );   // chyba wszystko jasne, nie?!

        $(this).attr('data-hover', $(this).text()); // to ZAWSZE ZMIENI i zmusi przeglądarkę do odświeżenia wyniku (jak wszystko inne się zawsze aktualizuje)
    });


});
