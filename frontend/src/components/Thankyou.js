import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ThankYou.module.css';
const ThankYou = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const registrationNumber = queryParams.get('registration_number') || 'XXXXXXXXXX';
    const printPage = () => {
        window.print();
    };
    return (
        <div className={styles.body}>
            <header className={styles.header}>
                <img src="https://www.shivkhori.in/images/logo.png" alt="Shiv Khori Logo" />
            </header>

            <div className={styles.thankYouContainer}>
                <h1>Thank You for Your Registration!</h1>
                <p>
                    Your registration has been successfully submitted.<br />
                    Your Registration Number is {registrationNumber}.<br />
                    Kindly print this page for hassle-free check-in at the Yatra starting point.
                </p>
                <h4>Also Keep your Aadhar Card with you for successful check-in!</h4>
                <button className={styles.printButton} onClick={printPage}>
                    Print this page
                </button>
            </div>
            
            <footer className={styles.footer}>
                <p>&copy; 2024 Shiv Khori Shrine Board. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ThankYou;
