const express = require('express');
const router = express.Router();
const { registerHospital, loginHospital } = require('../controllers/hospitalController');

console.log("registerHospital typeof:", typeof registerHospital); // should be function
console.log("loginHospital typeof:", typeof loginHospital);       // should be function

router.post('/register', registerHospital);
router.post('/login', loginHospital);

module.exports = router;
