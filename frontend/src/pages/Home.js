import React, { useState, useEffect } from "react";
// This uses the pre-built login form
import { StyledFirebaseAuth } from 'react-firebaseui';
// This imports firebase using the Firebase SDK v8 style
import firebase from 'firebase/compat/app'
// This imports the Firebase Auth libraries
import 'firebase/compat/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZAu21Xnht97pEAqxmNf1CyJHkHFjxudI",
  authDomain: "cs5356-milestone2-2b364.firebaseapp.com",
  projectId: "cs5356-milestone2-2b364",
  storageBucket: "cs5356-milestone2-2b364.appspot.com",
  messagingSenderId: "893513623486",
  appId: "1:893513623486:web:e869fa4112a7b1e1c5bbef"
};

firebase.initializeApp(firebaseConfig)

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};



function Home() {

  const handleSubmit = e => {
    console.log(firebase.auth().currentUser.uid)
    e.preventDefault()
    fetch('/api/order',{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        from:e.target.from.value, 
        to:e.target.to.value,
        max:e.target.max.value,
        ownerId: firebase.auth().currentUser.uid})
    }).then(response=>{
      if (response.ok){
        console.log("Add Order Ok")
      }
    })
  }

  const [isSignedIn, setIsSignedIn] = useState(false);
  

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      // this gets called whenever a user signs in or out
      setIsSignedIn(!!user); //!! convert user to boolean
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);


  if (!isSignedIn) {
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  }
  return (
    <div>
      <h1>My App</h1>
      <p>Welcome - You are now signed-in - {isSignedIn}!</p>
      <form onSubmit={handleSubmit}>
        <div>from</div>
        <input name="from"></input>
        <div>To</div>
        <input name="to"></input>
        <div>Max</div>
        <input name="max"></input>
        <input type="submit"/>
      </form>
      <br></br>
      <button class="is-danger" onClick={()=>firebase.auth().signOut()}>sign out</button>
    </div>
  );
}

export default Home;
