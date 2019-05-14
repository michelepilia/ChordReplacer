var fundamentalSelector = document.getElementById("fundamental-chord");
var qualitySelector = document.getElementById("quality-chord");
var extensionSelector = document.getElementById("extension-chord");
var inversionSelector = document.getElementById("inversion-chord");
var chordsToSwap = [];
var swapActive = 0;
var instPlayMode = false;
var actualChord;
var allVoices=[];

function addChord() {
	var chord = new Chord();

	sequencer.push(chord);

	var chordHtml = document.createElement("SPAN");
	chordHtml.classList.add("chord");
	chordHtml.classList.add("actual-chord");
	currentIndex = document.getElementsByClassName("chord").length - 1;
	chordHtml.id = "c"+currentIndex;

	var canvas = document.createElement("CANVAS");
	canvas.classList.add("time-bar");

	var chordNameHtml = document.createElement("div");
	chordNameHtml.classList.add("chord-name");
	chordNameHtml.id = "t"+currentIndex;
	chordNameHtml.innerHTML="REST";

	var chordTypeHtml = document.createElement("div");
	chordTypeHtml.classList.add("chord-type");
	chordTypeHtml.innerHTML=" ";

	var chordSubHtml = document.createElement("div");
	chordSubHtml.classList.add("chord-substitution");
	chordSubHtml.innerHTML="S";
	chordSubHtml.id = "s" + (document.getElementsByClassName("chord").length-1);

	var eButton = document.createElement("DIV");
	eButton.classList.add("chord-edit");
	eButton.innerHTML = "E";

	var swapButton = document.createElement("div");
	swapButton.classList.add("chord-swap");
	swapButton.innerHTML = "Sw";
	swapButton.id="swap-button-"+(document.getElementsByClassName("chord").length-1);


	var quantizationButton = document.createElement("div");
	quantizationButton.classList.add("quantization-button");
	var plusButton = document.createElement("div");
	var minusButton = document.createElement("div");
	plusButton.id = "plus-button-"+currentIndex;
	minusButton.id = "minus-button-"+currentIndex;
	plusButton.classList.add("quantization-plus");
	minusButton.classList.add("quantization-minus");
	plusButton.innerHTML="+";
	minusButton.innerHTML="-";
	quantizationButton.appendChild(plusButton);
	quantizationButton.appendChild(minusButton);


	chordsBlocksHtml.insertBefore(chordHtml, plusSpan);
	chordHtml.appendChild(canvas);
	chordHtml.appendChild(eButton);
	chordHtml.appendChild(chordSubHtml);
	chordHtml.appendChild(chordTypeHtml);
	chordHtml.appendChild(chordNameHtml);

	chordHtml.appendChild(swapButton);
	chordHtml.appendChild(quantizationButton);

	var style = window.getComputedStyle(chordHtml, null);
    var actualSize = parseInt(style.getPropertyValue("width").substr(0,style.getPropertyValue("width").length-2));
	canvas.width = actualSize;

	createChordEventListeners(); 


}


