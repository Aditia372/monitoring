import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./Preplanning.css";

const SidebarLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">
          <span className="plane-icon">🛫</span>
          <span className="title-text">
            Pre <span className="highlight">Planning</span>
          </span>
        </h2>
        {user && (
          <div className="user-profile">
            <div className="avatar">🧑‍✈️</div> {/* Avatar yang lebih cocok */}
            <div>
              <p className="username">{user.username.toUpperCase()}</p> {/* Uppercase hanya tampilan */}
              {/* <p className="userid">ID: {user.id}</p> */}
            </div>
          </div>
        )}
        <div className="profile-separator"></div> {/* Tambahkan ini */}
        <nav className="menu">
          <button onClick={() => navigate("/preplanning")}>🏠 Dashboard</button>
          <button onClick={() => navigate("/preplanning/tambah-pesawat")}>✈️ Tambah Pesawat</button>
          <button onClick={() => navigate("/preplanning/all")}>📋 All Division Task</button>
          <button onClick={() => navigate("/preplanning/my-task")}>📌 My Division Task</button>
          <div className="logout-section">
            <div className="logout-separator"></div>
            <button className="logout" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
