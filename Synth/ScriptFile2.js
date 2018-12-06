var context = new AudioContext()
context.destination.maxChannelCount=2;
button = document.querySelector('#play');
var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");
var analyser = context.createAnalyser();
analyser.fftSize = 4096*2;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyser.connect(context.destination);
var synth1 = new Synth(context, 5, 2);

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

 function Oscillator(type, frequency, destination, audioContext){

    this.context=audioContext;
    this.oscillator = this.context.createOscillator();
    this.oscillator.type=type;
    this.oscillator.frequency.value=frequency;
    this.gain = this.context.createGain();
    this.gain.connect(destination);
    this.oscillator.connect(this.gain);

    this.start = function(){
        this.oscillator.start();
    }

    this.mute = function(){
        this.gain.gain.setValueAtTime(0.00000001,this.context.currentTime);
    }

    this.unMute = function(){
        this.gain.gain.setValueAtTime(0.5,this.context.currentTime);
    }

    this.setGainValueAtTime = function(value,time){
        this.gain.gain.setValueAtTime(value,time);
    }

    this.level = function(value){
        this.gain.gain.setValueAtTime(value,this.context.currentTime);
    }

    this.changeFreq = function(value){
        this.oscillator.frequency.value = value;
    }

    this.changeWaveform = function(type){
        this.oscillator.type=type;
    }

 }

 function Synth(AudioContext, numberOfVoices, numberOfOscillators) {

    /*Synth attributes:
    1) AudioContext
    2) Amplitude Gain -> modelled by the amplitude envelope
    3) Matrix 5row x 3 columns. Each cell [row][col] corresponds 
       to the oscillator number col of the voice number row
       Remember that each voice corresponds to a note of the chord.
    */

    this.context=AudioContext;

    this.amplitudeGain = this.context.createGain();
    this.amplitudeGain.connect(analyser);
    this.amplitudeGain.maxChannelCount = 3;
    now = this.context.currentTime;
    this.amplitudeGain.gain.setValueAtTime(0.000001,now);

    this.voicesOscillatorsMatrix = [];
    for( i = 0; i < numberOfVoices; i++) {
        this.voicesOscillatorsMatrix[i] = new Array(numberOfOscillators);
        for( k = 0 ; k < numberOfOscillators ; k++){
            this.voicesOscillatorsMatrix[i][k] = new Oscillator("square",440,this.amplitudeGain,this.context);
            this.voicesOscillatorsMatrix[i][k].start();
        }
    }
    this.setCrossModulation = function(){
            this.voicesOscillatorsMatrix[0][0].oscillator.disconnect(this.amplitudeGain);
            this.voicesOscillatorsMatrix[1][0].oscillator.disconnect(this.amplitudeGain);
            this.voicesOscillatorsMatrix[2][0].oscillator.disconnect(this.amplitudeGain);
            this.voicesOscillatorsMatrix[3][0].oscillator.disconnect(this.amplitudeGain);
            this.voicesOscillatorsMatrix[4][0].oscillator.disconnect(this.amplitudeGain);
            this.voicesOscillatorsMatrix[0][0].oscillator.connect(this.voicesOscillatorsMatrix[0][1].oscillator.frequency);
            this.voicesOscillatorsMatrix[1][0].oscillator.connect(this.voicesOscillatorsMatrix[1][1].oscillator.frequency);
            this.voicesOscillatorsMatrix[2][0].oscillator.connect(this.voicesOscillatorsMatrix[2][1].oscillator.frequency);
            this.voicesOscillatorsMatrix[3][0].oscillator.connect(this.voicesOscillatorsMatrix[3][1].oscillator.frequency);
            this.voicesOscillatorsMatrix[4][0].oscillator.connect(this.voicesOscillatorsMatrix[4][1].oscillator.frequency);               
    }

    this.playSynthNote = function() {
        setInterval(function(){
    console.log(synth1.voicesOscillatorsMatrix[0][1].oscillator.frequency.value)
},10);
        this.attack = Number(document.querySelector("#attack").value);
        this.decay = Number(document.querySelector("#decay").value);
        now = this.context.currentTime;
        this.amplitudeGain.gain.setValueAtTime(0.0001, now);
        this.amplitudeGain.gain.exponentialRampToValueAtTime(0.5,now + this.attack);
        this.amplitudeGain.gain.linearRampToValueAtTime(0.0000001,now + this.attack + 4);
  }

  this.changeOscillatorLevel = function(voiceNumber,oscillatorNumber, value){
    this.voicesOscillatorsMatrix[voiceNumber][oscillatorNumber].level=value;
  }

  this.setVoiceFrequency = function(voiceNumber, value){

    for( i = 0 ; i < this.voicesOscillatorsMatrix[0].length; i++){
        this.voicesOscillatorsMatrix[voiceNumber][i].changeFreq(value);      
    }
  }

  this.setOscillator1Frequency = function(value) {
    for ( i = 0; i < 4 ; i++) {
        this.voicesOscillatorsMatrix[i][0].changeFreq(value);
    }
  }

}

button.onclick = playSynthSound;
function playSynthSound(data){
    synth1.playSynthNote();
}


