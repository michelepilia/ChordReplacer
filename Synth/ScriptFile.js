/*
var audio_context = window.AudioContext || window.webkitAudioContext;
var con = new audio_context();
var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");
var analyser = con.createAnalyser();
analyser.fftSize = 4096*2;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

var oscCarrier = con.createOscillator();
var oscCrossModulatorFM = con.createOscillator();
var oscCrossModulator = con.createOscillator();

var oscCrossModulatorFM_amp = con.createGain();
var oscCrossModulator_amp = con.createGain();

oscCrossModulator.type="sawtooth";
oscCrossModulatorFM_amp.gain.value = 200; //this regolates the intensity of FM. It's the FM knob in our synth
oscCarrier.frequency.value = 440;
oscCrossModulatorFM.frequency.value = 220;

oscCrossModulatorFM.connect(oscCrossModulatorFM_amp);
oscCrossModulatorFM_amp.connect(oscCarrier.frequency);
oscCrossModulator.connect(oscCrossModulator_amp);

oscCrossModulator_amp.connect(analyser);
oscCarrier.connect(analyser);
analyser.connect(con.destination);
oscCarrier.type="square";
oscCrossModulatorFM.type="sawtooth";
oscCrossModulator.frequency.value=220;
*/

/*
oscCarrier.start();
oscCrossModulatorFM.start();
oscCrossModulator.start();
*/


var audio_context = window.AudioContext || window.webkitAudioContext;
var context = new audio_context();
var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");
var analyser = context.createAnalyser();
analyser.fftSize = 4096*2;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

var synth = new Synth(context,5,2);
synth.connectDestination(analyser);

analyser.connect(context.destination);


function Oscillator(type, frequency, audioContext){

    this.context = audioContext;
    this.oscillator = this.context.createOscillator();
    this.oscillator.type = type ;
    this.oscillator.frequency.value = frequency;  

    this.start = function(){
        this.oscillator.start();
    }

    this.changeFrequency = function(value){
        this.oscillator.frequency.value = value;
    }
    this.changeWaveform = function(type){
        this.oscillator.type=type;
    }
 }

function Mixer(numberOfOscillators,numberOfVoices, audioContext){

	this.context = audioContext;
	this.gainNodesMatrix = [];
    for( i = 0; i < numberOfVoices; i++) {
        this.gainNodesMatrix[i] = new Array(numberOfOscillators);
        for( k = 0 ; k < numberOfOscillators ; k++){
            this.gainNodesMatrix[i][k] = this.context.createGain();
            this.gainNodesMatrix[i][k].gain.setValueAtTime(0.05,this.context.currentTime);
        }
    }

	this.connectOscillatorToGainNode=function(oscillator,voiceNumber,oscillatorNumber){
		oscillator.oscillator.connect(this.gainNodesMatrix[voiceNumber][oscillatorNumber])
	}

	this.muteOscillator = function(voiceNumber,oscillatorNumber){
		this.gainNodesMatrix[voiceNumber][oscillatorNumber].setValueAtTime(0.00000001,this.context.currentTime);
	}

	this.unMuteOscillator = function(voiceNumber,oscillatorNumber){
		this.gainNodesMatrix[voiceNumber][oscillatorNumber].setValueAtTime(1,this.context.currentTime);
	}

	this.setGainNodeValueAtTime = function(voiceNumber,oscillatorNumber,value,time){
        this.gainNodesMatrix[voiceNumber][oscillatorNumber].setValueAtTime(value,time);
    }
    this.setGainVNodeValueNow = function(voiceNumber,oscillatorNumber,value){
    	this.gainNodesMatrix[voiceNumber][oscillatorNumber].setValueAtTime(value,this.context.currentTime);
    }

    this.connectAllGainNodesToDestination = function(destination){
    	for( i = 0; i < numberOfVoices; i++) {
        	for( k = 0 ; k < numberOfOscillators ; k++){
				this.gainNodesMatrix[i][k].connect(destination);
        	}
    	}
    }
}

function Synth(AudioContext, numberOfVoices, numberOfOscillators) {

    this.context=AudioContext;
    this.amplitudeGain = this.context.createGain();
    this.amplitudeGain.maxChannelCount = numberOfVoices*numberOfOscillators;
    now = this.context.currentTime;
    this.amplitudeGain.gain.setValueAtTime(0.00000001,now);

    this.mixer = new Mixer(numberOfOscillators,numberOfVoices,AudioContext);
    this.mixer.connectAllGainNodesToDestination(this.amplitudeGain);

    this.voicesOscillatorsMatrix = [];

    for( i = 0; i < numberOfVoices; i++) {
        this.voicesOscillatorsMatrix[i] = new Array(numberOfOscillators);
        for( k = 0 ; k < numberOfOscillators ; k++){
            this.voicesOscillatorsMatrix[i][k] = new Oscillator("square",440,this.context)  
            this.mixer.connectOscillatorToGainNode(this.voicesOscillatorsMatrix[i][k],i,k);         
            this.voicesOscillatorsMatrix[i][k].start();
        }
    }

  	this.FMModulatorsOscillators = [];
  	this.FMModulatorsGainNodes = [];


    /*
    this.playSynth = function() {
        this.attack = Number(document.querySelector("#attack").value);
        this.decay = Number(document.querySelector("#decay").value);
        now = this.context.currentTime;
        this.amplitudeGain.gain.setValueAtTime(0.0001, now);
        this.amplitudeGain.gain.exponentialRampToValueAtTime(0.5,now + this.attack);
        this.amplitudeGain.gain.linearRampToValueAtTime(0.0000001,now + this.attack + this.decay);
  }*/

  this.changeOscillatorLevel = function(voiceNumber,oscillatorNumber, value){
    this.mixer.setGainValueNow(voiceNumber, oscillatorNumber,value);
  }

  this.changeAmplitudeGainLevel = function(value){
    this.amplitudeGain.gain.setValueAtTime(value,this.context.currentTime);
  }

  this.setVoiceFrequency = function(voiceNumber, value){
    for( i = 0 ; i < this.voicesOscillatorsMatrix[0].length; i++){
        this.voicesOscillatorsMatrix[voiceNumber][i].changeFrequency(value);      
    }
  }

  this.connectDestination = function(destination){
  	this.amplitudeGain.connect(destination);
  }

  this.setUpCrossModulation=function(){

  	for(i=0;i<this.voicesOscillatorsMatrix.length;i++){
  		this.FMModulatorsOscillators[i] = this.voicesOscillatorsMatrix[i][0]; //probabilmente va fatta una copia e non per riferimento. Facendo
  		this.FMModulatorsGainNodes[i] = this.context.createGain();       //copia andrebbe aggiornata ogni volta che cambia l'oscillatore vero
  		this.FMModulatorsGainNodes[i].gain.setValueAtTime(100,this.context.currentTime);
  		this.FMModulatorsOscillators[i].oscillator.connect(this.FMModulatorsGainNodes[i]);
  		this.FMModulatorsGainNodes[i].connect(this.voicesOscillatorsMatrix[i][1].oscillator.frequency);
  	}



  }

  

}


function drawSamples()
{
  analyser.getByteTimeDomainData(dataArray);
  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.beginPath();
  for(var i=0; i<canvas.width;i++) {
    ctx.lineTo(i,dataArray[i]);
  }
  ctx.stroke();
  requestAnimationFrame(drawSamples);
}

drawSamples();