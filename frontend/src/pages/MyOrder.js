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
    fetch("/api/owner/" + firebase.auth().currentUser.uid)
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        // res = res.orders.map((item) => {
        //   item.time.seconds = new Date(item.time.seconds).toLocaleString();
        //   return item;
        // });
        setMyOrderList(res.orders);
        console.log(res.orders)
      });
      console.log("Here")
  };

  const handelDimiss = (item) => {
    fetch('/api/delete/' +  firebase.auth().currentUser.uid,{
        method:'delete',
        body: JSON.stringify({
            ownerId: item.ownerId
        })
    })
  }

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

  if (isSignedIn && myOrderList.length <= 0) {
    getMyOrders();
  }

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
                    <button onClick={()=>{handelDimiss(item)}} style={{ background: "red" }}>Dimiss</button>
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

export default MyOrder;
