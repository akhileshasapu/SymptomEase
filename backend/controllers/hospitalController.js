const Hospital = require('../models/Hospital');
// If using bcryptjs instead of bcrypt
const bcrypt = require('bcryptjs');

//register a hospital
const registerHospital = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if either the email or name already exists in the database
    const existingHospital = await Hospital.findOne({ $or: [{ email }, { name }] });

    if (existingHospital) {
      return res.status(400).json({ error: 'Hospital with this name or email already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const hospital = new Hospital({ name, email, password: hashedPassword });

    // Save the new hospital
    await hospital.save();

    res.status(201).json({ message: 'Hospital registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};


// Login hospital
const loginHospital = async (req, res) => {
    try {
      const { email, password } = req.body;
      const hospital = await Hospital.findOne({ email });
      if (!hospital) {
        return res.status(400).json({ error: 'Hospital not found' });
      }
      const passwordMatch = await bcrypt.compare(password, hospital.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // ✅ Include hospital name in response
      res.status(200).json({
        message: 'Login successful',
        hospitalId: hospital._id,
        hospitalName: hospital.name
      });
    } catch (err) {
      res.status(500).json({ error: 'Login failed' });
    }
  };
  
module.exports = {
  registerHospital,
  loginHospital,
};
