import React from 'react';
import './CasualtyReport.css'; // We'll create this for styling

function CasualtyReport({ report }) {
  // If there's no report, don't render anything
  if (!report) {
    return null;
  }

  // Destructure the report for easier access
  const { location, number_of_patients, severity } = report;

  return (
    <div className="report-container">
      <h3>📋 Processed Report</h3>
      <div className="report-details">
        <p>
          <strong>Total Patients:</strong> 
          <span>{number_of_patients}</span>
        </p>
        <p>
          <strong>Location (Lat/Long):</strong> 
          <span>{location.lat}, {location.long}</span>
        </p>
        
        <h4>Severity Breakdown:</h4>
        <ul className="severity-list">
          <li>
            <span className="severity-label red">Red (Immediate):</span>
            <span className="severity-count">{severity.red}</span>
          </li>
          <li>
            <span className="severity-label yellow">Yellow (Delayed):</span>
            <span className="severity-count">{severity.yellow}</span>
          </li>
          <li>
            <span className="severity-label green">Green (Minor):</span>
            <span className="severity-count">{severity.green}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CasualtyReport;