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
var bpmText = document.getElementById("bpm-value");
var chordSubstitutionMenu = document.getElementById("chord-substitution-menu");
var chordSubstitutionTable = document.getElementById("chord-substitution-table");
var loopButton = document.getElementById("loop-button");
var randButton = document.getElementById("rand-button");

var sendMIDIButton = document.getElementById("ext-midi");
sendMIDIButton.addEventListener("click",enableSendMIDI,false);
var actualIndex = 0;
var previousIndex=-1;
var latency=0;
var diffLengthIncreasing = 1; //[pixel]
var quantumTime = 60*1000/bpm/2;//[ms] -> divided by 2 works correctly only if grid is 1/8 !!
var t1 = (quantumTime*4)/numberOfUpdates; //-> t1 e' l'intervallo di tempo costante dopo cui chiamare il fillRect per la canvas
var numberOfUpdates; // numberOfUpdates = actualCanvas.width / diffLengthIncreasing
var actualCanvas;
var numberOfCanvas;
var playStatus = 0;
var actualTimeInterval;
var instPlayButton = document.getElementById("inst-play-button");

var plusChordStyle = window.getComputedStyle(document.getElementsByClassName('pluschord')[0], null);
var quantumSizeInPxs =  parseInt(plusChordStyle.getPropertyValue("width").substr(0,plusChordStyle.getPropertyValue("width").length-2))/8;

var nextCanvasTimeout;
var playingChords = [];
var a=0;
var loop = false;

playButton.addEventListener("click",playEffect,false);
stopButton.addEventListener("click",stopGraphicView,false);
bpmText.addEventListener('input',changeBpm,false)
plusButton.addEventListener("click", addChord, false);
minusButton.addEventListener("click", removeChord, false);
doneButton.addEventListener("click", editChord, false);
saveChords.addEventListener("click", saveChordsPreset, false);
loadChords.addEventListener("click", handleLoadChords, false);
chordsPresetNameField.addEventListener("input", saveChordsPresetName, false);
instPlayButton.addEventListener("click", toggleInstPlayMode, false);
loopButton.addEventListener("click",activeLoop,false);
randButton.addEventListener("click",randomChord,false);



function handleLoadChords(){
    if (chordsLoader.style.display != "block") {
        loadChordsPreset();
    }
    else{
        closeChordsLoader();
    }
}
function handleSubstitution(data){
    if (chordSubstitutionMenu.style.display != "block") {
        openSubstitutionMenu(data);
    }
    else{
        closeSubstitution();
    }
}

function activeLoop(){
    loop = !loop;
    applyGraphicEffect("loop");
}

function createChordEventListeners(){
	newEditButton = Array.from(document.getElementsByClassName("chord-edit")).pop();
    newSwapButton = Array.from(document.getElementsByClassName("chord-swap")).pop();
    newQuantizationPlusButton = Array.from(document.getElementsByClassName("quantization-plus")).pop();
    newQuantizationMinusButton = Array.from(document.getElementsByClassName("quantization-minus")).pop();
	newSubstitutionButton = Array.from(document.getElementsByClassName("chord-substitution")).pop();
    newSubstitutionButton.addEventListener("click",handleSubstitution,false);
    newEditButton.addEventListener("click", showChordEditor, false);
    newSwapButton.addEventListener("click", handleSwap, false);
    newSwapButton.addEventListener("mouseover",handleMouseOver,false);
    newSwapButton.addEventListener("mouseleave",handleMouseLeave,false);
    newQuantizationPlusButton.addEventListener("click", changeChordSize, false);
    newQuantizationMinusButton.addEventListener("click", changeChordSize, false);

}

