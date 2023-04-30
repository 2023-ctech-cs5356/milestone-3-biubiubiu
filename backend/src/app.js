import express, { response } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import bodyParser from "body-parser";
import * as db from "./database.js";
import { error } from "console";

const app = express();
app.use(
  cookieSession({
    secret: "cookiesecret",
  })
);
app.use(cookieParser());
app.use(cors());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);



app.post("/api/order", (req, res) => {
  /**
   * Create a new Order
   *
   * Return:
   * 201 Created - with the new Order object
   * 400 Bad Request - when the request body is missing the required field
   * 401 Unauthorized - Only signed in users should be able to create a Order
   */

  if (!req.body.ownerId){
    res.status(401).send("No user Logged in")
  } else {
    db.createOrder({
      from:req.body.from,
      to:req.body.to,
      ownerId: req.body.ownerId,
      owner:req.body.owner,
      max:req.body.max,
    })
    .then((orderInfo)=>{
      res.status(201).send(orderInfo)
    })
    .catch((error)=>{
      res.status(400).send({error: error.massage})
    })
  }
});

app.get("/api/order", (req,res)=>{
    /*
  Read All Order

  Return:
  200 Read
  400 Bad Request - Error Incur
  */

  db.getAllOrders()
  .then((allOrders)=>{
    res.status(200).send(allOrders)
  })
  .catch((error)=>{
    res.status(400).send({error: error.massage})
  })

})

app.put("/api/join/:orderID", (req,res)=>{
  /*
  Join to an Order

  Return:
  200 Updated
  400 Bad Request - Passengers reach the Maximum
  401 Unauthorized - Only signed in users can Join

  */
  console.log(req.params.orderID==="3kL9alXRbAT49Mad2Z2h")

  if (!req.body.username){
    res.status(401).send("Only signed in users can Join")
  } else {
    db.joinOrder(req.params.orderID, req.body.username)
    .then((response)=>{
      if (response){
        res.status(201).send("Join Successfully")
      } else {
        res.status(400).send("Passengers reach the Maximum")
      }
    })
  }
})


app.delete("/api/delete/:orderID", (req,res) => {
  /*
  Delete an Order

  Return:
  200 Deleted
  400 Bad Request - Did not Find the Order
  401 Unauthorized - Only signed in users can Join

  */
  db.deleteOrder(req.params.orderID, req.body.ownerId)
  .then(response=>{
    if(response===true){
      res.status(201).send("Deleted")
    } else {
      res.status(401).send("Unauthorized Behaviour")
    }
  })
})

app.get("/api/owner/:ownerID", (req,res)=>{
  /* 
  Read All Orders for A Owner

  Return:
  200 Read
  400 No Order for the users or No such User

  */
  db.GetOwnerOrders(req.params.ownerID)
  .then((userOrder)=>{
    if (userOrder) {
      res.status(200).send(userOrder)
    } else {
      res.status(400).send("No Order Exist for the User")
    }
  })
})



export default app;
