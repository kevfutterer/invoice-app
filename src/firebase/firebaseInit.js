import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAYrFsotdiKvyAPTHVVRXp2vFYoot7v-rM",
    authDomain: "invoice-project-47459.firebaseapp.com",
    projectId: "invoice-project-47459",
    storageBucket: "invoice-project-47459.appspot.com",
    messagingSenderId: "999332528488",
    appId: "1:999332528488:web:1f881bc0bc8b72d46916dd",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp.firestore();