function addChordFromDB(idx) {

	var chordHtml = document.createElement("SPAN");
	chordHtml.classList.add("chord");
	chordHtml.classList.add("actual-chord");
	currentIndex = idx;
	chordHtml.id = "c"+currentIndex;

	var canvas = document.createElement("CANVAS");
	canvas.classList.add("time-bar");

	var chordNameHtml = document.createElement("div");
	chordNameHtml.classList.add("chord-name");
	chordNameHtml.id = "t"+currentIndex;
	chordNameHtml.innerHTML=""; 

	var chordTypeHtml = document.createElement("div");
	chordTypeHtml.classList.add("chord-type");
	chordTypeHtml.innerHTML=" ";

	var chordSubHtml = document.createElement("div");
	chordSubHtml.classList.add("chord-substitution");
	chordSubHtml.innerHTML="S";

	var eButton = document.createElement("DIV");
	eButton.classList.add("chord-edit");
	eButton.innerHTML = "E";

    var swapButton = document.createElement("div");
	swapButton.classList.add("chord-swap");
	swapButton.innerHTML = "Sw";
	swapButton.id="swap-button-"+(document.getElementsByClassName("chord").length-1);


	var quantizationButton = document.createElement("div");
	quantizationButton.classList.add("quantization-button");
	var plusButton = document.createElement("div");
	var minusButton = document.createElement("div");
	plusButton.id = "plus-button-"+currentIndex;
	minusButton.id = "minus-button-"+currentIndex;
	plusButton.classList.add("quantization-plus");
	minusButton.classList.add("quantization-minus");
	plusButton.innerHTML="+";
	minusButton.innerHTML="-";
	quantizationButton.appendChild(plusButton);
	quantizationButton.appendChild(minusButton);

	chordsBlocksHtml.insertBefore(chordHtml, plusSpan);
	chordHtml.appendChild(canvas);
	chordHtml.appendChild(eButton);
	chordHtml.appendChild(chordSubHtml);
	chordHtml.appendChild(chordTypeHtml);
	chordHtml.appendChild(chordNameHtml);
	chordHtml.appendChild(swapButton);
	chordHtml.appendChild(quantizationButton);
	
	var style = window.getComputedStyle(chordHtml, null);
    var actualSize = parseInt(style.getPropertyValue("width").substr(0,style.getPropertyValue("width").length-2));
	canvas.width = actualSize;

	updateChordTag(sequencer[idx], idx);
	createChordEventListeners(); 

}



function removeChord(){
	
	if (sequencer.length > 0){
		delete(sequencer.pop());
		blockToRemove = document.getElementsByClassName("chord")[document.getElementsByClassName("chord").length - 2];
		blockToRemove.remove();
	}
	else return;
}

function editChord(){

	var chordIdx = parseInt(document.getElementsByClassName("done-button-chord")[0].id.substr(15));
	sequencer[chordIdx].noteFlag = true;
	sequencer[chordIdx].fundamental = fundamentalSelector.value;
	sequencer[chordIdx].quality = qualitySelector.value;
	sequencer[chordIdx].extension = extensionSelector.value;
	sequencer[chordIdx].inversion = inversionSelector.value;

	closeChordEditor();
	updateChordTag(sequencer[chordIdx], chordIdx);
}

function saveChordsPresetName(){
  chordsPresetName = document.getElementById("preset-chords-name").value;
}

function getNoteFromIntervalAbs(initNote, interval){
	initValue = noteDict[initNote];
	targetValue = (initValue+interval)%12;
	targetNote = noteDictInverse[targetValue];
	return targetNote;
}


function handleSwap(data){
	var id = data.target.getAttribute("id").substr(12);
	if (swapActive==0) {
		chordsToSwap[0] = sequencer[id];
		chordsToSwap[1] = id;
		swapActive=1;
		updateChordsViewForSwap(data);
	}
	else if (swapActive==1) {
		chordsToSwap[2] = sequencer[id];
		chordsToSwap[3] = id;
		sequencer[chordsToSwap[1]]=chordsToSwap[2];
		sequencer[chordsToSwap[3]]=chordsToSwap[0];
		swapActive=0;
		updateChordsViewForSwap(data);
		updateChordTag(sequencer[chordsToSwap[1]], chordsToSwap[1]);
	    updateChordTag(sequencer[chordsToSwap[3]], chordsToSwap[3]);
	}
}


function changeChordSize(data){
	var type = -1;
	var chordIndex = data.target.getAttribute("id").substr(13);;
	if (data.target.getAttribute("class")=='quantization-plus') {
		chordIndex = data.target.getAttribute("id").substr(12);
		type = 1 ;
	}
	var chordHtml = document.getElementById("c"+chordIndex);
	if (sequencer[chordIndex].duration + type >=1) {
		sequencer[chordIndex].duration = sequencer[chordIndex].duration+type;
		updateChordDurationInView("c"+chordIndex,type);
	}
	//console.log(sequencer[chordIndex].duration);
}


