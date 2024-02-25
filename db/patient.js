const knex = require('./knex'); // Assuming you have a knex configuration file

// Create a new patient
function createPatient(patient) {
    return knex('Patient').insert(patient);
}

// Read all patients
function getAllPatients() {
    return knex('Patient').select('*');
}

// Read a single patient by ID
function getPatientById(patientId) {
    return knex('Patient').where('patient_id', patientId).first();
}

// Update a patient
function updatePatient(patientId, patientUpdates) {
    return knex('Patient').where('patient_id', patientId).update(patientUpdates);
}

// Delete a patient
function deletePatient(patientId) {
    return knex('Patient').where('patient_id', patientId).del();
}

module.exports = {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient
};
