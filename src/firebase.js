//import firebase from "firebase";
import firebase from 'firebase/app';
import 'firebase/auth'; 
import 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBXlitHUs_aRq4zsiHSxqGpEoNnQAfEEVI",
    authDomain: "chatapp-firebase-b3780.firebaseapp.com",
    databaseURL: "https://chatapp-firebase-b3780.firebaseio.com",
    projectId: "chatapp-firebase-b3780",
    storageBucket: "chatapp-firebase-b3780.appspot.com",
    messagingSenderId: "196662174687",
    appId: "1:196662174687:web:18c9956f7fd815379d1a6a",
    measurementId: "G-6VYVRQ16VF"
  };

const firebaseApp=firebase.initializeApp(firebaseConfig);
const db=firebaseApp.firestore();
const auth=firebase.auth();
const provider=new firebase.auth.GoogleAuthProvider();

export {auth,provider};
export default db;