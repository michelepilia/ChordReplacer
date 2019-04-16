function startVoice(voice) {

  voice.lfo_gain.gain = 0;

  lfo.connect(this.lfo_gain);
  voice.gain1.connect(pre_filt_gain);
  voice.gain2.connect(pre_filt_gain);
  voice.oscillator1.connect(voice.pre_gain1);
  voice.oscillator2.connect(voice.pre_gain2);
  voice.pre_gain1.connect(voice.gain1);
  voice.pre_gain2.connect(voice.gain2);

  voice.oscillator1.frequency.value = voice.frequency * offset3;
  voice.oscillator1.frequency.value = voice.oscillator1.frequency.value * offset1;
  voice.oscillator2.frequency.value = voice.frequency * offset4;
  voice.oscillator2.frequency.value = voice.oscillator2.frequency.value * offset2;
  voice.oscillator1.type = selectorValues[0];
  voice.oscillator2.type = selectorValues[1];
  
  

  //Inizio sezione da sistemare
  voice.lfo_gain.disconnect();
  this.lfo_gain.connect(this.lfo_destinations[(parseInt(selectorValues[3]))]);

  filt.Q.value = minQ+(amounts[5]/(maxAmount-minAmount)*(maxQ-minQ));
  master.gain.value=amounts[8]*SENS/270;
  offset3 = Math.pow(2,(pitch_amount1)/12);
  offset4 = Math.pow(2,(pitch_amount2)/12);
  lfo.type = selectorValues[2];
  eg = minFilt+(amounts[6]/(maxAmount-minAmount)*(maxFilt-minFilt)); //Calcolo frequenza eg

  lfo_gain.gain.value = lfoGainType
    if (selectorValues[3] == "0" || selectorValues[3] == "1") {
      this.lfo_gain.gain.value = sliderAmounts[5]/100;
    }
    else if (selectorValues[3] == "2"){
      this.lfo_gain.gain.value = sliderAmounts[5]*10;
      console.log("PIPPO");
    }
    else {
      this.lfo_gain.gain.value = 28*sliderAmounts[5]/100;
    }
  
//Fine sezione da sistemare












function keyDownListener(e) {
  if(keys.includes(e.key) && !e.repeat){
    voice = new Voice(tones[keys.indexOf(e.key)]); //Voce è inteso come signal path totale 
    playingNotes.push(voice);
    startVoice(playingNotes[playingNotes.length-1]);
  }
}

function keyUpListener(e) {
  if(keys.includes(e.key) && !e.repeat){
    indexOfPlayingNote = noteIsPlaying(tones[keys.indexOf(e.key)]);
    if (indexOfPlayingNote!=-1) {
        timeoutRelease(e);
    }
  }
}

function rotate(data) {
    getMouseDirection(data);
    if (yDirection == "up" && antiGlitchFlag > -1) {
        if (amounts[knobToRotateIndex] < maxAmount) {
            amounts[knobToRotateIndex]++;
            //updateKnobs();
            //Qui scrivere il valore dell'angolazione su firebase
            updateView();
            updateSound();
        }
    }
    else if (yDirection == "down" && antiGlitchFlag > -1) {
        if (amounts[knobToRotateIndex] > minAmount) {
            amounts[knobToRotateIndex]--;
            //Qui scrivere il valore dell'angolazione su firebase
            //updateKnobs();
            updateView();
            updateSound();
        }
    }
}

function updateSound(){
    if (knobToRotateIndex == 1 ) {
        offset1 = Math.pow(2,(amounts[1]*SENS/270*2 - 1)/12);
    }
    else if (knobToRotateIndex == 3) {
        offset2 = Math.pow(2,(amounts[3]*SENS/270*2 - 1)/12);

    }

}

/*
e.PageY ritorna l'altezza della pagina, a cui si trova il puntatore del mouse.
OldY e' il valore precedente d'altezza della pagina a cui si trovava il puntatore del mouse.
Dunque valutando la condizione e.PageY ">" o "<" di oldY si puo' stabilire se la rotazione del knob sia in senso orario
(nel caso l'utente sposti il mouse verso l'alto) od antiorario (nel caso l'utente sposti il mouse verso il basso).
Bisogna pero' fare attenzione al glitch che si puo' verificare in tal caso. 
Infatti: supponiamo che l'utente smetta di ruotare il knob, rilasciando il tasto del mouse. Si supponga
che l'utente rilasci il mouse sulla posizione d'altezza 150. Pertanto il valore di oldY diventa 150.
Pero' il knob occupa piu' punti sull'asse Y, ad esempio dalle posizioni 130 a 160. Dunque se l'utente muove verso
in basso il mouse, ma clicca inizialmente sul knob all'altezza 153, la funzione "getMouseDirection()"
considera questo movimento verso l'alto perche' la posizione attuale del mouse sull'asse Y e' 153, ed oldY e' 150. Pertanto si avra' una minima
rotazione nel senso opposto a quello voluto dall'utente. Alla fine della prima esecuzione il valore di oldY diventa 153.
Alla seconda esecuzione di getMouseDirection, sempre nell'ambito della stessa rotazione (cioe' l'utente non ha ancora rilasciato il tasto
sul mouse) essendo il movimento del mouse un movimento continuo, si ha oldY aggiornato alla posizione corrente del mouse, 
in tal caso al valore 153. Per cui il glitch non si presenta piu'. Pertanto e' stata introdotta la variabile antiglitchFlag,
inizializzata in modo che getMouseDirection venga eseguita almeno 2 volte nell'ambito della stessa rotazione, prima di aggiornare modello,
view e audio. 
*/


function getMouseDirection(e) {

    if (e.pageY < oldY) {
        yDirection = "up";
    } else if (e.pageY > oldY) {
        yDirection = "down";
    }
    oldY = e.pageY;
    antiGlitchFlag++;
}







































/*DA SISTEMARE*/


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











/*DA SISTEMARE FINO ALLA FINE*/



function updateSliders(slider){
  id = slider.getAttribute("id");
  id = id.substr(1); //Rimuove il primo elemento dell'array, dunque la prima lettera dell'id. Non si poteva utilizzare il metodo usato coi knob perchè alcuni index hanno due cifre
    sliderChangeIndex = parseInt(id) - 1;
    console.log(sliderChangeIndex);
    sliderAmounts[sliderChangeIndex]=parseInt(slider.value);
    console.log("New value: "+sliderAmounts);
}

function updatePitch1(slider){
  pitch_amount1 = parseInt(slider.value);
}

function updatePitch2(slider){
  pitch_amount2 = parseInt(slider.value);
}


document.querySelectorAll(".slider").forEach(function(){
  this.oninput = function(e){controller(e.target)};
})



function updateSelectors(selector){
  id = selector.getAttribute("id");
  id = id.substr(8); 
    selectorChangeIndex = parseInt(id) - 1;
    console.log(selectorChangeIndex);
    selectorValues[selectorChangeIndex]=selector.value;
    console.log("New value: "+selectorValues[selectorChangeIndex]);
}


document.querySelectorAll(".selector").forEach(function(){
  this.oninput = function(e){controller(e.target)};
})

function controller(data){

  if (data.getAttribute("class").includes("selector")){
    updateSelectors(data);
  }
  else if(data.getAttribute("id")=='sp1'){
    updatePitch1(data);
  }
  else if(data.getAttribute("id")=='sp2'){
    updatePitch2(data);
  }
  else{
    updateSliders(data);
  }
}







