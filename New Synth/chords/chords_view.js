var plusButton = document.getElementById("plus-button");
var minusButton = document.getElementById("minus-button");
var plusSpan = document.getElementById("plus-button-span");
var editButtons = document.getElementsByClassName("chord-edit");
var chordsBlocksHtml = document.getElementById("chords-blocks");
var chordEditor = document.getElementById("edit-chord-window");
var doneButton = document.getElementById("done-edit-chord");
var saveChords = document.getElementById("save-chords");
var loadChords = document.getElementById("load-chords");
var chordsLoader = document.getElementById("chords-loader");
var chordsPresetNameField = document.getElementById("preset-chords-name");
var chordsPresetNameFieldContainer = document.getElementById("preset-chords-name-ext");
var playButton = document.getElementById("play-button");
var stopButton = document.getElementById("stop-button");
var actualIndex = 0;

playButton.addEventListener("click",playGraphicView);
stopButton.addEventListener("click",pauseGraphicView);

plusButton.addEventListener("click", addChord, false);
minusButton.addEventListener("click", removeChord, false);
doneButton.addEventListener("click", editChord, false);
saveChords.addEventListener("click", saveChordsPreset, false);
loadChords.addEventListener("click", loadChordsPreset, false);
chordsPresetNameField.addEventListener("input", saveChordsPresetName, false);

function createChordEventListeners(){
	newEditButton = Array.from(document.getElementsByClassName("chord-edit")).pop();
	newEditButton.addEventListener("click", showChordEditor, false);
}

function createChordsLoaderEventListeners() {
    loadChordsButton = document.getElementsByClassName("chords-load-button");
    deleteChordsButton = document.getElementsByClassName("chords-delete-button");
    for (var i = 0; i < loadChordsButton.length; i++) { 
        loadChordsButton[i].addEventListener("click", loadChordsFunction, false); 
        deleteChordsButton[i].addEventListener("click",deleteChordsFunction,false);
    };
}

function showChordEditor(data){
	chordEditor.style.display = "block";
	doneButton.id = "done-edit-chord" + data.target.parentElement.getAttribute("id").substr(1);
}

function closeChordEditor(){
	chordEditor.style.display = "none";
}

function updateChordTag(chord, id){
    if (chord.noteFlag) {
        document.getElementById("c"+id).children[4].innerHTML = chord.fundamental + chord.quality + chord.extension + "[" + chord.inversion + "]";
    }
    else {
        document.getElementById("c"+id).children[4].innerHTML = "REST";
    }
}


function postSaveChordsPreset(){
    saveChords.style.backgroundColor = "red";
    saveChords.innerHTML = "Saved!";
    setTimeout(function(){  saveChords.style.backgroundColor = "darkgray";
                            saveChords.innerHTML = "Save chords"; 
                        }, 700);
}

function openChordsLoader(){
    chordsLoader.style.display = "block";
}

function closeChordsLoader(){
    chordsLoader.style.display = "none";
}



function updateChordsViewFromModel(){

    var sequencerHtml = Array.from(chordsBlocksHtml.children); //Blocchi HTML da rimuovere in formato array
    sequencerHtml.pop(); //Rimuovo l'ultimo, che sarebbe il plus button block

    for (i=1; i<sequencerHtml.length; i++){ //Ripulisco traccia, parto da 1 perché lo 0 è il field text per il name
        sequencerHtml[i].remove();
    }

    for (i=0; i<sequencer.length; i++) {
        addChordFromDB(i);
    };

}

function playGraphicView(){
    numberOfChords = document.getElementsByClassName("chord").length - 1;
    actualIndex=0;
    var actualChord = document.getElementsByClassName("chord")[actualIndex];
    function moveToNextCanvas(){
        numberOfChords = document.getElementsByClassName("chord").length - 1;
        if(actualIndex<document.getElementsByClassName("chord").length-1){
            actualChord = document.getElementsByClassName("chord")[actualIndex];
            canvasHTML = actualChord.firstChild;
            playCanvas(canvasHTML);
            actualIndex = (actualIndex+1) % numberOfChords;
        }
    }

    function reLoop(){
        numberOfChords = document.getElementsByClassName("chord").length - 1;
        clearInterval(chordDurationInterval);
        for(i=0; i<numberOfChords;i++){
                actualChord = document.getElementsByClassName("chord")[i];
                canvasHTML = actualChord.firstChild;
                var ctx = canvasHTML.getContext("2d");
                ctx.clearRect(0,0,canvasHTML.width,canvasHTML.height);
        }
    }
    var chordDurationInterval = setInterval(moveToNextCanvas,60*4*1000/bpm);
}

function pauseGraphicView(){
    
}

function playCanvas(canvas){

    var ctx = canvas.getContext("2d");
    var x=0;
    var timeInterval = 60*4/bpm;
    vx=10;
    var y=0;
    var vy=0;
    function move() {
      console.log("called");
      ctx.fillStyle = "lightblue";
      ctx.clearRect(0,0,canvas.width,canvas.height);
      x += canvas.width/4;
      ctx.fillRect(0,y,x,canvas.height); 
      if (x>=canvas.width+canvas.width/4){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        clearInterval(interval);
      }
    }
    var interval = setInterval(move,timeInterval*1000/4);
}


function lamp(arrivingX){
    ctx = canvasHTML.getContext("2d");
    ctx.backgroundColor = "blue";
   
}
