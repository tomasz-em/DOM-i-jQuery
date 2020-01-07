/*  1. Timer z listy DOM
Stwórz timer składający się z dwóch inputów (minuty i sekundy) oraz buttona “Start”, który rozpoczyna odliczanie zadanego czasu. 
Stan ma być aktualizowany co sekundę. W trakcie trwania odliczania oba inputy mają być zablokowane (disabled).
*/

    // ----- ZMIENNE -----

    var defaultMinutesValue = 0,
    defaultSecondsValue = "00",
    minutesValue = 0,
    secondsValue = 0,
    secondsTotal = 0,
    minutesCounted = 0,
    timerInterval,
    goodInputs = false,
    audioElem = new Audio('bell-ding.mp3'), // plik dźwiękowy: https://freesound.org/people/Natty23/sounds/411749/ + konwersja na .MP3 (+ też w FF się odtwarza)

    minutesInput = document.getElementById('minutes'),
    secondsInput = document.getElementById('seconds'),
    resetBtn = document.getElementById('timer-reset'),
    startBtn = document.getElementById('timer-start'),
    wholeForm = document.getElementById('timer-form');

        // ----- FUNKCJE ------

function prepareTimer( evt ) {
evt.preventDefault();

goodInputs = false;
minutesValue = Math.floor( Math.abs( Number( minutesInput.value ) ) );
secondsValue = Math.abs( Math.floor( Number( secondsInput.value ) ) );  // kolejność zewnętrznych przekształceń nieistotna 
console.log("czas STARTOWY: ", minutesValue, secondsValue);

    if ( !isNaN( minutesValue ) && !isNaN( secondsValue ) ) { // czy to są liczby w ogóle
        if ( minutesValue > 999 ) minutesValue = 999;   // normalizacja zakresów
        if ( secondsValue >= 60 ) {
        minutesValue += Math.floor( secondsValue / 60 );    // dodanie do minut wielokrotności (przy założonych zakresach [0..99]) dla sekund
        secondsValue = ( secondsValue % 60 );   // po dodaniu +1 minuty, resztę sekund nadpisuje swoje pole
            // secondsValue = 59;    // ...albo podzielić dwucyfrową liczbę przez 60
        }

        if ( ( ( minutesValue === 0 ) && ( secondsValue > 0 ) ) // weryfikacja, gdy możliwe zero w pobranych danych
            || ( ( minutesValue > 0 ) && ( secondsValue === 0 ) )
            || ( ( minutesValue > 0 ) && ( secondsValue > 0 ) ) ) goodInputs = true;    // gdy jest OK (są wartości liczbowe oraz akceptowalne jedno 0)
    }
    else {
        // może jakieś wyświetlenie powiadomienia o problemie teraz, tutaj określić... 
                // (wstawianie i chowanie komunikatu znacząco rozbuduje dość proste zadanie nr 1)
        //      ...
    }

    wholeForm.parentElement.style.backgroundColor = "#f2f2f2";  // zmiany na stylowanie domyślne
    wholeForm.previousElementSibling.innerText = "Timer";

    if ( goodInputs ) { // że dane są jako liczbowe i nieujemne
        // ewentualne wyświetlenie prawidłowych wartości po konwersji... prezenstacja znormalizowanych danych wejściowych
        minutesInput.value = minutesValue;
        secondsInput.value = ( secondsValue < 10 ) ? "0" + secondsValue : secondsValue; // przekształcenie tylko na rzecz <input>a, by od razu było dopełenienie zerem 
                                            // (jeśli tak było wpisane, a wcześniejsza konwersja na liczbę usunęła zero z lewej strony) 
        minutesInput.setAttribute('disabled', true);
        secondsInput.setAttribute('disabled', true);
        startBtn.setAttribute('disabled', true);    // blokowanie przycisku, by wielokrotnie nie obsługiwać tego typu zdarzenia naraz!
        startBtn.previousElementSibling.focus();    // usunięcie aktywnego stanu z dezaktywowanego przycisku (trochę TAK i NIE względem dostępności)

        secondsTotal = minutesValue * 60 + secondsValue;    // tu obliczenia przed startem
        timerInterval = setInterval(timerStart, 1000);     // przypisanie iteracji... wystaruje funkcję z opóźnieniem (każdą iterację)
    }
}

function timerStart() {
    secondsTotal--;
    minutesValue = Math.floor( secondsTotal / 60 );
    secondsValue = secondsTotal - minutesValue * 60;
    secondsValue >= 10 ? true : secondsValue = "0" + secondsValue;  // !!! trójkowo: tu jako tekst jest wartość liczbowa !!!
                        // używane w ostatnim kroku, tuż przed wyświetleniem w formularzu
    
    minutesInput.value = minutesValue;
    secondsInput.value = secondsValue;
    // console.log("czas aktualizowany: ", minutesValue, secondsValue);
        
        if ( secondsTotal === 0 ) { // zrobić coś, gdy się licznik wyzeruje
        minutesInput.removeAttribute('disabled');
        secondsInput.removeAttribute('disabled');
        startBtn.removeAttribute('disabled');
 
        // console.info("Interwał zakończenia", timerInterval);
        clearInterval( timerInterval ); // !!! zerowanie wywoływania TEj funkcji po osiągnięciu "0" przez odlicznik czasu

        audioElem.play();   // wszelkiego typu notyfikacja graficzna + odtworzenie dźwięku! (MP3 działa nawet w IE i FF)
        wholeForm.parentElement.style.backgroundColor = "lightgreen";
        wholeForm.previousElementSibling.innerText = "Timer - osiągnięto zaplanowany czas!";
        // alert("Osiągnęto zaplanowany czas!");    // to trochę mało wyszukana forma wyświetlenia powiadomienia
        } 
}

function timerReset() {

    clearInterval( timerInterval ); // usuwanie zadanej powtarzalności wywołania funkcji "timeStart" co 1s

    minutesInput.removeAttribute('disabled');
    secondsInput.removeAttribute('disabled');
    startBtn.removeAttribute('disabled');

    minutesInput.value = defaultMinutesValue;
    secondsInput.value = defaultSecondsValue;

    wholeForm.parentElement.style.backgroundColor = "#f2f2f2";
    wholeForm.previousElementSibling.innerText = "Timer";
}


    // ----- ZDARZENIA ------

    wholeForm.addEventListener("submit", prepareTimer, false);  // naciskanie klawisza myszą/klawiaturą oraz [Enter] w dowolnym polu formularza

resetBtn.addEventListener("click", timerReset, false);  // zwykłe "click" przez mysz lub klawiaturę