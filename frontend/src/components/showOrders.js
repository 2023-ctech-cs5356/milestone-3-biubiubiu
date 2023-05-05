import React from "react";
import { Link } from "react-router-dom";


const ShowOrders = (props) => {
    return (
        <div>
        <main>
          <ul>
            <div className="ul_title">All Available Car</div>
            {props.orderList.length >= 1 &&
              props.orderList.map((item, index) => {
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
                      <button
                        onClick={() => {
                            props.handleJoinCar(item);
                        }}
                      >
                        JoIn Car
                      </button>
                      <Link to={`/map/${item.from}/${item.to}`}>
                      <button>View Map</button>
                      </Link>
                    </div>
                  </li>
                );
              })}
          </ul>
        </main>
        </div>
)
}

export default ShowOrders;