import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import "./Home.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const Home = () => {
  const pieData = {
    labels: ["Open", "Bounce", "Unsubscribe"],
    datasets: [
      {
        data: [53, 36, 11],
        backgroundColor: ["#00c0ef", "#f56954", "#f39c12"],
        hoverOffset: 4,
      },
    ],
  };

  const lineData = {
    labels: [
      "9:00AM", "12:00AM", "3:00PM", "6:00PM",
      "9:00PM", "12:00PM", "3:00AM", "6:00AM",
    ],
    datasets: [
      {
        label: "Open",
        data: [100, 200, 300, 400, 450, 500, 600, 700],
        fill: true,
        backgroundColor: "rgba(0, 192, 239, 0.4)",
        borderColor: "#00c0ef",
      },
      {
        label: "Click",
        data: [50, 100, 150, 180, 210, 230, 260, 280],
        fill: true,
        backgroundColor: "rgba(243, 156, 18, 0.4)",
        borderColor: "#f39c12",
      },
      {
        label: "Click Second Time",
        data: [20, 40, 60, 80, 100, 120, 140, 160],
        fill: true,
        backgroundColor: "rgba(245, 105, 84, 0.4)",
        borderColor: "#f56954",
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>CREATIVE TIM</h2>
        <ul>
          <li>Dashboard</li>
          <li>User Profile</li>
          <li>Table List</li>
          <li>Typography</li>
          <li>Icons</li>
          <li>Maps</li>
          <li>Notifications</li>
        </ul>
        <button className="upgrade">UPGRADE TO PRO</button>
      </aside>

      <main className="main-content">
        <nav className="topbar">
          <span>Dashboard</span>
          <div className="topbar-right">
            <input type="text" placeholder="Search" />
            <span>🔔</span>
            <span>Account</span>
            <span>Log out</span>
          </div>
        </nav>

        <div className="cards">
          <div className="card">
            <h3>Email Statistics</h3>
            <p>Last Campaign Performance</p>
            <Pie data={pieData} />
          </div>
          <div className="card">
            <h3>Users Behavior</h3>
            <p>24 Hours Performance</p>
            <Line data={lineData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
