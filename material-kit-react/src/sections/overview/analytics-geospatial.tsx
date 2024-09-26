import React from 'react';
import { Card, CardHeader, Box } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapData {
  id: number;
  latitude: number;
  longitude: number;
  description: string;
}

interface GeospatialAnalysisProps {
  data: MapData[];
}

const GeospatialAnalysis: React.FC<GeospatialAnalysisProps> = ({ data }) => (
  <Card>
    <CardHeader title="Geospatial Analysis" subheader="Geographical Distribution of Complaints" />
    <Box p={3} height={400}>
      <MapContainer center={[19.5, 73.5]} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {data.map((item) => (
          <Marker key={item.id} position={[item.latitude, item.longitude]}>
            <Popup>{item.description}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  </Card>
);

export default GeospatialAnalysis;
