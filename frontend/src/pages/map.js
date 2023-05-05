import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Map() {
  const navigate = useNavigate()
  const [mapLoaded, setMapLoaded] = useState(false);
  const {from,to}=useParams()

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBrwwVAVjR7e0UeKY9Vjj2vo8xZnh78S9Q&libraries=places`;
    script.async = true;
    script.onload = () => {
      setMapLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // When the component unmounts, we need the remove the API script
    };
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      initMap(from,to);
    }
  }, [mapLoaded]); //This is to ensure that the API script has been added to the html.  It runs every time the mapLoaded Changed


  async function initMap(from,to) {

    let locationFrom = from;
    let locationTo = to;
    let geocoder = new window.google.maps.Geocoder();
    let map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 5,
    });

    geocoder.geocode({ address: locationFrom }, function (results, status) {
      if (status === "OK") {
        var markerFrom = new window.google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
        });
        map.setCenter(results[0].geometry.location);
      } else {
        alert(
          "Geocode was not successful for the following reason: " + status
        );
      }
    });

    geocoder.geocode({ address: locationTo }, function (results, status) {
      if (status === "OK") {
        var markerTo = new window.google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
        });
      } else {
        alert(
          "Geocode was not successful for the following reason: " + status
        );
      }
    });
  }

  return (
    <div>
      {mapLoaded && <div id="map" style={{ width: "100%", height: "500px" }} />}
      <button onClick={()=>navigate('/home')}>Back</button>
    </div>

  );
}

export default Map;