import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import MyOrder from "./pages/MyOrder";
import Map from "./pages/map"

/**
 * CS-5356-TODO
 * App contains all the pages for this web application
 *
 * There are 4 pages
 * - /login
 * - /logout
 * - /instructor-home
 * - /:session-code
 *
 * When the App loads for the first time, make a
 * GET /api/user to see if the user is signed in.
 *
 * If you receive a 401, set the isSignedIn state
 * to false.
 *
 * If you receive a 200, set the isSignedIn state to true
 * and then set the user state to the user object
 * from the response of the request.
 *
 */

const App = () => {

  return (
    <div>
      <Router>
        {/* <Navbar isSignedIn={isSignedIn} username={user?.userId ?? null} /> */}
        <Routes>
        
        <Route
            path="/MyOrder"
            element={<MyOrder />}
          />

          <Route exact path="/" element={<Home />} />

          <Route path="/map/:from/:to" element={<Map />} />

        </Routes>
      </Router>
    </div>
  );
};

export default App;
