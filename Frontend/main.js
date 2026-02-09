document.addEventListener('DOMContentLoaded', () => {

    console.log("Main JS Loaded 🚀");

    // ===============================
    // INIT LOGIN PAGE
    // ===============================
    initLogin();

    // ===============================
    // INIT SIGNUP PAGE
    // ===============================
    initSignup();

    // ===============================
    // GLOBAL ENHANCEMENTS
    // ===============================
    initGlobalFeatures();
});


// =====================================================
// LOGIN FUNCTIONALITY
// =====================================================
function initLogin() {

    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return; // Only run on login page

    const togglePasswordBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    const loginBtn = document.querySelector('.login-btn');
    const btnText = loginBtn?.querySelector('span');
    const googleBtn = document.querySelector('.google-btn');
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');

    // Password toggle
    if (togglePasswordBtn && passwordInput && eyeIcon) {
        togglePasswordBtn.addEventListener('click', () => {
            const hidden = passwordInput.type === 'password';
            passwordInput.type = hidden ? 'text' : 'password';
            eyeIcon.setAttribute('name', hidden ? 'eye-off-outline' : 'eye-outline');
        });
    }

    // Form submission
    if (loginBtn && btnText) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email')?.value;
            const password = passwordInput?.value;

            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }

            const originalText = btnText.textContent;
            btnText.textContent = 'Signing In...';
            loginBtn.disabled = true;
            loginBtn.style.opacity = '0.7';

            setTimeout(() => {
                alert('Login successful! (Demo)');
                btnText.textContent = originalText;
                loginBtn.disabled = false;
                loginBtn.style.opacity = '1';
            }, 1500);
        });
    }

    // Google sign in
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            alert('Redirecting to Google Sign-In... (Demo)');
        });
    }

    // Input focus effects
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const group = input.closest('.input-group');
            if (group) group.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            const group = input.closest('.input-group');
            if (group) group.classList.remove('focused');
        });
    });
}



// =====================================================
// SIGNUP FUNCTIONALITY
// =====================================================
function initSignup() {

    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return; // Only run on signup page

    let currentStep = 1;

    const nextToStep2Btn = document.getElementById('nextToStep2');
    const backToStep1Btn = document.getElementById('backToStep1');

    if (nextToStep2Btn) {
        nextToStep2Btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (validateStep1()) goToStep(2);
        });
    }

    if (backToStep1Btn) {
        backToStep1Btn.addEventListener('click', (e) => {
            e.preventDefault();
            goToStep(1);
        });
    }

    function goToStep(step) {
        document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
        const target = document.getElementById(`step${step}`);
        if (target) target.classList.add('active');

        document.querySelectorAll('.progress-step').forEach(p => {
            const stepNum = parseInt(p.getAttribute('data-step'));
            p.classList.toggle('active', stepNum === step);
        });

        currentStep = step;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ==========================
    // VALIDATION HELPERS
    // ==========================
    const showError = (id, message) => {
        const field = document.getElementById(id);
        const errorEl = document.getElementById(id + 'Error');
        if (field) field.classList.add('error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
    };

    const clearError = (id) => {
        const field = document.getElementById(id);
        const errorEl = document.getElementById(id + 'Error');
        if (field) field.classList.remove('error');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }
    };

    const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = phone => phone.replace(/\D/g, '').length >= 10;
    const validatePassword = pwd => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);

    function validateStep1() {
        let valid = true;

        const fullName = document.getElementById('fullName')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const password = document.getElementById('password')?.value;
        const confirm = document.getElementById('confirmPassword')?.value;

        ['fullName','email','phone','password','confirmPassword'].forEach(clearError);

        if (!fullName || fullName.length < 2) { showError('fullName','Enter valid name'); valid=false; }
        if (!email || !validateEmail(email)) { showError('email','Enter valid email'); valid=false; }
        if (!phone || !validatePhone(phone)) { showError('phone','Enter valid phone'); valid=false; }
        if (!password || !validatePassword(password)) { showError('password','Weak password'); valid=false; }
        if (!confirm || confirm !== password) { showError('confirmPassword','Passwords do not match'); valid=false; }

        return valid;
    }

    function validateStep2() {
        let valid = true;
        const requiredFields = ['villageName','plotName','plotSize','soilType','cropType','irrigationMethod','waterAvailability','fertilizerUsage'];

        requiredFields.forEach(id => {
            clearError(id);
            const value = document.getElementById(id)?.value.trim();
            if (!value) {
                showError(id,'This field is required');
                valid = false;
            }
        });

        return valid;
    }

    // Form submit
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setSubmitButtonLoading(true);

        setTimeout(() => {
            setSubmitButtonLoading(false);
            showSuccessModal();
        }, 1500);
    });

    // Success modal
    function showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) modal.classList.add('active');
    }
}



// =====================================================
// GLOBAL FEATURES
// =====================================================
function initGlobalFeatures() {

    // Spinner animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        .animate-spin { animation: spin 1s linear infinite; }
    `;
    document.head.appendChild(style);

    // Footer year auto update
    const footerTextEl = document.querySelector('.footer-text');
    if (footerTextEl) {
        footerTextEl.textContent =
            footerTextEl.textContent.replace(/\b\d{4}\b/, new Date().getFullYear());
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}



// =====================================================
// SUBMIT BUTTON LOADING STATE
// =====================================================
function setSubmitButtonLoading(isLoading) {
    const btn = document.getElementById('submitBtn');
    if (!btn) return;

    if (isLoading) {
        btn.disabled = true;
        btn.innerHTML = 'Creating Account...';
    } else {
        btn.disabled = false;
        btn.innerHTML = 'Create Account';
    }
}
