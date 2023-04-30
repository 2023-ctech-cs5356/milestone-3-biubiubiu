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



/// Create the Order
export const createOrder = async (order) => {

  // Save the order into the firebase
  const orderInfo = {
    "from": order.from,
    "to":order.to,
    "time": new Date(),
    "owner":order.owner,
    "ownerId":order.ownerId,
    "passenger":[order.owner],
    "max":order.max,
  }

  const orderRef = await firestoreDb.collection("orders").add(orderInfo)
  const newOrder = await orderRef.get()
  const newOrderCreate = {id:newOrder.id, ...newOrder.data()}

  // Check whether the Users exist
  const ownerInfo = await firestoreDb.collection("owners").doc(order.ownerId).get()
  if (!ownerInfo.exists){ // if not exist, we create one
    await firestoreDb.collection("owners").doc(order.ownerId).set({
      owner:order.owner,
      orders:[]
    })
  }

  // add the new orders to the users' orders
  await firestoreDb.collection("owners").doc(order.ownerId).update({
    orders: firebase.firestore.FieldValue.arrayUnion(orderInfo)
  })

  return newOrderCreate
  
};

/// Read All Orders
export const getAllOrders = async() => {
  const orders = []
  const querySnapshot = await firestoreDb.collection("orders").get()
  querySnapshot.forEach((doc)=>{
    orders.push({id:doc.id, ...doc.data()})
  })
  //console.log("Data:", orders)
  return orders
}


/// Delete order by order ID, only user who create it can delete it
export const deleteOrder = async(orderId, ownerId) =>{
  const orderRef = firestoreDb.collection("orders").doc(orderId)
  const orderInfo = await orderRef.get()

  if (orderInfo.exists) {
    const orderData = orderInfo.data()
    if (orderData.ownerId === ownerId){
      orderRef.delete()
      return true
    } else {
      return false
    }
  } else {
    return false
  }

}


/// Update the Order for its time
export const updateOrderTime = async(order, newTime) => {
  await firestoreDb.collection('orders').doc(order.id).update({
    time:newTime
  })
}

/// Join to an Order
export const joinOrder = async(orderId, username) => {
  const orderInfo = await firestoreDb.collection("orders").doc(orderId).get()
  if (orderInfo.data().passenger.length<orderInfo.data().max){
    await firestoreDb.collection("orders").doc(orderId).update({
      passenger: firebase.firestore.FieldValue.arrayUnion(username)
    })
    return orderInfo.data()
  } else {
    return null
  }
}

/// Read Order for an Owner, Only the Owner itself can access its own orders
export const GetOwnerOrders = async(ownerId) => {
  const ownerInfo = await firestoreDb.collection("owners").doc(ownerId).get()
  const userOrders = ownerInfo.data() //Need to Fix

  return userOrders
}

// getAllOrders()
//GetOwnerOrders("WrfLu3AEhqTABwo8n1dMjdARlT92")