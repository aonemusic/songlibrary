export function initPlayer() {
    return `
    <div class="bottom-player" id="player-ui" style="display:none;">
        <div style="display:flex; align-items:center; gap:10px;" onclick="document.getElementById('song-detail-ui').style.display='block'">
            <img id="p-img" style="width:45px; height:45px; border-radius:4px;">
            <div style="flex-grow:1;">
                <b id="p-title" style="display:block; font-size:0.9em;"></b>
                <span id="p-art" style="font-size:0.7em; color:#888;"></span>
            </div>
            <i class="fas fa-heart" id="p-heart" style="cursor:pointer;"></i>
        </div>
        <input type="range" id="seek-bar" value="0" style="width:100%; margin-top:10px; accent-color:#1DB954;">
        <audio id="main-audio"></audio>
    </div>`;
}

export function playTrack(song) {
    const player = document.getElementById('player-ui');
    const audio = document.getElementById('main-audio');
    player.style.display = 'block';
    document.getElementById('p-title').innerText = song.title;
    document.getElementById('p-art').innerText = song.artist;
    document.getElementById('p-img').src = song.logo;
    
    if(audio.src !== song.url) {
        audio.src = song.url;
        audio.play();
    }
}
