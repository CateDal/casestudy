import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import './DataList.css';
import { Bar, Line, Scatter, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { MapContainer, TileLayer, GeoJSON, Popup  } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapData from './/MapData';  

//import { casesDensity } from "./data.js";


// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);


const DengueDataList = () => {
  const [dengueData, setDengueData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });

  const regions = [
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


  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [filterField, setFilterField] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { // Fetch dengue data from Firestore
    const fetchData = async () => {
      const dengueCollection = collection(db, "dengueData");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDengueData(dataList);
      setFilteredData(dataList);
      console.log("Fetched dengue data:", dataList);
    };

    fetchData();
  }, []);

  


useEffect(() => {
  let filtered = dengueData.filter((data) => {
    if (!filterField || !filterValue) return true;
    return data[filterField].toString().toLowerCase().includes(filterValue.toLowerCase());
  });

  if (sortConfig.key) {
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  setFilteredData(filtered);
}, [filterField, filterValue, sortConfig, dengueData]);

  const handleDelete = async (id) => {
    const dengueDocRef = doc(db, "dengueData", id);
    try {
      await deleteDoc(dengueDocRef);
      setDengueData(dengueData.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      location: data.location,
      cases: data.cases,
      deaths: data.deaths,
      date: data.date,
      regions: data.regions,
    });
    setIsModalOpen(true); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };


  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingId) return;

    const dengueDocRef = doc(db, "dengueData", editingId);
    try {
      await updateDoc(dengueDocRef, {
        location: editForm.location,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: editForm.date,
        regions: editForm.regions,
      });

      setDengueData((prevData) =>
        prevData.map((data) =>
          data.id === editingId ? { id: editingId, ...editForm } : data
        )
      );

      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const paginateNext = () => {
    if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const paginatePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  //  bar chart
const barChartData = {
  labels: [...new Set(dengueData.map(data => data.regions))],
  datasets: [
    {
      label: 'Cases',
      data: [...new Set(dengueData.map(data => data.regions))].map(region =>
        dengueData.filter(data => data.regions === region).reduce((total, data) => total + data.cases, 0)
      ),
      backgroundColor: 'rgba(75, 197, 192, 1)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
    {
      label: 'Deaths',
      data: [...new Set(dengueData.map(data => data.regions))]
        .map(regions => dengueData.filter(data => data.regions === regions)
        .reduce((total, data) => total + data.deaths, 0)),
      backgroundColor: 'rgba(255, 99, 132, 1)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

// Bar chart options
const barChartOptions = {
  responsive: true,
  indexAxis: 'y', // Switch to horizontal bar chart
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.x !== null) {
            label += context.parsed.x;
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Count', // X-axis label
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Region', // Y-axis label
      },
    },
  },
};

  // line chart
  const lineChartData = {
    labels: [...new Set(dengueData.map(data => data.date))],
    datasets: [
      {
        label: 'Cases',
        data: [...new Set(dengueData.map(data => data.date))]
          .map(date => dengueData.filter(data => data.date === date)
          .reduce((total, data) => total + data.cases, 0)),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 197, 192, 1)',
        fill: false,
      },
      {
        label: 'Deaths',
        data: [...new Set(dengueData.map(data => data.date))]
          .map(date => dengueData.filter(data => data.date === date)
          .reduce((total, data) => total + data.deaths, 0)),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 1)',
        fill: false,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Date', // X-axis label
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count', // Y-axis label
        },
      },
    },
  };


  // cards
const [totalDataEntries, setTotalDataEntries] = useState(0);
const [totalCases, setTotalCases] = useState(0);
const [totalDeaths, setTotalDeaths] = useState(0);

useEffect(() => {
  const fetchData = async () => {
    const dengueCollection = collection(db, "dengueData");
    const dengueSnapshot = await getDocs(dengueCollection);
    const dataList = dengueSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    setDengueData(dataList);
    setFilteredData(dataList);

    // Calculate totals
    setTotalDataEntries(dataList.length);
    setTotalCases(dataList.reduce((acc, data) => acc + data.cases, 0));
    setTotalDeaths(dataList.reduce((acc, data) => acc + data.deaths, 0));
  };

  fetchData();
}, []);

// Scatter plot data
const scatterPlotData = {
  datasets: [
    {
      label: 'Cases vs Deaths',
      data: dengueData.map(data => ({
        x: data.cases,
        y: data.deaths
      })),
      backgroundColor: 'rgba(75, 197, 192, 1)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      pointRadius: 5
    }
  ]
};

// Scatter plot options
const scatterPlotOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `Cases: ${context.raw.x}, Deaths: ${context.raw.y}`;
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Cases'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Deaths'
      }
    }
  }
};

// pie
const pieData = {
  labels: ['Cases', 'Deaths'], // Labels for cases and deaths
  datasets: [
    {
      label: 'Distribution of Dengue Cases and Deaths',
      data: [totalCases, totalDeaths], // Use the state variables for totals
      backgroundColor: ['#36A2EB', '#FF6384'], // Colors for cases and deaths
      hoverBackgroundColor: ['#36A2EB', '#FF6384'],
    },
  ],
};

const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          const label = tooltipItem.label || '';
          const value = tooltipItem.raw;
          const total = tooltipItem.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(2);
          return `${label}: ${value} cases (${percentage}%)`;
        },
      },
    },
  },
};


