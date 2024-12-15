import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './components/about';
import LandingPage from './components/LandingPage';
import Map from './components/map';
import Header from './components/Header';
import  CsvUploader from './components/CsvUploader'; // Import csv.js

function App() {
  const [csvData, setCsvData] = useState([]);

  // Callback function to update CSV data
  const handleCSVUpload = (result) => {
    setCsvData(result.data); // Assuming you want to store the parsed data
  };

  return (
    <Router>
      <div className="App">
        {/* Use the Header component here */}
        <Header />
        
        {/* CSV File Upload */}
        <input
          type="file"
          accept=".csv"
          onChange={(e) => CsvUploader(e, handleCSVUpload)}
        />

        <Routes>
          <Route path="/LandingPage" element={<LandingPage />} />
          <Route path="/map" element={<Map />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
