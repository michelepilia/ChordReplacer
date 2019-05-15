var playingVoices = [];
var playedChord = false;
var classToRotate = "int-knob";/*indica la classe html di cui si vuole effettuare la rotazione*/
var classToRotate2 = "." + classToRotate;
var knobToRotateIndex = 0;
var oldY = 0;
var yDirection = "";
var antiGlitchFlag = 0;
var keyboardPlay = false; 


function startVoice(voice) {

  voice.gain1.connect(pre_filt_gain);
  voice.gain2.connect(pre_filt_gain);
  voice.oscillator1.connect(pre_gain1);
  voice.oscillator2.connect(pre_gain2);
  pre_gain1.connect(voice.gain1);
  pre_gain2.connect(voice.gain2);
  voice.oscillator1.frequency.value = voice.frequency * offset3;
  voice.oscillator1.frequency.value = voice.oscillator1.frequency.value * offset1;
  voice.oscillator2.frequency.value = voice.frequency * offset4;
  voice.oscillator2.frequency.value = voice.oscillator2.frequency.value * offset2;
  voice.oscillator1.type = selectorValues[0];
  voice.oscillator2.type = selectorValues[1];
  playNote(voice);
}


function keyDownListener(e){ 
  if (keyboardPlay) {
    if(keys.includes(e.key) && !e.repeat){
      voice = new Voice(tones[keys.indexOf(e.key)]); //Voce è inteso come signal path totale 
      //playingNotes.push(voice); 
      //startVoice(playingNotes[playingNotes.length-1]);
    }
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

function sliderListener(data){
  var slider = data.target;
  if(slider.getAttribute("id")=='sp1'){
    pitch_amount1 = parseInt(slider.value);
    offset3 = Math.pow(2,(pitch_amount1)/12);
  }
  else if(slider.getAttribute("id")=='sp2'){
    pitch_amount2 = parseInt(slider.value);
    offset4 = Math.pow(2,(pitch_amount2)/12);
  }
  else {
    id = slider.getAttribute("id");
    id = id.substr(1) -1; //Rimuove il primo elemento dell'array, dunque la prima lettera dell'id. Non si poteva utilizzare il metodo usato coi knob perchè alcuni index hanno due cifre
    sliderChangeIndex = parseInt(id);
    console.log("sl index = "+sliderChangeIndex);
    sliderAmounts[sliderChangeIndex]=parseInt(slider.value);
    if (sliderChangeIndex == 5) {
      lfo_amp.gain.value = lfoGainType();
    }
  }
}

function selectorListener(data){
  selector = data.target;

  id = selector.getAttribute("id");
  id = id.substr(8); 
  selectorChangeIndex = parseInt(id) - 1;
  selectorValues[selectorChangeIndex]=selector.value;

  if (selectorChangeIndex==2) {
    lfo.type = selectorValues[2];
  }
  else if (selectorChangeIndex==3) {
    lfo_amp.disconnect();
    console.log("lfo disconnected");
    lfo_amp.connect(lfo_destinations[(parseInt(selectorValues[3]))]); 
  }
}

function rotate(data) {
  getMouseDirection(data);
  if (yDirection == "up" && antiGlitchFlag > -1) {
      if (amounts[knobToRotateIndex] < maxAmount) {
          amounts[knobToRotateIndex]++;
      }
  }
  else if (yDirection == "down" && antiGlitchFlag > -1) {
      if (amounts[knobToRotateIndex] > minAmount) {
          amounts[knobToRotateIndex]--;
      }
  }
  updateView();

  if (knobToRotateIndex == 1 ) { //Detune 1
      offset1 = Math.pow(2,(amounts[1]/(maxAmount-minAmount)*2 - 1)/12);
  }
  else if (knobToRotateIndex == 3) { //Detune 2
      offset2 = Math.pow(2,(amounts[3]/(maxAmount-minAmount)*2 - 1)/12);
  }
  else if (knobToRotateIndex == 4){ //Cutoff
    filt.frequency.value = minFilt+(amounts[4]/(maxAmount-minAmount)*(maxFilt-minFilt));
  }
  else if (knobToRotateIndex == 5){ //Reso
    filt.Q.value = minQ+(amounts[5]/(maxAmount-minAmount)*(maxQ-minQ));
  }
  else if (knobToRotateIndex == 6){ //EG
    eg = minFilt+(amounts[6]/(maxAmount-minAmount)*(maxFilt-minFilt)); //Calcolo frequenza eg
  }
  else if (knobToRotateIndex == 7){ //LFO Rate 
    lfo.frequency.value = minLfo+(amounts[7]/(maxAmount-minAmount)*maxLfo);
  }
  else if (knobToRotateIndex == 8){ //Master
    master.gain.value=amounts[8]/(maxAmount-minAmount);
  }


}



function lfoGainType(){
  if (selectorValues[3] == "0") {
    //minFilt+(amounts[6]/(maxAmount-minAmount)*(maxFilt-minFilt));
    return minLfo+(sliderAmounts[5]/100/(maxLfoAmpGain-minLfoAmpGain)*(maxLfoAmpGain-minLfoAmpGain));
  }
  else if (selectorValues[3] == "1"){
    console.log(sliderAmounts[5]*10);
    return sliderAmounts[5]*10;
  }
  else {
    return 25*sliderAmounts[5]/100;
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



function timeoutRelease(e){
  var a = noteIsPlaying(tones[keys.indexOf(e.key)]);//prevents global variable to be changed while executing code here
  release(playingNotes[a]);
  setTimeout(function(){
        a = noteIsPlaying(tones[keys.indexOf(e.key)]);
        release2(playingNotes[a]);
        playingNotes.splice(a,1);
    }, now + sliderAmounts[9]/100*1000);
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


function keyboardMaker() {
  var f = 262;
  var i;
  for (i=0; i<(keys.length); i++){
    tones[i] = Math.round(262*Math.pow(2,1/12)**i);
    //console.log(scale[i]+" "+(i+1));k
  }
  //console.log("Ciao");
}


function saveSynthPresetName(){
  synthPresetName = document.getElementById("preset-synth-name").value;
}

function playNotesFromFrequencies(arrayOfFrequencies,multFactor,bypass, sustainTime,index){
  var ind;
  for ( i = 0; i < arrayOfFrequencies.length; i++) {
    voice = new Voice(arrayOfFrequencies[i]*multFactor);
    sequencer[index].voices.push(voice);
    voice.gain1.connect(filt);
    voice.gain2.connect(filt);
    voice.oscillator1.connect(voice.gain1);
    voice.oscillator2.connect(voice.gain2);
    voice.oscillator1.frequency.value = voice.frequency * offset3;
    voice.oscillator1.frequency.value = voice.oscillator1.frequency.value * offset1;
    voice.oscillator2.frequency.value = voice.frequency * offset4;
    voice.oscillator2.frequency.value = voice.oscillator2.frequency.value * offset2;
    voice.oscillator1.type = selectorValues[0];
    voice.oscillator2.type = selectorValues[1];
    attackTime = sliderAmounts[6]/100;
    decayTime = sliderAmounts[7]/100;
    releaseTime = sliderAmounts[9]/100;
    allVoices.push(voice);
    //console.log("rltime = "+ releaseTime);
    //console.log(attackTime+decayTime+sustainTime);
    playTransient(voice, attackTime, decayTime, sustainTime);/*[seconds]*/
  }
  ind = index;
  sequencer[index].timerOfRelease = setTimeout(function(){
    now = c.currentTime;
    t3 = now;
    //console.log("rltime = "+ releaseTime);
    filt.frequency.linearRampToValueAtTime(minFilt+(amounts[4]/(maxAmount-minAmount)*(maxFilt-minFilt)), now + sliderAmounts[3]/100);
    for (k = 0; k < sequencer[index].voices.length; k++) {    
      //console.log("rltime = "+ releaseTime);
        releaseVoice(sequencer[index].voices[k],t3,releaseTime,ind);        
    }
    }, sustainTime*1000);
  playingChords.push(sequencer[index]);
}

function releaseVoice(voice, t3,releaseTime,ind){
  //console.log("rltime = "+ releaseTime);
  voice.gain1.gain.linearRampToValueAtTime(0, t3+releaseTime);
  voice.gain2.gain.linearRampToValueAtTime(0, t3+releaseTime);
  setTimeout(function(){
  voice.oscillator1.stop();
  voice.oscillator2.stop();
  voice.oscillator1.disconnect();
  voice.oscillator2.disconnect();
  voice.gain1.disconnect();
  voice.gain2.disconnect();
  voice.released = true;
  sequencer[ind].voices.pop();
  voice.frequency=0;
  if (sequencer[ind].voices.length==0) {
    playingChords.pop();
  }
  console.timeEnd();
  },releaseTime*1000);
}

function enableKeyboard(){
  keyboardPlay = !keyboardPlay;
}