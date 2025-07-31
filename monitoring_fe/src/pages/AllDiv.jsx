import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import "./AllDivision.css";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const divisions = ["Pre Planning", "Planner", "PC", "Kitting(lg)", "Production", "Quality Control", "Engineering Liaison"];

const AllDiv = () => {
  const [aircrafts, setAircrafts] = useState([]);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [allTasks, setAllTasks] = useState({});
  const [chartLoading, setChartLoading] = useState(true);

  const fetchAllTasks = async () => {
    const newAllTasks = {};
    for (const aircraft of aircrafts) {
      newAllTasks[aircraft.id] = {};
      for (const division of divisions) {
        try {
          const res = await fetch(`http://localhost:5000/api/tasks/${aircraft.id}/${division}`);
          const data = await res.json();
          const updated = data.map((task) => {
            const createdDate = new Date(task.created_at);
            const now = new Date();
            const diffMinutes = (now - createdDate) / (1000 * 60);
            if (task.status !== "selesai" && diffMinutes > 10) {
              return { ...task, status: "pending" };
            }
            return task;
          });
          newAllTasks[aircraft.id][division] = updated;
        } catch (err) {
          console.error(`Gagal mengambil tugas ${division} untuk ${aircraft.name}:`, err);
          newAllTasks[aircraft.id][division] = [];
        }
      }
    }
    setAllTasks(newAllTasks);
    setChartLoading(false);
  };
  useEffect(() => {
    if (aircrafts.length > 0) {
      fetchAllTasks(); // fetch awal
  
      const interval = setInterval(() => {
        fetchAllTasks();
      }, 10000); // fetch ulang setiap 10 detik
  
      return () => clearInterval(interval); // bersihkan saat komponen unmount
    }
  }, [aircrafts]);
  
  useEffect(() => {
    const fetchAircrafts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/aircrafts");
        const data = await res.json();
        setAircrafts(data);
        if (data.length > 0) {
          setSelectedAircraft(data[0]); // auto pilih aircraft pertama
        }
      } catch (err) {
        console.error("Gagal mengambil daftar pesawat:", err);
      }
    };
    fetchAircrafts();
  }, []);
  

  useEffect(() => {
    if (aircrafts.length > 0) {
      fetchAllTasks();
    }
  }, [aircrafts]);

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
    const allDivTasks = allTasks[aircraft.id] || {};
    const statusCounts = {
      Selesai: 0,
      Dikerjakan: 0,
      Pending: 0,
      Belum: 0,
    };

    divisions.forEach((division) => {
      (allDivTasks[division] || []).forEach((task) => {
        const status = task.status?.toLowerCase();
        if (status === "selesai") statusCounts.Selesai++;
        else if (status === "dikerjakan") statusCounts.Dikerjakan++;
        else if (status === "pending") statusCounts.Pending++;
        else statusCounts.Belum++;
      });
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
          backgroundColor: ["#10B981", "#F59E0B", "#EF4444", "#9CA3AF"],
          borderWidth: 1,
        },
      ],
    };

    return (
      <div key={aircraft.id} className="aircraft-chart-card">
        <div className="chart-header">📊 Progres Pesawat - {aircraft.name}</div>
        <div className="chart-wrapper">
          <Pie data={chartData} />
        </div>
        {/* </div> */}

        {/* Tambahan Rekap Samping */}
        <div className="task-summary space-y-2">
          {Object.entries(statusCounts).map(([label, count], idx) => (
            <div key={label} className="summary-item">
              <div className="summary-left">
                <span className="color-bullet" style={{ backgroundColor: chartData.datasets[0].backgroundColor[idx] }}></span>
                <span className="summary-label">{label}</span>
              </div>
              <span className="summary-count">{count} tugas</span>
            </div>
          ))}
          {/* </div> */}

          {/* Persentase selesai */}
          <div className="mt-4">
            <h5 className="font-semibold text-sm text-gray-700">✅ Total Selesai:</h5>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
              <div className="bg-green-500 h-4 rounded-full text-right pr-2 text-white text-xs flex items-center justify-end" style={{ width: `${((statusCounts.Selesai / total) * 100).toFixed(0)}%` }}>
                {((statusCounts.Selesai / total) * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mytask-container fancy-bg">
      {/* Menu bar horizontal */}
      <div className="menu-bar bg-white shadow-md py-3 px-4 flex flex-wrap gap-4 sticky top-0 z-10">
        {aircrafts.map((aircraft) => (
          <button
            key={aircraft.id}
            className={`menu-item px-4 py-2 rounded-full border ${selectedAircraft?.id === aircraft.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-blue-100"}`}
            onClick={() => setSelectedAircraft(aircraft)}
          >
            ✈️ {aircraft.name}
          </button>
        ))}
      </div>

      {/* Konten utama */}
      <main className="mytask-main">
        {selectedAircraft && !chartLoading && renderPieChart(selectedAircraft)}

        {selectedAircraft && (
          <>
            {divisions.map((division, divisionIndex) => {
              const previousDivision = divisions[divisionIndex - 1];
              const currentTasks = allTasks[selectedAircraft.id]?.[division] || [];
              const isBlocked = divisionIndex > 0 && (allTasks[selectedAircraft.id]?.[previousDivision] || []).some((task) => task.status !== "selesai");

              return (
                <div key={division} className="mb-6 border-l-4 border-blue-500 pl-4 py-4 bg-gray-50 rounded-md shadow-sm">
                  <h3 className="division-title text-lg font-semibold mb-2">📁 {division}</h3>
                  {isBlocked && <p className="warning-text bg-yellow-100 text-yellow-800 font-medium py-2 px-4 rounded-md shadow-sm bg-white">⚠️ Selesaikan divisi sebelumnya terlebih dahulu.</p>}
                  <div className="task-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {currentTasks.map((task) => (
                      <div key={task.id} className="task-card p-4 border rounded shadow-sm bg-white">
                        <div className="task-top flex justify-between items-center">
                          <h4 className={`task-title font-medium ${task.status === "pending" ? "text-red-600" : ""}`}>{task.task_name}</h4>
                          {getStatusLabel(task.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </main>
    </div>
  );
};

export default AllDiv;
