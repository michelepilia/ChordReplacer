var outputs = [];
var noteon;
var noteoff;
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
 
  // Craft 'note on' and 'note off' messages (channel 3, note number 60 [C3], max velocity)
  noteon = [0x92, 60, 127];
  noteoff = [0x82, 60, 127];
 
  // Send the 'note on' and schedule the 'note off' for 1 second later
  outputs[0].send(noteon);
  setTimeout(
    function() {
      outputs[0].send(noteoff);
    },
    1000
  );
  updateOutputsView(outputs);
}
 
// Function executed on failed connection
function onFailure(error) {
  console.log("Could not connect to the MIDI interface");
}

function sendNote(){
  outputs[document.getElementById("midi-outputs").value].send(noteon);
}