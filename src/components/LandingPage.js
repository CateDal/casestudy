import "./all.css";
import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import { db } from './firebase';
import Modal from "react-modal";
import Header from "./Header";
import topBg from './topbg.jpg';
import CsvUploader from "./CsvUploader"; 

const LandingPage = () => {
  const [records, setRecords] = useState([]);
  const [ticketNumber, setTicketNumber] = useState("");
  const [dateOfApprehension, setDateOfApprehension] = useState("");
  const [timeOfApprehension, setTimeOfApprehension] = useState("");
  const [nameOfDriver, setNameOfDriver] = useState("");
  const [placeOfViolation, setPlaceOfViolation] = useState("");
  const [violationType, setViolationType] = useState("");
  const [fineStatus, setFineStatus] = useState("");
  const [apprehendingOfficer, setApprehendingOfficer] = useState("");

  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const [formState, setFormState] = useState({
    ticketNumber: "",
    dateOfApprehension: "",
    timeOfApprehension: "",
    nameOfDriver: "",
    placeOfViolation: "",  // Add placeOfViolation to the form state
    violationType: "",
    fineStatus: "",
    apprehendingOfficer: "",

  });

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Function to handle the data coming from the CsvUploader component
  const handleCsvData = (data) => {
    setRecords(data); // Store the uploaded CSV data
  };

  useEffect(() => {
    const fetchData = async () => {
      const recordsCollection = collection(db, "records");
      const recordsSnapshot = await getDocs(recordsCollection);
      const dataList = recordsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRecords(dataList);
      setFilteredData(dataList);

      // Calculate totals
      console.log("Fetched traffic data:", dataList);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const recordsDocRef = doc(db, "records", id);
    try {
      await deleteDoc(recordsDocRef);
      setRecords(records.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (selectedData) {
        // If selectedData exists, update the record
        const recordDocRef = doc(db, "records", selectedData.id);
        await updateDoc(recordDocRef, formState);
        alert("Data updated successfully!");
      } else {
        // Otherwise, add a new record
        await addDoc(collection(db, "records"), formState);
        alert("Data added successfully!");
      }
  
      // Reset form and close modal
      setFormState({
        ticketNumber: "",
        dateOfApprehension: "",
        timeOfApprehension: "",
        nameOfDriver: "",
        placeOfViolation: "", // Reset placeOfViolation as well
        violationType: "",
        fineStatus: "",
        apprehendingOfficer: "",
      });
      setSelectedData(null);
      closeModal();
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    }
  };
  
  // Define the handleEdit function
  const handleEdit = (record) => {
    setSelectedData(record);
    setFormState({
      ticketNumber: record.ticketNumber,
      dateOfApprehension: record.dateOfApprehension,
      timeOfApprehension: record.timeOfApprehension,
      nameOfDriver: record.nameOfDriver,
      placeOfViolation: record.placeOfViolation,
      violationType: record.violationType,
      fineStatus: record.fineStatus,
      apprehendingOfficer: record.apprehendingOfficer,
    });
    openModal();
  };

  return (
    <div className="app-container">
      {/* Header Section */}
      <Header />

      {/* Main Section */}
      <main className="main-section">
        <div className="top-section">
          <div className="placeholder large">
            <img src={topBg} alt="Logo" className="banner" />
          </div>
        </div>
        <div className="bottom-section">
          <div className="placeholder medium"></div>
          <div className="placeholder medium"></div>
          <div className="placeholder small"></div>
          <div className="placeholder small"></div>
        </div>
      </main>

      {/* Records Section */}
      <section className="records-section">
        {/* CSV Uploader Section */}
        <div className="csv-uploader-section">
          <CsvUploader onCsvUpload={handleCsvData} />
        </div>
        <div className="records-header">
          <h2 className="recorh2">Records
            <button onClick={openModal} className="adddata"> Add Record</button>
          </h2>
          <div className="search-bar">
            <input type="text" placeholder="Search..." className="search" />
          </div>
        </div>

        <table className="records-table">
          <thead>
            <tr>
              <th>Ticket Number</th>
              <th>Date of Apprehension</th>
              <th>Time of Apprehension</th>
              <th>Name of Driver</th>
              <th>Place of Violation</th>
              <th>Violation Type</th>
              <th>Fine Status</th>
              <th>Apprehending Officer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((record, index) => (
                <tr key={record.id || index}>
                  <td>{record.ticketNumber}</td>
                  <td>{record.dateOfApprehension}</td>
                  <td>{record.timeOfApprehension}</td>
                  <td>{record.nameOfDriver}</td>
                  <td>{record.placeOfViolation}</td>
                  <td>{record.violationType}</td>
                  <td>{record.fineStatus}</td>
                  <td>{record.apprehendingOfficer}</td>
                  <td>
                    <div className="buttons">
                      <button className="edit-button" onClick={() => handleEdit(record)}>Edit</button>
                      <button className="delete-button" onClick={() => handleDelete(record.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No records to display</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Modal for Add */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Record"
        className="modal-content"
      >
        <h2>{selectedData ? "Edit Record" : "Add New Record"}</h2>
        <form onSubmit={handleSubmit} className="add-form">
          <label htmlFor="ticket-id">Ticket Number/ID</label>
          <input
            id="ticket-id"
            type="text"
            placeholder="Enter Ticket Number/ID"
            value={formState.ticketNumber} // Use ticketNumber instead of ticketnumber
            onChange={(e) => setFormState({ ...formState, ticketNumber: e.target.value })} // Update ticketNumber
            required
          />

          <label htmlFor="date-of-apprehension">Date of Apprehension</label>
          <input 
            id="date-of-apprehension" 
            type="date" 
            value={formState.dateOfApprehension} 
            onChange={(e) => setFormState({ ...formState, dateOfApprehension: e.target.value })} 
            required 
          />

          <label htmlFor="time-of-apprehension">Time of Apprehension</label>
          <input
            id="time-of-apprehension"
            type="text"
            placeholder="Enter time (HH:MM:SS)"
            value={formState.timeOfApprehension}
            onChange={(e) => setFormState({ ...formState, timeOfApprehension: e.target.value })}
            required
          />

          <label htmlFor="driver-name">Name of Driver</label>
          <input 
            id="driver-name" 
            type="text" 
            placeholder="Enter Name of Driver" 
            value={formState.nameOfDriver} 
            onChange={(e) => setFormState({ ...formState, nameOfDriver: e.target.value })} 
            required 
          />

          <label htmlFor="violation-place">Place of Violation</label>
          <select 
            id="violation-place" 
            value={formState.placeOfViolation}  // Bind placeOfViolation from formState
            onChange={(e) => setFormState({ ...formState, placeOfViolation: e.target.value })}  // Update placeOfViolation
            required
          >
            <option value="" disabled>Select Place of Violation</option>
            <option value="Abuno, Iligan City, Lanao del Norte">Abuno</option>
            <option value="Acmac-Mariano Badelles Sr., Iligan City, Lanao del Norte">Acmac-Mariano Badelles Sr.</option>
            <option value="Bagong Silang, Iligan City, Lanao del Norte">Bagong Silang</option>
            <option value="Bonbonon, Iligan City, Lanao del Norte">Bonbonon</option>
            <option value="Bunawan, Iligan City, Lanao del Norte">Bunawan</option>
            <option value="Buru-un, Iligan City, Lanao del Norte">Buru-un</option>
            <option value="Dalipuga, Iligan City, Lanao del Norte">Dalipuga</option>
            <option value="Del Carmen, Iligan City, Lanao del Norte">Del Carmen</option>
            <option value="Digkilaan, Iligan City, Lanao del Norte">Digkilaan</option>
            <option value="Ditucalan, Iligan City, Lanao del Norte">Ditucalan</option>
            <option value="Dulag, Iligan City, Lanao del Norte">Dulag</option>
            <option value="Hinaplanon, Iligan City, Lanao del Norte">Hinaplanon</option>
            <option value="Hindang, Iligan City, Lanao del Norte">Hindang</option>
            <option value="Kabacsanan, Iligan City, Lanao del Norte">Kabacsanan</option>
            <option value="Kalilangan, Iligan City, Lanao del Norte">Kalilangan</option>
            <option value="Kiwalan, Iligan City, Lanao del Norte">Kiwalan</option>
            <option value="Lanipao, Iligan City, Lanao del Norte">Lanipao</option>
            <option value="Luinab, Iligan City, Lanao del Norte">Luinab</option>
            <option value="Mahayahay, Iligan City, Lanao del Norte">Mahayahay</option>
            <option value="Mainit, Iligan City, Lanao del Norte">Mainit</option>
            <option value="Mandulog, Iligan City, Lanao del Norte">Mandulog</option>
            <option value="Maria Cristina, Iligan City, Lanao del Norte">Maria Cristina</option>
            <option value="Palao, Iligan City, Lanao del Norte">Palao</option>
            <option value="Panoroganan, Iligan City, Lanao del Norte">Panoroganan</option>
            <option value="Poblacion, Iligan City, Lanao del Norte">Poblacion</option>
            <option value="Puga-an, Iligan City, Lanao del Norte">Puga-an</option>
            <option value="Rogongon, Iligan City, Lanao del Norte">Rogongon</option>
            <option value="San Miguel, Iligan City, Lanao del Norte">San Miguel</option>
            <option value="San Roque, Iligan City, Lanao del Norte">San Roque</option>
            <option value="Santa Elena, Iligan City, Lanao del Norte">Santa Elena</option>
            <option value="Santa Filomena, Iligan City, Lanao del Norte">Santa Filomena</option>
            <option value="Santiago, Iligan City, Lanao del Norte">Santiago</option>
            <option value="Santo Rosario, Iligan City, Lanao del Norte">Santo Rosario</option>
            <option value="Saray, Iligan City, Lanao del Norte">Saray</option>
            <option value="Suarez, Iligan City, Lanao del Norte">Suarez</option>
            <option value="Tambacan, Iligan City, Lanao del Norte">Tambacan</option>
            <option value="Tibanga, Iligan City, Lanao del Norte">Tibanga</option>
            <option value="Tipanoy, Iligan City, Lanao del Norte">Tipanoy</option>
            <option value="Tomas L. Cabili (Tominobo Proper), Iligan City, Lanao del Norte">Tomas L. Cabili (Tominobo Proper)</option>
            <option value="Tubod, Iligan City, Lanao del Norte">Tubod</option>
            <option value="Ubaldo Laya, Iligan City, Lanao del Norte">Ubaldo Laya</option>
            <option value="Upper Hinaplanon, Iligan City, Lanao del Norte">Upper Hinaplanon</option>
            <option value="Upper Tominobo, Iligan City, Lanao del Norte">Upper Tominobo</option>
            <option value="Villa Verde, Iligan City, Lanao del Norte">Villa Verde</option>
          </select>



          <label htmlFor="violation-type">Violation Type</label>
          <input 
            id="violation-type" 
            type="text" 
            placeholder="Enter Violation Type" 
            value={formState.violationType} 
            onChange={(e) => setFormState({ ...formState, violationType: e.target.value })} 
            required 
          />

          <label htmlFor="fine-status">Fine Status</label>
          <input 
            id="fine-status" 
            type="text" 
            value={formState.fineStatus} 
            onChange={(e) => setFormState({ ...formState, fineStatus: e.target.value })} 
            required 
          />

          <label htmlFor="apprehending-officer">Apprehending Officer</label>
          <input 
            id="apprehending-officer" 
            type="text" 
            value={formState.apprehendingOfficer} 
            onChange={(e) => setFormState({ ...formState, apprehendingOfficer: e.target.value })} 
            required 
          />

          <button type="submit">Submit</button>
          <button type="button" onClick={closeModal}>Close</button>
        </form>
      </Modal>
    </div>
  );
};

export default LandingPage;
