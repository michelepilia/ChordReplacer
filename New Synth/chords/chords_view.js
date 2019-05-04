var plusButton = document.getElementById("plus-button");
var minusButton = document.getElementById("minus-button");
var plusSpan = document.getElementById("plus-button-span");
var editButtons = document.getElementsByClassName("chord-edit");
var chordsBlocksHtml = document.getElementById("chords-blocks");
var chordEditor = document.getElementById("edit-chord-window");
var doneButton = document.getElementById("done-edit-chord");
var saveChords = document.getElementById("save-chords");
var loadChords = document.getElementById("load-chords");

plusButton.addEventListener("click", addChord, false);
minusButton.addEventListener("click", removeChord, false);
doneButton.addEventListener("click", editChord, false);
saveChords.addEventListener("click", saveChordsPreset, false);
loadChords.addEventListener("click", loadChordsPreset, false);

function createChordEventListeners(){
	newEditButton = Array.from(document.getElementsByClassName("chord-edit")).pop();
	newEditButton.addEventListener("click", showChordEditor, false);
}

function showChordEditor(data){
	chordEditor.style.display = "block";
	doneButton.id = "done-edit-chord" + data.target.parentElement.getAttribute("id").substr(1);
}

function closeChordEditor(){
	chordEditor.style.display = "none";
}

function updateChordTag(chord, id){
	var chordToChange = document.getElementById("c"+id).children[4].innerHTML = chord.fundamental + chord.quality + chord.extension + "[" + chord.inversion + "]";
}

function saveChordsPreset() {
	alert("Basically");
}

function loadChordsPreset() {
	alert("Tipically");
}