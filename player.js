// പാട്ടിന്റെ ലോജിക് കൈകാര്യം ചെയ്യുന്ന ഫങ്ക്ഷനുകൾ
export function initPlayer() {
    return `
    <div class="bottom-player" id="player-ui" style="display:none;">
        <div class="seek-container" style="padding: 0 10px;">
            <input type="range" id="seek-bar" value="0" style="width:100%; height:3px; accent-color:#1DB954; cursor:pointer;">
        </div>
        
        <div style="display:flex; align-items:center; justify-content:space-between; padding: 10px 15px;">
            <div style="display:flex; align-items:center; gap:12px; flex:1;" onclick="showSongDetail()">
                <img id="p-img" style="width:48px; height:48px; border-radius:6px; object-fit:cover;">
                <div style="overflow:hidden;">
                    <b id="p-title" style="display:block; font-size:0.95em; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;"></b>
                    <span id="p-art" style="font-size:0.75em; color:#b3b3b3;"></span>
                </div>
            </div>

            <div style="display:flex; align-items:center; gap:20px;">
                <i class="fas fa-heart" id="p-heart" style="font-size:1.2em; cursor:pointer;"></i>
                <i class="fas fa-play" id="p-play-btn" style="font-size:1.4em; cursor:pointer;" onclick="togglePlay()"></i>
            </div>
        </div>
        <audio id="main-audio"></audio>
    </div>

    <div id="song-detail-ui" class="overlay">
        <div style="padding: 20px;">
            <i class="fas fa-chevron-down" onclick="this.parentElement.parentElement.style.display='none'" style="font-size:1.5em; cursor:pointer; color:#888;"></i>
            
            <div style="text-align:center; margin-top:30px;">
                <img id="detail-img" style="width:280px; height:280px; border-radius:15px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); object-fit:cover;">
                <h2 id="detail-title" style="margin:25px 0 5px 0; font-size:1.6em;"></h2>
                <p id="detail-art" style="color:#b3b3b3; font-size:1.1em;"></p>
            </div>

            <div class="card" style="margin-top:40px; display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:12px;" id="uploader-link">
                    <img id="up-img" style="width:45px; height:45px; border-radius:50%; object-fit:cover;">
                    <div>
                        <b id="up-name" style="font-size:0.9em;"></b>
                        <p id="up-fol-count" style="font-size:0.75em; color:#888; margin:0;">0 Followers</p>
                    </div>
                </div>
                <button id="detail-fol-btn" class="btn" style="width:90px; padding:8px; font-size:0.8em; border-radius:20px;">Follow</button>
            </div>
        </div>
    </div>`;
}

// പാട്ട് പ്ലേ ചെയ്യുന്ന ഫങ്ക്ഷൻ
export function playTrack(song, rtdb, auth) {
    const player = document.getElementById('player-ui');
    const audio = document.getElementById('main-audio');
    const playBtn = document.getElementById('p-play-btn');

    player.style.display = 'block';
    document.getElementById('p-title').innerText = song.title;
    document.getElementById('p-art').innerText = song.artist;
    document.getElementById('p-img').src = song.logo;

    // ഡീറ്റെയിൽ പേജിലും വിവരങ്ങൾ മാറ്റുന്നു
    document.getElementById('detail-title').innerText = song.title;
    document.getElementById('detail-art').innerText = song.artist;
    document.getElementById('detail-img').src = song.logo;
    document.getElementById('up-img').src = song.up_p;
    document.getElementById('up-name').innerText = song.up;

    if(audio.src !== song.url) {
        audio.src = song.url;
        audio.play();
        playBtn.className = "fas fa-pause";
    }

    // ഫോളോവേഴ്സ് കൗണ്ട് എടുക്കുന്നു (Firebase integration)
    import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js").then(db => {
        const folRef = db.ref(rtdb, `users/${song.uid}/followers`);
        db.onValue(folRef, snap => {
            const count = snap.size || 0;
            document.getElementById('up-fol-count').innerText = `${count} Followers`;
            
            // ബട്ടൺ ടെക്സ്റ്റ് മാറ്റാൻ
            const isFollowing = snap.hasChild(auth.currentUser.uid);
            const btn = document.getElementById('detail-fol-btn');
            btn.innerText = isFollowing ? "Following" : "Follow";
            btn.style.background = isFollowing ? "#333" : "#1DB954";
            btn.style.color = isFollowing ? "white" : "black";
        });
    });
}

// Play/Pause നിയന്ത്രിക്കാൻ
window.togglePlay = () => {
    const audio = document.getElementById('main-audio');
    const btn = document.getElementById('p-play-btn');
    if (audio.paused) {
        audio.play();
        btn.className = "fas fa-pause";
    } else {
        audio.pause();
        btn.className = "fas fa-play";
    }
};

window.showSongDetail = () => {
    document.getElementById('song-detail-ui').style.display = 'block';
};
