var SENS = 3; /*Parametro di sensibilita' alla rotazione. E' possibile cambiarlo senza influenzare il resto del codice, a patto che sia un divisore esatto di 270.*/
/*AUDIO GLOBAL NODES*/
var lfo;
var lfo_amp;
var filt;
var master;
var c = new AudioContext();
/*--------------*/
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
var hipass;
var maxLfoAmpGain = 0.20;
var minLfoAmpGain = 0;

var amounts; /*Array contenente il valore di ogni knob*/
var selectorValues; //Array contenente i valori dei selettori, inizializzato con i valori di default
var sliderAmounts; //Array contenente il valore degli slider
var sliderChangeIndex = 0; //Index dello slider che sta cambiando
var selectorChangeIndex = 0; //Index del selector che si sta cambiando
var antiGlitchFlag = 0;
var lfo_destinations;


//Sezione tastiera
var tones = [];
keys = "awsedftgyhujkolpòà";
var keys_elem_array = [];
var playingNotes = [];
var indexOfPlayingNote = 0;

var synthPresetName = "Init";

function setUp(){

	/*Definizione variabili knob, slider, selettori*/

	amounts = [maxAmount/2, maxAmount/2, 0, maxAmount/2, maxAmount, 0, maxAmount, 0, maxAmount/2]; //Valori default knob
	selectorValues = ["sawtooth", "sawtooth", "sawtooth", "0"];
	sliderAmounts = [50, 50, 50, 50, 50, 50, 50, 50, 50, 50];

	/*Inizializzazione nodi Web Audio API*/
	master = c.createGain();

	/*Sezione Filter*/
	filt = c.createBiquadFilter();
	filt.type = "lowpass";
	filt.gain.value = 1;
	eg = minFilt+(amounts[6]/(maxAmount-minAmount)*(maxFilt-minFilt));
	filt.connect(master);

	hipass = c.createBiquadFilter();
	hipass.type = "highpass";
	hipass.gain.value = 1;
	hipass.frequency.value = 150;

	/*Sezione LFO*/
	lfo = c.createOscillator();
    lfo_amp = c.createGain();
    lfo.connect(lfo_amp);
    lfo.type = 'sine';
    lfo.frequency.value = 8;
    lfo_amp.gain.value = 0.15;
    lfo_amp.connect(master.gain);
    lfo.start();

	/*Sezione Master*/
	master.connect(hipass);
	limiter = c.createDynamicsCompressor();
	limiter.threshold.value = 0;
	limiter.knee.value=0;
	limiter.ratio.value=20;
	limiter.attack.value = 0;
	limiter.release.value=0;
	hipass.connect(limiter);
	limiter.connect(c.destination);
	lfo_destinations = [master.gain,master.gain,filt.frequency,filt.Q];
}


function Voice(frequency){ //Voce è inteso come signal path totale
	this.frequency = frequency;
	this.oscillator1 = c.createOscillator();
	this.oscillator2 = c.createOscillator();
	this.gain1 = c.createGain();
	this.gain2 = c.createGain();
	this.pre_gain1 = c.createGain();
	this.pre_gain2 = c.createGain(); 
  
}

