const pool = require("../config/db");

// GET all tasks for a specific aircraft and division
const getTasksByAircraftAndDivision = async (req, res) => {
  const { aircraft_id, division } = req.params;
  console.log("Fetching tasks for aircraft:", aircraft_id, "division:", division);
  try {
    const result = await pool.query(
      `SELECT * FROM tasks 
       WHERE aircraft_id = $1 AND division = $2
       ORDER BY order_number ASC`,
      [aircraft_id, division]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Gagal mengambil tugas" });
  }
};

// GET all tasks by division only
const getTasksByDivision = async (req, res) => {
  const { division } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM tasks 
       WHERE division = $1
       ORDER BY order_number ASC`,
      [division]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Gagal mengambil tugas berdasarkan divisi" });
  }
};

// GET all tasks by division (without order, optional)
const getAllTasksByDivision = async (req, res) => {
  const { division } = req.params;
  try {
    const tasks = await pool.query(
      "SELECT * FROM tasks WHERE division = $1",
      [division]
    );
    res.json(tasks.rows);
  } catch (err) {
    console.error("Gagal ambil semua tugas:", err.message);
    res.status(500).send("Server error");
  }
};

// UPDATE task status & unlock next task
const updateTaskStatus = async (req, res) => {
  const { task_id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *`,
      [status, task_id]
    );
    const tasks = result.rows[0];

    if (status === "selesai") {
      await pool.query(
        `UPDATE tasks 
         SET status = 'dikerjakan'
         WHERE aircraft_id = $1 AND division = $2 AND order_number = $3`,
        [tasks.aircraft_id, tasks.division, tasks.order_number + 1]
      );
    }

    res.json(tasks);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Gagal update status" });
  }
};

// GET tasks for specific divisions
const getTasks = async (req, res) => {
  try {
    const allowedDivisions = ['Engineering Liaison', 'Quality Control'];
    const result = await pool.query(
      'SELECT * FROM tasks WHERE division = ANY($1)',
      [allowedDivisions]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Gagal mengambil data tugas" });
  }
};

// CREATE a new task
const createTask = async (req, res) => {
  const { aircraft_id,division, task_name,  status } = req.body;
  // const file = req.file ? req.file.filename : null;

  try {
    await pool.query(
      'INSERT INTO tasks (aircraft_id, division, task_name, status) VALUES ($1, $2, $3, $4)',
      [aircraft_id, division, task_name, status]
    );    
    res.json({ message: 'Task created' });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Gagal membuat task" });
  }
};

// UPDATE task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { aircraft_id, task_name, division, status } = req.body;
  // const file = req.file ? req.file.filename : null;

  try {
    await pool.query(
      'UPDATE tasks SET aircraft_id=$1, division=$2,task_name=$3, status=$4 WHERE id=$5',
      [aircraft_id, division, task_name, status, id]
    );
    res.json({ message: 'Task updated' });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Gagal mengupdate task" });
  }
};

// DELETE task
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id=$1', [id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Gagal menghapus task" });
  }
};

// EXPORT semua function
module.exports = {
  getTasksByAircraftAndDivision,
  getTasksByDivision,
  updateTaskStatus,
  getAllTasksByDivision,
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
