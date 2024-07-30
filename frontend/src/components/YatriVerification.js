import React, { useState } from 'react';
import styles from './YatriVerification.module.css';

const YatriVerification = () => {
  const [name, setName] = useState('');
  const [registration, setRegistration] = useState('');
  const [error, setError] = useState('');
  const [details, setDetails] = useState(null); // To store fetched details

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name && registration) {
      setError(''); // Clear any previous errors
      try {
        const response = await fetch('http://16.16.187.232/api/yatra/fetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ registration_number: registration }),
        });

        const result = await response.json();

        if (result.status) {
          setDetails(result.data); // Set details in state
        } else {
          setError(result.message || 'Failed to fetch details.');
        }
      } catch (error) {
        setError('An error occurred: ' + error.message);
      }
    } else {
      setError('Please fill in all fields.');
    }
  };

  const printPage = () => {
    window.print();
  };

  const renderDetails = () => {
    if (!details) return null;

    const { main_person, additional_persons } = details;

    return (
      <div className={styles.gridContainer}>
        <div className={styles.gridItem}>
          <h3>Main Person</h3>
          <p><strong>Name:</strong> {main_person.name}</p>
          <p><strong>Registration Number:</strong> {main_person.registration_number}</p>
        </div>

        {additional_persons && additional_persons.length > 0 && (
          <div className={styles.gridItem}>
            <h3>Additional Persons</h3>
            <ul>
              {additional_persons.map((person, index) => (
                <li key={index}>
                  <strong>Name:</strong> {person.name} <br />
                  <strong>Registration Number:</strong> {person.registration_number}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <img src="https://www.shivkhori.in/images/logo.png" alt="Shiv Khori Logo" />
      </header>

      <div className={styles.container}>
        {details ? (
          <>
            {renderDetails()}
            <button className={styles.printButton} onClick={printPage}>
              Print Details
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1>Shiv Khori Yatri Verification Form</h1>

            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="registration">Registration Number:</label>
            <input
              type="text"
              id="registration"
              placeholder="Enter Registration Number"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              required
            />

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit">Fetch Details</button>
          </form>
        )}
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2024 Shiv Khori Shrine Board. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default YatriVerification;
