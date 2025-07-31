import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { motion } from "framer-motion";

const steps = ["Informasi Pesawat", "Deadline"];

const TambahPesawat = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (activeStep === 0 && name.trim() === "") return;
    if (activeStep === 1 && deadline.trim() === "") return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const newAircraft = { name, deadline };
    try {
      const res = await fetch("http://localhost:5000/api/aircrafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAircraft),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Pesawat & tugas berhasil dibuat!");
        navigate("/preplanning");
      } else {
        alert(data.message || "Gagal menambahkan pesawat.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan.");
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafc",
        p: 2,
      }}
    >
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: "100%", maxWidth: 500 }}>
        <Typography variant="h5" align="center" mb={3} fontWeight={600} color="primary">
          Tambah Pesawat Baru
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box mt={4}>
            <TextField
              label="Nama Pesawat"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
        )}

        {activeStep === 1 && (
          <Box mt={4}>
            <TextField
              label="Deadline"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </Box>
        )}

        <Box mt={4} display="flex" justifyContent="space-between">
          {activeStep > 0 && (
            <Button variant="outlined" onClick={handleBack}>
              Kembali
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Lanjut
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Simpan
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TambahPesawat;
