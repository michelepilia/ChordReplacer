var fundamentalSelector = document.getElementById("fundamental-chord");
var qualitySelector = document.getElementById("quality-chord");
var extensionSelector = document.getElementById("extension-chord");
var inversionSelector = document.getElementById("inversion-chord");
var chordsToSwap = [];
var swapActive = 0;
var instPlayMode = false;

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
	var msQuantDur = (4/bpm)*(60000/quantization);
	var msChordDur = playingchord.duration*msQuantDur;
	
	playNotesFromFrequencies(freqs, 1, false);
	
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













