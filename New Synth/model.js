var lvl_osc1 = 0;
var pitch_osc1 = 0;
var fm_osc1 = 0;
var wave_osc1 = 0;
var lvl_osc2 = 0;
var pitch_osc2 = 1134;
var wave_osc2 = 0;
var cutoff_filt = 0;
var reso_filt = 0;
var atck_filt = 0;
var dcy_filt = 0;
var sus_filt = 0;
var rel_filt = 0;
var rate_lfo = 0;
var wave_lfo = 0;
var dest_lfo = 0;
var atck_lfo = 0;
var dcy_lfo = 0;
var sus_lfo = 0;
var rel_lfo = 0;
var lvl_mast = 0;
var atck_mast = 0;
var dcy_mast = 0;
var sus_mast = 0;
var rel_mast = 0;

var sliderNumbers = document.getElementsByClassName("slider").length;
var sliderAmounts = Array(sliderNumbers).fill(50); //Ipotizzando che il valore sia da 0 a 100 e all'inizio gli slider sono tutti a metà
var sliderChangeIndex = 0;

var selectorNumbers = Array(document.getElementsByClassName("selector").length);
var selectorValues = ["sawtooth", "sawtooth", "sawtooth", "osc 1"];
var selectorChangeIndex = 0;


/*function updateKnobs(){

	lvl_osc1=(amounts[0] * SENS) / 270 * 100;
	pitch_osc1=(amounts[1] * SENS) / 270 * 100;
	fm_osc1=(amounts[2] * SENS) / 270 * 100;
	lvl_osc2=(amounts[3] * SENS) / 270 * 100;
	pitch_osc2=(amounts[4] * SENS) / 270 * 100;
	cutoff_filt=(amounts[5] * SENS) / 270 * 100;
	reso_filt=(amounts[6] * SENS) / 270 * 100;
	rate_lfo=(amounts[7] * SENS) / 270 * 100 ;
	lvl_mast=(amounts[8] * SENS) / 270 * 100;

}*/


function updateSliders(slider){
	id = slider.getAttribute("id");
	id = id.substr(1); //Rimuove il primo elemento dell'array, dunque la prima lettera dell'id. Non si poteva utilizzare il metodo usato coi knob perchè alcuni index hanno due cifre
    sliderChangeIndex = parseInt(id) - 1;
    console.log(sliderChangeIndex);
    sliderAmounts[sliderChangeIndex]=parseInt(slider.value);
    console.log("New value: "+sliderAmounts);
}

function updatePitch(slider){
	pitch_amount = parseInt(slider.value);
}


document.querySelectorAll(".slider").forEach(function(){
	this.oninput = function(e){controller(e.target)};
})



function updateSelectors(selector){
	id = selector.getAttribute("id");
	id = id.substr(8); 
    selectorChangeIndex = parseInt(id) - 1;
    console.log(selectorChangeIndex);
    selectorValues[selectorChangeIndex]=selector.value;
    console.log("New value: "+selectorValues[selectorChangeIndex]);
}


document.querySelectorAll(".selector").forEach(function(){
	this.oninput = function(e){controller(e.target)};
})

function controller(data){

	if (data.getAttribute("class").includes("selector")){
		updateSelectors(data);
	}
	else if(data.getAttribute("id")=='sp1'){
		updatePitch(data);
	}
	else{
		updateSliders(data);
	}
}