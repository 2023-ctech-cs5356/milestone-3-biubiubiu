import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZAu21Xnht97pEAqxmNf1CyJHkHFjxudI",
  authDomain: "cs5356-milestone2-2b364.firebaseapp.com",
  projectId: "cs5356-milestone2-2b364",
  storageBucket: "cs5356-milestone2-2b364.appspot.com",
  messagingSenderId: "893513623486",
  appId: "1:893513623486:web:e869fa4112a7b1e1c5bbef"
};


// CS5356 TO-DO #0 Uncomment these 2 lines after
//   adding your Firebase Config
firebase.initializeApp(firebaseConfig);
const firestoreDb = firebase.firestore();


// const findOwner = (ownerID) => {
//   const users = firestoreDb.collection("users")
//   users.find
// }

/// Create the Order
export const createOrder = async (order) => {
  await firestoreDb.collection("orders").add({
    "from": order.from,
    "to":order.to,
    "time": new Date(),
    "ownerId":order.ownerId,
    "passenger":[order.ownerId],
    "max":order.max,
    //"userId":firebase.auth().currentUser.uid
  })

  // need to add to the users' order as well

};

/// Read All Orders
export const getAllOrders = async() => {
  const orders = []
  const querySnapshot = await firestoreDb.collection("orders").get()
  querySnapshot.forEach((doc)=>{
    orders.push({id:doc.id, ...doc.data()})
  })
  console.log("Data:", orders)
  return orders
}


/// Delete order by order ID
export const deleteOrder = async(order) =>{
  await firestoreDb.collection("orders").doc(order.id).delete()
}


/// Update the Order
export const updateOrderTime = async(order, newTime) => {
  await firestoreDb.collection('orders').doc(order.id).update({
    time:newTime
  })
}


// createOrder({"from":"Simon fraser university",
// "to": "grouse Mountain",
// "ownerId":"yseraid",
// "max":6
// });
// createOrder({"from":"Simon fraser university",
// "to": "grouse Mountain",
// "ownerId":"yseraid",
// "max":6
// });

// getAllOrders()
// deleteOrder("0SWiKnKtw7yufmTCyoZR")
// updateOrderTime("LnQaNWTPftsA6kjZlXRM",21312)