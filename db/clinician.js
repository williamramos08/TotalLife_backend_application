const knex = require('./knex'); // Assuming you have a knex configuration file

// Create a new clinician
function createClinician(clinician) {
    return knex('Clinician').insert(clinician);
}

// Read all clinicians
function getAllClinicians() {
    return knex('Clinician').select('*');
}

// Read a single clinician by ID
function getClinicianById(clinicianId) {
    return knex('Clinician').where('clinician_id', clinicianId).first();
}

// Update a clinician
function updateClinician(clinicianId, clinicianUpdates) {
    return knex('Clinician').where('clinician_id', clinicianId).update(clinicianUpdates);
}

// Delete a clinician
function deleteClinician(clinicianId) {
    return knex('Clinician').where('clinician_id', clinicianId).del();
}

module.exports = {
    createClinician,
    getAllClinicians,
    getClinicianById,
    updateClinician,
    deleteClinician
};
