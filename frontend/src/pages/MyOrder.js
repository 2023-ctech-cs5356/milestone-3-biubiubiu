import React, { useState, useEffect } from "react";
// This imports firebase using the Firebase SDK v8 style
import firebase from "firebase/compat/app";
// This imports the Firebase Auth libraries
import "firebase/compat/auth";
import { useNavigate } from "react-router-dom";
import "./Home.css";

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

  return (
      <div className="Home">
        <nav>
          <span className="has-text-primary-dark title is-3">Welcome {firebase.auth().currentUser.displayName} !</span>
          <div>
            <button
              onClick={() => {
                navigate("/home");
              }}
            >
              Main Page
            </button>
            <button onClick={() => firebase.auth().signOut()}>Log Out</button>
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
                      <p>Time:{new Date(item.time).toLocaleString()}</p>
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
        </main>
      </div>
    );
  }
  


  
export default MyOrder;
