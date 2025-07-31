// controllers/aircraftController.js
const pool = require("../config/db");

const defaultPrePlanningTasks = [
  "Evaluate Engineering Document Pakage",
  "Perform Preplanning of manufacturing concept",
  "Create and release Preplanning sheet",
  "Create and release MBOM and Material Master",
  "Create and release Tool Request (TR)",
  "Evaluate Manufacturing Change Request",
  "Update & report workload progress",
];

const defaultPlannerTasks = [
  "Create Change Number",
  "Create and Release Master Process Sheet (Routing)",
  "Create and Release Out Of Sequence",
  "Evaluate Manufacturing Change Request (MCR)",
];
const defaultPpcTasks = [
  "Creates production planning, master schedule, production work priority, and production capacity planning",
  "Creates and release work order",
  "Analyze workload capacity at work center",
  "Ensure completeness and prepare work packages",
  "Send the work packages component to kitting",
  "Report informing about production and deliveries situation"
];
const defaultKittingTasks = [
  "Receive Work Order",
  "Kitting Material",
  "Checking Quantity",
  "Inspecting Material and Document",
  "Packet Material Send to Production"
];
const defaultPfTasks = [
  "Plan Man Power According Production Detail Schedule",
  "Excute every step of Process Sheet",
  "Completed Component"
];
const defaultQcTasks = [
  "Checking the conformity of production results with the process sheet",
];
const defaultEliTasks = [
  "Analyze and evaluate Subtitution of Material(SoM) in the production proses",
  "Make dispositions"
];
const getDeadline = () => {
  const now = new Date();
  now.setDate(now.getDate() + 3);
  return now;
};

const addAircraft = async (req, res) => {
  const { name, deadline } = req.body;

  try {
    const aircraftResult = await pool.query(
      "INSERT INTO aircrafts (name, deadline) VALUES ($1, $2) RETURNING *",
      [name, deadline]
    );
    const aircraft = aircraftResult.rows[0];

    // Tambah tugas Pre Planning
    for (let i = 0; i < defaultPrePlanningTasks.length; i++) {
      await pool.query(
        `INSERT INTO tasks 
          (aircraft_id, task_name, division, status, order_number, deadline)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          aircraft.id,
          defaultPrePlanningTasks[i],
          "Pre Planning",
          i === 0 ? "pending" : "locked",
          i + 1,
          getDeadline(),
        ]
      );
    }

    // Tambah tugas Planner
    for (let i = 0; i < defaultPlannerTasks.length; i++) {
      await pool.query(
        `INSERT INTO tasks 
          (aircraft_id, task_name, division, status, order_number, deadline)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          aircraft.id,
          defaultPlannerTasks[i],
          "Planner",
          i === 0 ? "pending" : "locked",
          i + 1,
          getDeadline(),
        ]
      );
    }
    for (let i = 0; i < defaultKittingTasks.length; i++) {
      await pool.query(
        `INSERT INTO tasks 
          (aircraft_id, task_name, division, status, order_number, deadline)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          aircraft.id,
          defaultKittingTasks[i],
          "Kitting(lg)",
          i === 0 ? "pending" : "locked",
          i + 1,
          getDeadline(),
        ]
      );
    }
    for (let i = 0; i < defaultPfTasks.length; i++) {
      await pool.query(
        `INSERT INTO tasks 
          (aircraft_id, task_name, division, status, order_number, deadline)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          aircraft.id,
          defaultPfTasks[i],
          "Production",
          i === 0 ? "pending" : "locked",
          i + 1,
          getDeadline(),
        ]
      );
    } for (let i = 0; i < defaultQcTasks.length; i++) {
      await pool.query(
        `INSERT INTO tasks 
          (aircraft_id, task_name, division, status, order_number, deadline)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          aircraft.id,
          defaultQcTasks[i],
          "Quality Control",
          i === 0 ? "pending" : "locked",
          i + 1,
          getDeadline(),
        ]
      );
    }
    for (let i = 0; i < defaultEliTasks.length; i++) {
      await pool.query(
        `INSERT INTO tasks 
          (aircraft_id, task_name, division, status, order_number, deadline)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          aircraft.id,
          defaultEliTasks[i],
          "Engineering Liaison",
          i === 0 ? "pending" : "locked",
          i + 1,
          getDeadline(),
        ]
      );
    }
    for (let i = 0; i < defaultPpcTasks.length; i++) {
      try {
        await pool.query(
          `INSERT INTO tasks 
            (aircraft_id, task_name, division, status, order_number, deadline)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            aircraft.id,
            defaultPpcTasks[i],
            "PC", // <<< pastikan ini nilainya PC
            i === 0 ? "pending" : "locked",
            i + 1,
            getDeadline(),
          ]
        );
      } catch (error) {
        console.error("❌ Gagal insert task PC:", defaultPpcTasks[i]);
        console.error("🛠 Error:", error.message);
      }
    }    
    res.status(201).json({ message: "Pesawat & tugas berhasil ditambahkan", aircraft });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menambahkan pesawat" });
  }
};


// Tambahkan di aircraftController.js
// controllers/aircraftController.js

const getAllAircrafts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM aircrafts ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil daftar pesawat" });
  }
};

module.exports = {
    addAircraft,
    getAllAircrafts
  };