function toggleInstPlayMode(){
	var chordTags = document.getElementsByClassName("chord-name");
	if (instPlayMode){
		for(i=0; i<chordTags.length; i++){
			chordTags[i].removeEventListener("click", instPlayChord);
			chordTags[i].removeEventListener("mouseover", chordTagMouseOver);
			chordTags[i].removeEventListener("mouseout", chordTagMouseOut);
		}
	}
	else {
		for(i=0; i<chordTags.length; i++){
			chordTags[i].addEventListener("click", instPlayChord);
			chordTags[i].addEventListener("mouseover", chordTagMouseOver);
			chordTags[i].addEventListener("mouseout", chordTagMouseOut);
		}
	}
	instPlayMode = !instPlayMode;
	toggleInstPlayButton();
}

function instPlayChord(data){
	var id = parseInt(data.target.getAttribute("id").substr(1));
	var playingchord = sequencer[id];
	var freqs = createVoicing(playingchord);
	var sustainTime = playingchord.duration*quantumTime/1000; /*[seconds]*/
	sequencer[id].setSustainTime(sustainTime);
    sequencer[id].setIndex(id);
  	var position = isChordPlaying(id);
    if (position!=-1){
    	clearTimeout(playingChords[position].timeOfRelease);
    	scavenger();
    	playNotesFromFrequencies(freqs, 1, false,sustainTime,id);
    }
    else{
    	playNotesFromFrequencies(freqs, 1, false,sustainTime,id);
    }
}
function scavenger(){
	if (playingChords.length>0) {
		for (var i = 0; i < playingChords.length; i++) {
			for (var k = 0; k < playingChords[i].voices.length; k++) {
				voice.oscillator1.stop();
				voice.oscillator2.stop();
				voice.oscillator1.disconnect();
				voice.oscillator2.disconnect();
				voice.gain1.disconnect();
				voice.gain2.disconnect();
				playingChords[i].voices.pop();
			}
		}
	}
	playingChords=[];

	for (var i = 0; i <= allVoices.length; i++) {
		if (allVoices[i]!=null &&allVoices[i].frequency!=0) {
			allVoices[i].oscillator1.stop();
			allVoices[i].oscillator2.stop();
		}
	}
	for (var i = 0; i <= allVoices.length; i++) {
		allVoices.pop();
	}
}

function createVoicing(chord){

	var fund = noteDict[chord.fundamental] + 36;
	var voicing = [];
	var freqVoicing = [];
	var first;
    var third;
    var fifth;
    var extension;

    if (chord.noteFlag) {
        first = fund;
        if(chord.quality=="maj"){
        	third=fund+4;
        	fifth=fund+7;
        }
        else if (chord.quality=="min"){
        	third=fund+3;
        	fifth=fund+7;
        }
        else if (chord.quality=="sus2"){
        	third=fund+2;
        	fifth=fund+7;
        }
        else if (chord.quality=="sus4"){
        	third=fund+5;
        	fifth=fund+7;
        }
        else if (chord.quality=="aug"){
        	third=fund+4;
        	fifth=fund+8;
        }
        else if (chord.quality=="dim"){
        	third=fund+3;
        	fifth=fund+6;
        }

        if (chord.extension=="none") {ext=fund+12;}
        else if (chord.extension=="6") {ext=fund+9;}
        else if (chord.extension=="b7") {ext=fund+10;}
        else if (chord.extension=="maj7") {ext=fund+11;}
        else if (chord.extension=="9") {ext=fund+14;}
        else if (chord.extension=="11") {ext=fund+17;}
        else if (chord.extension=="13") {ext=fund+21;}


        //C0, E4, G7, B11 The notes in variables
      	//C0, C12, G19, E28, B35 The notes I want in a C maj7

        voicing = [fund, fund+12, fifth+12, third+24, ext+24];
      	if (chord.inversion==1){voicing[0] = third;}
      	else if (chord.inversion==2){voicing[0] = fifth;}

      	freqVoicing = voicing.map(function(x){
      		return Math.pow(2, ((x-69)/12))*440;
      	})


    }
    return freqVoicing;

}


