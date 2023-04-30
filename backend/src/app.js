import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import bodyParser from "body-parser";
import * as db from "./database.js";

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
    const orderInfo = db.createOrder({
      from:req.body.from,
      to:req.body.to,
      ownerId: req.body.ownerId,
      owner:req.body.owner,
      max:req.body.max,
    })
    
    res.status(201).send(orderInfo)
  }
});

app.get("/api/order", (req,res)=>{
    /*
  Read All Order

  Return:
  200 Read
  400 Bad Request - Did not find the Order
  */

  const allOrders = db.getAllOrders()
  if (allOrders){
    res.status(200).send(allOrders)
  } else {
    res.status(400).send(allOrders)
  }
})

app.put("/api/join/:orderID", (req,res)=>{
  /*
  Join to an Order

  Return:
  200 Updated
  400 Bad Request - Did not find the Order
  401 Unauthorized - Only signed in users can Join

  */

  if (!req.body.userId){
    res.status(401).send("No user Logged in")
  } else {
    db.joinOrder(req.params.orderID, req.body.userId)
    res.status(201).send("Ok")
  }
})


app.delete("/api/join/:orderID", (req,res) => {
  /*
  Delete an Order

  Return:
  200 Deleted
  400 Bad Request - Did not Find the Order
  401 Unauthorized - Only signed in users can Join

  */
  db.deleteOrder(req.params.orderID)
  res.status(201).send("Deleted")
})

app.get("/api/join/:ownerID", (req,res)=>{
  /* 
  Read All Order for A Owner


  */

  const orders = db.GetOwnerOrders(req.params.ownerID)
  res.status(200).send(orders)
})



export default app;
