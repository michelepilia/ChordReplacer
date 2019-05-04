var bpm = 120;
var quantization = 8; //Actual value = 1/quantization
var noteDict = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11};
var sequencer = [];
var chordsPresetName = "Init";


class Chord {

	constructor() {
		this.noteFlag = false;
		this.duration = quantization;
		this.fundamental = 'A';
		this.quality = 'major';
		this.extension = '7+';
		this.inversion = '0';
	};
}