function moveToNextChord(){
console.log("called");

}

function stopAudioPlay(){


}

function tellTheSubs(data){
	var subs = [];
	var id = parseInt(data.target.parentElement.getAttribute("id").substr(1));
	var chord = sequencer[id];
	var prevChord = sequencer[id-1];
	var nextChord = sequencer[id+1];
	var newChord;
	var newSub;

	if (prevChord==undefined){prevChord = new Chord();};
	if (nextChord==undefined){nextChord = new Chord();};

	//Preparation by seventh
	newChord = new Chord();
	newChord.fundamental = noteDictInverse[(noteDict[chord.fundamental]+7)%12];
	newChord.noteFlag = true;
	newChord.quality = "maj";
	newChord.extension = "b7";
	newChord.inversion = "none";
	newChord.duration = quantization;
	newSub = new Substitution("Preparation by VII", chord, [newChord]);
	subs.push(newSub);

	if (chord.quality == "maj" && chord.extension == "b7"){ //Tritone Substitution + VII dim7 + #II dim7 as dominant + aug triad +...
		//Tritone
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse[(noteDict[chord.fundamental]+6)%12]; //WRT V degree
		newSub = new Substitution("Tritone Substitution", chord, [newChord]);
		subs.push(newSub);

		//VII dim7
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse[(noteDict[chord.fundamental]+3)%12]; //WRT V degree
		newChord.quality = "dim";
		newChord.extension = "b7";
		newChord.inversion = "none";
		newSub = new Substitution("VII dim7 as dominant", chord, [newChord]);
		subs.push(newSub);

		//#IIdim7
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse[(noteDict[chord.fundamental]+8)%12]; //WRT V degree
		newChord.quality = "dim";
		newChord.extension = "b7";
		newChord.inversion = "none";
		newSub = new Substitution("#II dim7 as dominant", chord, [newChord]);
		subs.push(newSub);

		//Aug
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.quality = "aug";
		newChord.extension = "b7";
		newChord.inversion = "none";
		newSub = new Substitution("V aug as dominant", chord, [newChord]);
		subs.push(newSub);
		

		//Preparation by minor7
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse[(noteDict[chord.fundamental]+7)%12]; //WRT V degree (II-V)
		newChord.quality = "min";
		newChord.extension = "b7";
		newChord.inversion = "none";
		newSub = new Substitution("Preparation by minor 7", chord, [newChord]);
		subs.push(newSub);

		newSub = new Substitution("Back propagation of 7th", chord, []);
		subs.push(newSub);


		//Backdoor Progression
		var secMin = noteDictInverse[(noteDict[chord.fundamental]+7)%12];
		var tonic = noteDictInverse[(noteDict[chord.fundamental]+5)%12];
		if ((prevChord.fundamental==secMin && prevChord.quality=="min")&&(nextChord.fundamental==tonic && nextChord.quality=="maj")) {
			var newChord1 = new Chord(); 
			var newChord2 = new Chord();
			newChord1.fundamental = noteDictInverse[(noteDict[chord.fundamental]+10)%12]; 
			newChord2.fundamental = noteDictInverse[(noteDict[chord.fundamental]+3)%12];
			newChord1.quality = "min";
			newChord2.quality = "maj";
			newChord1.extension = "b7";
			newChord2.extension = "b7";
			newChord1.inversion = "none";
			newChord2.inversion = "none";
			newChord1.duration = chord.duration/2;
			newChord2.duration = chord.duration/2;

			newSub = new Substitution("Backdoor Progression", chord, [newChord1, newChord2]);
			subs.push(newSub);
		};

	}

	if (chord.quality == "maj"){ //II-V 
		var newChord1 = new Chord(); 
		var newChord2 = new Chord();
		newChord1.fundamental = noteDictInverse[(noteDict[chord.fundamental]+2)%12]; 
		newChord2.fundamental = noteDictInverse[(noteDict[chord.fundamental]+7)%12];
		newChord1.noteFlag = true;
		newChord2.noteFlag = true;
		newChord1.quality = "min";
		newChord2.quality = "maj";
		newChord1.extension = "b7";
		newChord2.extension = "b7";
		newChord1.inversion = "none";
		newChord2.inversion = "none";
		newChord1.duration = chord.duration/2;
		newChord2.duration = chord.duration/2;

		newSub = new Substitution("Preparation by II-V", chord, [newChord1, newChord2]);
		subs.push(newSub);
	}

	if (chord.quality == "maj" && (chord.extension=="none" || chord.extension=="maj7" || chord.extension=="6")){ //Tonic sub (Assuming that a major chord if no b7 is tonic) 
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse[(noteDict[chord.fundamental]+9)%12];
		newChord.quality = "min";
		newChord.extension = "b7";
		newChord.inversion = "none";
		newSub = new Substitution("Tonic Substitution (relative min)", chord, [newChord]);
		subs.push(newSub);

		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse[(noteDict[chord.fundamental]+4)%12];
		newChord.quality = "min";
		newChord.extension = "b7";
		newChord.inversion = "none";
		newSub = new Substitution("Tonic Substitution (III min)", chord, [newChord]);
		subs.push(newSub);
	}

	if (chord.quality == "maj" && (chord.extension == "none" || chord.extension == "maj7" || chord.extension == "6")){ //IV minor substitution 1
		tonic = noteDictInverse[(noteDict[chord.fundamental]+7)%12];
		if (nextChord.fundamental = tonic && nextChord.quality == "maj" && (nextChord.extension == "none" || nextChord.extension == "maj7" || nextChord.extension == "6")){
			newChord = new Chord();
			Object.assign(newChord, chord);
			newChord.quality = "min";
			newChord.extension = "none";
			newChord.inversion = "none";
			newSub = new Substitution("IV minor(1)", chord, [newChord]);
			subs.push(newSub);
		}
	}

	if (chord.quality == "maj" && (chord.extension == "none" || chord.extension == "b7")){ //IV minor substitution 2
		tonic = noteDictInverse[(noteDict[chord.fundamental]+5)%12];
		subDom = noteDictInverse[(noteDict[chord.fundamental]+10)%12];
		
		if (prevChord.fundamental == subDom && prevChord.quality =="maj" && nextChord.fundamental == tonic && nextChord.quality == "maj" && (nextChord.extension == "none" || nextChord.extension == "maj7" || nextChord.extension == "6") && (prevChord.extension == "none" || prevChord.extension == "maj7" || prevChord.extension == "6")){
			newChord = new Chord();
			Object.assign(newChord, chord);
			newChord.quality = "min";
			newChord.extension = "none";
			newChord.inversion = "none";
			newSub = new Substitution("IV minor(2)", chord, [newChord]);
			subs.push(newSub);
		}
	
	}

	if (chord.quality == "dim" && chord.extension == "6"){ //General dim substitution (like a simple inversion)
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse[(noteDict[chord.fundamental]+3)%12];
		newSub = new Substitution("General dim7 substitution", chord, [newChord]);
		subs.push(newSub);
	}

	if (chord.quality == "aug"){ //General dim substitution (like a simple inversion)
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse[(noteDict[chord.fundamental]+4)%12];
		newSub = new Substitution("General aug substitution", chord, [newChord]);
		subs.push(newSub);
	}

	//Left deletion
	newSub = new Substitution("Left deletion", chord, []);
	subs.push(newSub);

	return subs;

}

