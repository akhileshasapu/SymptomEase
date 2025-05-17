const Patient = require('../models/PatientDocument');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Register
exports.registerPatient = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await Patient.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newPatient = new Patient({ email, password: hashedPassword });
    await newPatient.save();

    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login
exports.loginPatient = async (req, res) => {
  const { email, password } = req.body;
  try {
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', email: patient.email });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Upload
exports.uploadDocument = async (req, res) => {
  const { email } = req.params;
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const patient = await Patient.findOne({ email });
    if (!patient) {
      fs.unlinkSync(req.file.path); // Clean up uploaded file if patient not found
      return res.status(404).json({ message: 'User not found' });
    }

    patient.documents.push({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: `/upload/${req.file.filename}`

    });

    await patient.save();
    res.status(200).json({ 
      message: 'Upload successful', 
      document: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype
      }
    });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    // ✅ ALWAYS send JSON
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};


// Get documents
exports.getDocuments = async (req, res) => {
  const { email } = req.params;
  try {
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(patient.documents);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};