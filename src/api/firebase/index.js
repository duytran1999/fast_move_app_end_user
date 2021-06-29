import * as firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCogzYVNF1ejxp9hSYZigpRbrRWWJA18KE",
    authDomain: "fastmove-e11aa.firebaseapp.com",
    projectId: "fastmove-e11aa",
    storageBucket: "fastmove-e11aa.appspot.com",
    messagingSenderId: "645032414567",
    appId: "1:645032414567:web:fc64ac7842ca31c07373c2",
    measurementId: "G-KYQ4P1NV8Y"
};

export const FirebaseApp = firebase.initializeApp(firebaseConfig);

