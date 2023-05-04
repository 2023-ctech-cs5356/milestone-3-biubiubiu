import React, { useState, useEffect } from "react";
// This uses the pre-built login form
import { StyledFirebaseAuth } from "react-firebaseui";
// This imports firebase using the Firebase SDK v8 style
import firebase from "firebase/compat/app";
// This imports the Firebase Auth libraries
import "firebase/compat/auth";

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

function Home() {
  const [orderList, setOrderList] = useState([]);

  const getAllOrders = () => {
    fetch("http://localhost:8080/api/order")
      .then((res) => res.json())
      .then((res) => {
        res = res.map((item) => {
          item.time.seconds = new Date(item.time.seconds).toLocaleString();
          return item;
        });
        setOrderList(res);
      });
  };

  const handelJoinCar = (item) => {
    fetch("api/join/" + item.id, {
      method: "put",
      body: JSON.stringify({
        username: firebase.auth().currentUser.displayName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(()=>{
      getAllOrders()
    })
      // .then((data) => data.text())
      // .then((res) => {
      //   console.log("res", res);
      // });
  };

  const handleSubmit = (e) => {
    console.log(
      firebase.auth().currentUser.uid,
      firebase.auth().currentUser.displayName
    );
    e.preventDefault();
    fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: e.target.from.value,
        to: e.target.to.value,
        max: e.target.max.value,
        ownerId: firebase.auth().currentUser.uid,
        owner: firebase.auth().currentUser.displayName,
      }),
    }).then((response) => {
      if (response.ok) {
        getAllOrders();
        console.log("Add Order Ok");
        alert("Creat Successfully");
      }
    });
  };

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
  if (isSignedIn && orderList.length <= 0) {
    getAllOrders();
  }

  return (
    // <div>
    //   <h1>My App</h1>
    //   <p>Welcome - You are now signed-in - {isSignedIn}!</p>
    //   <form onSubmit={handleSubmit}>
    //     <div>from</div>
    //     <input name="from"></input>
    //     <div>To</div>
    //     <input name="to"></input>
    //     <div>Max</div>
    //     <input name="max"></input>
    //     <input type="submit"/>
    //   </form>
    //   <br></br>
    //   <button class="is-danger" onClick={()=>firebase.auth().signOut()}>sign out</button>
    // </div>
    <div className="Home">
      <nav>
        <span>Welcome {firebase.auth().currentUser.displayName} !</span>
        <div>
          <button>My Order</button>
          <button onClick={() => firebase.auth().signOut()}>Log out</button>
        </div>
      </nav>

      <header>
        <div className="wrap">
          <form onSubmit={handleSubmit}>
            <div>
              <span>From:</span>
              <input name="from"></input>
            </div>
            <div>
              <span>To:</span>
              <input name="to"></input>
            </div>
            <div>
              <span>Max Passenger:</span>
              <input name="max"></input>
            </div>
            <input
              className="submitBtn button"
              type="submit"
              value={"Create A TrIp"}
            ></input>
          </form>
        </div>
        <div className="wrap">
          <span className="titleName">Search by :</span>
          <form>
            <div>
              <span>From:</span>
              <input name="from"></input>
            </div>
            <div>
              <span>To:</span>
              <input name="to"></input>
            </div>
            <div>
              <span>Max Passenger:</span>
              <input name="max"></input>
            </div>
            <input
              className="submitBtn button"
              type="submit"
              value={"Search"}
            ></input>
          </form>
        </div>
      </header>

      <main>
        <ul>
          <div className="ul_title">All Available Car</div>
          {orderList.length >= 1 &&
            orderList.map((item, index) => {
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
                    <button
                      onClick={() => {
                        handelJoinCar(item);
                      }}
                    >
                      JoIn Car
                    </button>
                    <button>View Map</button>
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

export default Home;
