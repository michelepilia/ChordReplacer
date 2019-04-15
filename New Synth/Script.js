var SENS = 3; /*Parametro di sensibilita' alla rotazione. E' possibile cambiarlo senza influenzare il resto del codice, a patto che sia un divisore esatto di 270.*/
/*-----------------------------------------------------------------------------*/


var classToRotate = "int-knob";/*indica la classe html di cui si vuole effettuare la rotazione*/
var classToRotate2 = "." + classToRotate;
var knobNumbers = document.getElementsByClassName(classToRotate).length;
var knobToRotateIndex = 0;
var oldY = 0;
var yDirection = "";
var maxAmount = 270 / SENS;
var minAmount = 0;
var antiGlitchFlag = 0;
var pitch_amount1 = 0;
var pitch_amount2 = 0;
var amounts = Array(knobNumbers).fill(maxAmount/2); /*Array contenente il valore di ogni knob*/



function updateSound(){
    if (knobToRotateIndex == 1 ) {
        offset1 = Math.pow(2,(amounts[1]*SENS/270*2 - 1)/12);
    }
    else if (knobToRotateIndex == 3) {
        offset2 = Math.pow(2,(amounts[3]*SENS/270*2 - 1)/12);

    }

    

}

function updateView() {

    document.getElementsByClassName(classToRotate)[knobToRotateIndex].style.transform = "rotate(" + ((amounts[knobToRotateIndex] -maxAmount/2) * SENS )+ "deg)";
    document.getElementsByClassName("knob-level-amount-percentage")[knobToRotateIndex].innerHTML=parseInt((amounts[knobToRotateIndex])*SENS/270*100);

}

function updateView2(){
     document.getElementsByClassName("knob-level-amount-percentage")[knobToRotateIndex].style.visibility="hidden";
}

function updateView3(){
    document.getElementsByClassName("knob-level-amount-percentage")[knobToRotateIndex].style.visibility="visible";
}
    
function f1(knob) {
    knob.onmousedown = preRotate;
}

function preRotate(data) {
    
    antiGlitchFlag=-2;
    knobToRotateIndex = parseInt(data.target.getAttribute("id")[1]) - 1;
    document.addEventListener("mousemove", rotate, false); 
    updateView3();


}

function rotate(data) {
    getMouseDirection(data);
    if (yDirection == "up" && antiGlitchFlag > -1) {
        if (amounts[knobToRotateIndex] < maxAmount) {
            amounts[knobToRotateIndex]++;
            //updateKnobs();
            //Qui scrivere il valore dell'angolazione su firebase
            updateView();
            updateSound();
        }
    }
    else if (yDirection == "down" && antiGlitchFlag > -1) {
        if (amounts[knobToRotateIndex] > minAmount) {
            amounts[knobToRotateIndex]--;
            //Qui scrivere il valore dell'angolazione su firebase
            //updateKnobs();
            updateView();
            updateSound();
        }
    }
}

function stop() {

    document.removeEventListener("mousemove", rotate);
    updateView2();
}

/*
e.PageY ritorna l'altezza della pagina, a cui si trova il puntatore del mouse.
OldY e' il valore precedente d'altezza della pagina a cui si trovava il puntatore del mouse.
Dunque valutando la condizione e.PageY ">" o "<" di oldY si puo' stabilire se la rotazione del knob sia in senso orario
(nel caso l'utente sposti il mouse verso l'alto) od antiorario (nel caso l'utente sposti il mouse verso il basso).
Bisogna pero' fare attenzione al glitch che si puo' verificare in tal caso. 
Infatti: supponiamo che l'utente smetta di ruotare il knob, rilasciando il tasto del mouse. Si supponga
che l'utente rilasci il mouse sulla posizione d'altezza 150. Pertanto il valore di oldY diventa 150.
Pero' il knob occupa piu' punti sull'asse Y, ad esempio dalle posizioni 130 a 160. Dunque se l'utente muove verso
in basso il mouse, ma clicca inizialmente sul knob all'altezza 153, la funzione "getMouseDirection()"
considera questo movimento verso l'alto perche' la posizione attuale del mouse sull'asse Y e' 153, ed oldY e' 150. Pertanto si avra' una minima
rotazione nel senso opposto a quello voluto dall'utente. Alla fine della prima esecuzione il valore di oldY diventa 153.
Alla seconda esecuzione di getMouseDirection, sempre nell'ambito della stessa rotazione (cioe' l'utente non ha ancora rilasciato il tasto
sul mouse) essendo il movimento del mouse un movimento continuo, si ha oldY aggiornato alla posizione corrente del mouse, 
in tal caso al valore 153. Per cui il glitch non si presenta piu'. Pertanto e' stata introdotta la variabile antiglitchFlag,
inizializzata in modo che getMouseDirection venga eseguita almeno 2 volte nell'ambito della stessa rotazione, prima di aggiornare modello,
view e audio. 
*/
function getMouseDirection(e) {

    if (e.pageY < oldY) {
        yDirection = "up";
    } else if (e.pageY > oldY) {
        yDirection = "down";
    }
    oldY = e.pageY;
    antiGlitchFlag++;
}

document.querySelectorAll(classToRotate2).forEach(f1);
document.onmouseup = stop;


document.getElementById('sp1').onmousemove = function(){
    document.getElementById('osc1-pitch-value').innerHTML=pitch_amount1;
}

document.getElementById('sp2').onmousemove = function(){
    document.getElementById('osc2-pitch-value').innerHTML=pitch_amount2;
}