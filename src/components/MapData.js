import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "./MapData.css";
import philippineData from './ph1.json'; // ph1.json
import "leaflet/dist/leaflet.css";

const MapData = () => {
    const [dengueData, setDengueData] = useState([]);
    const [geoJsonData, setGeoJsonData] = useState(philippineData);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dengueCollection = collection(db, "dengueData");
                const dengueSnapshot = await getDocs(dengueCollection);
                const dataList = dengueSnapshot.docs.map((doc) => ({
                    region: doc.data().regions,
                    cases: doc.data().cases,
                    deaths: doc.data().deaths // Fetch deaths as well
                }));

                // Combine cases and deaths from the same region
                const aggregatedData = dataList.reduce((acc, curr) => {
                    const region = curr.region;
                    if (acc[region]) {
                        acc[region].cases += curr.cases;
                        acc[region].deaths += curr.deaths;
                    } else {
                        acc[region] = { cases: curr.cases, deaths: curr.deaths };
                    }
                    return acc;
                }, {});

                const aggregatedList = Object.keys(aggregatedData).map(region => ({
                    region,
                    cases: aggregatedData[region].cases,
                    deaths: aggregatedData[region].deaths
                }));

                setDengueData(aggregatedList);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    const getDengueDataForRegion = (regionName) => {
        const regionData = dengueData.find(data => normalizeString(data.region) === regionName);
        return regionData ? regionData : { cases: 0, deaths: 0 }; // Return both cases and deaths, defaulting to 0
    };

    const getColor = (cases) => {
        return cases > 5000 ? '#800026' :
               cases > 1000 ? '#BD0026' :
               cases > 500  ? '#E31A1C' :
               cases > 100  ? '#FC4E2A' :
               cases > 50   ? '#FD8D3C' :
               cases > 10   ? '#FEB24C' :
               cases > 0    ? '#FED976' :
                              '#FFEDA0';
    };

    const normalizeString = (str) => {
        if (str) {
            return str.toUpperCase().trim();
        }
        return ''; // Return empty string if str is undefined
    };

    const styleFeature = (feature) => {
        const regionName = normalizeString(feature.properties?.name); // Safely access name
        const { cases } = getDengueDataForRegion(regionName); // Get cases for the region
        return {
            fillColor: getColor(cases),
            weight: 2,
            opacity: 1,
            color: 'gray',
            dashArray: '1',
            fillOpacity: 0.8
        };
    };

    const onEachFeature = (feature, layer) => {
        const regionName = feature.properties?.name ? normalizeString(feature.properties.name) : 'Unknown Region';
        const { cases, deaths } = getDengueDataForRegion(regionName);

        layer.bindTooltip(
            `<strong>${regionName}</strong><br>Cases: ${cases}<br>Deaths: ${deaths}`,
            { direction: "center", className: "custom-tooltip", permanent: false }
        );
    };

    return (
        <div className="map-container">
            <h1>Philippines Dengue Cases Choropleth Map</h1>
            <MapContainer 
                center={[12.8797, 121.7740]}
                zoom={6}
                className="leaflet-container"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
                />
                {dengueData.length > 0 && (
                    <GeoJSON 
                        data={geoJsonData}
                        style={styleFeature}
                        onEachFeature={onEachFeature}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default MapData;
