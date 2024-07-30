import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ShivkhoriRegistration from './components/ShivkhoriRegistration';
import ThankYou from './components/Thankyou';
import YatriVerification from './components/YatriVerification';

function App() {
  return (
    <Router>
      <div className="App">

        <Routes>
          <Route path="/" element={<ShivkhoriRegistration />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/yatri-verification" element={<YatriVerification />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
