import React from 'react';
import { Card, CardHeader, Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface CategoryData {
  name: string;
  value: number;
}

interface PriorityData {
  name: string;
  value: number;
}

interface DescriptiveAnalysisProps {
  categoryData: CategoryData[];
  priorityData: PriorityData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6347'];

const DescriptiveAnalysis: React.FC<DescriptiveAnalysisProps> = ({ categoryData, priorityData }) => (
  <Card>
    <CardHeader title="Descriptive Analysis" subheader="Distribution of Complaints" />
    <Box display="flex" flexDirection="row">
      <Box flex={1} p={3}>
        <Typography variant="h6">Complaints by Category</Typography>
        <PieChart width={400} height={300}>
          <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Box>
      <Box flex={1} p={3}>
        <Typography variant="h6">Complaints by Priority</Typography>
        <PieChart width={400} height={300}>
          <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
            {priorityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Box>
    </Box>
  </Card>
);

export default DescriptiveAnalysis;
