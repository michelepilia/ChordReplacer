var c = new AudioContext(); 

var tones = [];
var now ;
keys = "awsedftgyhujkolpòà";
var keys_elem_array = [];
var master = c.createGain();
master.connect(c.destination);
var playingNotes = [];
var offset1 = 1;
var offset3 = 1;
var offset2 = 1;
var indexOfPlayingNote = 0;

function keyboardMaker() {
  var f = 440;
  var i;
  for (i=0; i<(keys.length); i++){
    tones[i] = Math.round(440*Math.pow(2,1/12)**i);
    createButton((i), tones[i]);
    //console.log(scale[i]+" "+(i+1));k
  }
  //console.log("Ciao");
}
keyboardMaker();


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
  this.gain1 = c.createGain();
  this.gain2 = c.createGain();
    this.gain1.connect(master);
    this.gain2.connect(master);
    this.oscillator1.connect(this.gain1);
    this.oscillator2.connect(this.gain2);
    offset3 = Math.pow(2,(amounts[2])/12);
    this.oscillator1.frequency.value = this.frequency * offset3;
    this.oscillator1.frequency.value = this.oscillator1.frequency.value * offset1;
    this.oscillator2.frequency.value = this.oscillator2.frequency.value * offset2;
  this.playNote = function(){
    this.oscillator1.type = selectorValues[0];
    this.oscillator2.type = selectorValues[1];
    this.oscillator1.start();
    this.oscillator2.start(); 

    now=c.currentTime;
    this.gain1.gain.setValueAtTime(0, now);
    this.gain2.gain.setValueAtTime(0, now);

    this.gain1.gain.linearRampToValueAtTime(1*amounts[0]*SENS/270, now+sliderAmounts[8]/100);
    this.gain2.gain.linearRampToValueAtTime(1*amounts[3]*SENS/270, now+sliderAmounts[8]/100);

    now = c.currentTime;
    this.gain1.gain.linearRampToValueAtTime(sliderAmounts[10]/100*amounts[0]*SENS/270, now + sliderAmounts[9]/100);
    this.gain2.gain.linearRampToValueAtTime(sliderAmounts[10]/100*amounts[3]*SENS/270, now + sliderAmounts[9]/100);
  }

  this.release = function(){
    console.log("RELEASE STARTED...: "+this.frequency);
    now = c.currentTime;
    this.gain1.gain.linearRampToValueAtTime(0, now+sliderAmounts[11]/100);
    this.gain2.gain.linearRampToValueAtTime(0, now+sliderAmounts[11]/100);

  }

  this.release2 = function(){
    console.log("release2 started...: " + this.frequency);

    this.oscillator1.stop();
    this.oscillator2.stop();
    
    this.oscillator1.disconnect();
    this.oscillator2.disconnect();
    this.gain1.disconnect();
    this.gain2.disconnect();
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