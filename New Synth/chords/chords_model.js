var bpm = 120;
var quantization = 8; //Actual value = 1/quantization
var noteDict = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11};
var noteDictInverse = {0: "C", 1: "C#", 2: "D", 3: "D#", 4: "E", 5: "F", 6: "F#", 7: "G", 8: "G#", 9: "A", 10: "A#", 11: "B"};
var sequencer = [];
var chordsPresetName = "Init";


class Chord {

	constructor() {
		this.noteFlag = false;
		this.duration = quantization;
		this.voices = [];
		this.timeOfRelease;
		this.played = false;
		this.indexInSequencer;
	};
	setSustainTime = function(sustainTime) {
		this.sustainTime = sustainTime;
	}
	setIndex = function(index){//is the index of the chord in the sequencer
		this.indexInSequencer = index;
	}
	addVoice = function(voice){
		this.voices.push(voice);
	}
	setTimeOfRelease = function(timer){
		this.timeOfRelease = timer;
	}
	setAsPlayed = function(){
		this.played = true;
	}

}

class Substitution{

	constructor(name, origin, destination){
		this.name = name;
		this.origin = origin;
		this.destination = destination;}
}

