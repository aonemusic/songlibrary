import { initPlayer, playTrack } from './player.js';
import { renderProfileUI } from './profile.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, onValue, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

let allSongs = [];

// UI Initialize ചെയ്യുന്നു
document.getElementById('player-root').innerHTML = initPlayer();
document.getElementById('profile-root').innerHTML = renderProfileUI();

// 1. ലോഗിൻ സ്റ്റാറ്റസ് പരിശോധിക്കുന്നു
onAuthStateChanged(auth, user => {
    if(user) {
        document.getElementById('my-avatar').src = user.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
        loadSongs();
    } else {
        // ലോഗിൻ ചെയ്തില്ലെങ്കിൽ കാണിക്കേണ്ടത് (ഓപ്ഷണൽ)
        console.log("No user logged in");
    }
});

// 2. പാട്ടുകൾ ലോഡ് ചെയ്യുന്നു
function loadSongs() {
    onValue(ref(rtdb, 'songs'), snap => {
        allSongs = [];
        const list = document.getElementById('track-list');
        list.innerHTML = "";
        snap.forEach(child => {
            const s = child.val();
            allSongs.push({ id: child.key, ...s });
            const div = document.createElement('div');
            div.className = 'track-item';
            div.innerHTML = `<img src="${s.logo}"> <div><b>${s.title}</b><br><small>${s.up}</small></div>`;
            div.onclick = () => playTrack({id: child.key, ...s}, rtdb, auth);
            list.appendChild(div);
        });
    });
}

// 3. പ്രൊഫൈൽ വിവരങ്ങൾ ഡാറ്റാബേസിൽ അപ്ഡേറ്റ് ചെയ്യുന്നു
window.updateUserInDB = async (data) => {
    const user = auth.currentUser;
    if(!user) return;
    try {
        await updateProfile(user, data);
        alert("Profile Updated!");
        location.reload(); // മാറ്റങ്ങൾ കാണാൻ റീഫ്രഷ് ചെയ്യുന്നു
    } catch (err) {
        alert("Error: " + err.message);
    }
};

// 4. പ്രൊഫൈൽ തുറക്കുന്ന ഫങ്ക്ഷൻ (സ്വന്തം ആണോ എന്ന് പരിശോധിക്കുന്നു)
window.openMyProfile = () => {
    const user = auth.currentUser;
    const profileUI = document.getElementById('profile-ui');
    profileUI.style.display = 'block';
    
    document.getElementById('view-p-img').src = user.photoURL;
    document.getElementById('view-p-name').innerText = user.displayName;
    
    // സ്വന്തം പ്രൊഫൈൽ ആയതുകൊണ്ട് എഡിറ്റ് ബട്ടണുകൾ കാണിക്കുന്നു
    document.getElementById('edit-pic-btn').style.display = 'flex';
    document.getElementById('edit-name-btn').style.display = 'block';
    document.getElementById('fol-btn').style.display = 'none'; // സ്വന്തമായി ഫോളോ ചെയ്യണ്ട
};

// ഹെഡറിലെ അവതാറിൽ ക്ലിക്ക് ചെയ്താൽ പ്രൊഫൈൽ തുറക്കാൻ
document.getElementById('my-avatar').onclick = window.openMyProfile;
