import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { data } from 'src/dummy-data';
// import { AnalyticsNews } from '../analytics-news';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faExclamationTriangle, faInfoCircle, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import GeospatialAnalysis from '../analytics-geospatial';
import TrendAnalysis from "../analytics-trend";
import DescriptiveAnalysis from "../analytics-descriptive";
import SentimentAnalysis from '../analytics-sentiment';
import ResolutionRatesByPriority from '../analytics-resolution-rates';


// Define the shape of the complaint data
interface Complaint {
  priority: 'high' | 'medium' | 'low';
}

export function OverviewAnalyticsView() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const response = await fetch('http://localhost:8000/complaints/');
        const djangodate = await response.json();
        console.log(djangodate);
        if (Array.isArray(djangodate)) {
          setComplaints(djangodate);
        } else {
          console.error('Data is not an array:', djangodate);
        }
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchComplaints();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Process complaints data to fit the analytics components
  const highPriorityComplaints = complaints.reduce((sum, complaint) => sum + (complaint.priority === 'high' ? 1 : 0), 0);
  const totalComplaints = complaints.length;
  const mediumPriorityComplaints = complaints.reduce((sum, complaint) => sum + (complaint.priority === 'medium' ? 1 : 0), 0);
  const lowPriorityComplaints = complaints.reduce((sum, complaint) => sum + (complaint.priority === 'low' ? 1 : 0), 0);

  const highPriorityCounts = data.monthlyTrends.map(trend => trend.high);
  const mediumPriorityCounts = data.monthlyTrends.map(trend => trend.medium);
  const lowPriorityCounts = data.monthlyTrends.map(trend => trend.low);
  const priorityCounts = data.monthlyTrends.map(trend => trend.count)

  const calculatePercentageChange = (previous: number, current: number) => {
    if (previous === 0) return current > 0 ? 100 : 0; // Avoid division by zero
    return ((current - previous) / previous) * 100;
  };
  
  // Calculate previous month values for percentage calculation
  const previousHigh = highPriorityCounts[highPriorityCounts.length - 2] || 0;
  const previousMedium = mediumPriorityCounts[mediumPriorityCounts.length - 2] || 0;
  const previousLow = lowPriorityCounts[lowPriorityCounts.length - 2] || 0;
  
  const currentHigh = highPriorityCounts[highPriorityCounts.length - 1];
  const currentMedium = mediumPriorityCounts[mediumPriorityCounts.length - 1];
  const currentLow = lowPriorityCounts[lowPriorityCounts.length - 1];
  
  // Calculate percentage changes
  const highChange = calculatePercentageChange(previousHigh, currentHigh);
  const mediumChange = calculatePercentageChange(previousMedium, currentMedium);
  const lowChange = calculatePercentageChange(previousLow, currentLow);
  
  // Calculate total counts
  const totalHigh = highPriorityCounts.reduce((acc, count) => acc + count, 0);
  const totalMedium = mediumPriorityCounts.reduce((acc, count) => acc + count, 0);
  const totalLow = lowPriorityCounts.reduce((acc, count) => acc + count, 0);
  
  // Calculate overall total and its percentage change
  const overallTotalPrevious = previousHigh + previousMedium + previousLow;
  const overallTotalCurrent = currentHigh + currentMedium + currentLow;
  
  const overallChange = calculatePercentageChange(overallTotalPrevious, overallTotalCurrent);
  

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Welcome to Rail Madad Dashboard 👋
      </Typography>

      <Grid container spacing={3}>
      <Grid xs={12} sm={6} md={3}>
        <AnalyticsWidgetSummary
          title="High Priority Complaints"
          percent={highChange} // Pass positive value
          total={highPriorityCounts[highPriorityCounts.length - 1]}
          icon={<FontAwesomeIcon icon={faExclamationCircle} />}
          chart={{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: highPriorityCounts,
          }}
        />
      </Grid>

      <Grid xs={12} sm={6} md={3}>
        <AnalyticsWidgetSummary
          title="Medium Priority Complaints"
          percent={mediumChange} // Pass positive value
          total={mediumPriorityCounts[mediumPriorityCounts.length - 1]}
          color="warning"
          icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
          chart={{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: mediumPriorityCounts,
          }}
        />
      </Grid>

      <Grid xs={12} sm={6} md={3}>
        <AnalyticsWidgetSummary
          title="Low Priority Complaints"
          percent={lowChange} // Pass positive value
          total={lowPriorityCounts[lowPriorityCounts.length - 1]}
          color="error"
          icon={<FontAwesomeIcon icon={faInfoCircle} />}
          chart={{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: lowPriorityCounts,
          }}
        />
      </Grid>

      <Grid xs={12} sm={6} md={3}>
        <AnalyticsWidgetSummary
          title="Overall Complaints"
          percent={overallChange} // Pass positive value
          total={priorityCounts[priorityCounts.length - 1]}
          color="secondary"
          icon={<FontAwesomeIcon icon={faClipboardList} />}
          chart={{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: priorityCounts,
          }}
        />
      </Grid>

        <Grid xs={12} md={6} lg={4}>
            <GeospatialAnalysis data={data.complaints}/>
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Complaint Trends"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: '2023', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: '2024', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
            <ResolutionRatesByPriority data={data.resolutionRates}/>
        </Grid>

        <Grid xs={12} md={6} lg={4}>
            <SentimentAnalysis data={data.sentiments}/>
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <DescriptiveAnalysis categoryData={data.categories} priorityData={data.priorities}/>
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <TrendAnalysis data={data.trends}/>
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite
            title="Complaint Sources"
            list={[
              { value: 'email', label: 'Email', total: 323234 },
              { value: 'phone', label: 'Phone', total: 341212 },
              { value: 'website', label: 'Website', total: 24343 },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTasks
            title="Pending Tasks"
            list={_tasks}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
