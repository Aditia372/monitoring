import React from "react";
import "./Preplanning.css";

const Planner = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <img src="/logo.png" alt="Logo" className="dashboard-logo" />
        <h1 className="dashboard-title">Dashboard Planner</h1>
        <p className="dashboard-description">
          Silakan pilih menu di sebelah kiri untuk melihat tugas berdasarkan divisi Anda.
        </p>
      </div>
    </div>
  );
};

export default Planner;
