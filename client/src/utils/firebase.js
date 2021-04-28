import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDlPDtEoo8ed611FqJ1y76K83LfNphj8WQ",
    authDomain: "practiceonexx-d80a6.firebaseapp.com",
    projectId: "practiceonexx-d80a6",
    storageBucket: "practiceonexx-d80a6.appspot.com",
    messagingSenderId: "382126820042",
    appId: "1:382126820042:web:e6ee569abbfe0168abc233",
    measurementId: "G-KMFTK1TCCH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth();

//Access Firestore
const db = firebase.firestore();
export const timestamp = firebase.firestore.FieldValue.serverTimestamp;
export const carsCollection = db.collection('Cars');
export const usersCollection = db.collection('Users');
export const siteRef = db.doc("Site/business");
export const employeesRef = db.collection('Site').doc("employees").collection("admins");

export default firebase;