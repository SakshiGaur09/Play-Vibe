var songs = [
  "audio/Astronaut-In-The-Ocean.mp3",
  "audio/Heeriye.mp3", 
  "audio/Kasoor_Prateek_Kuhad.mp3",
  "audio/Moonlight.mp3",
  "audio/Pahado_Mein.mp3",
  "audio/Pal_Behta_Jaaye.mp3",
  "audio/Water.mp3",
  "audio/WithYou.mp3",
  "audio/Shaky.mp3",
  "audio/Waalian.mp3",
  "audio/Unstoppable.mp3"
];

var songNames = [
  "Astronaut in the Ocean",
  "Heeriye", 
  "Kasoor",
  "Moonlight",
  "Pahadon Mein",
  "Pal Behta Jaye",
  "Water",
  "With You",
  "Shaky",
  "Waalian",
  "Unstoppable"
];

var artists = [
  "Masked Wolf",
  "Jasleen Royal",
  "Prateek Kuhad", 
  "Kali Uchis",
  "Prabh Gill",
  "Vishmay",
  "Diljit Dosanjh",
  "AP Dhillon",
  "Sanju Rathore",
  "Harnoor",
  "Sia"
];

var pictures = [
  "image/astro.png",
  "image/heeriye.png",
  "image/kasoor.png",
  "image/moonlight.png", 
  "image/pahado.png",
  "image/pal.png",
  "image/water.png",
  "image/withyou.png",
  "image/shaky.png",
  "image/waalian.png",
  "image/unstoppable.png"
];

var currentSong = 0;
var playing = false;
var audio = document.getElementById("audio-player");

function playSong() {
  if (playing == false) {
    audio.play();
    playing = true;
    document.getElementById("play").className = "bi bi-pause-fill";
  } else {
    audio.pause();
    playing = false;
    document.getElementById("play").className = "bi bi-play-fill";
  }
}

function nextSong() {
  currentSong = currentSong + 1;
  if (currentSong >= songs.length) {
    currentSong = 0;
  }
  loadSong();
  if (playing == true) {
    audio.play();
  }
}

function prevSong() {
  currentSong = currentSong - 1;
  if (currentSong < 0) {
    currentSong = songs.length - 1;
  }
  loadSong();
  if (playing == true) {
    audio.play();
  }
}

function loadSong() {
  audio.src = songs[currentSong];
  document.getElementById("song-name").innerHTML = songNames[currentSong];
  document.getElementById("artist-name").innerHTML = artists[currentSong];
  document.getElementById("poster").src = pictures[currentSong];
  
  var playlistItems = document.querySelectorAll(".playlist h4");
  for (var i = 0; i < playlistItems.length; i++) {
    playlistItems[i].classList.remove("active");
  }
  if (playlistItems[currentSong]) {
    playlistItems[currentSong].classList.add("active");
  }
}

function pickSong(songNumber) {
  currentSong = songNumber;
  loadSong();
  audio.play();
  playing = true;
  document.getElementById("play").className = "bi bi-pause-fill";
}

function pickSongFromMobile(songNumber) {
  currentSong = songNumber;
  loadSong();
  audio.play();
  playing = true;
  document.getElementById("play").className = "bi bi-pause-fill";
  hidePlaylist();
}

function likeSong() {
  var heart = document.getElementById("like-btn");
  var heartIcon = heart.querySelector("i");
  
  if (heartIcon.className == "bi bi-heart") {
    heartIcon.className = "bi bi-heart-fill";
    heart.style.background = "white";
    heart.style.color = "#100326";
  } else {
    heartIcon.className = "bi bi-heart";
    heart.style.background = "none";
    heart.style.color = "white";
  }
}

function updateProgress() {
  var progressBar = document.getElementById("progress-bar");
  var currentTime = document.getElementById("current-time");
  var totalTime = document.getElementById("total-time");
  
  if (audio.duration) {
    var progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    
    var currentMinutes = Math.floor(audio.currentTime / 60);
    var currentSeconds = Math.floor(audio.currentTime % 60);
    if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
    currentTime.innerHTML = currentMinutes + ":" + currentSeconds;
    
    var totalMinutes = Math.floor(audio.duration / 60);
    var totalSeconds = Math.floor(audio.duration % 60);
    if (totalSeconds < 10) totalSeconds = "0" + totalSeconds;
    totalTime.innerHTML = totalMinutes + ":" + totalSeconds;
  }
}

function seekSong() {
  var progressBar = document.getElementById("progress-bar");
  var seekTime = (progressBar.value / 100) * audio.duration;
  audio.currentTime = seekTime;
}

function changeVolume() {
  var volumeBar = document.getElementById("volume-bar");
  audio.volume = volumeBar.value / 100;
}

function showPlaylist() {
  var mobilePlaylist = document.getElementById("mobile-playlist");
  var html = "";
  
  for (var i = 0; i < songs.length; i++) {
    var activeClass = "";
    var playIcon = "bi-play-circle-fill";
    
    if (i == currentSong) {
      activeClass = "active";
      if (playing) {
        playIcon = "bi-pause-circle-fill";
      }
    }
    
    html += '<h4 class="' + activeClass + '" onclick="pickSongFromMobile(' + i + ')">';
    html += '<img src="' + pictures[i] + '" alt="' + songNames[i] + ' cover">';
    html += '<div class="song-details">';
    html += '<div class="song-title">' + songNames[i] + '</div>';
    html += '<div class="song-artist">' + artists[i] + '</div>';
    html += '</div>';
    html += '<i class="bi ' + playIcon + ' play-btn"></i>';
    html += '</h4>';
  }
  
  mobilePlaylist.innerHTML = html;
  document.getElementById("playlist-overlay").classList.add("active");
}

function hidePlaylist() {
  document.getElementById("playlist-overlay").classList.remove("active");
}

window.onload = function() {
  loadSong();
  
  document.getElementById("playy").onclick = playSong;
  
  document.getElementById("next").onclick = nextSong;
  document.getElementById("previous").onclick = prevSong;
  
  document.getElementById("like-btn").onclick = likeSong;
  
  document.getElementById("progress-bar").oninput = seekSong;
  
  document.getElementById("volume-bar").oninput = changeVolume;
  
  document.getElementById("playlist-btn").onclick = showPlaylist;
  document.getElementById("close-playlist").onclick = hidePlaylist;
  
  audio.ontimeupdate = updateProgress;
  
  audio.onended = nextSong;
  
  var playlistItems = document.querySelectorAll(".playlist h4");
  for (var i = 0; i < playlistItems.length; i++) {
    playlistItems[i].onclick = function() {
      var songIndex = Array.from(playlistItems).indexOf(this);
      pickSong(songIndex);
    };
  }
  
  document.getElementById("playlist-overlay").onclick = function(e) {
    if (e.target.id == "playlist-overlay") {
      hidePlaylist();
    }
  };
};