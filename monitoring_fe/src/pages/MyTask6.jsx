// MyTask2.jsx
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import "./MyTask6.css";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const MyTask6 = () => {
  const [aircrafts, setAircrafts] = useState([]);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allTaskData, setAllTaskData] = useState({});
  const [activeTab, setActiveTab] = useState("rekap");
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(true);
  const [taskForm, setTaskForm] = useState({
    aircraft_id: "",
    division: "Engineering Liaison",
    task_name: "",
    status: "locked",
  });

  const division = "Quality Control";

  const fetchAircrafts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/aircrafts");
      setAircrafts(res.data);
    } catch (err) {
      console.error("Gagal mengambil aircrafts:", err);
    }
  };

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
          if (task.status !== "selesai" && diffMinutes > 2) {
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

  useEffect(() => {
    const loadData = async () => {
      await fetchAircrafts();
    };
    loadData();
  }, []);
  
  useEffect(() => {
    if (aircrafts.length > 0) {
      fetchAllTaskData();
    }
  }, [aircrafts]);
  
  useEffect(() => {
    fetchAircrafts();
    fetchAllTaskData();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [selectedAircraft]);

  const updateStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/status/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      const resChart = await fetch(`http://localhost:5000/api/tasks/${selectedAircraft.id}/${division}`);
      const dataChart = await resChart.json();
      setAllTaskData((prev) => ({ ...prev, [selectedAircraft.id]: dataChart }));
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/tasks", taskForm);
      alert("Task berhasil ditambahkan");
      setTaskForm({ aircraft_id: "", division: "", task_name: "", status: "" });
      fetchAllTaskData();
    } catch (err) {
      console.error("Gagal menambahkan task:", err);
      alert("Gagal menambahkan task");
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
      <nav className="menu-bar">
        <ul>
          <li className={activeTab === "progres" ? "active" : ""} onClick={() => setActiveTab("progres")}>📈 Progres</li>
          <li className={activeTab === "form" ? "active" : ""} onClick={() => setActiveTab("form")}>➕ Tambah Task</li>
          {aircrafts.map((aircraft) => (
            <li
              key={aircraft.id}
              className={selectedAircraft?.id === aircraft.id && activeTab === "tugas" ? "active" : ""}
              onClick={() => {
                setSelectedAircraft(aircraft);
                setActiveTab("tugas");
              }}
            >
              ✈️ {aircraft.name}
            </li>
          ))}
        </ul>
      </nav>

      <main className="mytask-main">
        {activeTab === "rekap" || activeTab === "progres" ? (
          <>
            <h2 className="section-title">{activeTab === "rekap" ? "📊 Rekap Tugas per Pesawat" : "📈 Progres Pekerjaan"}</h2>
            {chartLoading ? <p className="loading-text">⏳ Memuat grafik...</p> : <div className="aircraft-chart-grid">{aircrafts.map(renderPieChart)}</div>}
          </>
        ) : activeTab === "tugas" && selectedAircraft ? (
          <>
            {loading ? (
              <p className="loading-text">⏳ Memuat tugas...</p>
            ) : (
              <div className="task-grid">
                {tasks.map((task, index) => {
                  const isLocked = index > 0 && tasks[index - 1].status !== "selesai";
                  return (
                    <div key={task.id} className="task-card modern">
                      <div className="task-top">
                        <h4 className={`task-title ${task.status === "pending" ? "pending" : ""}`}>{task.task_name}</h4>
                        {getStatusLabel(task.status)}
                      </div>
                      <div className="task-actions">
                        {(task.status === "belum" || task.status === "pending") && (
                          <button className="btn btn-progress" onClick={() => updateStatus(task.id, "dikerjakan")} disabled={isLocked}>
                            {isLocked ? "⛔ Tunggu sebelumnya" : "🛠 Dikerjakan"}
                          </button>
                        )}
                        {task.status === "dikerjakan" && (
                          <button className="btn btn-finish" onClick={() => updateStatus(task.id, "selesai")}>
                            ✔ Selesai
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : activeTab === "form" ? (
          <div className="task-form-container">
            <h2 className="form-title">Tambah Task</h2>
            <form onSubmit={handleSubmit} className="task-form">
              <div className="form-group">
                <label htmlFor="aircraft_id">Pilih Aircraft</label>
                <select name="aircraft_id" value={taskForm.aircraft_id} onChange={handleChange} required>
                  <option value="">Pilih Aircraft</option>
                  {aircrafts.map((aircraft) => (
                    <option key={aircraft.id} value={aircraft.id}>
                      {aircraft.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="division">Pilih Divisi</label>
                <select name="division" value={taskForm.division} onChange={handleChange} required>
                  <option value="Engineering Liaison">Engineering Liaison</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="task_name">Task Name</label>
                <input type="text" name="task_name" value={taskForm.task_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select name="status" value={taskForm.status} onChange={handleChange} required>
                  <option value="locked">locked</option>
                </select>              </div>
              <div className="form-buttons">
                <button type="submit" className="btn btn-submit">Tambah</button>
              </div>
            </form>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default MyTask6;
