import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import "./MyTask.css";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const MyTask2 = () => {
  const [aircrafts, setAircrafts] = useState([]);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allTaskData, setAllTaskData] = useState({});
  const [activeTab, setActiveTab] = useState("progres"); // default tab = progres
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(true);
  const division = "Planner";

  const fetchTasks = async () => {
    if (selectedAircraft) {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/tasks/${selectedAircraft.id}/${division}`);
        const data = await res.json();
        const updatedData = data.map((task) => {
          const createdDate = new Date(task.created_at);
          const now = new Date();
          const diffMinutes = (now - createdDate) / (1000 * 60);
          if (task.status !== "selesai" && diffMinutes > 10) {
            return { ...task, status: "pending" };
          }
          return task;
        });
        setTasks(Array.isArray(updatedData) ? updatedData : []);
      } catch (err) {
        console.error("Gagal mengambil tugas:", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchAircrafts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/aircrafts");
        const data = await res.json();
        setAircrafts(data);
      } catch (err) {
        console.error("Gagal mengambil daftar pesawat:", err);
      }
    };
    fetchAircrafts();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [selectedAircraft]);

  useEffect(() => {
    const fetchAllTaskData = async () => {
      setChartLoading(true);
      const newTaskData = {};
      for (const aircraft of aircrafts) {
        try {
          const res = await fetch(`http://localhost:5000/api/tasks/${aircraft.id}/${division}`);
          const data = await res.json();
          const updatedData = data.map((task) => {
            const createdDate = new Date(task.created_at);
            const now = new Date();
            const diffMinutes = (now - createdDate) / (1000 * 60);
            if (task.status !== "selesai" && diffMinutes > 2) {
              return { ...task, status: "pending" };
            }
            return task;
          });
          newTaskData[aircraft.id] = Array.isArray(updatedData) ? updatedData : [];
        } catch (err) {
          console.error(`Gagal mengambil tugas untuk pesawat ${aircraft.name}:`, err);
        }
      }
      setAllTaskData(newTaskData);
      setChartLoading(false);
    };

    if (aircrafts.length > 0) {
      fetchAllTaskData();
    }
  }, [aircrafts]);

  const updateStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/status/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));

      const updatedAllData = { ...allTaskData };
      const resChart = await fetch(`http://localhost:5000/api/tasks/${selectedAircraft.id}/${division}`);
      const dataChart = await resChart.json();
      updatedAllData[selectedAircraft.id] = dataChart;
      setAllTaskData(updatedAllData);
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "selesai":
        return <span className="status-badge green">Selesai</span>;
      case "dikerjakan":
        return <span className="status-badge orange">Dikerjakan</span>;
      case "pending":
        return <span className="status-badge red">Pending</span>;
      default:
        return <span className="status-badge gray">Belum</span>;
    }
  };

  const renderPieChart = (aircraft) => {
    const tasks = allTaskData[aircraft.id] || [];
    const statusCounts = {
      Selesai: 0,
      Dikerjakan: 0,
      Pending: 0,
      Belum: 0,
    };

    tasks.forEach((task) => {
      const status = task.status?.toLowerCase();
      if (status === "selesai") statusCounts.Selesai++;
      else if (status === "dikerjakan") statusCounts.Dikerjakan++;
      else if (status === "pending") statusCounts.Pending++;
      else statusCounts.Belum++;
    });

    const total = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1;

    const chartData = {
      labels: [
        `Selesai (${((statusCounts.Selesai / total) * 100).toFixed(1)}%)`,
        `Dikerjakan (${((statusCounts.Dikerjakan / total) * 100).toFixed(1)}%)`,
        `Pending (${((statusCounts.Pending / total) * 100).toFixed(1)}%)`,
        `Belum (${((statusCounts.Belum / total) * 100).toFixed(1)}%)`,
      ],
      datasets: [
        {
          data: [statusCounts.Selesai, statusCounts.Dikerjakan, statusCounts.Pending, statusCounts.Belum],
          backgroundColor: ["#4CAF50", "#FF9800", "#F44336", "#9E9E9E"],
          borderWidth: 1,
        },
      ],
    };

    return (
      <div key={aircraft.id} className="aircraft-chart-card">
        <h3 className="aircraft-chart-title">Progres Aircraft {aircraft.name}</h3>
        <Pie data={chartData} />
      </div>
    );
  };

  return (
    <div className="mytask-container fancy-bg">
      <header className="mytask-topnav">
        <nav className="nav-menu">
          <button
            className={activeTab === "progres" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("progres")}
          >
            📈 Progres
          </button>
          {aircrafts.map((aircraft) => (
            <button
              key={aircraft.id}
              className={
                selectedAircraft?.id === aircraft.id && activeTab === "tugas"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => {
                setSelectedAircraft(aircraft);
                setActiveTab("tugas");
              }}
            >
              ✈️ {aircraft.name}
            </button>
          ))}
        </nav>
      </header>

      <main className="mytask-main">
        {activeTab === "progres" && (
          <>
            {chartLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="loader"></div>
                <span className="ml-4 text-gray-600 text-lg animate-pulse">Memuat grafik...</span>
              </div>
            ) : (
              <div className="aircraft-chart-grid animate-fade-in">
                {aircrafts.map((aircraft) => (
                  <div className="animated-card" key={aircraft.id}>
                    {renderPieChart(aircraft)}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "tugas" && selectedAircraft && (
          <>
            {loading ? (
              <p>⏳ Memuat tugas...</p>
            ) : (
              <div className="task-grid">
                {tasks.map((task, index) => {
                  const isLocked = index > 0 && tasks[index - 1].status !== "selesai";
                  return (
                    <div key={task.id} className="task-card">
                      <div className="task-top">
                        <h4 className={`task-title ${task.status === "pending" ? "pending" : ""}`}>
                          {task.task_name}
                        </h4>
                        {getStatusLabel(task.status)}
                      </div>
                      <div className="task-actions">
                        {(task.status === "belum" || task.status === "pending") && (
                          <button
                            className="btn-progress"
                            onClick={() => updateStatus(task.id, "dikerjakan")}
                            disabled={isLocked}
                          >
                            {isLocked ? "⛔ Tunggu sebelumnya" : "🛠 Tandai Dikerjakan"}
                          </button>
                        )}
                        {task.status === "dikerjakan" && (
                          <button
                            className="btn-finish"
                            onClick={() => updateStatus(task.id, "selesai")}
                          >
                            ✔ Tandai Selesai
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MyTask2;
