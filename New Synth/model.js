//VARIABILI GLOBALI
var SENS = 3; /*Parametro di sensibilita' alla rotazione. E' possibile cambiarlo senza influenzare il resto del codice, a patto che sia un divisore esatto di 270.*/

//Definizione nodi Web Audio API
var c = new AudioContext(); 
var pre_gain1;
var pre_gain2;
var lfo;
var lfo_destinations;
var lfo_gain;
var pre_filt_gain; //Perchè si assume che il filtro possa avere un solo input, dunque si fanno confluire i due oscillatori in un unico nodo
var filt;
var master;

//Parametri vari Web Audio API
var eg;
var minLfo = 0;
var maxLfo = 20;
var minFilt = 200;
var maxFilt = 15000; //Hz
var minQ = -0.5;
var maxQ = 20;
var maxAmount = 270 / SENS; //Dei Knob
var minAmount = 0;
var classToRotate = "int-knob";/*indica la classe html di cui si vuole effettuare la rotazione*/
var classToRotate2 = "." + classToRotate;
var knobToRotateIndex = 0;
var oldY = 0;
var yDirection = "";
var offset1 = 1;
var offset2 = 1;
var offset3 = 1;
var offset4 = 1;
var pitch_amount1 = 0;
var pitch_amount2 = 0;

var amounts; /*Array contenente il valore di ogni knob*/
var selectorValues; //Array contenente i valori dei selettori, inizializzato con i valori di default
var sliderAmounts; //Array contenente il valore degli slider
var sliderChangeIndex = 0; //Index dello slider che sta cambiando
var selectorChangeIndex = 0; //Index del selector che si sta cambiando
var antiGlitchFlag = 0;


//Sezione tastiera
var tones = [];
keys = "awsedftgyhujkolpòà";
var keys_elem_array = [];
var playingNotes = [];
var indexOfPlayingNote = 0;


function setUp(){

	/*Definizione variabili knob, slider, selettori*/

	amounts = [maxAmount/2, maxAmount/2, 0, maxAmount/2, maxAmount, 0, maxAmount, 0, maxAmount/2]; //Valori default knob
	selectorValues = ["sawtooth", "sawtooth", "sawtooth", "0"];
	sliderAmounts = [50, 50, 50, 50, 50, 50, 50, 50, 50, 50];



	/*Inizializzazione nodi Web Audio API*/
	
	/*Sezione Filter*/
	pre_filt_gain = c.createGain();
	pre_filt_gain.gain.value = 1;
	filt = c.createBiquadFilter();
	filt.type = "lowpass";
	filt.gain.value = 1;
	eg = minFilt+(amounts[6]/(maxAmount-minAmount)*(maxFilt-minFilt));
	pre_filt_gain.connect(filt);

	/*Sezione LFO*/
	pre_gain1 = c.createGain(); //Nodo gain intermedio tra oscillator e gain1, su cui lfo agisce, indipendentemente dal valore del knob
	pre_gain2 = c.createGain();
	pre_gain1.gain.value = 1;
	pre_gain2.gain.value = 1;
	lfo = c.createOscillator();
	lfo_destinations = [pre_gain1.gain, pre_gain2.gain, filt.frequency, filt.Q]; 
	lfo_gain = c.createGain();
	lfo.frequency.value = minLfo+(amounts[7]/(maxAmount-minAmount)*maxLfo);
	lfo.connect(lfo_gain); 
	lfo.start();

	

	/*Sezione Master*/
	master = c.createGain();
	filt.connect(master);
	master.connect(c.destination);
}


function Voice(frequency){ //Voce è inteso come signal path totale
	this.frequency = frequency;
	this.oscillator1 = c.createOscillator();
	this.oscillator2 = c.createOscillator();

	this.gain1 = c.createGain();
	this.gain2 = c.createGain();
 
  
}

