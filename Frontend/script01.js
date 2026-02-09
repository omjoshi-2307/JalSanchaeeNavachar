// ===================================
// Multi-Step Form Navigation
// ===================================

let currentStep = 1;

// Navigation event listeners (guarded)
const nextToStep2Btn = document.getElementById('nextToStep2');
if (nextToStep2Btn) {
    nextToStep2Btn.addEventListener('click', function(e) {
        e.preventDefault();
        if (typeof validateStep1 === 'function' && validateStep1()) {
            goToStep(2);
        }
    });
}

const backToStep1Btn = document.getElementById('backToStep1');
if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', function(e) {
        e.preventDefault();
        goToStep(1);
    });
}

function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });

    // Show target step if it exists
    const targetStepEl = document.getElementById(`step${step}`);
    if (targetStepEl) targetStepEl.classList.add('active');

    // Update progress indicator
    document.querySelectorAll('.progress-step').forEach(progressStep => {
        const stepNum = parseInt(progressStep.getAttribute('data-step'));
        if (stepNum === step) {
            progressStep.classList.add('active');
        } else {
            progressStep.classList.remove('active');
        }
    });

    currentStep = step;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// Password Toggle Functionality
// ===================================

document.querySelectorAll('.password-toggle').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const passwordInput = document.getElementById(targetId);
        if (!passwordInput) return;

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.innerHTML = `
                <svg class="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        } else {
            passwordInput.type = 'password';
            this.innerHTML = `
                <svg class="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
            `;
        }
    });
});

// ===================================
// Profile Picture Preview
// ===================================

const profilePictureInput = document.getElementById('profilePicture');
if (profilePictureInput) {
    profilePictureInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const profilePreview = document.getElementById('profilePreview');
        if (file && profilePreview) {
            const reader = new FileReader();
            reader.onload = function(event) {
                profilePreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// ===================================
// Optional Section Toggle
// ===================================

const toggleOptionalBtn = document.getElementById('toggleOptional');
if (toggleOptionalBtn) {
    toggleOptionalBtn.addEventListener('click', function() {
        const optionalContent = document.getElementById('optionalContent');
        this.classList.toggle('active');
        if (optionalContent) optionalContent.classList.toggle('expanded');
    });
}

// ===================================
// Form Validation Functions
// ===================================

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    if (field) field.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    if (field) field.classList.remove('error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10;
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

// ===================================
// Step 1 Validation
// ===================================

function validateStep1() {
    let isValid = true;

    clearError('fullName');
    clearError('email');
    clearError('phone');
    clearError('password');
    clearError('confirmPassword');

    const fullNameEl = document.getElementById('fullName');
    const fullName = fullNameEl ? fullNameEl.value.trim() : '';
    if (fullName === '') {
        showError('fullName', 'Full name is required');
        isValid = false;
    } else if (fullName.length < 2) {
        showError('fullName', 'Please enter a valid full name');
        isValid = false;
    }

    const emailEl = document.getElementById('email');
    const email = emailEl ? emailEl.value.trim() : '';
    if (email === '') {
        showError('email', 'Email address is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    const phoneEl = document.getElementById('phone');
    const phone = phoneEl ? phoneEl.value.trim() : '';
    if (phone === '') {
        showError('phone', 'Phone number is required');
        isValid = false;
    } else if (!validatePhone(phone)) {
        showError('phone', 'Please enter a valid phone number (at least 10 digits)');
        isValid = false;
    }

    const passwordEl = document.getElementById('password');
    const password = passwordEl ? passwordEl.value : '';
    if (password === '') {
        showError('password', 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError('password', 'Password must be at least 8 characters with uppercase, lowercase, and number');
        isValid = false;
    }

    const confirmEl = document.getElementById('confirmPassword');
    const confirmPassword = confirmEl ? confirmEl.value : '';
    if (confirmPassword === '') {
        showError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }

    return isValid;
}

// ===================================
// Step 2 Validation
// ===================================

function validateStep2() {
    let isValid = true;

    ['villageName','plotName','plotSize','soilType','cropType','irrigationMethod','waterAvailability','fertilizerUsage'].forEach(id => clearError(id));

    const villageNameEl = document.getElementById('villageName');
    const villageName = villageNameEl ? villageNameEl.value.trim() : '';
    if (villageName === '') { showError('villageName', 'Village name is required'); isValid = false; }

    const plotNameEl = document.getElementById('plotName');
    const plotName = plotNameEl ? plotNameEl.value.trim() : '';
    if (plotName === '') { showError('plotName', 'Plot name/ID is required'); isValid = false; }

    const plotSizeEl = document.getElementById('plotSize');
    const plotSize = plotSizeEl ? plotSizeEl.value.trim() : '';
    if (plotSize === '') { showError('plotSize', 'Plot size is required'); isValid = false; }
    else if (parseFloat(plotSize) <= 0) { showError('plotSize', 'Plot size must be greater than 0'); isValid = false; }

    const soilTypeEl = document.getElementById('soilType');
    const soilType = soilTypeEl ? soilTypeEl.value : '';
    if (soilType === '') { showError('soilType', 'Please select a soil type'); isValid = false; }

    const cropTypeEl = document.getElementById('cropType');
    const cropType = cropTypeEl ? cropTypeEl.value.trim() : '';
    if (cropType === '') { showError('cropType', 'Crop type and variety is required'); isValid = false; }

    const irrigationMethodEl = document.getElementById('irrigationMethod');
    const irrigationMethod = irrigationMethodEl ? irrigationMethodEl.value : '';
    if (irrigationMethod === '') { showError('irrigationMethod', 'Please select an irrigation method'); isValid = false; }

    const waterAvailabilityEl = document.getElementById('waterAvailability');
    const waterAvailability = waterAvailabilityEl ? waterAvailabilityEl.value : '';
    if (waterAvailability === '') { showError('waterAvailability', 'Please select water availability'); isValid = false; }

    const fertilizerUsageEl = document.getElementById('fertilizerUsage');
    const fertilizerUsage = fertilizerUsageEl ? fertilizerUsageEl.value : '';
    if (fertilizerUsage === '') { showError('fertilizerUsage', 'Please select fertilizer usage type'); isValid = false; }

    return isValid;
}

// ===================================
// Real-time Validation
// ===================================

const step1Fields = ['fullName','email','phone','password','confirmPassword'];
step1Fields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            clearError(fieldId);
            if (fieldId === 'email' && !validateEmail(this.value.trim())) {
                showError(fieldId, 'Please enter a valid email address');
            } else if (fieldId === 'phone' && !validatePhone(this.value.trim())) {
                showError(fieldId, 'Please enter a valid phone number');
            } else if (fieldId === 'password' && !validatePassword(this.value)) {
                showError(fieldId, 'Password must be at least 8 characters with uppercase, lowercase, and number');
            } else if (fieldId === 'confirmPassword') {
                const pwd = document.getElementById('password');
                if (pwd && this.value !== pwd.value) showError(fieldId, 'Passwords do not match');
            }
        }
    });

    field.addEventListener('input', function() {
        if (field.classList.contains('error')) clearError(fieldId);
    });
});

const step2Fields = ['villageName','plotName','plotSize','soilType','cropType','irrigationMethod','waterAvailability','fertilizerUsage'];
step2Fields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.addEventListener('blur', function() { if (this.value.trim() !== '') clearError(fieldId); });
    field.addEventListener('input', function() { if (field.classList.contains('error')) clearError(fieldId); });
});

// ===================================
// Form Submission
// ===================================

const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (typeof validateStep2 === 'function' && validateStep2()) {
            const filesEl = document.getElementById('profilePicture');
            const formData = {
                fullName: (document.getElementById('fullName') ? document.getElementById('fullName').value.trim() : ''),
                email: (document.getElementById('email') ? document.getElementById('email').value.trim() : ''),
                phone: (document.getElementById('phone') ? document.getElementById('phone').value.trim() : ''),
                password: (document.getElementById('password') ? document.getElementById('password').value : ''),
                profilePicture: (filesEl && filesEl.files ? filesEl.files[0] : null),
                villageName: (document.getElementById('villageName') ? document.getElementById('villageName').value.trim() : ''),
                plotName: (document.getElementById('plotName') ? document.getElementById('plotName').value.trim() : ''),
                plotSize: (document.getElementById('plotSize') ? document.getElementById('plotSize').value.trim() : ''),
                plotSizeUnit: (document.getElementById('plotSizeUnit') ? document.getElementById('plotSizeUnit').value : ''),
                soilType: (document.getElementById('soilType') ? document.getElementById('soilType').value : ''),
                cropType: (document.getElementById('cropType') ? document.getElementById('cropType').value.trim() : ''),
                irrigationMethod: (document.getElementById('irrigationMethod') ? document.getElementById('irrigationMethod').value : ''),
                waterAvailability: (document.getElementById('waterAvailability') ? document.getElementById('waterAvailability').value : ''),
                fertilizerUsage: (document.getElementById('fertilizerUsage') ? document.getElementById('fertilizerUsage').value : ''),
                lastHarvested: (document.getElementById('lastHarvested') ? document.getElementById('lastHarvested').value.trim() : null),
                expectedYield: (document.getElementById('expectedYield') ? document.getElementById('expectedYield').value.trim() : null)
            };

            console.log('Form submitted for:', formData.email);
            showSuccessModal();
        }
    });
}

// ===================================
// Success Modal
// ===================================

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('active');

    const formEl = document.getElementById('signupForm');
    if (formEl) formEl.reset();

    try { goToStep(1); } catch (e) {}

    const profilePreviewEl = document.getElementById('profilePreview');
    if (profilePreviewEl) profilePreviewEl.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230284c7' stroke-width='2'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
}

// Close modal on background click (guarded)
const successModalEl = document.getElementById('successModal');
if (successModalEl) {
    successModalEl.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
}

// ===================================
// Phone Number Formatting (Optional Enhancement)
// ===================================

const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) { value = value; }
            else if (value.length <= 6) { value = `(${value.slice(0,3)}) ${value.slice(3)}`; }
            else if (value.length <= 10) { value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6)}`; }
            else { value = `+${value.slice(0,1)} (${value.slice(1,4)}) ${value.slice(4,7)}-${value.slice(7,11)}`; }
        }
        e.target.value = value;
    });
}

