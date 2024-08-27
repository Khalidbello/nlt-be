"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
class ErrorMessage {
    constructor(message, timestamp) {
        this.message = message;
        this.timestamp = timestamp;
    }
}
function storeErrorMessage(message) {
    const filename = 'errors.json';
    // Get the current date and format it nicely
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    // Create an ErrorMessage object
    const errorMessage = new ErrorMessage(message, today);
    // Read existing errors (or create an empty array if file doesn't exist)
    let errors = [];
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        errors = JSON.parse(data) || [];
    }
    catch (error) {
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
    }
    catch (error) {
        console.error("Error writing error file:", error);
    }
}
// Example usage
exports.default = storeErrorMessage;
//# sourceMappingURL=error-recorder.js.map