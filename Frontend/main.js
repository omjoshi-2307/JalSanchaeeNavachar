// ===============================
// MAIN JS WITH UNIVERSAL FEATURES & FIREBASE
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    console.log("Main JS Loaded 🚀");
    initFirebase(); // Initialize Firebase
    initPasswordToggles(); // Setup password toggles
    initFooterYear(); // Update footer year dynamically
    initLoginForm(); // Setup login form
    initSignupForm(); // Setup signup form
    checkAuthState(); // Check authentication state
});

// =====================================================
// 🔹 FIREBASE INITIALIZATION
// =====================================================
let db = null; // Firestore reference
let auth = null; // Auth reference

function initFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyCowDfSEJJ2pCYrzIxKmhtkwVjJtXiAMkQ",
        authDomain: "agriculture-9ea45.firebaseapp.com",
        projectId: "agriculture-9ea45",
        storageBucket: "agriculture-9ea45.firebasestorage.app",
        messagingSenderId: "276579410211",
        appId: "1:276579410211:web:69b4379b6d8f65575aec96"
    };

    import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js").then(({ initializeApp }) => {
        const app = initializeApp(firebaseConfig);
        console.log("Firebase Initialized ✅");

        // Initialize Firestore
        import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js").then(({ getFirestore }) => {
            db = getFirestore(app);
            window.db = db; // make globally available
        });

        // Initialize Auth
        import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js").then(({ getAuth }) => {
            auth = getAuth(app);
            window.auth = auth; // make globally available
            setupAuthStateListener(); // Listen to auth changes
        });
    });
}

// =====================================================
// 🔹 AUTHENTICATION STATE MANAGEMENT
// =====================================================

// Define which pages require authentication
const protectedPages = ['dashboard.html', 'profile.html', 'settings.html'];
const authPages = ['login.html', 'signup.html', 'register.html'];

// Flag to prevent multiple simultaneous redirects
let authCheckInProgress = false;

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page;
}

function checkAuthState() {
    // This will be called on page load
    // The actual redirect will happen in setupAuthStateListener
}

function setupAuthStateListener() {
    if (!auth) return;

    import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js").then(({ onAuthStateChanged }) => {
        onAuthStateChanged(auth, async (user) => {
            // Prevent concurrent auth checks
            if (authCheckInProgress) return;
            authCheckInProgress = true;

            const currentPage = getCurrentPage();
            
            if (user) {
                // User is signed in
                console.log("User logged in:", user.email);
                console.log("Email verified:", user.emailVerified);
                
                // Store user info globally
                window.currentUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified
                };

                // Check email verification for protected pages
                if (protectedPages.includes(currentPage)) {
                    if (!user.emailVerified) {
                        showVerificationMessage();
                        authCheckInProgress = false;
                        return;
                    }
                    
                    // Update last login time in Firestore
                    updateUserLoginTime(user.uid);
                }

                // Update UI for logged-in users
                updateUIForLoggedInUser(user);
                
            } else {
                // User is signed out
                console.log("No user logged in");
                window.currentUser = null;

                // If on protected pages, redirect to login
                if (protectedPages.includes(currentPage)) {
                    window.location.href = 'login.html';
                    return;
                }

                // Update UI for logged-out users
                updateUIForLoggedOutUser();
            }

            authCheckInProgress = false;
        });
    });
}

// Update user's last login time
async function updateUserLoginTime(uid) {
    if (!window.db) return;
    
    try {
        const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        await updateDoc(doc(window.db, 'users', uid), {
            emailVerified: true,
            lastLogin: new Date()
        });
    } catch (error) {
        console.log("Error updating login time:", error);
    }
}

