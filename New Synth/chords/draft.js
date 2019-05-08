function createVoicing(chord){

	var fund = noteDict[chord.fundamental] + 16;
	var voicing = [];
	var first;
    var third;
    var fifth;
    var extension;

    if (chord.noteFlag) {
        first = fund;
        if(chord.quality=="maj"){
        	third=fund+4;
        	fifth=fund+7;
        }
        else if (chord.quality=="min"){
        	third=fund+3;
        	fifth=fund+7;
        }
        else if (chord.quality=="sus2"){
        	third=fund+2;
        	fifth=fund+7;
        }
        else if (chord.quality=="sus4"){
        	third=fund+5;
        	fifth=fund+7;
        }
        else if (chord.quality=="aug"){
        	third=fund+4;
        	fifth=fund+8;
        }
        else if (chord.quality=="dim"){
        	third=fund+3;
        	fifth=fund+6;
        }

        if (chord.extension=="none") {ext=fund+12;}
        else if (chord.extension=="6") {ext=fund+9;}
        else if (chord.extension=="b7") {ext=fund+10;}
        else if (chord.extension=="maj7") {ext=fund+11;}
        else if (chord.extension=="9") {ext=fund+14;}
        else if (chord.extension=="11") {ext=fund+17;}
        else if (chord.extension=="13") {ext=fund+21;}


        //C0, E4, G7, B11 The notes in variables
      	//C0, C12, G19, E28, B35 The notes I want in a C maj7

        voicing = [fund, fund+12, fifth+12, third+24, ext+24];
      	if (chord.inversion==1){voicing[0] = third;}
      	else if (chord.inversion==2){voicing[0] = fifth;}


      	return voicing;
}