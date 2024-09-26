// Define the interface for complaints
interface Complaint {
    id: number;
    latitude: number;
    longitude: number;
    description: string;
    priority: "High" | "Medium" | "Low";
    date: string; // Use Date type if you plan to parse it as a Date object
  }
  
  // Define the interface for sentiments
  interface Sentiment {
    date: string; // Use Date type if needed
    Positive: number;
    Neutral: number;
    Negative: number;
  }
  
  // Define the interface for categories
  interface Category {
    name: string;
    value: number;
  }
  
  // Define the interface for priorities
  interface Priority {
    name: "Low" | "Medium" | "High";
    value: number;
  }
  
  // Define the interface for trends
  interface Trend {
    week: number;
    date: string; // Use Date type if needed
    count: number;
  }

  interface monthlyTrend {
    month: string;
    count: number,
    high: number,
    medium: number,
    low: number
  }
  
  // Define the interface for resolution rates
  interface ResolutionRate {
    priority: "High" | "Medium" | "Low";
    resolved: number;
    pending: number;
  }
  
  // Define the interface for categories series
  interface CategoriesSeries {
    categories: string[];
    series: {
      name: string;
      data: number[];
    }[];
  }
  
  // Define the main data structure
  interface DashboardData {
    complaints: Complaint[];
    sentiments: Sentiment[];
    categories: Category[];
    priorities: Priority[];
    trends: Trend[];
    monthlyTrends: monthlyTrend[];
    resolutionRates: ResolutionRate[];
    categoriesSeries: CategoriesSeries;
  }
  
// Example of how to use this interface
// Define the main data structure
export const data: DashboardData = {
    complaints: [
      {
        id: 1,
        latitude: 19.2184,
        longitude: 72.9781,
        description: "Dirty restrooms in coach",
        priority: "Medium",
        date: "2024-01-15",
      },
      {
        id: 2,
        latitude: 18.5204,
        longitude: 73.8567,
        description: "Food quality is poor",
        priority: "High",
        date: "2024-01-20",
      },
      {
        id: 3,
        latitude: 19.076,
        longitude: 72.8777,
        description: "Overcrowded platform during peak hours",
        priority: "Low",
        date: "2024-01-25",
      },
      {
        id: 4,
        latitude: 18.9947,
        longitude: 73.8344,
        description: "Violence observed between passengers",
        priority: "High",
        date: "2024-02-05",
      },
      {
        id: 5,
        latitude: 20.0058,
        longitude: 73.7898,
        description: "Missing signage for directions",
        priority: "Medium",
        date: "2024-02-15",
      },
      {
        id: 6,
        latitude: 19.0847,
        longitude: 72.8832,
        description: "Unattended luggage on platform",
        priority: "Medium",
        date: "2024-03-01",
      },
      {
        id: 7,
        latitude: 20.45,
        longitude: 80.5385,
        description: "Train coach is unclean",
        priority: "Low",
        date: "2024-03-10",
      },
      {
        id: 8,
        latitude: 19.9975,
        longitude: 73.1298,
        description: "Delayed train service",
        priority: "High",
        date: "2024-03-15",
      },
      {
        id: 9,
        latitude: 19.0402,
        longitude: 72.8347,
        description: "Broken ticket vending machine",
        priority: "Medium",
        date: "2024-04-01",
      },
      {
        id: 10,
        latitude: 19.7545,
        longitude: 75.3189,
        description: "Poor lighting in waiting area",
        priority: "Low",
        date: "2024-04-05",
      },
      {
        id: 11,
        latitude: 19.0517,
        longitude: 73.4280,
        description: "Unsanitary conditions at food stalls",
        priority: "High",
        date: "2024-04-20",
      },
    ],
    sentiments: [
      { date: "2024-01-01", Positive: 10, Neutral: 55, Negative: 35 },
      { date: "2024-02-01", Positive: 12, Neutral: 50, Negative: 38 },
      { date: "2024-03-01", Positive: 14, Neutral: 48, Negative: 38 },
      { date: "2024-04-01", Positive: 15, Neutral: 50, Negative: 35 },
      { date: "2024-05-01", Positive: 16, Neutral: 52, Negative: 32 },
      { date: "2024-06-01", Positive: 17, Neutral: 51, Negative: 32 },
      { date: "2024-07-01", Positive: 18, Neutral: 50, Negative: 32 },
      { date: "2024-08-01", Positive: 19, Neutral: 49, Negative: 32 },
    ],
    categories: [
      { name: "Coach - Cleanliness", value: 4 },
      { name: "Catering & Vending Services", value: 3 },
      { name: "Punctuality", value: 2 },
      { name: "Security", value: 4 },
      { name: "Facilities for women with special needs", value: 2 },
    ],
    priorities: [
      { name: "Low", value: 5 },
      { name: "Medium", value: 4 },
      { name: "High", value: 5 },
    ],
    trends: [
      { week: 1, date: "2024-01-01", count: 15 },
      { week: 2, date: "2024-01-08", count: 12 },
      { week: 3, date: "2024-01-15", count: 14 },
      { week: 4, date: "2024-01-22", count: 16 },
      { week: 5, date: "2024-01-29", count: 18 },
      { week: 6, date: "2024-02-05", count: 20 },
      { week: 7, date: "2024-02-12", count: 19 },
      { week: 8, date: "2024-02-19", count: 21 },
      { week: 9, date: "2024-03-10", count: 22 },
      { week: 10, date: "2024-03-17", count: 20 },
      { week: 11, date: "2024-04-01", count: 18 },
      { week: 12, date: "2024-04-15", count: 17 },
      { week: 13, date: "2024-05-01", count: 15 },
      { week: 14, date: "2024-05-05", count: 16 },
      { week: 15, date: "2024-06-05", count: 17 },
      { week: 16, date: "2024-06-12", count: 18 },
      { week: 17, date: "2024-07-01", count: 19 },
      { week: 18, date: "2024-07-10", count: 20 },
      { week: 19, date: "2024-07-15", count: 21 },
      { week: 20, date: "2024-08-01", count: 22 },
    ],
    monthlyTrends: [
      {
        month: "January",
        count: 72,
        high: 30,
        medium: 25,
        low: 17,
      },
      {
        month: "February",
        count: 68,
        high: 28,
        medium: 24,
        low: 16,
      },
      {
        month: "March",
        count: 60,
        high: 24,
        medium: 20,
        low: 16,
      },
      {
        month: "April",
        count: 50,
        high: 20,
        medium: 16,
        low: 14,
      },
      {
        month: "May",
        count: 45,
        high: 18,
        medium: 15,
        low: 12,
      },
      {
        month: "June",
        count: 43,
        high: 17,
        medium: 13,
        low: 13,
      },
      {
        month: "July",
        count: 42,
        high: 15,
        medium: 14,
        low: 13,
      },
      {
        month: "August",
        count: 40,
        high: 14,
        medium: 13,
        low: 13,
      },
    ],
    resolutionRates: [
      { priority: "High", resolved: 30, pending: 10 },
      { priority: "Medium", resolved: 25, pending: 10 },
      { priority: "Low", resolved: 15, pending: 5 },
    ],
    categoriesSeries: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      series: [
        { name: "2023", data: [43, 33, 22, 37, 67, 68, 37, 24] },
        { name: "2024", data: [51, 60, 50, 55, 45, 43, 42, 40] },
      ],
    },
  };
  