var c = new AudioContext(); 

var gates1 = [];
var gates2 = [];
var tones = [];
var now = c.currentTime;
keys = "awsedftgyhujkolpòà";
var keys_elem_array = [];

//alert(pitch_osc2);

function attack(freq){
    var osc1 = c.createOscillator();
    var osc2 = c.createOscillator();
    var g1 = c.createGain();
    var g2 = c.createGain();
    g1.connect(c.destination);
    g2.connect(c.destination);
    osc1.connect(g1);
    osc2.connect(g2);
    osc1.frequency.value = freq;
    osc2.frequency.value = 2*freq;
	  osc1.start();
	  osc2.start();
    console.log(osc1.frequency.value);
    g1.gain.setValueAtTime(0, now);
    g2.gain.linearRampToValueAtTime(1, now+0.1);
    g1.gain.setValueAtTime(0, now);
    g2.gain.linearRampToValueAtTime(0.2, now+0.1);
	  //g.gain.linearRampToValueAtTime(0, now+0.6);
    gates1[freq] = g1;
    gates2[freq] = g2;
}

/*function release(freq) {
    console.log(gates1);
    gates1[freq].gain.linearRampToValueAtTime(0, now+2.6);
    gates2[freq].gain.linearRampToValueAtTime(0, now+2.6);
    
}*/

function createButton(n, freq) {
  var b = document.createElement("button");
  keys_elem_array[n] = b;
	document.querySelector("footer").appendChild(b);
	//b.innerHTML = n.toString();
	b.innerHTML = keys[n];
  b.onclick = function(){attack(freq); b.onmousedown = function(){release(freq)}}
}

function keyboardMaker() {
  var f = 440;
  var i;
  for (i=0; i<(keys.length); i++){
    tones[i] = Math.round(440*Math.pow(2,1/12)**i);
    createButton((i), tones[i]);
    //console.log(scale[i]+" "+(i+1));
  }
  //console.log("Ciao");
}

keyboardMaker();

document.onkeydown = function(e){
  if(!e.repeat) {
    attack(tones[keys.indexOf(e.key)]);
    console.log(e.key);
  }
}
document.onkeyup = function(e){
  release(tones[keys.indexOf(e.key)]);
}