function openSubstitutionMenu(data){
    var first = chordSubstitutionTable.firstElementChild; 
    chordSubstitutionMenu.style.display = "block";
    substitutions = tellTheSubs(data);

    while (first) { //Ripulisco tabella
        first.remove(); 
        first = chordSubstitutionTable.firstElementChild; 
    } 

    for (i=0; i<substitutions.length; i++){
        //divI = document.createElement("div");
        //divI.innerHTML = substitutions[i].name;
        //chordSubstitutionMenu.append(divI);
        var exp = getSubsExplanation(substitutions[i]);
        var row = document.createElement("tr");
        row.classList.add("suggested-substitution");
        var tdName = document.createElement("td");
        //tdName.id = "substitution"+i;
        tdName.innerHTML = substitutions[i].name;
        var tdExplanation = document.createElement("td");
        tdExplanation.innerHTML = exp;
        var tdButton = document.createElement("td");
        //tdButton.id = "synth-loading-td-button"+i;
        var insideButton = document.createElement("BUTTON");
        //insideButton.id = "synth-loading-button"+i;
        insideButton.classList.add("synth-load-button");
        insideButton.innerHTML = "Apply";
        insideButton.id="apply-substitution-button"+i;
        insideButton.addEventListener("click",applySubstitution,false);
        tdButton.appendChild(insideButton);
        row.appendChild(tdName);
        row.appendChild(tdExplanation);
        row.appendChild(tdButton);
        chordSubstitutionTable.appendChild(row);
    }
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
    var chordId = data.target.parentElement.getAttribute("id").substr(1);
    var fund = sequencer[chordId].fundamental;
    var qual = sequencer[chordId].quality;
    var exten = sequencer[chordId].extension;
    var inv = sequencer[chordId].inversion;
    var selFund = document.getElementById("fundamental-chord");
    var selQual = document.getElementById("quality-chord");
    var selExt = document.getElementById("extension-chord");
    var selInv = document.getElementById("inversion-chord");
    

    if (fund!=undefined){
        selFund.value = fund;
    }
    if (qual!=undefined){
        selQual.value = qual;
    }
    if (exten!=undefined){
        selExt.value = exten;
    }
    if (inv!=undefined){
        selInv.value = inv;
    }
    
    
	chordEditor.style.display = "block";
	doneButton.id = "done-edit-chord" + chordId;
}

function closeChordEditor(){
	chordEditor.style.display = "none";
}


function postSaveChordsPreset(){
    saveChords.style.backgroundColor = "red";
    saveChords.innerHTML = "Saved!";
    setTimeout(function(){  saveChords.style.backgroundColor = "hsl(35, 70%, 90%)";
                            saveChords.innerHTML = "Save chords"; 
                        }, 700);
}

function openChordsLoader(){
    chordsLoader.style.display = "block";
}

function closeChordsLoader(){
    chordsLoader.style.display = "none";
}

function closeSubstitution(){
   chordSubstitutionMenu.style.display = "none";
   chordSubstitutionTable.innerHTML="";
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
    updateChordsSize();

}
function playEffect(){
    if (playStatus==0){
        playStatus = 1;
        performPlayerView();
    }
    else{
        pauseGraphicView();
        pauseAudioView();
    }
    applyGraphicEffect("play");
}

function performPlayerView(){
    numberOfCanvas = document.getElementsByClassName("time-bar").length;
    quantumTime = 60*1000/bpm/(quantization/4);
    //console.log("actualIndex == "+actualIndex);
    if (actualIndex<numberOfCanvas) {
        if (actualIndex<0) {
            actualIndex++;
            previousIndex=-1;
        }
        //console.time();
        moveToNextCanvas();
    }
    else{
        stopGraphicView();
    }
}


function moveToNextCanvas(){
    actualCanvas = document.getElementsByClassName("time-bar")[actualIndex];
    numberOfUpdates = actualCanvas.width/diffLengthIncreasing;
    var actualChordQuantums = sequencer[actualIndex].duration;
    t1 = (quantumTime*actualChordQuantums)/numberOfUpdates;
    playCanvas(actualCanvas);
    //console.log(actualCanvas);
    //console.log("width = "+ actualCanvas.width);
    //console.log("numberOfUpdates = "+ numberOfUpdates);
    //console.log("quarter time = " + quantumTime);
    //console.log("tn = " + quantumTime*actualChordQuantums);
    //console.log("t1 = "+t1);
    actualChord = document.getElementsByClassName("chord")[actualIndex];
    var actualChordQuantums = sequencer[actualIndex].duration;
    var playingchord = sequencer[actualIndex];
    var freqs = createVoicing(playingchord,false);
    var midiNotes = createVoicing(sequencer[actualIndex],true);
    var sustainTime = playingchord.duration*quantumTime/1000; /*[seconds]*/
    sequencer[actualIndex].sustainTime = sustainTime;
    sequencer[actualIndex].indexInSequencer = actualIndex;
    if (sendMidi) {
        sendMidiNotes(midiNotes,sustainTime,actualIndex++);
    }
    else{
        playNotesFromFrequencies(freqs, 1, false,sustainTime,actualIndex++);
    }
    previousIndex=actualIndex-1;
    nextCanvasTimeout = setTimeout(function(){performPlayerView();},quantumTime*actualChordQuantums); 
}

