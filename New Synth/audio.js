var c = new AudioContext(); 

var gates1 = [];
var gates2 = [];
var tones = [];
var now ;
keys = "awsedftgyhujkolpòà";
var keys_elem_array = [];
var master = c.createGain();
master.connect(c.destination);
var playingNotes = [];

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


function release(note) {
  /*Should be called once reached point AAAA, and not before*/
    console.log("RELEASE STARTED");
    now = c.currentTime;
    console.log("gates is: "+gates1);
    gates1[note.frequency].gain.linearRampToValueAtTime(0, now+sliderAmounts[11]/100);
    gates2[note.frequency].gain.linearRampToValueAtTime(0, now+sliderAmounts[11]/100);
    note.oscillator1.stop();
    note.oscillator2.stop();
    note.oscillator1.disconnect();
    note.oscillator2.disconnect();
    delete note.oscillator1;
    delete note.oscillator2;
    gates1[note.frequency].disconnect();
    gates2[note.frequency].disconnect();
    delete gates1[note.frequency];
    delete gates2[note.frequency];
    delete note;
    console.log("ENDED RELEASE");
}

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
  this.hasReachedSustain = false;
  this.keyUpOccured = false;
  this.oscillator1 = c.createOscillator();
  this.oscillator2 = c.createOscillator();
}

function playNote(note){
    console.log("EXECUTING playNote: " + note.frequency);

    note.oscillator1.type = "sawtooth";
    note.oscillator2.type = "sawtooth";
    var g1 = c.createGain();
    var g2 = c.createGain();
    g1.connect(master);
    g2.connect(master);
    note.oscillator1.connect(g1);
    note.oscillator2.connect(g2);
    note.oscillator1.frequency.value = note.frequency;
    note.oscillator2.frequency.value = 2*note.frequency;
    note.oscillator1.start();
    note.oscillator2.start();
    gates1[note.frequency] = g1;
    gates2[note.frequency] = g2;

    now=c.currentTime;
    g1.gain.setValueAtTime(0, now);
    g2.gain.setValueAtTime(0, now);

    g1.gain.linearRampToValueAtTime(1, now+sliderAmounts[8]/100);
    g2.gain.linearRampToValueAtTime(1, now+sliderAmounts[8]/100);

    now = c.currentTime;
    g1.gain.linearRampToValueAtTime(sliderAmounts[10]/100, now + sliderAmounts[9]/100);
    g2.gain.linearRampToValueAtTime(sliderAmounts[10]/100, now + sliderAmounts[9]/100);
    note.hasReachedSustain = true;
    console.log("SUSTAIN REACHED FOR NOTE: "+note.frequency); 
    if (note.keyUpOccured) {
      console.log("Already keyUp Event, occured during attack decay phase: " + note.frequency);
      release(note);
    }
    updatePlayingNotes(note);
    console.log("NOT EVEN KEYUP EVENT FOR NOTE: "+note.frequency);
}

document.onkeydown = function(e){
  if(keys.includes(e.key) && !e.repeat){
    note = new Note(tones[keys.indexOf(e.key)])
    playingNotes.push(note);
    playNote(note);
  }
  else{
    console.log("a");
  }
}

document.onkeyup = function(e){
  console.log("KEY UP EVENT OCCURED...")
  if(keys.includes(e.key)){
    console.log("It's a VALID KEY");
    var a = noteIsPlaying(tones[keys.indexOf(e.key)]);
    console.log("Element position in playingNotes is: "+a);
    if (a!=-1) {
        console.log(playingNotes[a]);
        playingNotes[a].keyUpOccured=true;
        release(playingNotes[a]);
    }
  }
}

function noteIsPlaying(frequency){
  for (var i = 0; i < playingNotes.length; i++) {
    if (playingNotes[i].frequency==frequency) {
      return i;
    }
  }
  return -1;

}

function updatePlayingNotes(note){
  console.log("UPDATE CALLED");
  playingNotes[noteIsPlaying(note.frequency)]=note;
  console.log(playingNotes);
}