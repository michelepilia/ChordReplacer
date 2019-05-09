var plusButton = document.getElementById("plus-button");
var minusButton = document.getElementById("minus-button");
var plusSpan = document.getElementById("plus-button-span");
var editButtons = document.getElementsByClassName("chord-edit");
var chordsBlocksHtml = document.getElementById("chords-blocks");
var chordEditor = document.getElementById("edit-chord-window");
var doneButton = document.getElementById("done-edit-chord");
var saveChords = document.getElementById("save-chords");
var loadChords = document.getElementById("load-chords");
var doneLoadChordsButton = document.getElementById("done-load-chords");
var chordsLoader = document.getElementById("chords-loader");
var chordsPresetNameField = document.getElementById("preset-chords-name");
var chordsPresetNameFieldContainer = document.getElementById("preset-chords-name-ext");
var playButton = document.getElementById("play-button");
var stopButton = document.getElementById("stop-button");
var bpmText = document.getElementById("bpm-value");
var actualIndex = 0;
var latency=0;
var diffLengthIncreasing = 1; //[pixel]
var quarterTime = 60*1000/bpm;//[ms] -> tn = quarterTime*4; e' il tempo di una battuta (4 quarti); 
var t1 = (quarterTime*4)/numberOfUpdates; //-> t1 e' l'intervallo di tempo costante dopo cui chiamare il fillRect per la canvas
var numberOfUpdates; // numberOfUpdates = actualCanvas.width / diffLengthIncreasing
var actualCanvas;
var numberOfCanvas;
var playStatus = 0;
var updateTimeInterval;
var chordTimeInterval;
var instPlayButton = document.getElementById("inst-play-button");

doneLoadChordsButton.addEventListener("click",closeChordsLoader,false);
playButton.addEventListener("click",playEffect,false);
stopButton.addEventListener("click",stopGraphicView,false);
bpmText.addEventListener('input',changeBpm,false)
plusButton.addEventListener("click", addChord, false);
minusButton.addEventListener("click", removeChord, false);
doneButton.addEventListener("click", editChord, false);
saveChords.addEventListener("click", saveChordsPreset, false);
loadChords.addEventListener("click", loadChordsPreset, false);
chordsPresetNameField.addEventListener("input", saveChordsPresetName, false);
instPlayButton.addEventListener("click", toggleInstPlayMode, false);