function playCanvas(canvas){
    var ctx = canvas.getContext("2d");
    var x=0;
    //console.time();
    function move() {
      if (x<=canvas.width+diffLengthIncreasing){
        ctx.fillStyle = "hsl(0, 95%, 71%)";
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

    var updateTimeInterval = setInterval(move,t1);
    actualTimeInterval = updateTimeInterval;
}

function pauseGraphicView(){
    if (!instPlayMode && playStatus==1) {
    playStatus=0;
    actualIndex=previousIndex;
    clearInterval(actualTimeInterval);
    clearTimeout(nextCanvasTimeout);
    clearTimeout(sequencer[actualIndex].timerOfRelease);
    /*release all voices*/
    //Should be better:
    //if in release phase, wait the end of release and then call scavenger, else call directly scavenger
    var a = [];
    scavenger(a);
    midiScavenger(a);
    }
}

function stopGraphicView(){
    playStatus = 0;
    actualIndex=0;
    previousIndex=-1;
    clearInterval(actualTimeInterval);
    clearTimeout(nextCanvasTimeout);
    clearAllTimeBar();
    if (loop) {
        playEffect();
    }
    else{
        applyGraphicEffect("stop");
    }
}

function clearAllTimeBar(){
    canvas = document.getElementsByClassName("time-bar");
    for (i = 0; i < canvas.length; i++) {
        ctx = canvas[i].getContext("2d");
        ctx.clearRect(0,0,canvas[i].width,canvas[i].height);
    }
}

function changeBpm() {
    bpm = parseInt(bpmText.value);
    console.log(bpm);
}

function updateChordTag(chord, id){
    var first = "";
    var second = "";
    var third = "";
    var fourth = "";

    if (chord.noteFlag) {
        first = chord.fundamental;
        if(chord.quality=="maj"){second="";}
        else if (chord.quality=="min"){second="-";}
        else if (chord.quality=="sus2" || chord.quality=="sus4"){second = "<sub style='vertical-align: sub; font-size: 23px; margin-right:2px;'>" + chord.quality + "</sub>";}
        else if (chord.quality=="aug"){second = "<sup style='vertical-align: super; font-size: 22px; margin-right:2px;'>#5</sup>";}

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
                third = "<sup style='vertical-align: super; font-size: 22px; margin-right:2px;'>"+"&#9837"+"&#53;"+"</sup>"; //bemolle
            }
            else if (chord.extension=="maj7"){
                second = "-" + "<sup style='vertical-align: super; font-size: 30px;'>&#916</sup>"; //delta
                third = "<sup style='vertical-align: super; font-size: 22px; margin-right:2px;'>"+"&#9837"+"&#53;"+"</sup>"; //bemolle 5
            }
            else if (chord.extension=="none"){
                second = "- ";
                third = "<sup style='vertical-align: super; font-size: 22px; margin-right:2px;'>"+"&#9837"+"&#53;"+"</sup>"; //bemolle
            }
            else {
                second = "-" + "<sup style='vertical-align: super; font-size: 30px;'>7</sup>";
                third = "<sup style='vertical-align: super; font-size: 22px; margin-right:2px;'>"+"&#9837"+"&#53;"+"</sup>"+"<sup style='vertical-align: super; font-size: 30px;'>9</sup>";
            }
        }

        if (chord.inversion==0) {fourth="";}
        else if (chord.inversion==1) {
            if (chord.quality=="maj" || chord.quality=="aug"){fourth="/"+getNoteFromIntervalAbs(chord.fundamental, 4);}
            else if (chord.quality=="min"||chord.quality=="dim"){fourth="/"+getNoteFromIntervalAbs(chord.fundamental, 3);}
            else if (chord.quality=="sus2"){fourth="/"+getNoteFromIntervalAbs(chord.fundamental, 2);}
            else if (chord.quality=="sus4"){fourth="/"+getNoteFromIntervalAbs(chord.fundamental, 5);}
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
        document.getElementById(id).style.backgroundColor="hsl(0, 95%, 60%)";
    }
    else{
        var classHtml=document.getElementsByClassName("chord-swap");
        for (var i = 0; i < classHtml.length; i++) {
            classHtml[i].style.backgroundColor="hsl(25, 90%, 75%)";
            classHtml[i].style.backgroundColor="hsl(25, 90%, 75%)";
        }
        updateChordsSize();
    }
}

function handleMouseOver(data){
    var id = data.target.getAttribute("id");
        document.getElementById(id).style.backgroundColor="hsl(0, 95%, 71%)";
}

function handleMouseLeave(data){
    var id = data.target.getAttribute("id"); 
    var index = id.substr(12);
    if (swapActive==0) {
        document.getElementById(id).style.backgroundColor="hsl(25, 90%, 75%)";
    }
    else if(swapActive==1 && chordsToSwap[1]==index){
        document.getElementById(id).style.backgroundColor="hsl(0, 95%, 60%)";
    }
    else{
        document.getElementById(id).style.backgroundColor="hsl(25, 90%, 75%)";
    }
}


function toggleInstPlayButton(){
    if(instPlayMode){
        instPlayButton.style.backgroundColor="hsl(90, 95%, 85%)";
    }
    else {
        instPlayButton.style.backgroundColor="white";
    }
}

function chordTagMouseOver(data){
    data.target.style.backgroundColor = "hsl(25, 90%, 80%)";
}

function chordTagMouseOut(data){
    data.target.style.backgroundColor = "inherit";
}

function updateChordDurationInView(chordId,type){
    pauseGraphicView();
    var chordHtml = document.getElementById(chordId);
    var style = window.getComputedStyle(chordHtml, null);
    var actualSize = parseInt(style.getPropertyValue("width").substr(0,style.getPropertyValue("width").length-2));
    var increase = actualSize + quantumSizeInPxs*type;  
    chordHtml.style.width = increase.toString()+"px";
    var style = window.getComputedStyle(chordHtml, null);
    var actualSize = parseInt(style.getPropertyValue("width").substr(0,style.getPropertyValue("width").length-2));
    var canvas = chordHtml.firstChild;
    canvas.width = actualSize;
    
    //console.log("next is: "+style.getPropertyValue("width"));
}

function updateChordsSize(){
    var canvasBlockHtml=document.getElementsByClassName("time-bar");
    var length = canvasBlockHtml.length;
    for (var i = 0; i < length ; i++) {
        updateChordSize(canvasBlockHtml[i],i);
    }
}

function updateChordSize(canvas,indexInSequencer){

    canvas.width = quantumSizeInPxs*sequencer[indexInSequencer].duration;
    var id = "c"+indexInSequencer;
    var chordHtml = document.getElementById(id);
    var style = window.getComputedStyle(chordHtml, null);
    var actualSize = parseInt(style.getPropertyValue("width").substr(0,style.getPropertyValue("width").length-2));
    var increase = canvas.width;  
    chordHtml.style.width = increase.toString()+"px";
}

function applyGraphicEffect(type){
    if (type=="play"){
        if (playStatus==1) playButton.style.backgroundColor="hsl(90, 95%, 85%)";
        else {
            playButton.style.backgroundColor = "white";
        }
    }
    else if (type=="stop"){
        playButton.style.backgroundColor = "white";
    }
    else if (type=="loop") {
        if (loop==true){
            loopButton.style.backgroundColor = "hsl(90, 95%, 85%)";
        }
        else{
            loopButton.style.backgroundColor="white";
        }
    }
    else if(type=="send-midi"){
        if (sendMidi) {
            sendMIDIButton.style.backgroundColor="hsl(90, 95%, 85%)";
        }
        else{
           sendMIDIButton.style.backgroundColor="white";
        }

    }
}

function updateOutputsView(outputs){
    for (var i = 0; i < outputs.length; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.innerHTML = outputs[i].name;
        document.getElementById("midi-outputs").appendChild(option);
    }

}
function enableSendMIDI(){
    sendMidi = !sendMidi;
    applyGraphicEffect("send-midi");

}