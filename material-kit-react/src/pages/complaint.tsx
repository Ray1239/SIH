import React, { useState } from 'react';
import ComplaintForm from 'src/components/form/ComplaintForm';
import ResultsDisplay from 'src/components/output/ResultDisplay';
import MetadataFileDisplay from 'src/components/output/FilNMetaDisplay';
import { Container, Grid, Paper } from '@mui/material';

// Define the types for results
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

interface Results {
  metadata: Metadata;
  file?: string; // Update to string path
  latitude?: number;
  longitude?: number;
}

const ComplaintPage: React.FC = () => {
  const [results, setResults] = useState<Results | undefined>(undefined);

  return (
    <Container sx={{ my: 5 }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <ComplaintForm setResults={setResults} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <ResultsDisplay results={results} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <MetadataFileDisplay results={results} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

const App: React.FC = () => <ComplaintPage/>

export default App;
