// src/App.js
import React, { useState } from "react";
import "./App.css";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function App() {
  const [placeName, setPlaceName] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Reference to the 'places' collection in Firestore
      const placesCollection = collection(db, "places");
      const placeQuery = query(placesCollection, where("name", "==", placeName));
      const placeSnapshot = await getDocs(placeQuery);

      if (!placeSnapshot.empty) {
        // Fetch the first matching place document
        const placeDoc = placeSnapshot.docs[0];
        const driversCollection = collection(placeDoc.ref, "drivers");
        const driversSnapshot = await getDocs(driversCollection);

        // Filter drivers based on availability status
        const availableDrivers = driversSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(driver => driver.available_status === true);

        setDrivers(availableDrivers);
      } else {
        setDrivers([]); // No place found
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setDrivers([]);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo">
          <img src="./logo512.png" alt="Rickshaw Icon" /> {/* Replace with actual icon path */}
          <span>Rickshaw App</span>
        </div>
      </header>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Place Name"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
        />
        <button onClick={handleSearch}>
          Search {/* Replace with actual icon path */}
        </button>
      </div>
      <h2>Available Drivers</h2>
      {loading && <p>Loading...</p>}
      <div className="driver-list">
        {drivers.length > 0 ? (
          drivers.map(driver => (
            <div className="driver-card" key={driver.id}>
              <p className="driver-name">{driver.name}</p>
              <p className="driver-details">{driver.auto_number_plate}</p>
              <a href={`tel:${driver.phone_number}`} className="call-button">CALL</a>
            </div>
          ))
        ) : (
          !loading && <p>No available drivers found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
