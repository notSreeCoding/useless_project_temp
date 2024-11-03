// src/DriverApp.js
import React, { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase";
import {
  collection,
  query,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

function DriverApp() {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [driverName, setDriverName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [autoNumberPlate, setAutoNumberPlate] = useState("");
  const [availableStatus, setAvailableStatus] = useState(false);

  // Fetch available places from Firestore on mount
  useEffect(() => {
    const fetchPlaces = async () => {
      const placesSnapshot = await getDocs(collection(db, "places"));
      const placesList = placesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlaces(placesList);
    };
    fetchPlaces();
  }, []);

  // Toggle availability status
  const toggleAvailability = () => {
    setAvailableStatus((prevStatus) => !prevStatus);
  };

  // Handle saving driver information
  const handleSaveDriver = async () => {
    if (!selectedPlace || !driverName || !phoneNumber || !autoNumberPlate) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      // Check if driver already exists in the selected place
      const placeDocRef = doc(db, "places", selectedPlace);
      const driversCollection = collection(placeDocRef, "drivers");
      const driverQuery = query(driversCollection, where("phone_number", "==", phoneNumber));
      const driverSnapshot = await getDocs(driverQuery);

      if (driverSnapshot.empty) {
        // If driver does not exist, create a new document
        const newDriverRef = doc(driversCollection);
        await setDoc(newDriverRef, {
          name: driverName,
          phone_number: phoneNumber,
          auto_number_plate: autoNumberPlate,
          available_status: availableStatus,
        });
      } else {
        // If driver exists, update the document with availability
        const existingDriverDoc = driverSnapshot.docs[0];
        await updateDoc(existingDriverDoc.ref, {
          name: driverName,
          phone_number: phoneNumber,
          auto_number_plate: autoNumberPlate,
          available_status: availableStatus,
        });
      }

      alert("Driver information saved successfully.");
    } catch (error) {
      console.error("Error saving driver:", error);
      alert("Failed to save driver information.");
    }
  };

  return (
    <div className="app-container">
      <h2>Driver App</h2>
      <form>
        <label>Place:</label>
        <select
          value={selectedPlace}
          onChange={(e) => setSelectedPlace(e.target.value)}
          required
        >
          <option value="">Select a place</option>
          {places.map((place) => (
            <option key={place.id} value={place.id}>
              {place.name}
            </option>
          ))}
        </select>

        <label>Driver Name:</label>
        <input
          type="text"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          required
        />

        <label>Phone Number:</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />

        <label>Auto Number Plate:</label>
        <input
          type="text"
          value={autoNumberPlate}
          onChange={(e) => setAutoNumberPlate(e.target.value)}
          required
        />

        <label>Availability:</label>
        <button
          type="button"
          onClick={toggleAvailability}
          className={`availability-button ${availableStatus ? "available" : "unavailable"}`}
        >
          {availableStatus ? "Available" : "Unavailable"}
        </button>

        <button type="button" onClick={handleSaveDriver}>
          Save Driver Info
        </button>
      </form>
    </div>
  );
}

export default DriverApp;
