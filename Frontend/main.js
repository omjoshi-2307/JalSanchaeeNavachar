<!-- Firebase SDK -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCowDfSEJJ2pCYrzIxKmhtkwVjJtXiAMkQ",
  authDomain: "agriculture-9ea45.firebaseapp.com",
  projectId: "agriculture-9ea45",
  storageBucket: "agriculture-9ea45.firebasestorage.app",
  messagingSenderId: "276579410211",
  appId: "1:276579410211:web:69b4379b6d8f65575aec96"
};

  const app = initializeApp(firebaseConfig);
  window.auth = getAuth(app);
</script>



















// ===============================
// MAIN JS WITH FIREBASE AUTH
// ===============================

document.addEventListener('DOMContentLoaded', () => {
    console.log("Main JS Loaded 🚀");

    initPasswordToggles();
    initLogin();
    initSignup();
    initGlobalFeatures();
});

// =====================================================
// UNIVERSAL PASSWORD TOGGLE
// =====================================================
function initPasswordToggles() {
    const toggles = document.querySelectorAll('.password-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;

            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';

            // Eye icon opacity
            const svg = toggle.querySelector('.eye-icon');
            if (svg) svg.style.opacity = isHidden ? "0.6" : "1";

            // Ion-icon switch
            const ionIcon = toggle.querySelector('ion-icon');
            if (ionIcon) {
                ionIcon.setAttribute('name', isHidden ? 'eye-outline' : 'eye-off-outline');
            }
        });
    });
}

// =====================================================
// FIREBASE AUTH MODULES (Shared)
// =====================================================
let authModule = null;
async function getAuthModule() {
    if (!authModule) {
        const mod = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
        authModule = mod;
    }
    return authModule;
}

// =====================================================
// LOGIN FUNCTIONALITY
// =====================================================
async function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    const loginBtn = document.querySelector('.login-btn');
    const googleBtn = document.querySelector('.google-btn');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email')?.value.trim();
        const password = document.getElementById('password')?.value;

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        if (!loginBtn) return;
        const btnText = loginBtn.querySelector('span');

        try {
            loginBtn.disabled = true;
            if (btnText) btnText.textContent = 'Signing In...';
            else loginBtn.textContent = 'Signing In...';

            const { signInWithEmailAndPassword } = await getAuthModule();
            await signInWithEmailAndPassword(window.auth, email, password);

            alert("Login Successful 🎉");
            window.location.href = "dashboard.html";

        } catch (error) {
            alert(error.message);
        } finally {
            if (btnText) btnText.textContent = 'Sign In';
            else loginBtn.textContent = 'Sign In';
            loginBtn.disabled = false;
        }
    });

    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                const { GoogleAuthProvider, signInWithPopup } = await getAuthModule();
                const provider = new GoogleAuthProvider();
                await signInWithPopup(window.auth, provider);

                alert("Google Login Successful 🎉");
                window.location.href = "dashboard.html";
            } catch (error) {
                alert(error.message);
            }
        });
    }
}

// =====================================================
// SIGNUP FUNCTIONALITY
// =====================================================
async function initSignup() {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email')?.value.trim();
        const password = document.getElementById('password')?.value;

        if (!email || !password) {
            alert("Fill all required fields");
            return;
        }

        setSubmitButtonLoading(true);

        try {
            const { createUserWithEmailAndPassword } = await getAuthModule();
            await createUserWithEmailAndPassword(window.auth, email, password);

            alert("Account Created Successfully 🎉");
            window.location.href = "login.html";

        } catch (error) {
            alert(error.message);
        } finally {
            setSubmitButtonLoading(false);
        }
    });
}

// =====================================================
// GLOBAL FEATURES
// =====================================================
function initGlobalFeatures() {
    const footerTextEl = document.querySelector('.footer-text');
    if (footerTextEl) {
        footerTextEl.textContent =
            footerTextEl.textContent.replace(/\b\d{4}\b/, new Date().getFullYear());
    }
}

// =====================================================
// SUBMIT BUTTON LOADING
// =====================================================
function setSubmitButtonLoading(isLoading) {
    const btn = document.getElementById('submitBtn');
    if (!btn) return;

    btn.disabled = isLoading;
    btn.innerHTML = isLoading ? 'Creating Account...' : 'Create Account';
}
