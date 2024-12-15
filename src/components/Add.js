import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import './DataList.css';

const AddDengueData = () => {
  const [location, setLocation] = useState("");
  const [cases, setCases] = useState("");
  const [deaths, setDeaths] = useState("");
  const [date, setDate] = useState("");
  const [regions, setRegions] = React.useState(""); // Initial value for the text input

  const regionOptions = [
    "NATIONAL CAPITAL REGION",
    "CAR",
    "REGION I-ILOCOS REGION",
    "REGION II-CAGAYAN VALLEY",
    "REGION III-CENTRAL LUZON",
    "REGION IV-A-CALABARZON",
    "REGION IVB-MIMAROPA",
    "REGION V-BICOL REGION",
    "REGION VI-WESTERN VISAYAS",
    "REGION VII-CENTRAL VISAYAS",
    "REGION VII-EASTERN VISAYAS",
    "REGION IX-ZAMBOANGA PENINSULA",
    "REGION X-NORTHERN MINDANAO",
    "REGION XI-DAVAO REGION",
    "REGION XII-SOCCSKSARGEN",
    "CARAGA",
    "BARMM",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "dengueData"), {
        location,
        cases: Number(cases),
        deaths: Number(deaths),
        date,
        regions,
      });
      setLocation("");
      setCases("");
      setDeaths("");
      setDate("");
      setRegions("");
      alert("Data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="form-container">
    <h3 className="form-title3">Add New Dengue Data</h3>
    <form onSubmit={handleSubmit}>
      
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Cases"
        value={cases}
        onChange={(e) => setCases(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Deaths"
        value={deaths}
        onChange={(e) => setDeaths(e.target.value)}
        required
      />
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
        <select
          value={regions}
          onChange={(e) => setRegions(e.target.value)}
          required
          style={{ marginRight: '10px' }} // Add margin to the right
        >
          <option value="" disabled>Select a region</option>
          {regionOptions.map((region, index) => (
            <option key={index} value={region}>
              {region}
            </option>
          ))}
        </select>
       

      <button type="submit" className="submitadd"> Add Data</button>
    </form>
  </div>
  );
};

export default AddDengueData;
