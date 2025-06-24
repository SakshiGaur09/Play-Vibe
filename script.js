const songs = [
  {
    "title": "Astronaut in the Ocean",
    "artist": "Masked Wolf",
    "audio": "audio/Astronaut-In-The-Ocean.mp3",
    "cover": "image/astro.png"
  },
  {
    "title": "Heeriye",
    "artist": "Jasleen Royal",
    "audio": "audio/Heeriye.mp3",
    "cover": "image/heeriye.png"
  },
  {
    "title": "Kasoor",
    "artist": "Prateek Kuhad",
    "audio": "audio/Kasoor_Prateek_Kuhad.mp3",
    "cover": "image/kasoor.png"
  },
  {
    "title": "Moonlight",
    "artist": "Kali Uchis",
    "audio": "audio/Moonlight.mp3",
    "cover": "image/moonlight.png"
  },
  {
    "title": "Pahadon Mein",
    "artist": "Prabh Gill",
    "audio": "audio/Pahado_Mein.mp3",
    "cover": "image/pahado.png"
  },
  {
    "title": "Pal Behta Jaye",
    "artist": "Vishmay",
    "audio": "audio/Pal_Behta_Jaaye.mp3",
    "cover": "image/pal.png"
  },
  {
    "title": "Water",
    "artist": "Diljit Dosanjh",
    "audio": "audio/Water.mp3",
    "cover": "image/water.png"
  },
  {
    "title": "With You",
    "artist": "AP Dhillon",
    "audio": "audio/WithYou.mp3",
    "cover": "image/withyou.png"
  },
  {
    "title": "Shaky",
    "artist": "Sanju Rathore",
    "audio": "audio/Shaky.mp3",
    "cover": "image/shaky.png"
  },
  {
    "title": "Waalian",
    "artist": "Harnoor",
    "audio": "audio/Waalian.mp3",
    "cover": "image/waalian.png"
  },
  {
    "title": "Unstoppable",
    "artist": "Sia",
    "audio": "audio/Unstoppable.mp3",
    "cover": "image/unstoppable.png"
  }
]


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
  audio.src = songs[currentSong].audio;
  document.getElementById("song-name").innerHTML = songs[currentSong].title;
  document.getElementById("artist-name").innerHTML = songs[currentSong].artist;
  document.getElementById("poster").src = songs[currentSong].cover;

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

// function likeSong() {
//   var heart = document.getElementById("like-btn");
//   var heartIcon = heart.querySelector("i");
  
//   if (heartIcon.className == "bi bi-heart") {
//     heartIcon.className = "bi bi-heart-fill";
//     heart.style.background = "white";
//     heart.style.color = "#100326";
//   } else {
//     heartIcon.className = "bi bi-heart";
//     heart.style.background = "none";
//     heart.style.color = "white";
//   }
// }

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
  const mobilePlaylist = document.getElementById("mobile-playlist");
  
  let html = "";

  for (let i = 0; i < songs.length; i++) {
    let activeClass = "";
    let playIcon = "bi-play-circle-fill";
   

    if (i === currentSong) {
      activeClass = "active";
      if (playing) {
        playIcon = "bi-pause-circle-fill";
      }
    }
    
    html += '<h4 class="' + activeClass + '" onclick="pickSongFromMobile(' + i + ')">';
    html += '<img src="' + songs[i].cover + '" alt="' + songs[i].title + ' cover">';
    html += '<div class="song-details">';
    html += '<div class="song-title">' + songs[i].title + '</div>';
    html += '<div class="song-artist">' + songs[i].artist + '</div>';
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
  
  
  
  document.getElementById("progress-bar").oninput = seekSong;
  
  document.getElementById("volume-bar").oninput = changeVolume;
  
  document.getElementById("playlist-btn").onclick = showPlaylist;
  document.getElementById("close-playlist").onclick = hidePlaylist;
  
  

  document.getElementById("search-btn").onclick = function (e) {
    e.preventDefault();
    const searchText = document.getElementById("search-bar").value.toLowerCase();

  //searchSongs(searchText);
  updateDesktopPlaylist();

  // 1. Find the first matching song
  const foundIndex = songs.findIndex(song =>
    song.title.toLowerCase().includes(searchText) ||
    song.artist.toLowerCase().includes(searchText)
  );

  // 2. If a song is found, move it to top and play it
  if (foundIndex !== -1) {
    const [matchedSong] = songs.splice(foundIndex, 1); // remove it from array
    songs.unshift(matchedSong); // place it at the top

    currentSong = 0; // set index to the first one
    loadSong(); // update song info
    if (playing) audio.play(); // auto play if already playing
    // showPlaylist(); // refresh playlist display
  } else {
    alert("No matching song found."); // show message if nothing found
  }
};

  
  audio.ontimeupdate = updateProgress;
  
  audio.onended = nextSong;
  //document.getElementById("search-bar").oninput = showPlaylist;


  let playlistItems = document.querySelectorAll(".playlist h4");
  for (let i = 0; i < playlistItems.length; i++) {
    playlistItems[i].onclick = function() {
      let songIndex = Array.from(playlistItems).indexOf(this);
      pickSong(songIndex);
    };
  }
  
  document.getElementById("playlist-overlay").onclick = function(e) {
    if (e.target.id == "playlist-overlay") {
      hidePlaylist();
    }
  };
};


