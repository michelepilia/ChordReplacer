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


function updateKnobs(){

	lvl_osc1=(amounts[0] * SENS) / 270 * 100;
	pitch_osc1=(amounts[1] * SENS) / 270 * 100;
	fm_osc1=(amounts[2] * SENS) / 270 * 100;
	lvl_osc2=(amounts[3] * SENS) / 270 * 100;
	pitch_osc2=(amounts[4] * SENS) / 270 * 100;
	cutoff_filt=(amounts[5] * SENS) / 270 * 100;
	reso_filt=(amounts[6] * SENS) / 270 * 100;
	rate_lfo=(amounts[7] * SENS) / 270 * 100 ;
	lvl_mast=(amounts[8] * SENS) / 270 * 100;

}





/*frequency1 = document.querySelector("#freq1"); //slide freq


frequency1.addEventListener('input', function (e) {
  field1.value = e.target.value;
});
*/

