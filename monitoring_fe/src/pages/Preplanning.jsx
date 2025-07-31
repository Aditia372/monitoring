import React from "react";
import "./Preplanning.css"; // pastikan sudah import CSS

const Preplanning = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <img
          src="/logo.png"
          alt="Plane Logo"
          className="dashboard-logo"
        />
        <h1 className="dashboard-title">Dashboard Pre Planning Division</h1>
        <p className="dashboard-description">
          Silakan pilih menu di sebelah kiri untuk mulai mengerjakan tugas dari divisi Anda 
        </p>
      </div>
    </div>
  );
};

export default Preplanning;
