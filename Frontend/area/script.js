// Conversion constant
const ACRES_TO_SQFT = 43560;

// Flag to prevent infinite loop when updating fields
let isUpdating = false;

/**
 * Convert from Acres to Square Feet
 * When user types in Acres field, update Square Feet field
 */
function convertFromAcres() {
    if (isUpdating) return;
    
    const acresInput = document.getElementById('acresInput');
    const sqftInput = document.getElementById('sqftInput');
    const value = parseFloat(acresInput.value);
    
    // Validate acres input
    if (acresInput.value === '') {
        // Input is empty - clear the other field
        hideError('acresError');
        acresInput.classList.remove('valid', 'error');
        isUpdating = true;
        sqftInput.value = '';
        sqftInput.classList.remove('valid', 'error');
        hideError('sqftError');
        isUpdating = false;
        return;
    }
    
    if (isNaN(value) || value < 0) {
        // Invalid input - show error
        showError('acresError');
        acresInput.classList.add('error');
        acresInput.classList.remove('valid');
        isUpdating = true;
        sqftInput.value = '';
        sqftInput.classList.remove('valid', 'error');
        hideError('sqftError');
        isUpdating = false;
        return;
    }
    
    // Valid input - hide error and show valid state
    hideError('acresError');
    acresInput.classList.add('valid');
    acresInput.classList.remove('error');
    
    // Convert Acres to Square Feet
    const convertedValue = value * ACRES_TO_SQFT;
    
    // Update Square Feet field
    isUpdating = true;
    sqftInput.value = convertedValue.toFixed(0);
    sqftInput.classList.add('valid');
    sqftInput.classList.remove('error');
    hideError('sqftError');
    isUpdating = false;
}

/**
 * Convert from Square Feet to Acres
 * When user types in Square Feet field, update Acres field
 */
function convertFromSqft() {
    if (isUpdating) return;
    
    const sqftInput = document.getElementById('sqftInput');
    const acresInput = document.getElementById('acresInput');
    const value = parseFloat(sqftInput.value);
    
    // Validate square feet input
    if (sqftInput.value === '') {
        // Input is empty - clear the other field
        hideError('sqftError');
        sqftInput.classList.remove('valid', 'error');
        isUpdating = true;
        acresInput.value = '';
        acresInput.classList.remove('valid', 'error');
        hideError('acresError');
        isUpdating = false;
        return;
    }
    
    if (isNaN(value) || value < 0) {
        // Invalid input - show error
        showError('sqftError');
        sqftInput.classList.add('error');
        sqftInput.classList.remove('valid');
        isUpdating = true;
        acresInput.value = '';
        acresInput.classList.remove('valid', 'error');
        hideError('acresError');
        isUpdating = false;
        return;
    }
    
    // Valid input - hide error and show valid state
    hideError('sqftError');
    sqftInput.classList.add('valid');
    sqftInput.classList.remove('error');
    
    // Convert Square Feet to Acres
    const convertedValue = value / ACRES_TO_SQFT;
    
    // Update Acres field (show up to 4 decimal places for precision)
    isUpdating = true;
    acresInput.value = convertedValue.toFixed(4);
    acresInput.classList.add('valid');
    acresInput.classList.remove('error');
    hideError('acresError');
    isUpdating = false;
}

/**
 * Show error message for a specific field
 * @param {string} errorId - The ID of the error message element
 */
function showError(errorId) {
    document.getElementById(errorId).classList.add('show');
}

/**
 * Hide error message for a specific field
 * @param {string} errorId - The ID of the error message element
 */
function hideError(errorId) {
    document.getElementById(errorId).classList.remove('show');
}

/**
 * Initialize event listeners when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get input elements
    const acresInput = document.getElementById('acresInput');
    const sqftInput = document.getElementById('sqftInput');
    
    // Add input event listeners for real-time conversion
    acresInput.addEventListener('input', convertFromAcres);
    sqftInput.addEventListener('input', convertFromSqft);
    
    // Prevent negative values and 'e' from being entered using keyboard
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('keydown', function(e) {
            // Prevent minus sign and 'e' (scientific notation)
            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
            }
        });
    });
});
