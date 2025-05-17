const Patient = require('../models/Patient');
const Hospital = require('../models/Hospital');

// Utility to clean hospital names into uppercase, no spaces/symbols
const sanitizeHospitalName = (name) => {
  return name
    .replace(/\s+/g, '')         // remove all spaces
    .replace(/[^a-zA-Z]/g, '')   // remove non-alphabetic characters
    .toUpperCase();              // convert to uppercase
};

const addPatient = async (req, res) => {
  try {
    const { hospitalId, name, age, gender, symptoms, phone, allergies, medications, otherInfo } = req.body;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    const prefix = sanitizeHospitalName(hospital.name); // Use cleaned hospital name

    const existingCount = await Patient.countDocuments({ hospitalId });

    const patientId = `${prefix}-${String(existingCount + 1).padStart(3, '0')}`;

    const patient = new Patient({
      hospitalId,
      name,
      age,
      gender,
      symptoms,
      phone,
      allergies,
      medications,
      otherInfo,
      patientId,
    });

    await patient.save();

    console.log("✅ Generated Patient ID:", patientId);

    res.status(201).json({ message: 'Patient added', patient });
  } catch (err) {
    console.error("❌ Error adding patient:", err);
    res.status(500).json({ error: 'Failed to add patient', details: err.message });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const hospitalId = req.query.hospitalId;
    if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital ID is required' });
    }

    const patients = await Patient.find({ hospitalId });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.id });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
};

const getPatientByCustomId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
};

module.exports = {
  addPatient,
  getAllPatients,
  getPatientById,
  getPatientByCustomId,
};
