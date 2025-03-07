// Constants for localStorage keys
const USER_EMAIL_KEY = 'trendsPulseUserEmail';
const ACCESS_KEY = 'trendsPulseAccess';
const LIFETIME_USERS_KEY = 'trendsPulseLifetimeUsers';

// Get lifetime users from localStorage or initialize empty array
let lifetimeUsers = JSON.parse(localStorage.getItem(LIFETIME_USERS_KEY) || '[]');

// Function to check if a user has lifetime access
function checkLifetimeAccess(email) {
    if (!email) return false;
    return lifetimeUsers.includes(email.toLowerCase());
}

// Function to grant lifetime access to a user
function grantLifetimeAccess(email) {
    if (!email) return;
    const normalizedEmail = email.toLowerCase();
    if (!lifetimeUsers.includes(normalizedEmail)) {
        lifetimeUsers.push(normalizedEmail);
        localStorage.setItem(LIFETIME_USERS_KEY, JSON.stringify(lifetimeUsers));
    }
    localStorage.setItem(ACCESS_KEY, 'lifetime');
}

// Initialize page when loaded
document.addEventListener('DOMContentLoaded', () => {
    const userEmail = localStorage.getItem(USER_EMAIL_KEY);
    
    // Check if user has lifetime access
    if (userEmail && checkLifetimeAccess(userEmail)) {
        showLifetimeAccessUI(userEmail);
    }

    // Initialize Google Sign-In
    google.accounts.id.initialize({
        client_id: '49454316035-i28f1qqe0lkittluu0rvgufk5fj3beok.apps.googleusercontent.com',
        callback: handleGoogleSignIn
    });
});

// Show lifetime access UI
function showLifetimeAccessUI(email) {
    const pricingCard = document.querySelector('.pricing-card');
    if (pricingCard) {
        pricingCard.innerHTML = `
            <div class="pricing-header">
                <h2>Lifetime Access Enabled</h2>
                <div class="trial-info">
                    <span class="trial-badge">✨ Unlimited Access Active</span>
                </div>
                <p class="access-info">Your account (${email}) has lifetime access enabled.</p>
            </div>
            
            <div class="features-list">
                <h3>Your Active Benefits:</h3>
                <ul>
                    <li>✨ Unlimited Trend Analysis</li>
                    <li>🔍 Real-time Topic Insights</li>
                    <li>📊 Advanced Analytics Dashboard</li>
                    <li>📈 Sentiment Analysis</li>
                    <li>🎯 Topic Relevance Scoring</li>
                    <li>📱 Mobile-Friendly Interface</li>
                    <li>🔄 Regular Updates & Improvements</li>
                    <li>🛟 Priority Support</li>
                </ul>
            </div>

            <a href="index.html" class="purchase-btn" style="text-decoration: none; text-align: center;">
                Go to Dashboard
            </a>
        `;
    }
}

// Handle Google Sign-In response
function handleGoogleSignIn(response) {
    if (response.credential) {
        const decoded = JSON.parse(atob(response.credential.split('.')[1]));
        const email = decoded.email;
        
        // Store user email
        localStorage.setItem(USER_EMAIL_KEY, email);
        
        // Check if this user already has lifetime access
        if (checkLifetimeAccess(email)) {
            showLifetimeAccessUI(email);
            return;
        }
        
        // Redirect to email contact
        contactForPurchase();
    }
}

// Function to handle contact for purchase
function contactForPurchase() {
    const userEmail = localStorage.getItem(USER_EMAIL_KEY);
    
    if (userEmail) {
        // If user is already signed in, open email client
        window.location.href = `mailto:agenturacontact@gmail.com?subject=TrendsPulse Access Purchase&body=Hi, I would like to purchase lifetime access to TrendsPulse.%0D%0A%0D%0AMy registered email: ${userEmail}%0D%0A%0D%0APlease provide me with further instructions for the purchase.%0D%0A%0D%0AThank you!`;
    } else {
        // If not signed in, show Google Sign-In
        google.accounts.id.initialize({
            client_id: '49454316035-i28f1qqe0lkittluu0rvgufk5fj3beok.apps.googleusercontent.com',
            callback: handleGoogleSignIn
        });
        
        // Create container for Google Sign-In
        const signInContainer = document.createElement('div');
        signInContainer.id = 'googleSignInContainer';
        signInContainer.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.9); padding: 40px; border-radius: 10px; text-align: center; z-index: 1000; min-width: 350px;';
        
        const heading = document.createElement('h3');
        heading.textContent = 'Sign in with Google to Continue';
        heading.style.cssText = 'color: white; margin: 0 0 25px 0; font-size: 18px;';
        
        const buttonDiv = document.createElement('div');
        buttonDiv.id = 'googleSignInButton';
        
        signInContainer.appendChild(heading);
        signInContainer.appendChild(buttonDiv);
        document.body.appendChild(signInContainer);
        
        // Render the Google Sign-In button
        google.accounts.id.renderButton(
            buttonDiv,
            { theme: 'outline', size: 'large', width: 300, text: 'signin_with' }
        );
    }
}

// Show success message
function showSuccessMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'payment-message success';
    messageDiv.innerHTML = `
        <div class="message-content">
            <h3>📧 Email Client Opened</h3>
            <p>Please send the email to complete your purchase request.</p>
        </div>
    `;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 5000);
}

// Show error message
function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'payment-message error';
    messageDiv.innerHTML = `
        <div class="message-content">
            <h3>❌ Error</h3>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 5000);
}

// Add payment message styles
const style = document.createElement('style');
style.textContent = `
    .payment-message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 20px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }

    .payment-message.success {
        background: rgba(0, 255, 213, 0.1);
        border: 1px solid #00ffd5;
        color: #fff;
    }

    .payment-message.error {
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid #ff4d4d;
        color: #fff;
    }

    .message-content h3 {
        margin: 0 0 10px 0;
        font-size: 1.2rem;
    }

    .message-content p {
        margin: 0;
        font-size: 0.9rem;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;