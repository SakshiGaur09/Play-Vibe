let songs = [];
let originalSongs = [];
let isShuffled = false;

async function loadSongsFromJSON() {
  try {
    const response = await fetch('songs.json');
    const data = await response.json();
    songs = data.songs;
    originalSongs = [...data.songs];
    console.log('Songs loaded from JSON:', songs);
  } catch (error) {
    console.error('Error loading songs from JSON:', error);
    throw new Error("Failed to load songs from JSON.");
  }
}

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
  if (isShuffled) {
    currentSong = Math.floor(Math.random() * songs.length);
  } else {
    currentSong = currentSong + 1;
    if (currentSong >= songs.length) {
      currentSong = 0;
    }
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
  
  updateLikeButton();
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

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function toggleShuffle() {
  const shuffleBtn = document.getElementById("shuffle");
  const shuffleIcon = shuffleBtn.querySelector("i");
  
  if (!isShuffled) {
    songs = shuffleArray(originalSongs);
    
    currentSong = Math.floor(Math.random() * songs.length);
    
    isShuffled = true;
    shuffleBtn.style.background = "white";
    shuffleBtn.style.color = "#100326";
    shuffleIcon.className = "bi bi-shuffle";
    
    loadSong();
    audio.play();
    playing = true;
    document.getElementById("play").className = "bi bi-pause-fill";
    
    console.log("Shuffle enabled");
  } else {
    const currentPlayingSong = songs[currentSong];
    songs = [...originalSongs];
    
    currentSong = songs.findIndex(song => 
      song.title === currentPlayingSong.title && song.artist === currentPlayingSong.artist
    );
    
    isShuffled = false;
    shuffleBtn.style.background = "none";
    shuffleBtn.style.color = "white";
    shuffleIcon.className = "bi bi-shuffle";
    
    console.log("Shuffle disabled");
  }
  
  updateDesktopPlaylist();
  updateMobilePlaylist();
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
  updateMobilePlaylist();
  document.getElementById("playlist-overlay").classList.add("active");
}

function updateMobilePlaylist() {
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
}

function hidePlaylist() {
  document.getElementById("playlist-overlay").classList.remove("active");
}

function searchSongs(searchText) {
  if (!searchText.trim()) {
    songs = isShuffled ? shuffleArray(originalSongs) : [...originalSongs];
    updateDesktopPlaylist();
    updateMobilePlaylist();
    return;
  }
  
  const filteredSongs = originalSongs.filter(song =>
    song.title.toLowerCase().includes(searchText.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchText.toLowerCase())
  );
  
  if (filteredSongs.length > 0) {
    songs = filteredSongs;
    currentSong = 0;
    loadSong();
    updateDesktopPlaylist();
    updateMobilePlaylist();
    
    if (playing) {
      audio.play();
    }
  } else {
    alert("No matching songs found.");
  }
}

window.onload = async function() {
  await loadSongsFromJSON();
  
  loadSong();
  
  document.getElementById("playy").onclick = playSong;
  
  document.getElementById("next").onclick = nextSong;
  document.getElementById("previous").onclick = prevSong;
  
  document.getElementById("shuffle").onclick = toggleShuffle;
  
  document.getElementById("progress-bar").oninput = seekSong;
  
  document.getElementById("volume-bar").oninput = changeVolume;
  
  document.getElementById("playlist-btn").onclick = showPlaylist;
  document.getElementById("close-playlist").onclick = hidePlaylist;
  
  document.getElementById("search-btn").onclick = function (e) {
    e.preventDefault();
    const searchText = document.getElementById("search-bar").value;
    searchSongs(searchText);
  };
  
  document.getElementById("search-bar").oninput = function() {
    const searchText = this.value;
    searchSongs(searchText);
  };
  
  document.getElementById("search-bar").onkeypress = function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const searchText = this.value;
      searchSongs(searchText);
    }
  };
//mobile search functionality
  document.getElementById("mobile-search-btn").onclick = function (e) {
  e.preventDefault();
  const searchText = document.getElementById("mobile-search-input").value;
  searchSongs(searchText);
};
document.getElementById("mobile-search-input").onkeypress = function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const searchText = this.value;
    searchSongs(searchText);
  }
};
  
  audio.ontimeupdate = updateProgress;
  
  audio.onended = nextSong;

  updateDesktopPlaylist();

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

window.addEventListener("DOMContentLoaded", () => {
    for (let key in favouriteSongs) {
        const fav = favouriteSongs[key];
        addToFavourites(fav.title, fav.artist, fav.poster, key);
        addToMobileFavourites(fav.title, fav.artist, fav.poster, key);
    }
});

function updateLikeButton() {
  const title = document.getElementById("song-name").textContent;
  const artist = document.getElementById("artist-name").textContent;
  const key = title + " - " + artist;
  const heartIcon = likeBtn.querySelector("i");
  
  if (favouriteSongs[key]) {
    heartIcon.className = "bi bi-heart-fill";
    likeBtn.style.background = "white";
    likeBtn.style.color = "#100326";
  } else {
    heartIcon.className = "bi bi-heart";
    likeBtn.style.background = "none";
    likeBtn.style.color = "white";
  }
}

likeBtn.addEventListener("click", () => {
    const title = document.getElementById("song-name").textContent;
    const artist = document.getElementById("artist-name").textContent;
    const poster = document.getElementById("poster").getAttribute("src");
    const key = title + " - " + artist;
    const heartIcon = likeBtn.querySelector("i");

    if (favouriteSongs[key]) {
        delete favouriteSongs[key];
        heartIcon.className = "bi bi-heart";
        likeBtn.style.background = "none";
        likeBtn.style.color = "white";
        removeFromFavourites(key);
        removeFromMobileFavourites(key);
    } else {
        favouriteSongs[key] = { title, artist, poster };
        heartIcon.className = "bi bi-heart-fill";
        likeBtn.style.background = "white";
        likeBtn.style.color = "#100326";
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
        const songIndex = songs.findIndex(s => s.title === title && s.artist === artist);
        if (songIndex !== -1) {
            currentSong = songIndex;
            loadSong();
            audio.play();
            playing = true;
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
        const songIndex = songs.findIndex(s => s.title === title && s.artist === artist);
        if (songIndex !== -1) {
            currentSong = songIndex;
            loadSong();
            audio.play();
            playing = true;
            document.getElementById("play").className = "bi bi-pause-fill";
            hidePlaylist();
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
  const playlist = document.querySelector(".menu-side .playlist:not(#desktop-playlist)");
  if (!playlist) return;
  
  playlist.innerHTML = songs.map((s, i) => `
    <h4 class="${i === currentSong ? 'active' : ''}" data-song="${i}">
      <img src="${s.cover}" alt="track cover">
      <span class="song-title">${s.title}</span>
      <i class="bi bi-play-circle-fill play-btn"></i>
    </h4>
  `).join('');

  let playlistItems = playlist.querySelectorAll("h4");
  for (let i = 0; i < playlistItems.length; i++) {
    playlistItems[i].onclick = function() {
      let songIndex = parseInt(this.getAttribute('data-song'));
      pickSong(songIndex);
    };
  }
}