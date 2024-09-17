import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function ResultsDisplay({ results }) {
  if (!results) {
    return (
      <div className="card p-4 shadow-sm h-100 d-flex justify-content-center align-items-center">
        <p className="text-muted">No results to display. Please submit a form.</p>
      </div>
    );
  }

  const { latitude, longitude } = results;

  // Custom icon for the marker
  const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41], // size of the icon
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34] // point from which the popup should open relative to the iconAnchor
  });

  return (
    <div className="card p-4 shadow-sm h-100 results-card">
      <h2 className="card-title text-center mb-4">Results</h2>
      <div className="card-body">
        <p><strong>Description:</strong> {results.description}</p>
        <p><strong>Priority:</strong> {results.priority}</p>
        <p><strong>Category:</strong> {results.category}</p>
        <p><strong>Analysis:</strong> {results.analysis}</p>
        <p><strong>Sentiment:</strong> {results.sentiment}</p>

        {/* Map Component */}
        {latitude && longitude && (
          <div className="map-container" style={{ height: '400px' }}>
            <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[latitude, longitude]} icon={customIcon}>
                <Popup>
                  {results.description}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsDisplay;