// Calculate the top 5 locations with the most cases and deaths
const top5LocationsByCases = [...filteredData]
  .sort((a, b) => b.cases - a.cases)
  .slice(0, 5);

const top5LocationsByDeaths = [...filteredData]
  .sort((a, b) => b.deaths - a.deaths)
  .slice(0, 5);



  return (
    <div className="container">
      {editingId ? (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="form-title">Update Data</h3>
            <div className="form-container1">
                  <form onSubmit={handleUpdate} className="form-grid">
                    <label>
                    <span>Location</span>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        required
                      />
                    </label>

                    <label>
                    <span>Cases</span>
                      <input
                        type="number"
                        value={editForm.cases}
                        onChange={(e) => setEditForm({ ...editForm, cases: e.target.value })}
                        required
                      />
                    </label>

                    <label>
                    <span>Deaths</span>
                      <input
                        type="number"
                        value={editForm.deaths}
                        onChange={(e) => setEditForm({ ...editForm, deaths: e.target.value })}
                        required
                      />
                    </label>

                    <label>
                    <span>Date</span>
                      
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        required
                      />
                    </label>

                    <label>
                      <span>Regions</span>
                      <select
                        value={editForm.regions}
                        onChange={(e) => setEditForm({ ...editForm, regions: e.target.value })}
                        required
                      >
                        <option value="" disabled>Select a region</option>
                        {regions.map((region, index) => (
                          <option key={index} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button type="submit" className="update-button" >Update</button>
                    <button type="button" className="cancel-button" onClick={() => setEditingId(null)}>Cancel</button>
                </form>
              </div>
          </div>
        </div>
       ) : (
        <>  
          <div className="card-container">
            <div className="card card-total-data">
              <h3>Total Data Entries</h3>
              <p>{totalDataEntries}</p>
            </div>
            <div className="card card-total-cases">
              <h3>Total Cases</h3>
              <p>{totalCases}</p>
            </div>
            <div className="card card-total-deaths">
              <h3>Total Deaths</h3>
              <p>{totalDeaths}</p>
            </div>
          </div>

          <div className="top-container">
            <div className="top-locations-container">
              <div className="top-locations">
                <h3 style={{ padding:'10px', marginTop:'0px', textAlign:'center', backgroundColor:' #2c3e50', color:'white', borderRadius:'4px 4px 0px 0px', marginBottom:'-20px'}} >Locations With Highest Cases</h3>
                <ul>
                  {top5LocationsByCases.map((location, index) => (
                    <li key={index}>
                      {location.location} - {location.cases} cases
                    </li>
                  ))}
                </ul>
              </div>

              <div className="top-locations">
                <h3 style={{ padding:'10px', marginTop:'0px', textAlign:'center', backgroundColor:' #2c3e50', color:'white', borderRadius:'4px 4px 0px 0px', marginBottom:'-20px'}} >Locations With Highest Deaths</h3>
                <ul>
                  {top5LocationsByDeaths.map((location, index) => (
                    <li key={index}>
                      {location.location} - {location.deaths} deaths
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="chart-column1">
            <h3 style={{ padding: '10px' }}>Choropleth Map here dengue cases</h3>
            <MapData /> 
          </div>

          <div className="top">
            <h2 className="form-title1">Dengue Data List</h2>
            <div className="filter-section">
              <select value={filterField} onChange={(e) => setFilterField(e.target.value)}>
                <option value="">Filter by...</option>
                <option value="location">Location</option>
                <option value="regions">Regions</option>
                <option value="date">Date</option>
              </select>
              <input
                type="text"
                placeholder="Search..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                disabled={!filterField}
              />
            </div>
          </div>    

          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("location")}>
                  Location {sortConfig.key === "location" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th>Cases</th>
                <th>Deaths</th>
                <th onClick={() => handleSort("date")}>
                  Date {sortConfig.key === "date" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("regions")}>
                  Regions {sortConfig.key === "regions" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((data) => (
                <tr key={data.id}>
                  <td>{data.location}</td>
                  <td>{data.cases}</td>
                  <td>{data.deaths}</td>
                  <td>{data.date}</td>
                  <td>{data.regions}</td>
                  <td>
                    <div className="buttons">
                      <button className="edit-button" onClick={() => handleEdit(data)}>Edit</button>
                      <button className="delete-button" onClick={() => handleDelete(data.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>        
          <div className="pagination">
            <button onClick={paginatePrev} disabled={currentPage === 1}>Previous</button>
            <button onClick={paginateNext} disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}>Next</button>
          </div>


          <div className="chart-column1">
              <h3 style={{ padding:'10px'}} >Dengue Cases Bar Chart</h3>
              <Bar data={barChartData} options={barChartOptions} />
            </div>

            <div className="chart-column1">
              <h3 style={{ padding:'10px'}} >Dengue Cases Line Chart</h3>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>

          <div className="charts-container">
            

            <div className="chart-column">
              <h3 style={{ padding:'10px'}} >Dengue Cases  Scatter Plot</h3>
              <Scatter data={scatterPlotData} options={scatterPlotOptions} /> 
            </div>

            <div className="chart-container">
              <h3 style={{ padding:'10px'}} >Doughnut Chart - Distribution of Cases and Deaths</h3>
              <Pie data={pieData} options={pieOptions} width={750} height={750} />
            </div>
          </div>      
                  
        </>
      )}
    </div>
  );
};

export default DengueDataList;