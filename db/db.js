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
				
				fbNames = fbSnapshot.val();
				fbNames = Object.keys(fbNames);

				var synthLoaderTable = document.getElementById("synth-loader-table");
				
				while (synthLoaderTable.firstChild) { //Cleaning table from past rows
    				synthLoaderTable.removeChild(synthLoaderTable.firstChild);
				} 

				for(i=0; i<fbNames.length; i++) {
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
					insideButton.classList.add("synth-load-button");
					insideButton.innerHTML = "Load";
					tdButton.appendChild(insideButton);

					var tdButton2 = document.createElement("TD");
					tdButton2.id = "synth-deleting-td-button"+i;
					var insideButton2 = document.createElement("BUTTON");
					insideButton2.id = "synth-deleting-button"+i;
					insideButton2.classList.add("synth-delete-button");
					insideButton2.innerHTML = "Delete";
					tdButton2.appendChild(insideButton2);
					row.appendChild(tdName);
					row.appendChild(tdDate);
					row.appendChild(tdButton);
					row.appendChild(tdButton2);
					synthLoaderTable.appendChild(row);
					createSynthEventListeners();	
				}
				openSynthLoader();

			});
	
}

function loadSynthFunction(data) {
	chosenIndex = parseInt(data.target.getAttribute("id").substr(20));

	firebase.database().ref("Synth").once('value').then(
		function(snapshot){
			fbSnapshot = snapshot;


			fbNames = fbSnapshot.val();
			fbNames = Object.keys(fbNames);

			fbSynth = fbSnapshot.val()[fbNames[chosenIndex]];

			amounts[0] = fbSynth.lvl1;
	  		amounts[1] = fbSynth.detune1;
	  		pitch_amount1 = fbSynth.pitch1;
	  		selectorValues[0] = fbSynth.waveform1;
	  		amounts[2] = fbSynth.lvl2;
	  		amounts[3] = fbSynth.detune2;
	  		pitch_amount2 = fbSynth.pitch2;
	  		selectorValues[1] = fbSynth.waveform2;
	  		amounts[4] = fbSynth.cutoff;
	  		amounts[5] = fbSynth.resonance;
	  		amounts[6] = fbSynth.eg;
	  		sliderAmounts[0] = fbSynth.filt_atck;
	  		sliderAmounts[1] = fbSynth.filt_dcy;
	  		sliderAmounts[2] = fbSynth.filt_sus;
	  		sliderAmounts[3] = fbSynth.filt_rel;
	  		amounts[7] = fbSynth.rate;
	  		selectorValues[2] = fbSynth.lfo_waveform;
	  		selectorValues[3] = fbSynth.lfo_dest;
	  		sliderAmounts[4] = fbSynth.lfo_atck;
	  		sliderAmounts[5] = fbSynth.lfo_lvl;
	  		amounts[8] = fbSynth.master;
	  		sliderAmounts[6] = fbSynth.mast_atck;
	  		sliderAmounts[7] = fbSynth.mast_dcy;
	  		sliderAmounts[8] = fbSynth.mast_sus;
	  		sliderAmounts[9] = fbSynth.mast_rel;

			closeSynthLoader();
			updateViewFromModel();
	});
}

function deleteSynthFunction(data){
	chosenIndex = parseInt(data.target.getAttribute("id").substr(21));

	firebase.database().ref("Synth").once('value').then(
		function(snapshot){
			fbSnapshot = snapshot;
			fbNames = fbSnapshot.val();
			fbNames = Object.keys(fbNames);
			fbSynth = firebase.database().ref("Synth").child(fbNames[chosenIndex]);
			fbSynth.remove();
			closeSynthLoader();
			updateViewFromModel();
	});
}


