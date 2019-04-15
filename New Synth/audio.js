var c = new AudioContext(); 
var lfo = c.createOscillator();
var minLfo = 0;
var maxLfo = 20;
var minFilt = 200;
var maxFilt = 15000; //Hz
var minQ = -3;
var maxQ = 3;
var tones = [];
var now ;
keys = "awsedftgyhujkolpòà";
var keys_elem_array = [];
var pre_filt_gain = c.createGain();
var filt = c.createBiquadFilter();
var eg;
var master = c.createGain();
master.connect(c.destination);
var playingNotes = [];
var offset1 = 1;
var offset3 = 1;
var offset2 = 1;
var indexOfPlayingNote = 0;


function setUp(){
  amounts[4] = maxAmount; //Prevedendo che il filtro (LPF) abbia inizialmente una cutoff freq. al massimo (=> inattivo)
  amounts[5] = 0; //Idem, perché la frequenza "target" dell'EG è uguale a quella di cutoff
  amounts[6] = maxAmount; //Inizialmente la frequenza dell'LFO è 0
  amounts[7] = 0;
  filt.type = "lowpass";
  filt.gain.value = 1;
  pre_filt_gain.connect(filt);
  pre_filt_gain.gain.value = 1;
  filt.connect(master);
  eg = minFilt+(amounts[6]/(maxAmount-minAmount)*(maxFilt-minFilt));
  lfo.frequency.value = minLfo+(amounts[7]/(maxAmount-minAmount)*maxLfo);
  lfo.start();

}


function keyboardMaker() {
  var f = 220;
  var i;
  for (i=0; i<(keys.length); i++){
    tones[i] = Math.round(220*Math.pow(2,1/12)**i);
    createButton((i), tones[i]);
    //console.log(scale[i]+" "+(i+1));k
  }
  //console.log("Ciao");
}
keyboardMaker();
setUp();

function createButton(n, freq) {
  var b = document.createElement("button");
  keys_elem_array[n] = b;
	document.querySelector("footer").appendChild(b);
	//b.innerHTML = n.toString();
	b.innerHTML = keys[n];
  b.onclick = function(){attack(freq); b.onmousedown = function(){release(freq)}}
}