function createChordEventListeners(){
	newEditButton = Array.from(document.getElementsByClassName("chord-edit")).pop();
    newSwapButton = Array.from(document.getElementsByClassName("chord-swap")).pop();
    newQuantizationPlusButton = Array.from(document.getElementsByClassName("quantization-plus")).pop();
    newQuantizationMinusButton = Array.from(document.getElementsByClassName("quantization-minus")).pop();
	newEditButton.addEventListener("click", showChordEditor, false);
    newSwapButton.addEventListener("click", handleSwap, false);
    newSwapButton.addEventListener("mouseover",handleMouseOver,false);
    newSwapButton.addEventListener("mouseleave",handleMouseLeave,false);
    newQuantizationPlusButton.addEventListener("click", increaseChordSize, false);
    newQuantizationMinusButton.addEventListener("click", decreaseChordSize, false);
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



function updateChordsViewFromModel(chordsName){

    var sequencerHtml = Array.from(chordsBlocksHtml.children); //Blocchi HTML da rimuovere in formato array
    sequencerHtml.pop(); //Rimuovo l'ultimo, che sarebbe il plus button block

    for (i=1; i<sequencerHtml.length; i++){ //Ripulisco traccia, parto da 1 perché lo 0 è il field text per il name
        sequencerHtml[i].remove();
    }

    for (i=0; i<sequencer.length; i++) {
        addChordFromDB(i);
    };
    chordsPresetNameField.value=chordsName;

}
function playEffect(){
    if (playStatus==0){
        playGraphicView();
    }
    else{
        pauseGraphicView();
    }
}
function playGraphicView(){
    playStatus = 1;
    numberOfCanvas = document.getElementsByClassName("time-bar").length;
    actualCanvas = document.getElementsByClassName("time-bar")[actualIndex];
    var ctx = actualCanvas.getContext("2d");
    numberOfUpdates = actualCanvas.width/diffLengthIncreasing;
    console.log("width = "+ actualCanvas.width);
    console.log("numberOfUpdates = "+ numberOfUpdates);
    quarterTime = 60*1000/bpm;
    console.log("quarter time = " + quarterTime);
    t1 = (quarterTime*4)/numberOfUpdates;
    console.log("tn = " + quarterTime*4);
    console.time();
    chordTimeInterval = setInterval(moveToNextCanvas,actualChordDuration());
    playCanvas(actualCanvas);

    function moveToNextCanvas(){
        if(++actualIndex<numberOfCanvas){
            actualCanvas = document.getElementsByClassName("time-bar")[actualIndex];
            playCanvas(actualCanvas);
        }
        else{
            console.timeEnd();
            playStatus=0;
            actualIndex=0;
            clearInterval(chordTimeInterval);
        }
    }
}

function pauseGraphicView(){
    playStatus=0;
    clearInterval(updateTimeInterval);
    clearInterval(chordTimeInterval);
}

function stopGraphicView(){
    pauseGraphicView();
    actualIndex=0;
    clearAllTimeBar();
}
function clearAllTimeBar(){
    canvas = document.getElementsByClassName("time-bar");
    for (i = 0; i < canvas.length; i++) {
        ctx = canvas[i].getContext("2d");
        ctx.clearRect(0,0,canvas[i].width,canvas[i].height);
    }
}

function actualChordDuration(){
    var actualChordDurationInQuarters = sequencer[actualIndex].duration/2;
    return (actualChordDurationInQuarters*quarterTime);
}


function playCanvas(canvas){

    var ctx = canvas.getContext("2d");
    var x=0;
    //console.time();
    function move() {
      if (x<=canvas.width+diffLengthIncreasing){
            ctx.fillStyle = "lightblue";
            ctx.clearRect(0,0,canvas.width,canvas.height);
            x += diffLengthIncreasing;
            ctx.fillRect(0,0,x,canvas.height);
      }
      else{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        clearInterval(updateTimeInterval);
        //console.timeEnd();
      }
    }
    updateTimeInterval = setInterval(move,t1);
}


function lamp(arrivingX){
    ctx = canvasHTML.getContext("2d");
    ctx.backgroundColor = "blue";
}



function changeBpm() {
    bpm = parseInt(bpmText.value);
}

function updateChordTag(chord, id){
    var first;
    var second;
    var third;
    var fourth;

    if (chord.noteFlag) {
        first = chord.fundamental;
        if(chord.quality=="maj"){second="";}
        else if (chord.quality=="min"){second="-";}
        else if (chord.quality=="sus2" || chord.quality=="sus4"){second = "<sub style='vertical-align: sub; font-size: 30px;'>" + chord.quality + "</sub>";}
        else if (chord.quality=="aug"){second="#5";}

        if (chord.extension=="none"){third = "";}
        else if (chord.extension=="maj7"){third = "<sup style='vertical-align: super; font-size: 30px;'>&#916</sup>";} //delta
        else if (chord.extension=="b7"){third = "<sup style='vertical-align: super; font-size: 30px;'>7</sup>";}
        else {third = "<sup style='vertical-align: super; font-size: 30px;'>" + chord.extension + "</sup>";}


        if (chord.quality=="dim"){
            if (chord.extension=="6"){ //bb7
                second = "<sup style='vertical-align: super; font-size: 30px;'>°7</sup>";
                third = "";
            }
            else if (chord.extension=="b7"){
                second = "-" + "<sup style='vertical-align: super; font-size: 30px;'>7</sup>";
                third = "&#9837"+"&#53;"; //bemolle
            }
            else if (chord.extension=="maj7"){
                second = "-" + "<sup style='vertical-align: super; font-size: 30px;'>&#916</sup>"; //delta
                third = "&#9837"+"&#53;"; //bemolle 5
            }
            else if (chord.extension=="none"){
                second = "- ";
                third = "&#9837"+"&#53;"; //bemolle
            }
            else {
                second = "-" + "<sup style='vertical-align: super; font-size: 30px;'>7</sup>";
                third = "&#9837"+"&#53"+"<sup style='vertical-align: super; font-size: 30px;'>9</sup>";
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
        document.getElementById("c"+id).children[4].innerHTML = first+second+third+fourth;
    }

    else {
        document.getElementById("c"+id).children[4].innerHTML = "";
    }

}

function updateChordsViewForSwap(data){
    var id=data.target.getAttribute("id");
    if (swapActive==1) {
        document.getElementById(id).style.backgroundColor="green";
    }
    else{
        var classHtml=document.getElementsByClassName("chord-swap");
        for (var i = 0; i < classHtml.length; i++) {
            classHtml[i].style.backgroundColor="lightgray";
            classHtml[i].style.backgroundColor="lightgray";
        }
    }
}

function handleMouseOver(data){
    var id = data.target.getAttribute("id");
    document.getElementById(id).style.backgroundColor="green";
}
function handleMouseLeave(data){
    if (swapActive==0) {
        var id = data.target.getAttribute("id");
        document.getElementById(id).style.backgroundColor="lightgray";
    }
}


function toggleInstPlayButton(){
    if(instPlayMode){
        instPlayButton.style.backgroundColor="lightgreen";
    }
    else {
        instPlayButton.style.backgroundColor="white";
    }
}
