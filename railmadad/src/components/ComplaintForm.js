import React, { useState } from 'react';
import axios from 'axios';
import './ComplaintForm.css';

function ComplaintForm({ setResults }) {
  const [formData, setFormData] = useState({
    mobile: '',
    PNR: '',
    description: '',
    priority: '',
    attachment: null,
    latitude: null,
    longitude: null
  });

  const [loading, setLoading] = useState(false); // To show loading indicator

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'attachment' ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while submitting

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const updatedFormData = {
            ...formData,
            latitude,
            longitude
          };

          // Create FormData object and append form data
          const data = new FormData();
          data.append('mobile', updatedFormData.mobile);
          data.append('PNR', updatedFormData.PNR);
          data.append('description', updatedFormData.description);
          data.append('priority', updatedFormData.priority);
          data.append('latitude', updatedFormData.latitude);
          data.append('longitude', updatedFormData.longitude);
          if (updatedFormData.attachment) {
            data.append('file', updatedFormData.attachment);
          }

          // Submit the form data
          axios.post('http://localhost:8000/', data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res => {
            // Fetch the results based on PNR after form submission
            axios.get(`http://localhost:8000/results/${updatedFormData.PNR}/`)
              .then(resultRes => {
                setResults(resultRes.data);  // Update the state with the result
              })
              .finally(() => setLoading(false));  // Stop loading when result is fetched
          })
          .catch(err => {
            console.error(err);
            setLoading(false);  // Stop loading in case of error
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Create FormData object and append form data without geolocation
          const data = new FormData();
          data.append('mobile', formData.mobile);
          data.append('PNR', formData.PNR);
          data.append('description', formData.description);
          data.append('priority', formData.priority);
          if (formData.attachment) {
            data.append('file', formData.attachment);
          }

          // Submit the form data without geolocation
          axios.post('http://localhost:8000/', data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res => {
            // Fetch the results based on PNR after form submission
            axios.get(`http://localhost:8000/results/${formData.PNR}/`)
              .then(resultRes => {
                setResults(resultRes.data);  // Update the state with the result
              })
              .finally(() => setLoading(false));  // Stop loading when result is fetched
          })
          .catch(err => {
            console.error(err);
            setLoading(false);  // Stop loading in case of error
          });
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
      // Create FormData object and append form data without geolocation
      const data = new FormData();
      data.append('mobile', formData.mobile);
      data.append('PNR', formData.PNR);
      data.append('description', formData.description);
      data.append('priority', formData.priority);
      if (formData.attachment) {
        data.append('file', formData.attachment);
      }

      // Submit the form data without geolocation
      axios.post('http://localhost:8000/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        // Fetch the results based on PNR after form submission
        axios.get(`http://localhost:8000/results/${formData.PNR}/`)
          .then(resultRes => {
            setResults(resultRes.data);  // Update the state with the result
          })
          .finally(() => setLoading(false));  // Stop loading when result is fetched
      })
      .catch(err => {
        console.error(err);
        setLoading(false);  // Stop loading in case of error
      });
    }
  };

  return (
    <div className="complaint-form card p-4 shadow-sm">
      <h2 className="card-title text-center mb-4">File a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="mobile" className="form-label">Mobile:</label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            className="form-control"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="PNR" className="form-label">PNR:</label>
          <input
            type="text"
            id="PNR"
            name="PNR"
            className="form-control"
            value={formData.PNR}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="priority" className="form-label">Priority:</label>
          <select
            id="priority"
            name="priority"
            className="form-select"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description:</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="attachment" className="form-label">Attach File:</label>
          <input
            type="file"
            id="attachment"
            name="attachment"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default ComplaintForm;