// ===================================
// Smooth Scroll Enhancement
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===================================
// Loading State for Submit Button
// ===================================

function setSubmitButtonLoading(isLoading) {
    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) return;

    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="btn-icon-left animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
            </svg>
            Creating Account...
        `;
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <svg class="btn-icon-left" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Create Account
        `;
    }
}

// Add CSS for spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .animate-spin { animation: spin 1s linear infinite; }
`;
document.head.appendChild(style);

// ===================================
// Keyboard Navigation Enhancement
// ===================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('successModal');
        if (modal && modal.classList.contains('active')) closeModal();
    }
});

// ===================================
// Form Auto-save to LocalStorage (Optional)
// ===================================

function saveFormData() {
    const getVal = id => (document.getElementById(id) ? document.getElementById(id).value : '');
    const formData = {
        fullName: getVal('fullName'),
        email: getVal('email'),
        phone: getVal('phone'),
        villageName: getVal('villageName'),
        plotName: getVal('plotName'),
        plotSize: getVal('plotSize'),
        plotSizeUnit: getVal('plotSizeUnit'),
        soilType: getVal('soilType'),
        cropType: getVal('cropType'),
        irrigationMethod: getVal('irrigationMethod'),
        waterAvailability: getVal('waterAvailability'),
        fertilizerUsage: getVal('fertilizerUsage'),
        lastHarvested: getVal('lastHarvested'),
        expectedYield: getVal('expectedYield')
    };
    localStorage.setItem('farmhub_signup_draft', JSON.stringify(formData));
}

function loadFormData() {
    const savedData = localStorage.getItem('farmhub_signup_draft');
    if (savedData) {
        try {
            const formData = JSON.parse(savedData);
            Object.keys(formData).forEach(key => {
                const element = document.getElementById(key);
                if (element && formData[key] !== undefined && formData[key] !== null) element.value = formData[key];
            });
        } catch (e) {
            console.error('Error loading saved form data:', e);
        }
    }
}

// Uncomment to enable auto-save feature
// loadFormData();
// if (document.getElementById('signupForm')) document.getElementById('signupForm').addEventListener('input', saveFormData);

// Update footer year dynamically (keeps displayed year current)
const footerTextEl = document.querySelector('.footer-text');
if (footerTextEl) {
    footerTextEl.textContent = footerTextEl.textContent.replace(/\b\d{4}\b/, new Date().getFullYear());
}

console.log('FarmHub Signup Form initialized successfully! 🌾');