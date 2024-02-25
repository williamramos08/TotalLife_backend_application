const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const clinicianFunctions = require('./db/clinician');
const patientFunctions = require('./db/patient');
const appointmentFunctions = require('./db/appointments');
const cors = require('cors'); // Import the cors middleware
const { validateClinician, validatePatient, validateAppointment} = require('./validations'); 

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// Clinician Endpoints

// Create a new clinician
app.post("/clinicians", async (req, res) => {
    try {
        const validationErrors = await validateClinician(req.body);
        if (validationErrors.length > 0) {
            // If there are validation errors, return them as response
            return res.status(400).json({ errors: validationErrors });
        }

        // If validation passes, proceed with creating the clinician
        const newClinician = await clinicianFunctions.createClinician(req.body);
        res.status(201).json(newClinician);
    } catch (error) {
        console.error("Error creating clinician:", error);
        res.status(500).json({ error: "Unable to create clinician" });
    }
});

// Get all clinicians
app.get("/clinicians", async (req, res) => {
    try {
        const allClinicians = await clinicianFunctions.getAllClinicians();
        res.status(200).json(allClinicians);
    } catch (error) {
        console.error("Error fetching clinicians:", error);
        res.status(500).json({ error: "Unable to fetch clinicians" });
    }
});

// Get a clinician by ID
app.get("/clinicians/:id", async (req, res) => {
    try {
        const clinicianId = req.params.id;
        const clinician = await clinicianFunctions.getClinicianById(clinicianId);
        if (clinician) {
            res.status(200).json(clinician);
        } else {
            res.status(404).json({ error: "Clinician not found" });
        }
    } catch (error) {
        console.error("Error fetching clinician:", error);
        res.status(500).json({ error: "Unable to fetch clinician" });
    }
});

// Update a clinician by ID
app.put("/clinicians/:id", validateClinician, async (req, res) => {
    try {
        const clinicianId = req.params.id;
        const updatedClinician = await clinicianFunctions.updateClinician(clinicianId, req.body);
        res.status(200).json(updatedClinician);
    } catch (error) {
        console.error("Error updating clinician:", error);
        res.status(500).json({ error: "Unable to update clinician" });
    }
});

// Delete a clinician by ID
app.delete("/clinicians/:id", async (req, res) => {
    try {
        const clinicianId = req.params.id;
        await clinicianFunctions.deleteClinician(clinicianId);
        console.log(`Clinician with ID ${clinicianId} deleted successfully`);
        res.status(204).send(); // No content
    } catch (error) {
        console.error("Error deleting clinician:", error);
        res.status(500).json({ error: "Unable to delete clinician" });
    }
});

// Patient Endpoints

// Create a new patient
app.post("/patients", validatePatient, async (req, res) => {
    try {
        const newPatient = await patientFunctions.createPatient(req.body);
        res.status(201).json(newPatient);
    } catch (error) {
        console.error("Error creating patient:", error);
        res.status(500).json({ error: "Unable to create patient" });
    }
});

// Get all patients
app.get("/patients", async (req, res) => {
    try {
        const allPatients = await patientFunctions.getAllPatients();
        res.status(200).json(allPatients);
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ error: "Unable to fetch patients" });
    }
});

// Get a patient by ID
app.get("/patients/:id", async (req, res) => {
    try {
        const patientId = req.params.id;
        const patient = await patientFunctions.getPatientById(patientId);
        if (patient) {
            res.status(200).json(patient);
        } else {
            res.status(404).json({ error: "Patient not found" });
        }
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ error: "Unable to fetch patient" });
    }
});

// Update a patient by ID
app.put("/patients/:id", validatePatient, async (req, res) => {
    try {
        const patientId = req.params.id;
        const updatedPatient = await patientFunctions.updatePatient(patientId, req.body);
        res.status(200).json(updatedPatient);
    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ error: "Unable to update patient" });
    }
});

// Delete a patient by ID
app.delete("/patients/:id", async (req, res) => {
    try {
        const patientId = req.params.id;
        await patientFunctions.deletePatient(patientId);
        console.log(`Patient with ID ${patientId} deleted successfully`);
        res.status(204).send(); // No content
    } catch (error) {
        console.error("Error deleting patient:", error);
        res.status(500).json({ error: "Unable to delete patient" });
    }
});

// Appointment Endpoints

// Create a new appointment
app.post("/appointments", validateAppointment, async (req, res) => {
    try {
        const newAppointment = await appointmentFunctions.createAppointment(req.body);
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ error: "Unable to create appointment" });
    }
});

// Get all appointments
app.get("/appointments", async (req, res) => {
    try {
        // Call the getAllAppointmentsWithNames function
        const allAppointments = await appointmentFunctions.getAllAppointmentsWithNames();
        // Send the response with the retrieved appointments
        res.status(200).json(allAppointments);
    } catch (error) {
        // Handle errors
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Unable to fetch appointments" });
    }
});

// Get an appointment by ID
app.get("/appointments/:id", async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const appointment = await appointmentFunctions.getAppointmentById(appointmentId);
        if (appointment) {
            res.status(200).json(appointment);
        } else {
            res.status(404).json({ error: "Appointment not found" });
        }
    } catch (error) {
        console.error("Error fetching appointment:", error);
        res.status(500).json({ error: "Unable to fetch appointment" });
    }
});

// Update an appointment by ID
app.put("/appointments/:id", validateAppointment, async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const updatedAppointment = await appointmentFunctions.updateAppointment(appointmentId, req.body);
        res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ error: "Unable to update appointment" });
    }
});

// Delete an appointment by ID
app.delete("/appointments/:id", async (req, res) => {
    try {
        const appointmentId = req.params.id;
        await appointmentFunctions.deleteAppointment(appointmentId);
        console.log(`Appointment with ID ${appointmentId} deleted successfully`);
        res.status(204).send(); // No content
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ error: "Unable to delete appointment" });
    }
});

app.listen(PORT, () => console.log("Server is running on port ", PORT));
