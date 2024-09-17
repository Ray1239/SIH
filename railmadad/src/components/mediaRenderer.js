import React from 'react';

function MediaRenderer({ results }) {
  if (!results.file || !results.metadata.file_type) {
    return (
      <div className="media-renderer">
        <p>No media file provided.</p>
      </div>
    );
  }

  const renderMedia = () => {
    const fileExtension = results.metadata.file_type.toLowerCase();

    switch (fileExtension) {
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.gif':
        return (
          <div className="image-frame" style={{ textAlign: 'center' }}>
          <img
            src={`http://localhost:8000/media/complaints/${results.metadata.file_name}`}
            alt="Media"
            className="img-fluid"
            style={{
              width: '300px', // Set a fixed width for the square shape
              height: '300px', // Set the height equal to the width to make it square
              objectFit: 'cover', // Crop the image to fit the square without stretching
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '5px'
            }}
          />
        </div>
        );

      case '.mp4':
      case '.avi':
      case '.mov':
        return (
          <div className="video-frame">
            <video
              controls
              src={`http://localhost:8000/media/complaints/${results.metadata.file_name}`} // Assuming file path is correct
              className="video-fluid"
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case '.mp3':
      case '.wav':
        return (
          <div className="audio-frame">
            <audio
              controls
              src={results.file} // Assuming file path is correct
              className="audio-fluid"
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        );

      default:
        return (
          <div className="media-renderer">
            <p>Unsupported file type.</p>
          </div>
        );
    }
  };

  return (
    <div className="media-renderer">
      {renderMedia()}
    </div>
  );
}

export default MediaRenderer;