function Note(frequency){
  this.frequency = frequency;
  this.oscillator1 = c.createOscillator();
  this.oscillator2 = c.createOscillator();
  this.pre_gain1 = c.createGain(); //Nodo gain intermedio tra oscillator e gain1, su cui lfo agisce, indipendentemente dal valore del knob
  this.pre_gain2 = c.createGain();
  this.gain1 = c.createGain();
  this.gain2 = c.createGain();
  filt.Q = minQ+(amounts[5]/(maxAmount-minAmount)*(maxQ-minQ));
  this.lfo_destinations = [this.pre_gain1.gain, this.pre_gain2.gain, (c.createGain().gain)]; //Il terzo parametro è provvisorio, in attesa di implementare il filtro
  this.lfo_gain = c.createGain();
  lfo.connect(this.lfo_gain);
  this.lfo_gain.gain = 0;
  this.lfo_gain.disconnect();
  this.lfo_gain.connect(this.lfo_destinations[(parseInt(selectorValues[3]))]);
  master.gain.value=amounts[8]*SENS/270;
    this.gain1.connect(pre_filt_gain);
    this.gain2.connect(pre_filt_gain);
    this.oscillator1.connect(this.pre_gain1);
    this.oscillator2.connect(this.pre_gain2);
    this.pre_gain1.connect(this.gain1);
    this.pre_gain2.connect(this.gain2);
    offset3 = Math.pow(2,(pitch_amount)/12);
    this.oscillator1.frequency.value = this.frequency * offset3;
    this.oscillator1.frequency.value = this.oscillator1.frequency.value * offset1;
    this.oscillator2.frequency.value = this.frequency * offset2;
    lfo.frequency.value = minLfo+(amounts[7]/(maxAmount-minAmount)*(maxLfo-minLfo));
    console.log("freq: " + this.frequency + " osc1 freq: " + this.oscillator1.frequency.value + " osc2 freq: " + this.oscillator2.frequency.value);
  this.playNote = function(){
    this.oscillator1.type = selectorValues[0];
    this.oscillator2.type = selectorValues[1];
    lfo.type = selectorValues[2];
    this.oscillator1.start();
    this.oscillator2.start(); 

    now=c.currentTime;
    this.gain1.gain.setValueAtTime(0, now);
    this.gain2.gain.setValueAtTime(0, now);
    filt.frequency.setValueAtTime(minFilt+(amounts[4]/(maxAmount-minAmount)*(maxFilt-minFilt)), now); //Freq cutoff at time 0
    eg = minFilt+(amounts[6]/(maxAmount-minAmount)*(maxFilt-minFilt)); //Calcolo frequenza eg
    this.gain1.gain.linearRampToValueAtTime(1*amounts[0]*SENS/270, now+sliderAmounts[8]/100);
    this.gain2.gain.linearRampToValueAtTime(1*amounts[2]*SENS/270, now+sliderAmounts[8]/100);
    filt.frequency.linearRampToValueAtTime(eg, now+sliderAmounts[0]/100); //Linear ramp to eg at tima ATCK
    this.lfo_gain.gain.linearRampToValueAtTime(0.3*SENS, now+sliderAmounts[4]/100);
    now = c.currentTime;
    this.lfo_gain.gain.linearRampToValueAtTime(sliderAmounts[6]/100, now+sliderAmounts[5]/100);
    filt.frequency.linearRampToValueAtTime(sliderAmounts[2]/100*eg, now + sliderAmounts[1]/100); //linear ramp tu SUS (% di eg) at time DCY
    this.gain1.gain.linearRampToValueAtTime(sliderAmounts[10]/100*amounts[0]*SENS/270, now + sliderAmounts[9]/100);
    this.gain2.gain.linearRampToValueAtTime(sliderAmounts[10]/100*amounts[2]*SENS/270, now + sliderAmounts[9]/100);
  }

  this.release = function(){
    console.log("RELEASE STARTED...: "+this.frequency);
    now = c.currentTime;
    this.gain1.gain.linearRampToValueAtTime(0, now+sliderAmounts[11]/100);
    this.gain2.gain.linearRampToValueAtTime(0, now+sliderAmounts[11]/100);
    this.lfo_gain.gain.linearRampToValueAtTime(0, now+sliderAmounts[7]/100);
    filt.frequency.linearRampToValueAtTime(minFilt+(amounts[4]/(maxAmount-minAmount)*(maxFilt-minFilt)), now + sliderAmounts[3]/100);
  }

  this.release2 = function(){
    console.log("release2 started...: " + this.frequency);

    this.oscillator1.stop();
    this.oscillator2.stop();
    
    this.oscillator1.disconnect();
    this.oscillator2.disconnect();
    this.gain1.disconnect();
    this.gain2.disconnect();
    this.lfo_gain.disconnect();
    delete this.oscillator1;
    delete this.oscillator2;
    delete this.gain1;
    delete this.gain2;
  }
}




document.onkeydown = function(e){
  if(keys.includes(e.key) && !e.repeat){
    note = new Note(tones[keys.indexOf(e.key)])
    playingNotes.push(note);
    console.log("1): "+note);
    playingNotes[playingNotes.length-1].playNote();
    console.log("2) " +playingNotes.length-1);
  }
  else{
    console.log("KEY NOT VALID");
  }
}

document.onkeyup = function(e){
  if(keys.includes(e.key) && !e.repeat){
    indexOfPlayingNote = noteIsPlaying(tones[keys.indexOf(e.key)]);
    console.log("KEY UP EVENT OCCURED...: " + tones[keys.indexOf(e.key)]);
    if (indexOfPlayingNote!=-1) {
        timeoutRelease(e);
    }
  }
}

function timeoutRelease(e){
  var a = noteIsPlaying(tones[keys.indexOf(e.key)]);//prevents global variable to be changed while executing code here
  playingNotes[a].release();
  console.log("timeout release called...: " + playingNotes[a].frequency);
  setTimeout(function(){
        a = noteIsPlaying(tones[keys.indexOf(e.key)]);
        playingNotes[a].release2();
        playingNotes.splice(a,1);
    }, now + sliderAmounts[11]/100*1000);
}

function noteIsPlaying(frequency){
  for (var i = 0; i < playingNotes.length; i++) {
    if (playingNotes[i].frequency==frequency) { //add cents to freq offset
      return i;
    }
  }
  return -1;
}

//durante il timeout il valore di indexOfPlayingNote puo' essere modificato da
//un evento key up per cui si generano errori nel release.

