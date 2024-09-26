import React from 'react';

// Define the types for the metadata and file
interface Metadata {
  file_name?: string;
  file_type?: string;
  image_format?: string;
  video_format?: string;
  audio_format?: string;
  document_type?: string;
}

interface MediaRendererProps {
  results: {
    file?: string; // Update to string path
    metadata: Metadata;
  };
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ results }) => {
  const { file, metadata } = results;
  console.log(metadata);

  // Ensure results.metadata.file_type is defined before using it
  const fileType = metadata.file_type?.toLowerCase();

  function determineFileType(data: Metadata) {
    // Check for image file types
    if (data.image_format) {
        return "image";
    }
    
    // Check for video file types
    if (data.video_format) {
        return "video";
    }
    
    // Check for audio file types
    if (data.audio_format) {
        return "audio";
    }
    
    // Check for PDF or document types
    if (data.document_type) {
        return "document";
    }

    // Default fallback if no known type is detected
    return 'unknown';
  }

  const file_type = determineFileType(metadata);

  if (!file || !fileType) {
    return (
      <div className="media-renderer">
        <p>No media file provided or file type is undefined.</p>
      </div>
    );
  }

  // Create a URL for the file path
  const fileUrl = file; // Directly use the file path

  const renderMedia = () => {
    switch (file_type) {
      case 'image':
        return (
          <div className="image-frame" style={{ textAlign: 'center' }}>
            <img
              src={`http://localhost:8000/media/complaints/${metadata.file_name}`}
              alt="Media"
              className="img-fluid"
              style={{
                width: '300px',
                height: '300px',
                objectFit: 'cover',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '5px',
              }}
            />
          </div>
        );

      case 'video':
        return (
          <div className="video-frame">
            <video
              controls
              src={`http://localhost:8000/media/complaints/${metadata.file_name}`}
              className="video-fluid"
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
            >
                <track kind="captions" />
                Your browser does not support the video tag.
            </video>
          </div>
        );

      case 'audio':
        return (
          <div className="audio-frame">
            <audio
              controls
              src={`http://localhost:8000/media/complaints/${metadata.file_name}`}
              className="audio-fluid"
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
            >
                <track kind="captions" />
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

  return <div className="media-renderer">{renderMedia()}</div>;
};

export default MediaRenderer;
