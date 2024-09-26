import React from 'react';
import { Card, CardHeader, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

interface TrendData {
  week: number;
  date: string;
  count: number;
}

interface TrendAnalysisProps {
  data: TrendData[];
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ data }) => (
    <Card>
      <CardHeader title="Trend Analysis" subheader="Complaints Over Time" />
      <Box p={3} height={400}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              tickFormatter={(week) => week}
              label={{ value: 'Week Number', position: 'insideBottomRight', offset: -10 }}
              interval={0}
            />
            <YAxis label={{ value: 'Number of Complaints', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              content={({ payload }) => {
                if (payload && payload.length) {
                  const { payload: payloadData } = payload[0];
                  return (
                    <div className="custom-tooltip" style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
                      <p><strong>Week: {payloadData.week}</strong></p>
                      <p>Date: {dayjs(payloadData.date).format('YYYY-MM-DD')}</p>
                      <p>Count: {payloadData.count}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Card>
);
export default TrendAnalysis;
