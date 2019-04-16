/*Event Listeners*/

document.addEventListener("keydown", keyDownListener, false);
document.addEventListener("keyup", keyUpListener, false);
document.addEventListener("mouseup", stop, false);
document.getElementsByClass(classToRotate).forEach(addEventListener("mousedown", preRotate, false));



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



/*Update View Functions*/

function updateView() { //Quando giri knob
    document.getElementsByClassName(classToRotate)[knobToRotateIndex].style.transform = "rotate(" + ((amounts[knobToRotateIndex] -maxAmount/2) * SENS )+ "deg)";
    document.getElementsByClassName("knob-level-amount-percentage")[knobToRotateIndex].innerHTML=parseInt((amounts[knobToRotateIndex])*SENS/270*100);

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

    filt.frequency.setValueAtTime(minFilt+(amounts[4]/(maxAmount-minAmount)*(maxFilt-minFilt)), now); //Freq cutoff at time 0
    
    voice.gain1.gain.linearRampToValueAtTime(1*amounts[0]*SENS/270, now+sliderAmounts[8]/100);
    voice.gain2.gain.linearRampToValueAtTime(1*amounts[2]*SENS/270, now+sliderAmounts[8]/100);
    
    filt.frequency.linearRampToValueAtTime(eg, now+sliderAmounts[0]/100); //Linear ramp to eg at tima ATCK
    lfo.frequency.linearRampToValueAtTime(minLfo+(amounts[7]/(maxAmount-minAmount)*(maxLfo-minLfo)), now+sliderAmounts[4]/100);
    

    filt.frequency.linearRampToValueAtTime(sliderAmounts[2]/100*eg, now + sliderAmounts[1]/100 + sliderAmounts[0]/100); //linear ramp tu SUS (% di eg) at time DCY
    voice.gain1.gain.linearRampToValueAtTime(sliderAmounts[10]/100*amounts[0]*SENS/270, now + sliderAmounts[9]/100 +sliderAmounts[8]/100);
    voice.gain2.gain.linearRampToValueAtTime(sliderAmounts[10]/100*amounts[2]*SENS/270, now + sliderAmounts[9]/100+sliderAmounts[8]/100);
  }

  function release(voice){
    now = c.currentTime;
    voice.gain1.gain.linearRampToValueAtTime(0, now+sliderAmounts[11]/100);
    voice.gain2.gain.linearRampToValueAtTime(0, now+sliderAmounts[11]/100);
    voice.lfo_gain.gain.linearRampToValueAtTime(0, now+sliderAmounts[7]/100);
    filt.frequency.linearRampToValueAtTime(minFilt+(amounts[4]/(maxAmount-minAmount)*(maxFilt-minFilt)), now + sliderAmounts[3]/100);
  }

  function release2(voice){
  	voice.oscillator1.stop();
    voice.oscillator2.stop();
    voice.oscillator1.disconnect();
    voice.oscillator2.disconnect();
    voice.gain1.disconnect();
    voice.gain2.disconnect();
    voice.lfo_gain.disconnect();
    delete voice;
  }

