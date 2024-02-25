const axios = require('axios');

function validatePatient(req, res, next) {
    const { first_name, last_name, date_of_birth, address, phone_number, email } = req.body;
    const missingFields = [];

    // Check if required fields are present and not empty
    if (!first_name || first_name.trim() === "") missingFields.push("first_name");
    if (!last_name || last_name.trim() === "") missingFields.push("last_name");
    if (!date_of_birth || date_of_birth.trim() === "") missingFields.push("date_of_birth");
    if (!address || address.trim() === "") missingFields.push("address");
    if (!phone_number || phone_number.trim() === "") missingFields.push("phone_number");
    if (!email || email.trim() === "") missingFields.push("email");

    // If any required fields are missing or empty, send a 400 Bad Request response with error message
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Proceed to the next middleware if all required fields are present and not empty
    next();
}

// Validation middleware for appointment POST and PUT requests
function validateAppointment(req, res, next) {
    const { clinician_id, patient_id, appointment_datetime, appointment_purpose } = req.body;
    const missingFields = [];

    // Check if required fields are present and not empty
    if (!clinician_id || clinician_id.trim() === "") missingFields.push("clinician_id");
    if (!patient_id || patient_id.trim() === "") missingFields.push("patient_id");
    if (!appointment_datetime || appointment_datetime.trim() === "") missingFields.push("appointment_datetime");
    if (!appointment_purpose || appointment_purpose.trim() === "") missingFields.push("appointment_purpose");

    // If any required fields are missing or empty, send a 400 Bad Request response with error message
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Proceed to the next middleware if all required fields are present and not empty
    next();
}

// Validate NPI number format
function validateNpiNumberFormat(npi_number) {
    const npiRegex = /^[0-9]{10}$/;
    return npiRegex.test(npi_number);
}

// Validate NPI number using NPI Registry API
async function validateNpiNumber(clinician) {
    try {
        const npiApiUrl = `https://npiregistry.cms.hhs.gov/api/?number=${clinician.npi_number}&
                        first_name=${clinician.first_name}&last_name=${clinician.last_name}&state=${clinician.state}&version=2.1`;
        const response = await axios.get(npiApiUrl);
        console.log(npiApiUrl);

        if (response.data && response.data.results && response.data.results.length > 0) {
            const registryClinician = response.data.results[0]; // Assuming the first result is the most relevant

            // Check if the retrieved clinician details match the provided clinician
            if (
                registryClinician.basic &&
                registryClinician.basic.first_name === clinician.first_name &&
                registryClinician.basic.last_name === clinician.last_name &&
                registryClinician.addresses &&
                registryClinician.addresses.length > 0 &&
                registryClinician.addresses[0].state === clinician.state
            ) {
                // NPI number and clinician details are valid
                return true;
            } else {
                // Provided clinician details do not match the NPI registry
                return false;
            }
        } else {
            // NPI number is not valid or does not exist in the registry
            return false;
        }
    } catch (error) {
        console.error('Error validating NPI number:', error);
        throw new Error('Error validating NPI number');
    }
}

// Validation middleware for clinician POST and PUT requests
async function validateClinician(clinician) {
    const errors = [];
    // Validate first name
    if (!clinician.first_name || clinician.first_name.trim() === '') {
        errors.push('First name is required');
    }
    // Validate last name
    if (!clinician.last_name || clinician.last_name.trim() === '') {
        errors.push('Last name is required');
    }
    // Validate NPI number format
    if (!clinician.npi_number || !validateNpiNumberFormat(clinician.npi_number)) {
        errors.push('Invalid NPI number format');
    }
    // Validate NPI number using NPI Registry API
    if (!await validateNpiNumber(clinician)) {
        errors.push('Invalid NPI number or Clinician details not found in registry');
    }
    // Validate state
    if (!clinician.state || clinician.state.trim() === '') {
        errors.push('State is required');
    }

    return errors;
}


module.exports = { validatePatient, validateAppointment, validateClinician, validateNpiNumberFormat, validateNpiNumber};
