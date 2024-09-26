import React from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define the types for the results
interface Results {
  description?: string;
  priority?: string;
  category?: string;
  analysis?: string;
  sentiment?: string;
  latitude?: number;
  longitude?: number;
}

// Define the props for the ResultsDisplay component
interface ResultsDisplayProps {
  results?: Results;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results) {
    return (
      <Card sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom align="center">Results</Typography>
          <Typography variant="body1" align="center" color="textSecondary">No results to display. Please submit a form.</Typography>
        </CardContent>
      </Card>
    );
  }

  const { latitude, longitude, description, priority, category, analysis, sentiment } = results;

  const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
      <Typography variant="h6" gutterBottom align="center">Results</Typography>
      <CardContent>
        <Typography variant="body1"><strong>Description:</strong> {description || 'No description available'}</Typography>
        <Typography variant="body1"><strong>Priority:</strong> {priority || 'No priority available'}</Typography>
        <Typography variant="body1"><strong>Category:</strong> {category || 'No category available'}</Typography>
        <Typography variant="body1"><strong>Analysis:</strong> {analysis || 'No analysis available'}</Typography>
        <Typography variant="body1"><strong>Sentiment:</strong> {sentiment || 'No sentiment available'}</Typography>
        {latitude && longitude && (
          <div style={{ height: '400px', marginTop: '16px' }}>
            <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[latitude, longitude]} icon={customIcon}>
                <Popup>{description || 'No description available'}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
