import React from 'react';
import { Card, CardHeader, Box } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SentimentData {
  date: string;
  Positive: number;
  Neutral: number;
  Negative: number;
}

interface SentimentAnalysisProps {
  data: SentimentData[];
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ data }) => (
  <Card>
    <CardHeader title="Sentiment Analysis" subheader="Sentiment Trends Over Time" />
    <Box p={3} height={400}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="Positive" stroke="#8884d8" fillOpacity={0.3} fill="#8884d8" />
          <Area type="monotone" dataKey="Neutral" stroke="#82ca9d" fillOpacity={0.3} fill="#82ca9d" />
          <Area type="monotone" dataKey="Negative" stroke="#ffc658" fillOpacity={0.3} fill="#ffc658" />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  </Card>
);

export default SentimentAnalysis;
