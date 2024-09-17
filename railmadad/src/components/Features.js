import React from 'react';
import { FaCog, FaImage, FaExclamationTriangle, FaFileAlt, FaRobot, FaChartLine, FaComments, FaUserShield } from 'react-icons/fa';

const Features = () => (
  <div className="text-center my-4">
    <h2>Our Key Features</h2>
    <div className="row">
      {[{icon: FaCog, text: "Automated Categorization"}, {icon: FaImage, text: "Image & Video Analysis"}, {icon: FaExclamationTriangle, text: "Urgency Detection"}, {icon: FaFileAlt, text: "Enhanced Data Extraction"}, {icon: FaRobot, text: "Automated Response"}, {icon: FaChartLine, text: "Predictive Maintenance"}, {icon: FaComments, text: "Feedback Analysis"}, {icon: FaUserShield, text: "AI-Assisted Training"}].map((feature, index) => (
        <div className="col-3 mb-4" key={index}>
          <div className="feature-item">
            <feature.icon className="feature-icon" />
            <p>{feature.text}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Features;
