document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // ELEMENT SELECTIONS
    // ========================================
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.login-btn');
    const btnText = loginBtn?.querySelector('span');
    const googleBtn = document.querySelector('.google-btn');
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');

    // ========================================
    // PASSWORD VISIBILITY TOGGLE
    // ========================================
    if (togglePasswordBtn && passwordInput && eyeIcon) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPasswordHidden = passwordInput.type === 'password';

            // Toggle input type
            passwordInput.type = isPasswordHidden ? 'text' : 'password';

            // Toggle icon
            eyeIcon.setAttribute('name', isPasswordHidden ? 'eye-off-outline' : 'eye-outline');

            // Update accessibility attributes
            togglePasswordBtn.setAttribute('aria-label', isPasswordHidden ? 'Hide password' : 'Show password');
            togglePasswordBtn.setAttribute('aria-pressed', String(isPasswordHidden));
        });
    }

    // ========================================
    // FORM SUBMISSION HANDLING
    // ========================================
    if (loginForm && loginBtn && btnText) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const emailInput = document.getElementById('email');
            const email = emailInput?.value;
            const password = passwordInput?.value;
            // Validate form (basic check)
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }

            // Show loading state
            const originalText = btnText.textContent;
            btnText.textContent = 'Signing In...';
            loginBtn.disabled = true;
            loginBtn.style.opacity = '0.7';
            loginBtn.style.cursor = 'not-allowed';

            // Simulate API call
            setTimeout(() => {
                alert('Login successful! (Demo Only)');

                // Reset button state
                btnText.textContent = originalText;
                loginBtn.disabled = false;
                loginBtn.style.opacity = '1';
                loginBtn.style.cursor = 'pointer';

                // Optional: Reset form
                // loginForm.reset();
            }, 1500);
        });
    }

    // ========================================
    // GOOGLE SIGN-IN BUTTON
    // ========================================
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            alert('Redirecting to Google Sign-In... (Demo Only)\n\nTo implement real Google Sign-In, use Google OAuth 2.0');
            // In production: window.location.href = '/auth/google';
        });
    }

    // ========================================
    // INPUT FOCUS EFFECTS (Optional Enhancement)
    // ========================================
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const inputGroup = input.closest('.input-group');
            if (inputGroup) {
                inputGroup.classList.add('focused');
            }
        });

        input.addEventListener('blur', () => {
            const inputGroup = input.closest('.input-group');
            if (inputGroup) {
                inputGroup.classList.remove('focused');
            }
        });
    });
});