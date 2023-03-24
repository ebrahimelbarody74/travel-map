import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Room, Star } from "@material-ui/icons";
import "./App.css";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [star, setStar] = useState(0);
  const [viewport, setViewport] = useState({
    longitude: 17,
    latitude: 46,
    zoom: 4,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/api/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handelMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
    console.log(viewport);
  };
  const handelAddClick = (e) => {
    const long = e.lngLat.lng;
    const lat = e.lngLat.lat;
    setNewPlace({
      lat,
      long,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      const res = await axios.post("/api/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handelLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <Map
      initialViewState={viewport}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken="pk.eyJ1Ijoib3JpY283IiwiYSI6ImNsZmw0MGI5MzAxZjgzcW10aWNhcDZzeGoifQ.xH9cKtfkOHEx1_6jMvX8qg"
      onDblClick={handelAddClick}
      onViewportChange={(nextViewport) => setNewPlace(nextViewport)}
      transitionDuration="200"
    >
      {pins.map((p) => (
        <>
          <Marker
            longitude={p.long}
            latitude={p.lat}
            anchor="bottom"
            offsetLeft={-20}
            offsetTop={-10}
          >
            <Room
              style={{
                fontSize: viewport.zoom * 10,
                color: p.username === currentUser ? "tomato" : "slateblue",
                cursor: "pointer",
              }}
              onClick={() => handelMarkerClick(p._id, p.lat, p.long)}
            />
          </Marker>
          {p._id === currentPlaceId && (
            <Popup
              longitude={p.long}
              latitude={p.lat}
              anchor="left"
              closeButton={true}
              closeOnClick={false}
              onClose={() => setCurrentPlaceId(null)}
            >
              <div className="card">
                <label>place</label>
                <h4 className="place">{p.title}</h4>
                <label>Reviw</label>
                <p className="desc">{p.desc}</p>
                <div className="stars">
                  {Array(p.rating).fill(<Star className="star" />)}
                </div>
                <label>Information</label>
                <span className="username">
                  Created by <b>{p.username}</b>
                </span>
                <span className="date">{format(p.createdAt)} </span>
              </div>
            </Popup>
          )}
        </>
      ))}
      {newPlace && (
        <Popup
          longitude={newPlace.long}
          latitude={newPlace.lat}
          anchor="left"
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                placeholder="Enter a title"
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Description</label>
              <textarea
                placeholder="Say us something about this place."
                onChange={(e) => setDesc(e.target.value)}
              />
              <label>Rating</label>
              <select onChange={(e) => setStar(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button type="submit" className="submitButton">
                Add Pin
              </button>
            </form>
          </div>
        </Popup>
      )}
      {currentUser ? (
        <button className="button logout " onClick={handelLogout}>
          Log out
        </button>
      ) : (
        <div className="buttons">
          <button className="button login" onClick={() => setShowLogin(true)}>
            Login
          </button>
          <button
            className="button register"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          setCurrentUser={setCurrentUser}
          myStorage={myStorage}
        />
      )}{" "}
    </Map>
  );
}

export default App;
