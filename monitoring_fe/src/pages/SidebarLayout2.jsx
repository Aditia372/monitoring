import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./Planner.css";

const SidebarLayout2 = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [divisionId, setDivisionId] = useState("");
  const [divisionName, setDivisionName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const id = String(parsedUser.division_id);
      setDivisionId(id);

      const divisionMap = {
        2: "Planner",
        3: "PC",
        4: "Kitting(Lg)",
        5: "Production",
        6: "Quality Control",
        7: "Engineering Liaison",
      };

      setDivisionName(divisionMap[id] || "Unknown");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const taskRoutes = {
    2: "/planner/my-task2",
    3: "/planner/my-task3",
    4: "/planner/my-task4",
    5: "/planner/my-task5",
    6: "/planner/my-task6",
    7: "/planner/my-task7",
  };
  

  const handleMyTaskClick = () => {
    const route = taskRoutes[divisionId];
    if (route) {
      navigate(route);
    } else {
      alert("Divisi tidak dikenali!");
    }
  };

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <h2 class="sidebar-title">
          <span class="plane-icon">🛫</span>
          <span class="title-text">
            <span>Division</span>
            <span class="highlight">Dashboard</span>
          </span>
        </h2>

        {user && (
          <div className="user-profile">
            <div className="avatar">🧑‍💼</div>
            <div>
              <p className="username">{user.username.toUpperCase()}</p>
              <p className="division-name">{divisionName}</p>
            </div>
          </div>
        )}
        <div className="profile-separator"></div>

        <nav className="menu">
          <button onClick={() => navigate("/planner")}>🏠 Dashboard</button>
          <button onClick={() => navigate("/planner/all")}>📋 All Division Task</button>
          <button onClick={handleMyTaskClick}>📌 My Division Task</button>

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

export default SidebarLayout2;
