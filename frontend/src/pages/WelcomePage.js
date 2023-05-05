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
        justifyContent: "center",
        color: "#fff",

    };

    const buttonStyles = {
        margin: "10px",
    }
    return (
    
    <div style = {styles}>
        <Link to = '/Home'>
            <button style={buttonStyles}>Explore</button>
        </Link>
        <button style={buttonStyles}>Sign In</button>
    </div>

    ) 
}

export default Welcome