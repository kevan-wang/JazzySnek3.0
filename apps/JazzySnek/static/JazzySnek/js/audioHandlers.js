$(document).ready(function(){

	volume = $("#volumeSlider").val()
	if (volume == undefined) {
		volume = 10
	}
	console.log(volume)
	playing = ""

	var audio = {};
	for(i=0; i < songList.length; i++) {				//  Load up a sound library with all the sounds.
		name = songList[i]
		source = "../../static/JazzySnek/audio/" + name
		audio[name] = new Audio();
		audio[name].src = source
	}
	shufflePlaylist();
	if ($("#pageSong").attr("name") != "random") {
		setFirstSong($("#pageSong").attr("name"));
	}
	songIndex = 0;
	currentSong = songList[songIndex];
	loopPlayList();


	function loopPlayList() {
		audio[currentSong].play();
		// 1, 0.4, 0.16, 0.064, 0.0256, 0.0102, 0.0041, 0.0016, 0.0007, 0.0002, 0 -> 1/(5/2)^(10-x) where X is the volume setting.
			// Volume setting ranges from 0 to 10.  At 0, just set the volume to 0.
		audio[currentSong].volume =  Math.pow(0.5, 10-volume);
		lastSong = currentSong
		songIndex++;	// increment to next track
		if (songIndex == songList.length) {	// if we went through the entire playlist, reshuffle.
			songIndex = 0
			shufflePlaylist()
		}
		audio[lastSong].addEventListener("ended", function(){
			currentSong = songList[songIndex]	// ready next track
			loopPlayList();
		});
	}

	window.setInterval(function() {
		volume = $("#volumeSlider").val()
		if (volume == undefined) {
			volume = 10
		}
		// console.log("Volume slider = " + $("#volumeSlider").val())
		// console.log("Calculated volume = " + Math.pow(0.4, 10-volume))
		audio[currentSong].volume = Math.pow(0.5, 10-volume)
	}, 100);
});

function shufflePlaylist() {		// Randomizes the song list.
	for (var i = 0; i < songList.length ; i++) {
		temp = songList[i];	// store the song name at the current index
		randomIndex = Math.floor(Math.random()*songList.length);
		songList[i] = songList[randomIndex];	// switch song at current index with random song
		songList[randomIndex] = temp;
	}
}

function setFirstSong(name) {
	for (var i = 0; i < songList.length ; i++) {
		if (songList[i] == name) {
			temp = songList[0];
			songList[0] = songList[i];
			songList[i] = temp;
		}
	}				
}

var songList = [
	"Caravan Palace - Black Betty.mp3", "Caravan Palace - Brotherswing.mp3", "Caravan Palace - Lone Digger.mp3", 
	"Parov Stelar - The Mojo Radio Gang.mp3", "Postmodern Jukebox & Bart & Baker - Thrift Shop Remix.mp3"
]

//	"Jamie Berry & Octavia Rose - Lost In the Rhythm.mp3", "Jamie Berry & Rosie Harte - Peeping Tom.mp3",  
//	"Parov Stelar - All Night.mp3", "Parov Stelar - Booty Swing.mp3", "Parov Stelar - Josephine.mp3", "Tape Five -  Geraldines Routine.mp3"