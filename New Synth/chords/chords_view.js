var plusButton = document.getElementById("plus-button");
var minusButton = document.getElementById("minus-button");
var plusSpan = document.getElementById("plus-button-span");
var editButtons = document.getElementsByClassName("chord-edit");
var chordsBlocksHtml = document.getElementById("chords-blocks");

plusButton.addEventListener("click", addChord, false);
minusButton.addEventListener("click", removeChord, false);

function createChordEventListeners(){
		newEditButton = Array.from(document.getElementsByClassName("chord-edit")).pop();
		newEditButton.addEventListener("click", editChord, false);
}