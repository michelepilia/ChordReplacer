/*var editButtons = document.getElementsByClassName("chord-substitution");

class Substitution{

	constructor(name, origin, destination){
		this.name = name;
		this.origin = origin;
		this.destination = destination;
	}
}

for(i=0; i<editButtons.length; i++){editButtons[i].addEventListener("click", tellTheSubs, false);}; //Da inserire durante la creazione dell'accordo

function tellTheSubs(data){
	var subs = [];
	var id = parseInt(data.target.parentElement.getAttribute("id").substr(1));
	var chord = sequencer[id];
	var prevChord = sequencer[id-1];
	var nextChord = sequencer[id+1];
	var newChord;
	var newSub;

	//Preparation by seventh
	newChord = new Chord();
	newChord.fundamental = noteDictInverse[(noteDict[chord.fundamental]+7)%12];
	newChord.quality = "maj";
	newChord.extension = "b7";
	newChord.inversion = "none";
	newChord.duration = quantization;
	newSub = new Substitution("Preparation by VII", chord, [newChord]);
	subs.push(newSub);

	if (chord.quality == "maj" && chord.extension == "b7"){ //Tritone Substitution + VII dim7 + #II dim7 as dominant + aug triad +...
		//Tritone
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse[(noteDict[chord.fundamental]+6)%12]; //WRT V degree
		newSub = new Substitution("Tritone Substitution", chord, [newChord]);
		subs.push(newSub);

		//VII dim7
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse[(noteDict[chord.fundamental]+3)%12]; //WRT V degree
		newChord.quality = "dim";
		newChord.extension = "b7";
		newChord.inversion = "none";
		newSub = new Substitution("VII dim7 as dominant", chord, [newChord]);
		subs.push(newSub);

		//#IIdim7
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse((noteDict[chord.fundamental]-4)%12); //WRT V degree
		newChord.quality = "dim";
		newChord.extension = "b7";
		newChord.inversion = "none";
		newSub = new Substitution("#II dim7 as dominant", chord, [newChord]);
		subs.push(newSub);

		//#IIdim7
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.quality = "aug";
		newChord.extension = "b7";
		newChord.inversion = "none";
		newSub = new Substitution("V aug as dominant", chord, [newChord]);
		subs.push(newSub);

		//Preparation by minor7
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse((noteDict[chord.fundamental]-5)%12); //WRT V degree (II-V)
		newChord.quality = "min";
		newChord.extension = "b7";
		newChord.inversion = "none";
		newSub = new Substitution("Preparation by minor 7", chord, [newChord]);
		subs.push(newSub);

		newSub = new Substitution("Back propagation of 7th", chord, []);
		subs.push(newSub);


		//Backdoor Progression
		var secMin = noteDictInverse((noteDict.(chord.fundamental)-5)%12);
		var tonic = noteDictInverse((noteDict.(chord.fundamental)+5)%12);
		if ((prevChord.fundamental==secMin && prevChord.quality=="min")&&(nextChord.fundamental==tonic && nextChord.quality=="maj")) {
			var newChord1 = new Chord(); 
			var newChord2 = new Chord();
			newChord1.fundamental = noteDictInverse((noteDict.(chord.fundamental)-2)%12); 
			newChord2.fundamental = noteDictInverse((noteDict.(chord.fundamental)+3)%12);
			newChord1.quality = "min";
			newChord2.quality = "maj";
			newChord1.extension = "b7";
			newChord2.extension = "b7";
			newChord1.inversion = "none";
			newChord2.inversion = "none";
			newChord1.duration = chord.duration/2;
			newChord2.duration = chord.duration/2;

			newSub = new Substitution("Backdoor Progression", chord, [newChord1, newChord2]);
			subs.push(newSub);
		};

	}

	if (chord.quality == "maj"){ //II-V 
		var newChord1 = new Chord(); 
		var newChord2 = new Chord();
		newChord1.fundamental = noteDictInverse((noteDict.(chord.fundamental)+2)%12); 
		newChord2.fundamental = noteDictInverse((noteDict.(chord.fundamental)+7)%12);
		newChord1.quality = "min";
		newChord2.quality = "maj";
		newChord1.extension = "b7";
		newChord2.extension = "b7";
		newChord1.inversion = "none";
		newChord2.inversion = "none";
		newChord1.duration = chord.duration/2;
		newChord2.duration = chord.duration/2;

		newSub = new Substitution("Preparation by II-V", chord, [newChord1, newChord2]);
		subs.push(newSub);
	}

	if (chord.quality == "maj" && (chord.extension=="none" || chord.extension=="maj7" || chord.extension=="6")){ //Tonic sub (Assuming that a major chord if no b7 is tonic) 
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse((noteDict.(chord.fundamental)-3)%12);
		newChord.quality = "min";
		newChord.extension = "b7";
		newChord.inversion = "none";
		newSub = new Substitution("Tonic Substitution (relative min)", chord, [newChord]);
		subs.push(newSub);

		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse((noteDict.(chord.fundamental)+4)%12);
		newChord.quality = "min";
		newChord.extension = "b7";
		newChord.inversion = "none";
		newSub = new Substitution("Tonic Substitution (III min)", chord, [newChord]);
		subs.push(newSub);
	}

	if (chord.quality == "dim" && chord.extension == "6"){ //General dim substitution (like a simple inversion)
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse((noteDict.(chord.fundamental)+3)%12);
		newSub = new Substitution("General dim7 substitution", chord, [newChord]);
		subs.push(newSub);
	}

	if (chord.quality == "aug"){ //General dim substitution (like a simple inversion)
		newChord = new Chord();
		Object.assign(newChord, chord);
		newChord.fundamental = noteDictInverse((noteDict.(chord.fundamental)+4)%12);
		newSub = new Substitution("General aug substitution", chord, [newChord]);
		subs.push(newSub);
	}

	//Left deletion
	newSub = new Substitution("Left deletion", chord, []);
	subs.push(newSub);







}*/