var outputs = [];
var noteon;
var noteoff;
var allMidiNotes = [];
if (navigator.requestMIDIAccess) {
  // Try to connect to the MIDI interface.
  navigator.requestMIDIAccess().then(onSuccess, onFailure);
 
} else {
  console.log("Web MIDI API not supported!");
}
 
// Function executed on successful connection
function onSuccess(interface) {
 
   // Grab an array of all available devices
  var iter = interface.outputs.values();
  for (var i = iter.next(); i && !i.done; i = iter.next()) {
    outputs.push(i.value);
  }
  updateOutputsView(outputs);
}
 
// Function executed on failed connection
function onFailure(error) {
  console.log("Could not connect to the MIDI interface");
}

function sendMidiMessageOn(note){
  allMidiNotes.push(note);
  message = [0x92,note,127];
  outputs[document.getElementById("midi-outputs").value].send(message);
}

function sendMidiNotes(midiNotes,sustainTime,index){
  midiScavenger(a);
  for (var i = 0; i < midiNotes.length; i++) {
    sendMidiMessageOn(midiNotes[i]);
  }
  sequencer[index].timerOfRelease = setTimeout(function(){
    for (var i = 0; i < midiNotes.length; i++) {
      sendMidiMessageOff(midiNotes[i]);
    }
    }, sustainTime*1000);
}

function sendMidiMessageOff(note){
  message = [0x82,note,127];
  outputs[document.getElementById("midi-outputs").value].send(message);
}

function midiScavenger(){
  for (var i = 0; i < allMidiNotes.length; i++) {
    sendMidiMessageOff(allMidiNotes[i]);
  }
  allMidiNotes = [];
}