const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;
const fs = require("fs");


// Import routes
const hospitalRoutes = require("./routes/hospitalRoutes");
const patientRoutes = require("./routes/patientRoutes");
const patientDocumentRoutes = require("./routes/patientDocumentRoutes"); // Auth + docs

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded documents (fix for download issue)
app.get("/upload/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../upload", req.params.filename);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.download(filePath); // <-- This forces download
  } else {
    res.status(404).send("File not found");
  }
});

// ✅ Serve frontend and static assets
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/pages", express.static(path.join(__dirname, "../frontend/pages")));

// API Routes
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/patient-docs", patientDocumentRoutes);

// Page Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/hospital_dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/hospital_dashboard.html"));
});

app.get("/add_patient", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/add_patient.html"));
});

app.get("/view_patient", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/view_patient.html"));
});

app.get("/patient_login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/patient_login.html"));
});

app.get("/patient_register", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/patient_register.html"));
});

app.get("/patient_dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/patient_dashboard.html"));
});

// MongoDB Connection
mongoose
  .connect("mongodb+srv:")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
