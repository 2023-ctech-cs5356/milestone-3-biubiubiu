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

  await firestoreDb.collection("orders").add(orderInfo)

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
  await firestoreDb.collection("orders").doc(order.id).delete() // id property has been added in the getAllOrders funtion
}


/// Update the Order for its time
export const updateOrderTime = async(order, newTime) => {
  await firestoreDb.collection('orders').doc(order.id).update({ // id property has been added in the getAllOrders funtion
    time:newTime
  })
}

/// Join to an Order
export const joinOrder = async(orderId, userName) => {
  const orderInfo = await firestoreDb.collection("orders").doc(orderId).get()
  if (orderInfo.data().passenger.length<orderInfo.data().max){
    await firestoreDb.collection("orders").doc(orderId).update({
      passenger: firebase.firestore.FieldValue.arrayUnion(userName)
    })
  }
}

/// Read Order for an Owner
export const GetOwnerOrders = async(ownerId) => {
  
  const ownerInfo = await firestoreDb.collection("owners").doc(ownerId).get()
  const orders = ownerInfo.data().orders

  return orders
}

// getAllOrders()
joinOrder("1zgNdim9bPtqOySzljUs","HHAH" )
// updateOrderTime("LnQaNWTPftsA6kjZlXRM",21312)