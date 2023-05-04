import React, { useState, useEffect } from "react";
// This uses the pre-built login form
import { StyledFirebaseAuth } from "react-firebaseui";
// This imports firebase using the Firebase SDK v8 style
import firebase from "firebase/compat/app";
// This imports the Firebase Auth libraries
import "firebase/compat/auth";

import { useNavigate } from "react-router-dom";

import "./Home.css";

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

function MyOrder() {
  const [myOrderList, setMyOrderList] = useState([]);

  const navigate = useNavigate();

  const getMyOrders = () => {
    fetch("/api/owner/" + firebase.auth().currentUser.uid, {
      method:'GET'
    })
    .then((response)=>{
        response.json().then((orders)=>{
          setMyOrderList(orders);
          console.log("Infinite")
        })
      })
  };

  const handleDismiss = (item) => {
    console.log(firebase.auth().currentUser.uid)
    fetch('/api/delete/' +  item.id,{
        method:'DELETE',
        body: JSON.stringify({ownerId: firebase.auth().currentUser.uid}),
        headers: {
          "Content-Type": "application/json",
        }
    })
    .then((response)=>{
      if(response.ok){
        getMyOrders()
      }
    })
  }

  useEffect(()=>{getMyOrders()}, [])


  const [isSignedIn, setIsSignedIn] = useState(false);

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
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    );
  }

  if (isSignedIn && myOrderList.length >= 0) {

    return (
      <div className="Home">
        <nav>
          <span>Welcome {firebase.auth().currentUser.displayName} !</span>
          <div>
            <button
              onClick={() => {
                navigate("/");
              }}
            >
              Main Page
            </button>
            <button onClick={() => firebase.auth().signOut()}>Log out</button>
          </div>
        </nav>
  
        <main>
          <ul>
            <div className="ul_title">All Available Car</div>
            {myOrderList.length >= 1 &&
              myOrderList.map((item, index) => {
                return (
                  <li key={index}>
                    <div>
                      <p>From:{item.from}</p>
                      <p>To:{item.to}</p>
                      <p>Time:{item.time.seconds}</p>
                      <p>Current Passenger:{item.passenger.length}</p>
                      <p>Max Passenger:{item.max}</p>
                    </div>
                    <div>
                      <button onClick={()=>{handleDismiss(item)}} style={{ background: "red" }}>Dismiss</button>
                    </div>
                  </li>
                );
              })}
          </ul>
          {/* <ul>
            <div className="ul_title">All Available Car</div>
            <li>li</li>
          </ul> */}
        </main>
      </div>
    );
  }
  
  }

  
export default MyOrder;
