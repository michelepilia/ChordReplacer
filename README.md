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
<p align="center"><img height="250" src="https://github.com/michelepilia/ChordReplacer/blob/master/Sequencer.png"></p>

Description of sequencer

### Play

### Stop

### Instant Play

### Loop

### Add Chord

### Remove Chord

### Add Random Chord

### Edit Chord

### Change Size

### Swap Chords

## Substitutions

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

## Synth 
Type of Synthesis: Subtractive
Modules: 2 oscillators, LP filter, LFO, ADSR envelopes
<p align="center"><img height="200" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/SynthGui.JPG"></p>


### Audio Graph

Block diagram of the audio nodes:
<p align="center"><img height="200" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/Untitled Diagram.jpg"></p>

### Oscillator
<p align="left"><img height="80" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/oscillator.JPG"></p>
Level: adjusts the gain of the oscillator.
Detune: detunes the oscillator, in cents.
Pitch: changes frequency of the fundamental, in semitones.
Waveform: it's possible to choose 3 different waveforms: square, sawtooth and triangular.

### Low-Pass Filter
<p align="left"><img height="80" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/LPF.JPG"></p>

### LFO
<p align="left"><img height="80" src="https://github.com/michelepilia/ChordReplacer/blob/master/screens/lfo.JPG"></p>
Cutoff: cutoff frequency of the filter.
Reso: Q factor.
EG: cutoff frequency of the filter reached after the decay, and mantained during the sustain.
ADSR envelope can be used on to modulate the cutoff frequency.

## External MIDI

## Useful Links

> Project link: [http://chordreplacer.surge.sh/html.html](http://chordreplacer.surge.sh/html.html)

> Demo Video: [https://youtube.com](https://youtube.com)

