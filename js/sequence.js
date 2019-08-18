function createSequence() {
  console.log('createSequence()');

/**************************************************************************/
		var keys = new Tone.Players({
			"kick" : "./audio/my/seq/kick.[ogg|mp3]",
			"hh" : "./audio/my/seq/hh.[ogg|mp3]",
			"snare" : "./audio/my/seq/snare.[ogg|mp3]"
		}, {
			"volume" : -10,
			"fadeOut" : "64n",
		}).toMaster();
		//the notes
		var noteNames = ["kick", "hh", "snare"];
		var loop = new Tone.Sequence(function(time, col){
			var column = document.querySelector("tone-step-sequencer").currentColumn;
			column.forEach(function(val, i){
				if (val){
					//slightly randomized velocities
					var vel = Math.random() * 0.5 + 0.5;
					keys.get(noteNames[i]).start(time, 0, "32n", 0, vel);
				}
			});
			//set the columne on the correct draw frame
			Tone.Draw.schedule(function(){
				document.querySelector("tone-step-sequencer").setAttribute("highlight", col);
			}, time);
		}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n").start(0);

/**************************************************************************/

}

let sequence;

ready( () => {
  console.log('ready.');
//  sequence = createSequence();
//  document.querySelector("tone-transport").bind(Tone.Transport);
  document.querySelector("tone-play-toggle").bind(Tone.Transport);
/*
  //wait 1 sec
  async function bc() {
    await new Promise(resolve => setTimeout(bindChannels, 1000)); // millisec
  }
  bc();
*/
});
