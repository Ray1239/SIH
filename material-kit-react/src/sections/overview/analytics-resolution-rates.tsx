import React from 'react';
import { Card, CardHeader, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResolutionData {
  priority: string;
  resolved: number;
  pending: number;
}

interface ResolutionRatesByPriorityProps {
  data: ResolutionData[];
}

const COLORS = ['#00C49F', '#FFBB28'];

const ResolutionRatesByPriority: React.FC<ResolutionRatesByPriorityProps> = ({ data }) => (
  <Card>
    <CardHeader title="Resolution Rates by Priority" subheader="Resolved vs Pending Complaints" />
    <Box p={3} height={400}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="priority" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="resolved" stackId="a" fill={COLORS[0]} />
          <Bar dataKey="pending" stackId="a" fill={COLORS[1]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  </Card>
);

export default ResolutionRatesByPriority;
