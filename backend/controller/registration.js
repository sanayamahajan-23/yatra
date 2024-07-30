const { registration } = require("../models/registration")
const s3 = require("../utils/s3")

function generate12DigitNumber() {
    const min = 100000000000;
    const max = 999999999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString();
}

const submitRegistration = async (body, files) => {
    try {
        console.log('Starting submitRegistration function');

        // Function to generate a unique 12-digit registration number
        const generateUniqueRegistrationNumber = async () => {
            let isUnique = false;
            let registration_number;
            while (!isUnique) {
                registration_number = generate12DigitNumber();
                const existing = await registration.findOne({ registration_number });
                if (!existing) {
                    isUnique = true;
                }
            }
            return registration_number;
        };

        const registration_number = await generateUniqueRegistrationNumber();
        console.log('Generated unique registration number:', registration_number);

        // File paths for S3 storage
        let frontPath = `user/${registration_number}/front_${Date.now()}.${files[0].mimetype.split('/')[1]}`;
        let backPath = `user/${registration_number}/back_${Date.now()}.${files[1].mimetype.split('/')[1]}`;
        console.log('Generated file paths:', { frontPath, backPath });

        // Upload files to S3
        await s3.uploadToS3(frontPath, files[0].path, { contentType: files[0].mimetype });
        await s3.uploadToS3(backPath, files[1].path, { contentType: files[1].mimetype });
        console.log('Uploaded files to S3');

        // Update body with file paths
        body.aadhar_front = frontPath;
        body.aadhar_back = backPath;
        console.log('Updated body with aadhar_front and aadhar_back:', body);

        // Parse additionalPersons if it is a string
        if (typeof body.additionalPersons === 'string') {
            try {
                body.additionalPersons = JSON.parse(body.additionalPersons);
                console.log('Parsed additionalPersons:', body.additionalPersons);
            } catch (e) {
                console.error('Invalid JSON format for additionalPersons');
                throw new Error('Invalid JSON format for additionalPersons');
            }
        }

        // Check if additionalPersons is an array
        if (Array.isArray(body.additionalPersons) && body.additionalPersons.length > 0) {
            const mainRegistrationNumberLastDigit = parseInt(registration_number.slice(-1));
            let additional_persons_data = body.additionalPersons.map((person, index) => {
                // Calculate new registration number for each additional person
                const newLastDigit = (mainRegistrationNumberLastDigit + index + 1) % 10;
                const baseRegistrationNumber = registration_number.slice(0, -1);
                const newRegistrationNumber = baseRegistrationNumber + newLastDigit;

                return {
                    name: person.name,
                    registration_number: newRegistrationNumber
                };
            });
            console.log('Generated additional_persons_data:', additional_persons_data);
            body.additional_persons_data = additional_persons_data;
        } else {
            console.log('No additional persons found in the array or array is empty.');
            body.additional_persons_data = [];
        }

        // Save new registration to the database
        const newRegistration = new registration(body);
        newRegistration.registration_number = registration_number;
        await newRegistration.save();
        console.log('Saved new registration to database');

        return registration_number;
    } catch (error) {
        console.error('Error in submitRegistration function:', error.stack);
        throw new Error(error.message || error);
    }
};

const fetchRegistration = async (registration_number) => {
    try {
        const data = await registration.findOne({ registration_number: Number(registration_number) }).lean();
        if (data) {
            let frontPath = data.aadhar_front;
            let backPath = data.aadhar_back;

            data.aadhar_front = await s3.getFilePath(frontPath);
            data.aadhar_back = await s3.getFilePath(backPath);

            // Ensure additional_persons_data is populated correctly
            if (Array.isArray(data.additional_persons_data)) {
                data.additional_persons_data = data.additional_persons_data.map(person => ({
                    name: person.name,
                    registration_number: person.registration_number
                }));
            } else {
                data.additional_persons_data = [];
            }

            // Create a result object with the main person and additional persons
            const result = {
                main_person: {
                    name: data.name,
                    registration_number: data.registration_number
                },
                additional_persons: data.additional_persons_data
            };
            console.log(`Name: ${result.main_person.name}`);
            console.log(`Registration Number: ${result.main_person.registration_number}`);
            console.log('Additional Persons:');
            result.additional_persons.forEach(person => {
                console.log(`Name: ${person.name}`);
                console.log(`Registration Number: ${person.registration_number}`);
            });

            return result;
        } else {
            throw new Error('No registration data found');
        }
    } catch (error) {
        throw new Error(error.message || error);
    }
};


module.exports = {
    submitRegistration,
    fetchRegistration
}