import React, { useState, useEffect } from "react";

// This imports firebase using the Firebase SDK v8 style
import firebase from "firebase/compat/app";
// This imports the Firebase Auth libraries
import "firebase/compat/auth";

import { useNavigate } from "react-router-dom";
import "./Home.css";
import { Link } from "react-router-dom";
import ShowOrders from "../components/showOrders";

function Home() {
  const navigate = useNavigate();
  const [orderList, setOrderList] = useState([]);

  const getAllOrders = () => {
    fetch("/api/order")
      .then((res) => res.json())
      .then((res) => {
        res = res.map((item) => {
          return item;
        });
        setOrderList(res);
      });
  };

  useEffect(()=>{getAllOrders()}, [])

  const handleJoinCar = async (item) => {
    if (!firebase.auth().currentUser){
      navigate('/login')
    } else {
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
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!firebase.auth().currentUser){
      navigate('/login')
    } else {
    fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: e.target.from.value,
        to: e.target.to.value,
        time: e.target.time.value,
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
  }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchOrder = orderList.filter((item) => {
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
      if (_item) {
        return _item;
      }
    });
    if (!e.target.from.value && !e.target.to.value) {
      getAllOrders()
    } else {
      setOrderList(searchOrder);
    }
  };

  const handleLog = () =>{
    if (firebase.auth().currentUser){
      firebase.auth().signOut()
      .then(()=>{navigate('/')}
    )} else {
      {navigate('/login')}
    }}

    return (
      <div className="Home">
        <nav>
          <span className="has-text-primary-dark title is-3">Welcome, {firebase.auth().currentUser ? firebase.auth().currentUser.displayName:"User"} !</span>
          <div>
            <button onClick={() => { if (firebase.auth().currentUser) {navigate('/MyOrder')} else {navigate('/login')} }}>My Order</button>
            <button onClick = {handleLog}>{firebase.auth().currentUser? "Log Out" : "Log In"}</button>
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
              <input
                className="submitBtn button"
                type="submit"
                value={"Search"}
              ></input>
            </form>
          </div>
        </header>

        <ShowOrders orderList={orderList} handleJoinCar={handleJoinCar} />
      </div>
    );
    } 
export default Home;
