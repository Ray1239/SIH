// MetadataFileDisplay.js
import React from 'react';
import MediaRenderer from './mediaRenderer'; // Adjust path if necessary

function MetadataFileDisplay({results}) {
  if (!results) {
    return (
      <div className="card p-4 shadow-sm h-100 d-flex justify-content-center align-items-center">
        <p className="text-muted">No metadata available.</p>
      </div>
    );
  }
  const metadata = results.metadata;
  const location = {"latitude": results.latitude, "longitude": results.longitude};
  const file = results.file;
  
  const renderImageMetadata = () => (
    <>
      <li className="list-group-item"><strong>Image Format:</strong> {metadata.image_format || 'No image format available'}</li>
      <li className="list-group-item"><strong>Image Size:</strong> {metadata.image_size || 'No image size available'}</li>
      <li className="list-group-item"><strong>Color Mode:</strong> {metadata.color_mode || 'No color mode available'}</li>
    </>
  );

  const renderVideoMetadata = () => (
    <>
      <li className="list-group-item"><strong>Duration:</strong> {metadata.duration || 'No duration available'} seconds</li>
      <li className="list-group-item"><strong>Resolution:</strong> {metadata.resolution || 'No resolution available'}</li>
      <li className="list-group-item"><strong>FPS:</strong> {metadata.fps || 'No FPS available'}</li>
    </>
  );

  return (
    <div className="card p-4 shadow-sm h-100 metadata-file-card">
      <h2 className="card-title text-center mb-4">File Metadata</h2>
      <div className="card-body">
        <ul className="list-group">
          <li className="list-group-item"><strong>File Name:</strong> {metadata.file_name || 'No filename available'}</li>
          <li className="list-group-item"><strong>File Size:</strong> {metadata.file_size || 'No file size available'}</li>
          {metadata.file_type && ['.jpg', '.jpeg', '.png', '.gif'].includes(metadata.file_type) && renderImageMetadata()}
          {metadata.file_type && ['.mp4', '.avi', '.mov'].includes(metadata.file_type) && renderVideoMetadata()}
          <li className="list-group-item"><strong>Geolocation:</strong> {`${location.latitude}, ${location.longitude}` || 'No geolocation available'}</li>
        </ul>

        {file && (
          <div className="media-container mt-4">
            <MediaRenderer results={{metadata: metadata, file: file}}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default MetadataFileDisplay;
