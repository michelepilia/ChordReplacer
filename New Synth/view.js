/*Event Listeners*/
var knobs = document.getElementsByClassName(classToRotate);
var sliders = document.getElementsByClassName("slider");
var selectors = document.getElementsByClassName("selector");

document.addEventListener("keydown", keyDownListener, false);
document.addEventListener("keyup", keyUpListener, false);
document.addEventListener("mouseup", stop, false);
window.addEventListener("load", viewInit);

for (var i = 0; i < knobs.length; i++) { knobs[i].addEventListener("mousedown", preRotate, false); };
for (var i = 0; i < sliders.length; i++) { sliders[i].addEventListener("input", sliderListener, false); };
for (var i = 0; i < selectors.length; i++) { selectors[i].addEventListener("input", selectorListener, false); };



/*Mouse Rotation*/

function preRotate(data) {
    antiGlitchFlag=-2;
    knobToRotateIndex = parseInt(data.target.getAttribute("id")[1]) - 1;
    document.addEventListener("mousemove", rotate, false); 
    updateView3();
}

function stop() {
    document.removeEventListener("mousemove", rotate);
    updateView2();
}

function rotateFromModel(knob){
	knob.style.transform = "rotate(" + ((amounts[knobToRotateIndex] -maxAmount/2) * SENS )+ "deg)";
	knobToRotateIndex++;
}

/*Update View Functions*/

function viewInit(){
	setUp();
	keyboardMaker();
	knobToRotateIndex = 0;
	for (var i = 0; i < knobs.length; i++) {rotateFromModel(knobs[i])};
	knobToRotateIndex = 0;
}

function updateView() { //Quando giri knob
    document.getElementsByClassName(classToRotate)[knobToRotateIndex].style.transform = "rotate(" + ((amounts[knobToRotateIndex]-maxAmount/2) * SENS )+ "deg)";
    knobVal = parseInt((amounts[knobToRotateIndex])*SENS/270*100); //0:100
    if(knobToRotateIndex==1 || knobToRotateIndex==3){
    	document.getElementsByClassName("knob-level-amount-percentage")[knobToRotateIndex].innerHTML = (2*knobVal-100) + " c";
    }
    else if(knobToRotateIndex==4 || knobToRotateIndex==6){
    	document.getElementsByClassName("knob-level-amount-percentage")[knobToRotateIndex].innerHTML = (minFilt+knobVal*(maxFilt-minFilt)/100) + " Hz";
    }
    else if(knobToRotateIndex==5){
    	document.getElementsByClassName("knob-level-amount-percentage")[knobToRotateIndex].innerHTML = minQ+(knobVal*(maxQ-minQ)/100);
    }
    else if(knobToRotateIndex==7){
    	document.getElementsByClassName("knob-level-amount-percentage")[knobToRotateIndex].innerHTML = (minLfo+knobVal*(maxLfo-minLfo)/100) + " Hz";
    }
    else {
    	document.getElementsByClassName("knob-level-amount-percentage")[knobToRotateIndex].innerHTML=knobVal;
    }

}

function updateView2(){ //Quando finisci di muovere il mouse
    document.getElementsByClassName("knob-level-amount-percentage")[knobToRotateIndex].style.visibility="hidden";
}

function updateView3(){ //Prima di ruotare
    document.getElementsByClassName("knob-level-amount-percentage")[knobToRotateIndex].style.visibility="visible";
}



/*Envelope Functions*/

function playNote(voice) {
	voice.oscillator1.start();
    voice.oscillator2.start(); 


    now=c.currentTime;
    voice.gain1.gain.setValueAtTime(0, now);
    voice.gain2.gain.setValueAtTime(0, now);
    
    voice.gain1.gain.linearRampToValueAtTime(1*amounts[0]*SENS/270, now+sliderAmounts[6]/100);
    voice.gain2.gain.linearRampToValueAtTime(1*amounts[2]*SENS/270, now+sliderAmounts[6]/100);
    
    filt.frequency.linearRampToValueAtTime(eg, now+sliderAmounts[0]/100); //Linear ramp to eg at tima ATCK
    lfo.frequency.linearRampToValueAtTime(minLfo+(amounts[7]/(maxAmount-minAmount)*(maxLfo-minLfo)), now+sliderAmounts[4]/100);
    

    filt.frequency.linearRampToValueAtTime(sliderAmounts[2]/100*eg, now + sliderAmounts[1]/100 + sliderAmounts[0]/100); //linear ramp tu SUS (% di eg) at time DCY
    voice.gain1.gain.linearRampToValueAtTime(sliderAmounts[8]/100*amounts[0]*SENS/270, now + sliderAmounts[7]/100 +sliderAmounts[6]/100);
    voice.gain2.gain.linearRampToValueAtTime(sliderAmounts[8]/100*amounts[2]*SENS/270, now + sliderAmounts[7]/100+sliderAmounts[6]/100);
  }

  function release(voice){
    now = c.currentTime;
    voice.gain1.gain.linearRampToValueAtTime(0, now+sliderAmounts[9]/100);
    voice.gain2.gain.linearRampToValueAtTime(0, now+sliderAmounts[9]/100);
    lfo_gain.gain.linearRampToValueAtTime(0, now+sliderAmounts[9]/100); //Assumption that lfo release is equal to env release
    filt.frequency.linearRampToValueAtTime(minFilt+(amounts[4]/(maxAmount-minAmount)*(maxFilt-minFilt)), now + sliderAmounts[3]/100);
  }

  function release2(voice){
  	voice.oscillator1.stop();
    voice.oscillator2.stop();
    voice.oscillator1.disconnect();
    voice.oscillator2.disconnect();
    voice.gain1.disconnect();
    voice.gain2.disconnect();
    delete voice;
  }










  