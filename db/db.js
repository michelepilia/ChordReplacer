var fbSnapshot;


// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyD6jsRjiBmcggDBNpYpfsB3ifvlzxwBELs",
  authDomain: "chord-replacer.firebaseapp.com",
  databaseURL: "https://chord-replacer.firebaseio.com",
  projectId: "chord-replacer",
  storageBucket: "chord-replacer.appspot.com",
  messagingSenderId: "5808271153"
};
firebase.initializeApp(firebaseConfig);

db = firebase.database();


function saveSynthPreset() {
	var synthDb = firebase.database().ref('Synth');
	var presetName = synthPresetName;
	var newSynthPreset = synthDb.child(presetName);
	newSynthPreset.set({
  		'lvl1': amounts[0],
  		'detune1': amounts[1],
  		'pitch1': pitch_amount1,
  		'waveform1': selectorValues[0],
  		'lvl2': amounts[2],
  		'detune2': amounts[3],
  		'pitch2': pitch_amount2,
  		'waveform2': selectorValues[1],
  		'cutoff': amounts[4],
  		'resonance': amounts[5],
  		'eg': amounts[6],
  		'filt_atck': sliderAmounts[0],
  		'filt_dcy': sliderAmounts[1],
  		'filt_sus': sliderAmounts[2],
  		'filt_rel': sliderAmounts[3],
  		'rate': amounts[7],
  		'lfo_waveform': selectorValues[2],
  		'lfo_dest': selectorValues[3],
  		'lfo_atck': sliderAmounts[4],
  		'lfo_lvl': sliderAmounts[5],
  		'master': amounts[8],
  		'mast_atck': sliderAmounts[6],
  		'mast_dcy': sliderAmounts[7],
  		'mast_sus': sliderAmounts[8],
  		'mast_rel': sliderAmounts[9]
	});
	postSavePreset();
}


function loadSynthPreset(){
	var synthDb = firebase.database().ref('Synth');

	firebase.database().ref("Synth").once('value').then(
			function(snapshot){
				fbSnapshot = snapshot;
			});
	fbNames = fbSnapshot.val();
	fbNames = Object.keys(fbNames);

	var synthLoaderTable = document.getElementById("synth-loader-table");
	for(i=0; i<fbNames.length(); i++) {
		var row = document.createElement("TR");
		var tdName = document.createElement("TD");
		tdName.id = "synth-loading-name"+i;
		tdName.innerHTML = fbNames[i];
		var tdDate = document.createElement("TD");
		tdDate.innerHTML = "Today";
		var tdButton = document.createElement("TD");
		tdButton.id = "synth-loading-td-button"+i;
		var insideButton = document.createElement("BUTTON");
		insideButton.id = "synth-loading-button"+i;
		insideButton.innerHTML = "Load";
		tdButton.appendChild(insideButton);
		row.appendChild(tdName);
		row.appendChild(tdDate);
		row.appendChild(tdButton);
		synthLoaderTable.appendChild(row);	
	}
	openSynthLoader();
	//chosen = fbNames [0] //Esempio, simulando l input dell'utente
	fbSynth = fbSnapshot[chosen];


}





