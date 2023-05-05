import React from "react";
import carImage from "./car.jpg"
import { Link } from "react-router-dom";

const Welcome = () => {
    const styles = {
        backgroundImage: `url(${carImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        color: "#fff",

    };

    const buttonStyles = {
        margin: "10px",
    }
    return (
    
    <div style = {styles}>
        <h1 className="has-text-centered title is-1 has-text-primary-dark" style ={{margin: "20px"}}>Big CarPool, A way to travel save and cheap!</h1>
        <Link to = '/home'>
            <button style={buttonStyles}>Explore</button>
        </Link>
        <Link to = '/login'>
            <button style={buttonStyles}>Sign In</button>
        </Link>
    </div>

    ) 
}

export default Welcome