import * as fs from 'fs';

class ErrorMessage {
    constructor(public message: string, public timestamp: string) { }
}

function storeErrorMessage(message: any): void {
    const filename: string = 'errors.json'
    // Get the current date and format it nicely
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Create an ErrorMessage object
    const errorMessage = new ErrorMessage(message, today);

    // Read existing errors (or create an empty array if file doesn't exist)
    let errors: ErrorMessage[] = [];
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        errors = JSON.parse(data) || [];
    } catch (error: any) {
        // Ignore error if file doesn't exist, otherwise handle it
        if (error.code !== 'ENOENT') {
            console.error("Error reading error file:", error);
        }
    }

    // Add the new error message
    errors.push(errorMessage);

    // Write the updated errors array to the JSON file
    try {
        fs.writeFileSync(filename, JSON.stringify(errors, null, 2));
    } catch (error) {
        console.error("Error writing error file:", error);
    }
}

// Example usage
export default storeErrorMessage;
