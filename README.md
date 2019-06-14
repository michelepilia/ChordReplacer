# ChordReplacer

Students: Antonino Natoli (928370), Michele Pilia (915389).

http://chordreplacer.surge.sh/html.html


Aim: creating a web application that allows even inexperienced users to create chords using the standard notation and to apply harmonic substitutions suggested by the system.

Abstract:
Realization of a basic sequencer, synthesizer, external vst, data persistance.

Languages used:
Html, Css, Javascript

Sequencer:


Creating a chord tracks:


Substitutions:



Synthesizer:

Audio graph:

Modules:


Db persistance:













1) creazione blocchi di accordi con pulsante apposito dell'interfaccia '+'
2) inserimento di accordi tramite inserimento stringa o procedura guidata 
3) suggerimento sostituzioni armoniche in base al contesto
4) possibilità di sostituzione personalizzata da parte dell’utente
5) metro sopra i blocchi che indica le battute
6) restringimento ed allargamento dei blocchi, così come spostamento,     aggiunta e rimozione
7) possibilità di partire da giri armonici standard
8) aggiunta traccia melodica mediante interfaccia a matrice
9) synth di base sottrattivo, 3 oscillatori (pulse wave, sawtooth, triangle, tutti del browser) per voce, max numero di voci da decidere.
Supporto FM (osc 1 modula osc 2), inviluppo ADSR, filtro passa bassi con inviluppo,  LFO con inviluppo e possibilità di assegnare LFO a
pitch / filtro. Presets piano, violino, chitarra, qualche pad
10) in caso di tentativo di ricaricamento pagina mostrare alert che tutte le modifiche andranno perse
11) lo stato corrente del sistema può essere salvato
12) possibilità di riprodurre le tracce in qualsiasi fase del processo

Constraints: 1) metrica: 4/4 quanto da 1/16 non regolabile;
		    2) voicing accordi fisso (5 voci, max 7 e 9)
		    3) editing accordi limitato (menu a tendina)
