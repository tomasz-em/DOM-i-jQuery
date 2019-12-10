$(function () {
    console.info('DOM zaladowany!');

/* Zadanie 1
Ustaw event na elemencie dt, którego zadaniem jest wyświetlenie w konsoli informacji o elemencie, na który najechaliśmy.
*/
$('dt').on('mouseover', function () {
    console.warn(this);
    console.log( $(this).text() );
});


/* Zadanie 2
Znajdź w pliku index.html trzy buttony w elemencie z klasą hero-buttons. Dla każdego elementu ustaw event click, 
który po kliknięciu pobierze wartość znajdującą się w atrybucie data-feature i wyświetli ją w konsoli.
*/

var $heroButtons = $('.hero-buttons').find('button');

$heroButtons.on('click', function() {
console.log( $(this).data('feature') );
});


/*  Zadanie 3
Znajdź w pliku index.html sekcję z klasą superhero-description, a następnie napisz funkcję, która:
Ukryje domyślnie wszystkie elementy dd
Po kliknięciu w element dt sprawi, że elementy dd będą rozwijały się, jeśli są ukryte i vice versa. 
Do znalezienia najbliższego rodzeństwa danego elementu użyj funkcji .next().
*/

var $opisy = $('dd');
var $tytuly = $('dt');

$opisy.hide(0);
$tytuly.on('click', function() {
    $(this).next().toggle(300); // i są jeszcze jednofunkcyjne załatwianie animacji do pojawiania się zawartości: slideToggle i fadeToggle
});

/*  Zadanie 4
Znajdź w pliku index.html element z klasą shopping. Wykonaj następujące czynności:
* Po kliknięciu w button Dodaj – ustaw mu klasę added oraz pojedynczemu elementowi zawierającemu produkt zmień obramowanie 
    na zielone.
* Podmień tekst przycisku na Dodano.
* Po ponownym kliknięciu zresetuj ustawienia elementu cart-item.
*/

var $zakupy = $('.shopping');

$zakupy.on('click', 'button', function() {  // DELEGACJA ZDARZEŃ (też w jednej funkcji, a nie w dwóch jak w rozwiążaniu grupowym)
    if ( !$(this).hasClass('added') ) $(this).addClass('added').text('Dodano')
                    .parent().css({ backgroundColor: 'lightgreen', border: '1px solid green'}); // tu jeszcze tło się zmienia
    else $(this).removeClass('added').text('Dodaj').parent().css({ backgroundColor: '', border: ''});
        // prosty reset (powrót do ustawionych wcześniej deklaracji w CSSie, bez dwuznaczności po zmianie stylów tam)

});















});
