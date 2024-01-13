// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvNZ3kkalQJMUF7PO1L2ZqmpFyU3l0ZvU",
  authDomain: "physiotrack-28fa2.firebaseapp.com",
  projectId: "physiotrack-28fa2",
  storageBucket: "physiotrack-28fa2.appspot.com",
  messagingSenderId: "15039436768",
  appId: "1:15039436768:web:177eeb982d8e56628f7d85",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { app, ref, storage };
