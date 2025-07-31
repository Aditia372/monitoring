const pool = require("../config/db");

// Ambil semua divisi
const getDivisions = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, division_name FROM divisions");
    res.json(result.rows);
  } catch (error) {
    console.error("Error getDivisions:", error);
    res.status(500).json({ message: "Gagal mengambil divisi" });
  }
};

// Register pengguna
const register = async (req, res) => {
  const { username, password, division_id } = req.body;

  try {
    // Validasi: pastikan division_id ada di tabel divisions
    const divisionCheck = await pool.query(
      "SELECT * FROM divisions WHERE id = $1",
      [division_id]
    );

    if (divisionCheck.rows.length === 0) {
      return res.status(400).json({ message: "Divisi tidak ditemukan" });
    }

    // Simpan user baru
    const result = await pool.query(
      "INSERT INTO users (username, password, division_id) VALUES ($1, $2, $3) RETURNING *",
      [username, password, division_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error register:", error);
    res.status(500).json({ message: "Gagal registrasi pengguna" });
  }
};

// Login pengguna
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    res.json({ message: "Login berhasil", user: result.rows[0] });
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ message: "Gagal login" });
  }
};

module.exports = {
  getDivisions,
  register,
  login,
};
