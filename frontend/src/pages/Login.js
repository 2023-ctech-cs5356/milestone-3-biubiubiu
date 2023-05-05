import React, { useState, useEffect } from "react";
// This uses the pre-built login form
import { StyledFirebaseAuth } from "react-firebaseui";
// This imports firebase using the Firebase SDK v8 style
import firebase from "firebase/compat/app";
// This imports the Firebase Auth libraries
import "firebase/compat/auth";
import nightImage from "./night.jpg"


import { useNavigate } from "react-router-dom";

import "./Home.css";
import { Link } from "react-router-dom";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZAu21Xnht97pEAqxmNf1CyJHkHFjxudI",
  authDomain: "cs5356-milestone2-2b364.firebaseapp.com",
  projectId: "cs5356-milestone2-2b364",
  storageBucket: "cs5356-milestone2-2b364.appspot.com",
  messagingSenderId: "893513623486",
  appId: "1:893513623486:web:e869fa4112a7b1e1c5bbef",
};

firebase.initializeApp(firebaseConfig);

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};



function Login () {
    const styles = {
        backgroundImage: `url(${nightImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
    
    };
    const [isSignedIn, setIsSignedIn] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        const unregisterAuthObserver = firebase
          .auth()
          .onAuthStateChanged((user) => {
            // this gets called whenever a user signs in or out
            setIsSignedIn(!!user); //!! convert user to boolean
          });
        return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
      }, []);


    if (!isSignedIn) {
        return (
        <div style = {styles}>
            <h1 className="has-text-centered title is-1 has-text-primary-dark" style ={{margin: "20px"}}>Big CarPool</h1>
            <h1 className="has-text-success-light title is-3" style ={{margin: "20px"}}>Taking you to any place!</h1>
            <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
            style ={{margin: "20px"}}/>
        </div>
        );
    } else {
        navigate("/home")
    }
}

export default Login