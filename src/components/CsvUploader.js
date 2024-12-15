import React, { useState } from 'react';
import Papa from 'papaparse';  // Import PapaParse
import { db } from './firebase'; // Import Firebase configuration
import { collection, addDoc } from 'firebase/firestore';
import './CsvUploader.css'; // Import CSS for styling

function CsvUploader({ onCsvUpload }) { // Accept callback as prop
  const [csvFile, setCsvFile] = useState(null);

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file to upload.");
      return;
    }

    // Using PapaParse to parse the CSV file
    Papa.parse(csvFile, {
      complete: async (result) => {
        const data = result.data;
        
        // Map the CSV data to the correct fields
        const parsedData = data.slice(1).map((row) => { // Skip the header row
          return {
            ticketNumber: row[0].trim(),
            dateOfApprehension: row[1].trim(),
            timeOfApprehension: row[2].trim(),
            nameOfDriver: row[3].trim(),
            placeOfViolation: row[4].trim(),  // Ensure this is not split
            violationType: row[5].trim(),
            fineStatus: row[6].trim(),
            apprehendingOfficer: row[7].trim(),
          };
        });

        try {
          // Upload the data to Firestore
          const batch = parsedData.map(async (item) => {
            await addDoc(collection(db, 'records'), item); // Upload each item to Firestore
          });

          await Promise.all(batch);
          alert('CSV data uploaded successfully!');

          // Pass the parsed data back to LandingPage via onCsvUpload prop
          onCsvUpload(parsedData);
        } catch (error) {
          console.error('Error uploading CSV data:', error);
        }
      },
      header: false,  // We are manually handling the header row
      skipEmptyLines: true,  // Skip empty lines
    });
  };

  return (
    <div className="csv-uploader">
      <input type="file" accept=".csv" onChange={handleFileChange} className="file-input" />
      <button className="upload-csv-button" onClick={handleFileUpload}>Upload CSV</button>
    </div>
  );
}

export default CsvUploader;
