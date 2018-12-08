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
synth.setUpCrossModulation();
synth.changeAmplitudeGainLevel(0.2);

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
    this.connectToDestination= function(destination){
      this.oscillator.connect(destination);
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
    this.attack = 0.4;
    this.decay = 0.6;
    now = this.context.currentTime;
    this.amplitudeGain.gain.setValueAtTime(0.0001, now);
    this.amplitudeGain.gain.exponentialRampToValueAtTime(0.5,now + this.attack);
    this.amplitudeGain.gain.linearRampToValueAtTime(0.0000001,now + this.attack + this.decay);
    */

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
    this.updateFMModulatorsOscillators();
  }

  this.connectDestination = function(destination){
  	this.amplitudeGain.connect(destination);
  }

  this.setUpCrossModulation=function(){

  	//Not working this for cycle
    for(i=0;i<this.voicesOscillatorsMatrix.length;i++){
  		this.FMModulatorsOscillators[i] = new Oscillator("sine",1,this.context); 
  		this.FMModulatorsGainNodes[i] = this.context.createGain();                 
  		this.FMModulatorsGainNodes[i].gain.value=300;
  		this.FMModulatorsOscillators[i].connectToDestination(this.FMModulatorsGainNodes[i]);
  	  this.FMModulatorsGainNodes[i].connect(this.voicesOscillatorsMatrix[i][1].oscillator.frequency);
      this.FMModulatorsOscillators[i].start();
    }

  }

  this.updateFMModulatorsOscillators= function(){
  
    this.FMModulatorsOscillators[0].oscillator.frequency=this.voicesOscillatorsMatrix[0][0].oscillator.frequency.value;
    this.FMModulatorsOscillators[1].oscillator.frequency=this.voicesOscillatorsMatrix[1][0].oscillator.frequency.value;
    this.FMModulatorsOscillators[2].oscillator.frequency=this.voicesOscillatorsMatrix[2][0].oscillator.frequency.value;
    this.FMModulatorsOscillators[3].oscillator.frequency=this.voicesOscillatorsMatrix[3][0].oscillator.frequency.value;
    this.FMModulatorsOscillators[4].oscillator.frequency=this.voicesOscillatorsMatrix[4][0].oscillator.frequency.value;

    this.FMModulatorsOscillators[0].oscillator.type=this.voicesOscillatorsMatrix[0][0].oscillator.type;
    this.FMModulatorsOscillators[1].oscillator.type=this.voicesOscillatorsMatrix[1][0].oscillator.type;
    this.FMModulatorsOscillators[2].oscillator.type=this.voicesOscillatorsMatrix[2][0].oscillator.type;
    this.FMModulatorsOscillators[3].oscillator.type=this.voicesOscillatorsMatrix[3][0].oscillator.type;
    this.FMModulatorsOscillators[4].oscillator.type=this.voicesOscillatorsMatrix[4][0].oscillator.type;

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
