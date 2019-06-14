<p align="center"><img height="150" src="https://github.com/michelepilia/ChordReplacer/blob/master/Logo.png"></p>


# Chord Replacer

Project entirely realized by:

Antonino Natoli (928370)
Michele Pilia (915389)
Politecnico di Milano

## Goals

The main purpose of this project is to create a Web application that allows even inexperienced users to generate beautiful and innovating chord sequences using the standard notation and to apply harmonic substitutions suggested by the system.

The chord track can be played by the system in two different modes:
1) With an internal, stand-alone subtractive Synth
2) Sending MIDI message to an external software or device

## Specifics

Languages used:
1) HTML 
2) CSS 
3) JavaScript (with particular references to Web Audio API

Furthermore, following the syllabus of Advanced Coding Tools and Methodologies course, Firebase has been used to allow users to store and load custom presets
## GUI
<p align="center"><img height="500" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/GUI.JPG"></p>


## Sequencer 
<p align="center"><img height="250" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/Sequencer.png"></p>

Description of sequencer

### Play/Stop
<p align="center"><img height="70" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/play.png"></p>

### Instant Play
<p align="center"><img height="70" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/instplay.png"></p>

### Loop
<p align="center"><img height="70" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/loop.png"></p>

### Add/Remove Chord
<p align="center"><img height="150" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/pluschord.png"></p>

### Add Random Chord
<p align="center"><img height="150" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/randadd.png"></p>

### Edit Chord
<p align="center"><img height="150" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/editchord.png"></p>

### Change Size
<p align="center"><img height="150" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/plus%20size.png"></p>

### Swap Chords
<p align="center"><img height="150" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/swap.png"></p>

## Substitutions
<p align="center"><img height="400" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/subs.png"></p>

### List of implemented substitutions

1) Preparation by VII
2) Secondary Dominant
3) Tritone Substitution
4) VII dim7 as dominant
5) #II dim7 as dominant
6) V aug as dominant
7) Preparation by minor 7
8) Back propagation of 7th
9) Backdoor progression
10) Preparation by II-V
11) Tonic substitution (relative min)
12) Tonic substitution (III min)
13) IV minor as dominant
14) General dim7 substitution
15) General aug substitution
16) Left deletion
<div></div>

# Polyphonic Synthesizer
<p align="center"><img height="200" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/SynthGui.JPG"></p>
<div></div>
<div>The user can use this internal synth to play the chords he has created</div>
<div>Type of Synthesis: Subtractive</div>
<div>Modules: 2 oscillators, LP filter, LFO, ADSR envelopes</div>
<div></div>


### Audio Graph

Blocks diagram of the audio nodes:
<p align="lefy"><img height="200" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/Untitled Diagram.jpg"></p>
<div></div>

### Oscillator
<p align="left"><img height="80" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/oscillator.JPG"></p>
<div>Level: adjusts the gain of the oscillator</div>
<div>Detune: detunes the oscillator in cents</div>
<div>Pitch: changes frequency of the fundamental in semitones</div>
<div>Waveform: it's possible to choose 3 different waveforms (square, sawtooth and triangular)</div>
<div></div>

### Low-Pass Filter
<p align="left"><img height="80" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/LPF.JPG"></p>
<div>Cutoff: cutoff frequency of the filter</div>
<div>Reso: Q factor</div>
<div>EG: cutoff frequency of the filter reached after the decay</div>
<div>ADSR envelope can be used on to modulate the cutoff frequency</div>
<div></div>

### LFO
<p align="left"><img height="80" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/lfo.JPG"></p>
<div>Rate: controls the frequency of the lfo<div>
<div>Waveform: it's possible to choose 3 different waveforms: square, sawtooth and sine</div>
<div>Destination: parameter to be modulated</div>
<div>AL (Attack Level) envelope can be used to modulate the rate of the lfo</div>
<div></div>
  
## External MIDI
<p align="left"><img height="80" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/sendMidi.JPG"></p>
Allows using external VSTs and DAWs, in order to record the chords track and to create a complete musical project.
It's necessary to install a virtual audio cable.
<div></div>

## Useful Links

> Project link: [http://chordreplacer.surge.sh/html.html](http://chordreplacer.surge.sh/html.html)

> Demo Video: [https://youtube.com](https://youtube.com)

