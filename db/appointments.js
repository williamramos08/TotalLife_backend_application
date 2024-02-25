const knex = require('./knex'); // Assuming you have a knex configuration file

// Create a new appointment
function createAppointment(appointment) {
    return knex('Appointments').insert(appointment);
}

// Read all appointments
function getAllAppointments() {
    return knex('Appointments').select('*');
}

// Read a single appointment by ID
function getAppointmentById(appointmentId) {
    return knex('Appointments').where('appointment_id', appointmentId).first();
}

// Read all appointments with clinician and patient names
async function getAllAppointmentsWithNames() {
    try {
        const allAppointments = await knex('Appointments')
            .select(
                'Appointments.*', 
                'Clinician.first_name as clinician_full_name', 
                'Patient.first_name as patient_full_name'
            )
            .select(knex.raw("CONCAT(Clinician.first_name, ' ', Clinician.last_name) as clinician_full_name"))
            .select(knex.raw("CONCAT(Patient.first_name, ' ', Patient.last_name) as patient_full_name"))
            .leftJoin('Clinician', 'Appointments.clinician_id', 'Clinician.clinician_id')
            .leftJoin('Patient', 'Appointments.patient_id', 'Patient.patient_id');
        return allAppointments;
    } catch (error) {
        throw error;
    }
}


// Update an appointment
function updateAppointment(appointmentId, appointmentUpdates) {
    return knex('Appointments').where('appointment_id', appointmentId).update(appointmentUpdates);
}

// Delete an appointment
function deleteAppointment(appointmentId) {
    return knex('Appointments').where('appointment_id', appointmentId).del();
}


module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    getAllAppointmentsWithNames
};
