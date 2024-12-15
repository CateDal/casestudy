import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel CSS
import "./about.css";

const About = () => {
    // Declare the modal state and image URL, and the description
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState("");
    const [modalDescription, setModalDescription] = useState(""); // Add this state for description
    const [modalText, setModalText] = useState("");  // Declare modalText state

     // Function to open the modal with a selected image, description, and text
     const openModal = (image, description, text) => {
        setModalImage(image);
        setModalDescription(description);
        setModalText(text);  // Set the modalText dynamically
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setModalImage("");
        setModalDescription("");
        setModalText("");  // Reset modalText when closing
    };

    return (
        <div className="about-container">
            <h1>About Us</h1>
            <div className="about-row">
                <div className="about-text">
                    <p>
                        Welcome to Our System.This system is designed to streamline traffic and parking management in the city, 
                        ensuring a more organized and efficient experience for both residents and visitors.
                        Our services include real-time traffic updates, parking availability, and a user-friendly 
                        interface for managing violations and payments. We are committed to improving urban mobility and enhancing the quality of life in Iligan City.
                    </p>
                </div>
                <div className="about-image">
                    {/* Slideshow Carousel */}
                    <Carousel
                        showArrows={true}
                        infiniteLoop={true}
                        showThumbs={false}
                        showStatus={false}
                        autoPlay={true}
                        interval={3000}
                    >
                        <div>
                            <img src="/photo1.jpg" alt="Traffic Management" />
                        </div>
                        <div>
                            <img src="/photo2.jpg" alt="Parking Management" />
                        </div>
                        <div>
                            <img src="/photo3.jpg" alt="Urban Mobility" />
                        </div>
                    </Carousel>
                </div>
            </div>

           {/* New containers below the carousel */}
<div className="about-box-container">
    <div className="about-box" onClick={() => openModal("/ictpmo.jpg","Iligan City Traffic and Parking Management", "The Iligan City Traffic and Parking Management Office (ICTPMO) plays a crucial role in ensuring smooth traffic flow and parking management within the city. Through the use of advanced technologies, ICTPMO monitors traffic violations, enforces parking regulations, and manages the issuance of tickets electronically. The office focuses on creating a safer, more organized environment for residents and visitors by facilitating efficient traffic management and streamlining enforcement processes. Our system is designed to support the ICTPMO in maintaining order while enhancing the overall traffic experience in Iligan City.")}>
        <div className="image-container">
            <img src="/ictpmo.jpg" alt="Box 1" />
        </div>
        <p className="box-title">Iligan City Traffic and Parking Management</p>
    </div>
    <div className="about-box" onClick={() => openModal("/lto.jpg", "Parking Management", "The Land Transportation Office (LTO) E-Ticketing System provides a modern and efficient method for managing traffic-related violations. It offers quick issuance of tickets and digital record-keeping for better law enforcement. The system enhances the efficiency of traffic regulation by allowing authorities to issue tickets on the spot, reducing manual paperwork and ensuring accurate tracking of violations. This electronic solution aims to improve transparency, speed up the enforcement process, and provide a more organized approach to managing traffic violations, making it easier for citizens and authorities to track and resolve traffic-related issues.")}>
        <div className="image-container">
            <img src="/lto.jpg" alt="Box 2" />
        </div>
        <p className="box-title">Land Transportation Office</p>
    </div>
    <div className="about-box" onClick={() => openModal("/npa.png", "Philippine National Police", "The Philippine National Police (PNP) is the national law enforcement agency responsible for maintaining peace and order, ensuring public safety, and enforcing laws across the country.The E-Ticketing System provides the PNP with a powerful digital tool for monitoring and managing traffic-related incidents and urban mobility concerns. The system enables law enforcement officers to efficiently issue digital tickets for traffic violations, maintain accurate records of these violations, and track recurring offenders. This reduces manual paperwork, minimizes human error, and ensures transparency in law enforcement operations.")}>
        <div className="image-container">
            <img src="/npa.png" alt="Box 3" />
        </div>
        <p className="box-title">Philippine National Police</p>
    </div>
</div>

{/* Modal */}
{isModalOpen && (
    <div className="modal" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button className="close-btn" onClick={closeModal}>X</button>

            {/* Modal Image */}
            {modalImage && <img src={modalImage} alt="Modal Image" className="modal-image" />}

            {/* Modal Description */}
            <div className="modal-description">
                <h3>{modalDescription}</h3>
                <p>{modalText}</p> {/* Display the unique text for each modal */}
            </div>
        </div>
    </div>
)}


        </div>
    );
};

export default About;
