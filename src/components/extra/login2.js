import React from 'react';
import './login2.css';
const Login = () => {
    return (
        <div className="login-container">
            <header className="header">
                <img src="/logorem.png" alt="Iligan City Traffic" className="logo" />
                <p className="logo-text">ILIGAN CITY TRAFFIC AND PARKING MANAGEMENT OFFICE</p>
                <nav className="nav">
                    <a href="/login">Home</a>
                    <a href="/about">About Us</a>
                </nav>
            </header>

            <div className="login-content">
                <img src="/car.gif" alt="Car Illustration" className="car-imagelog" />
                <p className="heading">Welcome back! Please login to your account.</p>
                <form className="login-form">
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Password" required />
                    <a href="/forgot-password" className="forgot-password">Forgot Password?</a>

                    {/* Wrap the buttons in a container */}
                    <div className="buttons-container">
                        <button type="submit" className="login-btn">Login</button>
                        <a href="/signup" className="signup-btn">Sign Up</a>
                    </div>
                </form>
            </div>

            <p className="terms">
                By signing in you are agreeing to our <a href="#"><b>Term</b></a> and <b><a href="#">Privacy Policy</a></b>
            </p>
        </div>
    );
};

export default Login;