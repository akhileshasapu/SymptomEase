const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  addPatient,
  getAllPatients,
  getPatientById,
  getPatientByCustomId
} = require('../controllers/patientController');
const Patient = require('../models/Patient'); // Adjust path if needed

// File upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../upload'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// 📌 Upload Consultation Image for a Patient
router.post('/upload/:patientId', upload.single('file'), async (req, res) => {
  const { patientId } = req.params;

  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const patient = await Patient.findOne({ patientId });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Optional: Save upload metadata
    if (!patient.uploads) patient.uploads = [];
    patient.uploads.push({
      filename: req.file.filename,
      path: req.file.path,
      uploadedAt: new Date()
    });

    await patient.save();

    res.status(200).json({ message: 'Upload successful', file: req.file.filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload error', error: err.message });
  }
});

// 🚑 Existing routes
router.post('/', addPatient);
router.get('/', getAllPatients);
router.get('/search/by-id/:patientId', getPatientByCustomId);
router.get('/:id', getPatientById);

module.exports = router;
