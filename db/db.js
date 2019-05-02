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


var synthDb = firebase.database().ref('Synth');
var newSynthPreset = synthDb.child("Sarti Big Jazz Band");
newSynthPreset.set({
  'lvl1': '50',
  'lvl2': '80',
  'lvl3': '70',
  'lvl4': '60'
});


function savePreset() {
	var synthDb = firebase.database().ref('Synth');
	var presetName = "pino";
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
}
