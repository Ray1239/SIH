import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { TextField, MenuItem, Button, CircularProgress, Card, CardContent, Typography } from '@mui/material';

// Define the types for the component props
interface ComplaintFormProps {
  setResults: (results: any) => void; // Update the type as needed based on the results structure
}

// Define the type for form data
interface FormData {
  mobile: string;
  PNR: string;
  description: string;
  priority: string;
  attachment: File | null;
  latitude: number | null;
  longitude: number | null;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ setResults }) => {
  const [formData, setFormData] = useState<FormData>({
    mobile: '',
    PNR: '',
    description: '',
    priority: '',
    attachment: null,
    latitude: null,
    longitude: null
  });

  const [loading, setLoading] = useState(false); // To show loading indicator

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement & { files?: FileList | null };
    if(files !== null){
      console.log(files);
    }
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'attachment' ? (files ? files[0] : null) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while submitting

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;

      const updatedFormData = {
        ...formData,
        latitude,
        longitude
      };

      const data = new FormData();
      data.append('mobile', updatedFormData.mobile);
      data.append('PNR', updatedFormData.PNR);
      data.append('description', updatedFormData.description);
      data.append('priority', updatedFormData.priority);
      data.append('latitude', String(updatedFormData.latitude));
      data.append('longitude', String(updatedFormData.longitude));
      if (updatedFormData.attachment) {
        data.append('file', updatedFormData.attachment);
      }

      await axios.post('http://localhost:8000/complaints/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const resultRes = await axios.get(`http://localhost:8000/complaints/${updatedFormData.PNR}/`);
      setResults(resultRes.data); // Update the state with the result
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // Stop loading when result is fetched
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
      <Typography variant="h6" gutterBottom align="center">File a Complaint</Typography>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="PNR"
            name="PNR"
            value={formData.PNR}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          {/* <TextField
            select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">Select...</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField> */}
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Attach File
            <input
              type="file"
              name="attachment"
              hidden
              onChange={handleChange}
            />
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ComplaintForm;
