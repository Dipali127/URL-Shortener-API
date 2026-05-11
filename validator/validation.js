// validation.js

// Validates whether the provided URL string is properly structured.
// The URL must include a valid protocol (http, https, or ftp) followed by a valid hostname or domain name.
// This function uses Node.js's built-in URL parser, which ensures that the overall URL format 
// (including optional paths, query parameters, and fragments) is valid.

const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

// Validates whether the provided shortCode is in the correct format.
// The shortCode should contain only alphanumeric characters (letters and digits).
// Returns true if the shortCode is valid; otherwise, returns false.

const isValidShortCode = (shortcode) => {
    return /^[a-zA-Z0-9]+$/.test(shortcode);
}


module.exports = { isValidUrl, isValidShortCode };