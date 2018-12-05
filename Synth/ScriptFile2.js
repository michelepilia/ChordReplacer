var context = new AudioContext()
context.destination.maxChannelCount=2;
var synth1 = new Synth(context, 5, 3);
button = document.querySelector('#play');

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
    this.amplitudeGain.connect(this.context.destination);
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

    this.playSynthNote = function() {
        this.attack = Number(document.querySelector("#attack").value);
        this.decay = Number(document.querySelector("#decay").value);
        now = this.context.currentTime;
        this.amplitudeGain.gain.setValueAtTime(0.0001, now);
        this.amplitudeGain.gain.exponentialRampToValueAtTime(0.5,now + this.attack);
        this.amplitudeGain.gain.linearRampToValueAtTime(0.0000001,now + this.attack + this.decay);
  }

  this.changeOscillatorLevel = function(voiceNumber,oscillatorNumber, value){
    this.voicesOscillatorsMatrix[voiceNumber][oscillatorNumber].level=value;
  }

  this.setVoiceFrequency = function(voiceNumber, value){

    for( i = 0 ; i < this.voicesOscillatorsMatrix[0].length; i++){
        this.voicesOscillatorsMatrix[voiceNumber][i].changeFreq(value);      
    }
  }

}

button.onclick = playSynthSound;
function playSynthSound(data){
    synth1.playSynthNote();
}
