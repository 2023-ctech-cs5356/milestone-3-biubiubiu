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

function Home() {
  const navigate = useNavigate();
  const [allOrderList, setAllOrderList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [isGet, setIsGet] = useState(false);

  const getAllOrders = () => {
    fetch("/api/order")
      .then((res) => res.json())
      .then((res) => {
        res = res.map((item) => {
          // item.time.seconds = new Date(item.time.seconds).toLocaleString();
          return item;
        });
        setOrderList(res);
        setAllOrderList(res)
      });
  };

  const handelJoinCar = async (item) => {
    await fetch("/api/join/" + item.id, {
      method: "put",
      body: JSON.stringify({
        username: firebase.auth().currentUser.displayName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      getAllOrders();
    });
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
        time: new Date(e.target.time.value).getTime(),
        max: e.target.max.value,
        ownerId: firebase.auth().currentUser.uid,
        owner: firebase.auth().currentUser.displayName,
      }),
    }).then((response) => {
      if (response.ok) {
        getAllOrders();
        console.log("Add Order Ok");
        alert("Add Successfully");
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newOrder = allOrderList.filter((item) => {
      let _item = item;
      if (e.target.from.value) {
        if (item.from !== e.target.from.value) {
          _item = null;
        }
      }
      if (e.target.to.value) {
        if (item.to !== e.target.to.value) {
          _item = null;
        }
      }
      if (e.target.time.value) {
        if (item.time !== e.target.time.value) {
          _item = null;
        }
      }
      if (e.target.max.value) {
        if (item.max !== e.target.max.value) {
          _item = null;
        }
      }
      if (_item) {
        return _item;
      }
    });
    if (
      !e.target.from.value &&
      !e.target.to.value &&
      !e.target.time.value &&
      !e.target.max.value
    ) {
      setOrderList(allOrderList);
    } else {
      setOrderList(newOrder);
    }
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
  if (isSignedIn && orderList.length <= 0 && !isGet) {
    getAllOrders();
    setIsGet(true)
  }

  return (
    <div className="Home">
      <nav>
        <span>Welcome {firebase.auth().currentUser.displayName} !</span>
        <div>
          <button onClick={() => { navigate('./MyOrder') }}>My Order</button>
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
              <span>Time:</span>
              <input name="time" type="datetime-local"></input>
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
          <form onSubmit={handleSearch}>
            <div>
              <span>From:</span>
              <input name="from"></input>
            </div>
            <div>
              <span>To:</span>
              <input name="to"></input>
            </div>
            <div>
              <span>Time:</span>
              <input name="time" type="datetime-local"></input>
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
                    <p>Time:{item.time?.seconds}</p>
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