function applySubstitution(data){
	var length = "apply-substitution-button".length-1;
	var subIndexInSubs = data.target.getAttribute("id").substr(length);
	closeSubstitution();
	alert("Apply substituition with index: " + subIndexInSubs);
}

function isChordPlaying(sequencerIndex){
	if (playingChords.length>0) {
		for (var i = 0; i <= playingChords.length; i++) {
			if (playingChords[i].indexInSequencer==sequencerIndex) {
				return i;
			}
		}
	}
	return -1;
}


function getSubsExplanation(subst){
	var strToReturn = "";

	
	if ((subst.name=="Preparation by minor 7") || (subst.name=="Preparation by VII")){
		strToReturn = "| X | " + chordToString(subst.origin) + " | " + "&#8594;" + "| X " + chordToString(subst.destination[0]) + " | " + chordToString(subst.origin) + " |";
	}
	else if (subst.name=="Back propagation of 7th"){
		strToReturn = "| X | " + chordToString(subst.origin) + " Y | " + "&#8594;" + "| X " + chordToString(subst.origin) + " | Y |";
	}
	else if ((subst.name=="Backdoor Progression") || (subst.name=="Preparation by II-V")){
		strToReturn = "| X | " + chordToString(subst.origin) + " | " + "&#8594;" + "| X " + chordToString(subst.destination[0]) + " " + chordToString(subst.destination[1]) + " | " + chordToString(subst.origin) + " |";
	}
	else if (subst.name=="Left deletion"){
		strToReturn = "| X | " + chordToString(subst.origin) + " | " + "&#8594;" + "| X |";
	}
	else {
		
		strToReturn = chordToString(subst.origin) + "&#8594;" + chordToString(subst.destination[0]);
		
	}

	return strToReturn;
}

