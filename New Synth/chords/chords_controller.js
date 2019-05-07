var fundamentalSelector = document.getElementById("fundamental-chord");
var qualitySelector = document.getElementById("quality-chord");
var extensionSelector = document.getElementById("extension-chord");
var inversionSelector = document.getElementById("inversion-chord");
var chordsToSwap = [];
var swapActive = 0;

function addChord() {
	var chord = new Chord();

	sequencer.push(chord);

	var chordHtml = document.createElement("SPAN");
	chordHtml.classList.add("chord");
	currentIndex = document.getElementsByClassName("chord").length - 1;
	chordHtml.id = "c"+currentIndex;

	var canvas = document.createElement("CANVAS");
	canvas.classList.add("time-bar");

	var chordNameHtml = document.createElement("div");
	chordNameHtml.classList.add("chord-name");
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
	createChordEventListeners(); 


}


function addChordFromDB(idx) {

	var chordHtml = document.createElement("SPAN");
	chordHtml.classList.add("chord");
	currentIndex = idx;
	chordHtml.id = "c"+currentIndex;

	var canvas = document.createElement("CANVAS");
	canvas.classList.add("time-bar");

	var chordNameHtml = document.createElement("div");
	chordNameHtml.classList.add("chord-name");
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


function increaseChordSize(data){
	console.log("handleIncreaseInSize");
}

function decreaseChordSize(data){
	console.log("handleDescreaseInSize");
}