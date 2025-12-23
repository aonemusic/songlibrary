import { initPlayer, playTrack } from './player.js';
import { renderProfileUI } from './profile.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAthFMO8zGT5BtiOkh4zkc71jL06LR_F9c",
    authDomain: "a-one-chat-19ad6.firebaseapp.com",
    databaseURL: "https://a-one-chat-19ad6-default-rtdb.firebaseio.com",
    projectId: "a-one-chat-19ad6",
    storageBucket: "a-one-chat-19ad6.firebasestorage.app",
    messagingSenderId: "691783470864",
    appId: "1:691783470864:web:0b119fcddf984af66e5f95"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const rtdb = getDatabase(app);

// ലേഔട്ട് ലോഡ് ചെയ്യുന്നു
document.getElementById('player-root').innerHTML = initPlayer();
document.getElementById('profile-root').innerHTML = renderProfileUI();

onAuthStateChanged(auth, user => {
    if(user) {
        document.getElementById('my-avatar').src = user.photoURL;
        loadSongs();
    }
});

function loadSongs() {
    onValue(ref(rtdb, 'songs'), snap => {
        const list = document.getElementById('track-list');
        list.innerHTML = "";
        snap.forEach(child => {
            const s = child.val();
            const div = document.createElement('div');
            div.className = 'track-item';
            div.innerHTML = `<img src="${s.logo}"> <div><b>${s.title}</b><br><small>${s.up}</small></div>`;
            div.onclick = () => playTrack({...s, id: child.key});
            list.appendChild(div);
        });
    });
}