// Show verification message with option to resend
function showVerificationMessage() {
    const verificationDiv = document.createElement('div');
    verificationDiv.id = 'verificationMessage';
    verificationDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #fff3cd;
        border-bottom: 3px solid #ffc107;
        padding: 20px;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;
    verificationDiv.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <h3 style="margin: 0 0 10px 0; color: #856404;">📧 Email Verification Required</h3>
            <p style="margin: 0 0 15px 0; color: #856404;">
                Please verify your email address to access this page. 
                Check your inbox for the verification link.
            </p>
            <button id="resendVerificationBtn" style="
                background: #28a745;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-right: 10px;
                font-size: 14px;
            ">Resend Verification Email</button>
            <button id="checkVerificationBtn" style="
                background: #007bff;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-right: 10px;
                font-size: 14px;
            ">I've Verified - Check Now</button>
            <button id="logoutVerificationBtn" style="
                background: #dc3545;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            ">Logout</button>
        </div>
    `;
    
    document.body.insertBefore(verificationDiv, document.body.firstChild);
    
    // Add event listeners
    document.getElementById('resendVerificationBtn').addEventListener('click', resendVerificationEmail);
    document.getElementById('checkVerificationBtn').addEventListener('click', checkEmailVerification);
    document.getElementById('logoutVerificationBtn').addEventListener('click', handleLogout);
}

// Resend verification email
async function resendVerificationEmail() {
    const btn = document.getElementById('resendVerificationBtn');
    const originalText = btn.textContent;
    
    try {
        btn.disabled = true;
        btn.textContent = 'Sending...';
        
        const { sendEmailVerification } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        await sendEmailVerification(auth.currentUser);
        
        alert('Verification email sent! Please check your inbox and spam folder.');
        btn.textContent = 'Email Sent ✓';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 3000);
        
    } catch (error) {
        console.error('Error sending verification email:', error);
        alert('Error: ' + error.message);
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// Check if email has been verified
async function checkEmailVerification() {
    const btn = document.getElementById('checkVerificationBtn');
    const originalText = btn.textContent;
    
    try {
        btn.disabled = true;
        btn.textContent = 'Checking...';
        
        // Reload user to get latest emailVerified status
        await auth.currentUser.reload();
        
        if (auth.currentUser.emailVerified) {
            alert('Email verified successfully! Reloading page...');
            window.location.reload();
        } else {
            alert('Email not verified yet. Please check your inbox and click the verification link.');
        }
        
    } catch (error) {
        console.error('Error checking verification:', error);
        alert('Error: ' + error.message);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

function updateUIForLoggedInUser(user) {
    // Update any user-specific UI elements
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
        el.textContent = user.displayName || user.email.split('@')[0];
    });

    const userEmailElements = document.querySelectorAll('.user-email');
    userEmailElements.forEach(el => {
        el.textContent = user.email;
    });

    // Show/hide elements based on auth state
    const loggedInElements = document.querySelectorAll('.logged-in-only');
    loggedInElements.forEach(el => el.style.display = 'block');

    const loggedOutElements = document.querySelectorAll('.logged-out-only');
    loggedOutElements.forEach(el => el.style.display = 'none');
}

function updateUIForLoggedOutUser() {
    // Show/hide elements based on auth state
    const loggedInElements = document.querySelectorAll('.logged-in-only');
    loggedInElements.forEach(el => el.style.display = 'none');

    const loggedOutElements = document.querySelectorAll('.logged-out-only');
    loggedOutElements.forEach(el => el.style.display = 'block');
}

// =====================================================
// 🔹 LOGOUT FUNCTIONALITY
// =====================================================
function initLogout() {
    const logoutBtns = document.querySelectorAll('.logout-btn, #logoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });
}

async function handleLogout() {
    try {
        const { signOut } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        await signOut(auth);
        alert('Logged out successfully!');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    }
}

// Make logout available globally
window.handleLogout = handleLogout;

// Initialize logout buttons when DOM is ready
document.addEventListener('DOMContentLoaded', initLogout);

// =====================================================
// 1️⃣ UNIVERSAL PASSWORD TOGGLE
// =====================================================
function initPasswordToggles() {
    const toggles = document.querySelectorAll('.toggle-btn');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent accidental form submission
            const wrapper = toggle.closest('.input-wrapper');
            if (!wrapper) return;

            const input = wrapper.querySelector('input.password-input');
            if (!input) return;

            const eyeOpen = toggle.querySelector('.eye-open');
            const eyeClosed = toggle.querySelector('.eye-closed');

            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
            } else {
                input.type = 'password';
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
            }
        });
    });
}

// =====================================================
// 2️⃣ LOGIN FUNCTIONALITY
// =====================================================
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', handleLogin);

    const googleBtn = document.getElementById('googleLoginBtn');
    if (googleBtn) googleBtn.addEventListener('click', handleGoogleLogin);
}

async function handleLogin(event) {
    event.preventDefault();

    const loginBtn = document.getElementById('loginBtn');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert('Please fill all fields.');
        return;
    }

    try {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing In...';

        const { getAuth, signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Check if email is verified
        if (!userCredential.user.emailVerified) {
            alert('Please verify your email before logging in. Check your inbox for the verification link.');
            
            // Show option to resend verification email
            const resend = confirm('Do you want to resend the verification email?');
            if (resend) {
                const { sendEmailVerification } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
                await sendEmailVerification(userCredential.user);
                alert('Verification email sent! Please check your inbox.');
            }
            
            // Sign out the user
            const { signOut } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
            await signOut(auth);
            
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
            return;
        }
        
        // Email is verified, proceed to dashboard
        alert('Login successful!');
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error(error);
        let errorMessage = 'Login failed: ';
        
        // Provide user-friendly error messages
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/user-disabled':
                errorMessage += 'This account has been disabled.';
                break;
            case 'auth/user-not-found':
                errorMessage += 'No account found with this email.';
                break;
            case 'auth/wrong-password':
                errorMessage += 'Incorrect password.';
                break;
            case 'auth/invalid-credential':
                errorMessage += 'Invalid email or password.';
                break;
            default:
                errorMessage += error.message;
        }
        
        alert(errorMessage);
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign In';
    }
}

// Google Login
async function handleGoogleLogin() {
    try {
        const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        
        // Google accounts are auto-verified
        alert(`Welcome ${result.user.displayName || result.user.email}!`);
        
        // Save to Firestore if new user
        if (window.db) {
            const { doc, setDoc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            const userDoc = await getDoc(doc(window.db, 'users', result.user.uid));
            
            if (!userDoc.exists()) {
                await setDoc(doc(window.db, 'users', result.user.uid), {
                    fullName: result.user.displayName,
                    email: result.user.email,
                    emailVerified: true,
                    createdAt: new Date(),
                    loginMethod: 'google'
                });
            }
        }
        
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error(error);
        alert('Google login failed: ' + error.message);
    }
}

// =====================================================
// 3️⃣ SIGNUP / REGISTRATION
// =====================================================
function initSignupForm() {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    signupForm.addEventListener('submit', handleSignup);
}

async function handleSignup(event) {
    event.preventDefault();

    const signupBtn = document.getElementById('signupBtn') || document.getElementById('submitBtn');
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (!fullName || !email || !phone || !password || !confirmPassword) {
        alert('Please fill all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    try {
        signupBtn.disabled = true;
        signupBtn.textContent = 'Creating Account...';

        const { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with display name
        await updateProfile(userCredential.user, { displayName: fullName });

        // Send verification email
        await sendEmailVerification(userCredential.user);

        // Save additional info in Firestore
        if (window.db) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
            await setDoc(doc(window.db, 'users', userCredential.user.uid), {
                fullName,
                email,
                phone,
                emailVerified: false,
                createdAt: new Date(),
                loginMethod: 'email'
            });
        }

        // Show success message
        alert('Account created successfully! \n\nA verification email has been sent to ' + email + '. \n\nPlease verify your email before logging in.');
        
        // Sign out the user so they must verify before logging in
        const { signOut } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        await signOut(auth);
        
        // Redirect to login
        window.location.href = 'login.html';
        
    } catch (error) {
        console.error(error);
        let errorMessage = 'Signup failed: ';
        
        // Provide user-friendly error messages
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += 'An account with this email already exists.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/weak-password':
                errorMessage += 'Password is too weak. Use at least 6 characters.';
                break;
            default:
                errorMessage += error.message;
        }
        
        alert(errorMessage);
    } finally {
        signupBtn.disabled = false;
        signupBtn.textContent = 'Create Account';
    }
}

// =====================================================
// 4️⃣ GLOBAL FEATURES
// =====================================================
function initFooterYear() {
    const footer = document.querySelector('.footer p');
    if (!footer) return;

    const currentYear = new Date().getFullYear();
    footer.innerHTML = `© ${currentYear} JalSanchaeeNavachar. Empowering farmers with modern technology.`;
}

// =====================================================
// 🔹 UTILITY FUNCTIONS
// =====================================================

// Get current user
function getCurrentUser() {
    return window.currentUser || null;
}

// Check if user is authenticated
function isAuthenticated() {
    return window.currentUser !== null && window.currentUser.emailVerified;
}

// Require authentication (call this at the top of protected pages)
function requireAuth() {
    const user = getCurrentUser();
    if (!user || !user.emailVerified) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Make utilities globally available
window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;
window.requireAuth = requireAuth;
window.resendVerificationEmail = resendVerificationEmail;