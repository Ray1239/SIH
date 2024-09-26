import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import MediaRenderer from './MediaRenderer'; // Adjust path if necessary

// Define the types for the metadata and file
interface Metadata {
  image_format?: string;
  image_size?: string;
  color_mode?: string;
  duration?: number;
  resolution?: string;
  fps?: number;
  file_name?: string;
  file_size?: string;
  file_type?: string;
}

interface Location {
  latitude?: number;
  longitude?: number;
}

interface Results {
  metadata: Metadata;
  file?: string; // Update to string path
  latitude?: number;
  longitude?: number;
}

// Define the props for the MetadataFileDisplay component
interface MetadataFileDisplayProps {
  results?: Results;
}

const MetadataFileDisplay: React.FC<MetadataFileDisplayProps> = ({ results }) => {
  if (!results) {
    return (
      <Card sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom align="center">File Metadata</Typography>
          <Typography variant="body1" align="center" color="textSecondary">No metadata available.</Typography>
        </CardContent>
      </Card>
    );
  }

  const { metadata, file, latitude, longitude } = results;
  const location = { latitude, longitude };

  const renderImageMetadata = () => (
    <>
      <ListItem>
        <ListItemText primary={`Image Format: ${metadata.image_format || 'No image format available'}`} />
      </ListItem>
      <ListItem>
        <ListItemText primary={`Image Size: ${metadata.image_size || 'No image size available'}`} />
      </ListItem>
      <ListItem>
        <ListItemText primary={`Color Mode: ${metadata.color_mode || 'No color mode available'}`} />
      </ListItem>
    </>
  );

  const renderVideoMetadata = () => (
    <>
      <ListItem>
        <ListItemText primary={`Duration: ${metadata.duration || 'No duration available'} seconds`} />
      </ListItem>
      <ListItem>
        <ListItemText primary={`Resolution: ${metadata.resolution || 'No resolution available'}`} />
      </ListItem>
      <ListItem>
        <ListItemText primary={`FPS: ${metadata.fps || 'No FPS available'}`} />
      </ListItem>
    </>
  );

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        File Metadata
      </Typography>
      <CardContent>
        <List>
          <ListItem>
            <ListItemText primary={`File Name: ${metadata?.file_name || 'No filename available'}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`File Size: ${metadata?.file_size || 'No file size available'}`} />
          </ListItem>

          {/* Check if the file type is an image */}
          {metadata?.file_type && ['.jpg', '.jpeg', '.png', '.gif'].includes(metadata.file_type) && renderImageMetadata()}

          {/* Check if the file type is a video */}
          {metadata?.file_type && ['.mp4', '.avi', '.mov'].includes(metadata.file_type) && renderVideoMetadata()}

          {/* Check for geolocation */}
          <ListItem>
            <ListItemText
              primary={`Geolocation: ${location?.latitude || 'No latitude'}, ${location?.longitude || 'No longitude'}`}
            />
          </ListItem>

          {/* Check if file exists and render the media */}
          {file && (
            <>
              <Divider sx={{ my: 2 }} />
              <MediaRenderer results={{ metadata, file }} />
            </>
          )}
        </List>
      </CardContent>
    </Card>

  );
};

export default MetadataFileDisplay;
