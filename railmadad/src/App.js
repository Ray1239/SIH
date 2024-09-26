// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ComplaintForm from './components/ComplaintForm';
import Banner from './components/Banner';
import ResultsDisplay from './components/ResultsDisplay';
import MetadataFileDisplay from './components/FileNMetaDisplay';

import './App.css';
import 'leaflet/dist/leaflet.css';

function App() {
  const [results, setResults] = useState(null);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Banner />
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-md-4 mb-4 mb-md-0">
              <ComplaintForm setResults={setResults} />
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <ResultsDisplay results={results} />
            </div>
            <div className="col-md-4">
                <MetadataFileDisplay results={results} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