const favouriteList = document.getElementById("favourite-list");
const mobileFavouriteList = document.getElementById("mobile-favourite-list");
const likeBtn = document.getElementById("like-btn");

let favouriteSongs = JSON.parse(localStorage.getItem("favouriteSongs")) || {};

// Load favorites when page loads
window.addEventListener("DOMContentLoaded", () => {
    for (let key in favouriteSongs) {
        const fav = favouriteSongs[key];
        addToFavourites(fav.title, fav.artist, fav.poster, key);
        addToMobileFavourites(fav.title, fav.artist, fav.poster, key);
    }
});

likeBtn.addEventListener("click", () => {
    const title = document.getElementById("song-name").textContent;
    const artist = document.getElementById("artist-name").textContent;
    const poster = document.getElementById("poster").getAttribute("src");
    const key = title + " - " + artist;
    const heartIcon = likeBtn.querySelector("i");
    heartIcon.classList.toggle("bi-heart-fill");
    heartIcon.classList.toggle("bi-heart");

    if (favouriteSongs[key]) {
        delete favouriteSongs[key];
        likeBtn.innerHTML = '<i class="bi bi-heart"></i>';
        removeFromFavourites(key);
        removeFromMobileFavourites(key);
    } else {
        favouriteSongs[key] = { title, artist, poster };
        likeBtn.innerHTML = '<i class="bi bi-heart-fill"></i>';
        addToFavourites(title, artist, poster, key);
        addToMobileFavourites(title, artist, poster, key);
    }

    localStorage.setItem("favouriteSongs", JSON.stringify(favouriteSongs));
});

function addToFavourites(title, artist, poster, key) {
    if (document.querySelector(`.favourite-item[data-key="${key}"]`)) return;

    const favItem = document.createElement("div");
    favItem.classList.add("favourite-item");
    favItem.setAttribute("data-key", key);

    favItem.innerHTML = `
        <img src="${poster}" alt="cover" />
        <div>
            <h4>${title}</h4>
            <p>${artist}</p>
        </div>
    `;

    favItem.addEventListener("click", () => {
        console.log("Play:", title); // Hook this to your actual play logic


        const songIndex = songs.findIndex(s => s.title === title && s.artist === artist);
    if (songIndex !== -1) {
      currentSong = songIndex;
      loadSong();
      audio.play();
      playing = true;
      // Optional: update play button icon
      document.getElementById("play").className = "bi bi-pause-fill";
    }

  
    });
    favouriteList.appendChild(favItem);
}

function addToMobileFavourites(title, artist, poster, key) {
    if (document.querySelector(`#mobile-favourite-list .favourite-item[data-key="${key}"]`)) return;

    const favItem = document.createElement("div");
    favItem.classList.add("favourite-item");
    favItem.setAttribute("data-key", key);

    favItem.innerHTML = `
        <img src="${poster}" alt="cover" />
        <div>
            <h4>${title}</h4>
            <p>${artist}</p>
        </div>
    `;

    favItem.addEventListener("click", () => {
        console.log("Play:", title); 
        const songIndex = songs.findIndex(s => s.title === title && s.artist === artist);
    if (songIndex !== -1) {
      currentSong = songIndex;
      loadSong();
      audio.play();
      playing = true;
      document.getElementById("play").className = "bi bi-pause-fill";
      hidePlaylist(); // Hook into player
    }
  });

    mobileFavouriteList.appendChild(favItem);
}

function removeFromFavourites(key) {
    const item = document.querySelector(`.favourite-item[data-key="${key}"]`);
    if (item) item.remove();
}

function removeFromMobileFavourites(key) {
    const item = document.querySelector(`#mobile-favourite-list .favourite-item[data-key="${key}"]`);
    if (item) item.remove();
}

function updateDesktopPlaylist() {
  const playlist = document.getElementById("desktop-playlist");
  if (!playlist) return;
  playlist.innerHTML = songs.map((s, i) => `
    <h4 class="${i === currentSong ? 'active' : ''}" data-index="${i}">
      <img src="${s.cover}" alt="track cover">
      <span class="song-title">${s.title}</span>
      
      <i class="bi bi-play-circle-fill play-btn"></i>
    </h4>
  `).join('');

  // Song play on click
  playlist.querySelectorAll("h4").forEach((el, idx) => {
    el.onclick = () => pickSong(idx);
  });

  
 
 };