var c = new AudioContext(); 

var gates1 = [];
var gates2 = [];
var tones = [];
var now = c.currentTime;
keys = "awsedftgyhujkolpòà";
var keys_elem_array = [];
var master = c.createGain();
var oscillators = [];
master.connect(c.destination);


var ADSR_values = [0.1/*s*/,0.2 /*s*/,0.5/*gain*/,0.2/*s*/]; 

document.onkeydown = function(e){
  if(keys.includes(e.key) && !e.repeat){
    console.log(e.key);
    attack(tones[keys.indexOf(e.key)]);
  }
  else{
    console.log("a");
  }
}

document.onkeyup = function(e){
  if(keys.includes(e.key)){
    release(tones[keys.indexOf(e.key)]);
  }
}



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




function attack(freq){
    if (typeof gates1[freq] != undefined) {
      console.log("saluti");
    }
    var osc1 = c.createOscillator();
    var osc2 = c.createOscillator();
    oscillators.push(osc1);
    oscillators.push(osc2);
    osc1.type = "sawtooth";
    osc2.type = "square";
    var g1 = c.createGain();
    var g2 = c.createGain();
    g1.connect(master);
    g2.connect(master);
    osc1.connect(g1);
    osc2.connect(g2);
    osc1.frequency.value = freq;
    osc2.frequency.value = 2*freq;
	  osc1.start();
	  osc2.start();
    console.log(osc1.frequency.value);
    gates1[freq] = g1;
    gates2[freq] = g2;
    now=c.currentTime;
    g1.gain.setValueAtTime(0, now);
    g2.gain.setValueAtTime(0, now);
    console.log(sliderAmounts);

    g1.gain.linearRampToValueAtTime(1, now+sliderAmounts[8]/100);
    g2.gain.linearRampToValueAtTime(1, now+sliderAmounts[8]/100);

    now = c.currentTime;
    g1.gain.exponentialRampToValueAtTime(0.0000001+sliderAmounts[10]/100, now + sliderAmounts[9]/100);
    g2.gain.exponentialRampToValueAtTime(0.0000001+sliderAmounts[10]/100, now + sliderAmounts[9]/100);

    /*Now sustain. So waits until a keyUp Event, and then release() is called*/
}

function release(freq) {
    //console.log(gates1);
    now = c.currentTime;

    gates1[freq].gain.linearRampToValueAtTime(0, now+sliderAmounts[11]/100);
    gates2[freq].gain.linearRampToValueAtTime(0, now+sliderAmounts[11]/100);
    osc1.stop;
    osc2.stop;
    osc1.disconnect
    osc2.disconnect;
    delete osc1;
    delete osc2;
    gates1[freq].disconnect;
    gates2[freq].disconnect;
    delete gates1[freq];
    delete gates2[freq];
}

function createButton(n, freq) {
  var b = document.createElement("button");
  keys_elem_array[n] = b;
	document.querySelector("footer").appendChild(b);
	//b.innerHTML = n.toString();
	b.innerHTML = keys[n];
  b.onclick = function(){attack(freq); b.onmousedown = function(){release(freq)}}
}
