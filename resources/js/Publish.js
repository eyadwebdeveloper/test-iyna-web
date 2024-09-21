import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBJysqo3eYd-QyWjjwzKRr3BeQkEC003UM",
  authDomain: "iyna-database.firebaseapp.com",
  projectId: "iyna-database",
  storageBucket: "iyna-database.appspot.com",
  messagingSenderId: "675368579395",
  appId: "1:675368579395:web:6dfa085b2cb366a92abff6",
  measurementId: "G-S9EKQXR29S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

const dropContainer = document.getElementById("dropcontainer");
const fileInput = document.getElementById("images");
const form = document.getElementById("publish-form");

dropContainer.addEventListener("dragover", (e) => {
  // prevent default to allow drop
  e.preventDefault();
}, false);

dropContainer.addEventListener("dragenter", () => {
  dropContainer.classList.add("drag-active");
});

dropContainer.addEventListener("dragleave", () => {
  dropContainer.classList.remove("drag-active");
});

dropContainer.addEventListener("drop", (e) => {
  e.preventDefault()
  dropContainer.classList.remove("drag-active");
  fileInput.files = e.dataTransfer.files;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get the file
  const file = fileInput.files[0];

  if (!file) {
    console.log("No file selected");
    return;
  }

  // Upload file to Firebase Storage
  const storageRef = ref(storage, `images/${file.name}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on('state_changed', 
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      // Handle unsuccessful uploads
    }, 
    () => {
      // Handle successful uploads on complete
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        
        let email = document.getElementById('email').value;
        let name = document.getElementById('name').value;
        let title = document.getElementById('title').value;
        // Set the URL in Firestore
        setDoc(doc(db, "Publish", email), {
          name: name,
          email: email,
          articleTitle: title,
          paperURL: downloadURL
        });
      });
    }
  );
})