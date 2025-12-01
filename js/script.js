// Firebase Setup
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
    import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

    const firebaseConfig = {
        apiKey: "AIzaSyCiqRuzqN6460s02rYk7ZGMbIUGbmVVXxg",
        authDomain: "inkloom-12008.firebaseapp.com",
        projectId: "inkloom-12008",
        storageBucket: "inkloom-12008.firebasestorage.app",
        messagingSenderId: "148104043088",
        appId: "1:148104043088:web:1b9b2b0d937437d2670f55"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    window.signUp = async function() {
      const email = su_email.value;
      const pass = su_pass.value;
      await createUserWithEmailAndPassword(auth, email, pass);
      alert("Account created!");
    };

    window.logIn = async function() {
      const email = li_email.value;
      const pass = li_pass.value;
      await signInWithEmailAndPassword(auth, email, pass);
      alert("Logged in!");
    };

    window.forgotPassword = async function() {
      const email = li_email.value;
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    };

    window.logOut = function() {
      signOut(auth);
    };

    window.saveProfile = async function() {
      const user = auth.currentUser;
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, {
        username: username.value,
        bio: bio.value,
        avatar: avatarUrl.value
      }, { merge: true });
      alert("Profile updated!");
    };

    window.saveBook = async function() {
      const user = auth.currentUser;
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { savedBooks: arrayUnion(bookName.value) });
      loadBooks();
    };

    async function loadProfile(user) {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        avatarImg.src = d.avatar || "";
        username.value = d.username || "";
        bio.value = d.bio || "";
      }
    }

    async function loadBooks() {
      const user = auth.currentUser;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const list = document.getElementById('savedBooksList');
      list.innerHTML = "";
      if (snap.exists() && snap.data().savedBooks) {
        snap.data().savedBooks.forEach(b => {
          const div = document.createElement("div");
          div.className = "book";
          div.textContent = b;
          list.appendChild(div);
        });
      }
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        document.querySelector('.container').style.display="none";
        profilePage.style.display = "block";
        booksSection.style.display = "block";
        loadProfile(user);
        loadBooks();
      } else {
        document.querySelector('.container').style.display="block";
        profilePage.style.display = "none";
        booksSection.style.display = "none";
      }
    });