function chordToString(chord){
    var first = "";
    var second = "";
    var third = "";
    var fourth = "";

    if (chord.noteFlag) {
        first = chord.fundamental;
        if(chord.quality=="maj"){second="";}
        else if (chord.quality=="min"){second="-";}
        else if (chord.quality=="sus2" || chord.quality=="sus4"){second = "<sub style='vertical-align: sub; font-size: 10px;'>" + chord.quality + "</sub>";}
        else if (chord.quality=="aug"){second="#5";}

        if (chord.extension=="none"){third = "";}
        else if (chord.extension=="maj7"){third = "<sup style='vertical-align: super; font-size: 10px;'>&#916</sup>";} //delta
        else if (chord.extension=="b7"){third = "<sup style='vertical-align: super; font-size: 10px;'>7</sup>";}
        else {third = "<sup style='vertical-align: super; font-size: 10px;'>" + chord.extension + "</sup>";}


        if (chord.quality=="dim"){
            if (chord.extension=="6"){ //bb7
                second = "<sup style='vertical-align: super; font-size: 10px;'>°7</sup>";
                third = "";
            }
            else if (chord.extension=="b7"){
                second = "-" + "<sup style='vertical-align: super; font-size: 10px;'>7</sup>";
                third = "&#9837"+"&#53;"; //bemolle
            }
            else if (chord.extension=="maj7"){
                second = "-" + "<sup style='vertical-align: super; font-size: 10px;'>&#916</sup>"; //delta
                third = "&#9837"+"&#53;"; //bemolle 5
            }
            else if (chord.extension=="none"){
                second = "- ";
                third = "&#9837"+"&#53;"; //bemolle
            }
            else {
                second = "-" + "<sup style='vertical-align: super; font-size: 10px;'>7</sup>";
                third = "&#9837"+"&#53"+"<sup style='vertical-align: super; font-size: 10px;'>9</sup>";
            }
        }

        if (chord.inversion==0) {fourth="";}
        else if (chord.inversion==1) {
            if (chord.quality=="maj" || chord.quality=="aug"){fourth="/"+getNoteFromIntervalAbs(chord.fundamental, 4);}
            else if (chord.quality=="min"||chord.quality=="dim"){fourth="/"+getNoteFromIntervalAbs(chord.fundamental, 3);}
            else {fourth="";}
        }
        else if (chord.inversion==2) {
            if (chord.quality=="maj" || chord.quality=="min" || chord.quality=="sus2" || chord.quality=="sus4"){
                fourth="/"+getNoteFromIntervalAbs(chord.fundamental, 7);
            }
            else if (chord.quality=="dim"){fourth="/"+getNoteFromIntervalAbs(chord.fundamental, 6);}
            else if (chord.quality=="aug"){fourth="/"+getNoteFromIntervalAbs(chord.fundamental, 8)}
            else {fourth="";}
        }
        return first+second+third+fourth;
    }

    else {
        return ".";
    }

}
