// Razorpay configuration
const options = {
    key: 'rzp_live_qBnxFH7Aqj8mEw', // Replace with your Razorpay Key ID
    amount: 100, // Amount in paise (₹1 * 100)
    currency: 'INR',
    name: 'TrendsPulse',
    description: 'Lifetime Access',
    image: '/trends-ai/images/2025030122275204.png', // Your logo
    handler: function(response) {
        handlePaymentSuccess(response);
    },
    prefill: {
        email: localStorage.getItem('trendsPulseUserEmail') || ''
    },
    theme: {
        color: '#00ffd5'
    },
    modal: {
        ondismiss: function() {
            console.log('Payment modal closed');
        }
    }
};

// Initialize Razorpay
let razorpayInstance = null;

// Initialize page when loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if user has lifetime access
    const hasLifetimeAccess = localStorage.getItem('trendsPulseAccess') === 'lifetime';
    const userEmail = localStorage.getItem('trendsPulseUserEmail');

    if (hasLifetimeAccess && userEmail) {
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
        localStorage.setItem('trendsPulseUserEmail', email);
        
        // Check if this user already has lifetime access
        if (localStorage.getItem('trendsPulseAccess') === 'lifetime') {
            showLifetimeAccessUI(email);
            return;
        }
        
        // Proceed with Razorpay payment
        initializeRazorpayPayment();
    }
}

// Initialize Razorpay payment
function initializeRazorpayPayment() {
    if (!razorpayInstance) {
        razorpayInstance = new Razorpay(options);
    }
    razorpayInstance.open();
}

// Modified click handler for the purchase button
function openRazorpay() {
    const userEmail = localStorage.getItem('trendsPulseUserEmail');
    
    // Check if user already has lifetime access
    if (localStorage.getItem('trendsPulseAccess') === 'lifetime') {
        showLifetimeAccessUI(userEmail);
        return;
    }
    
    if (userEmail) {
        // If already signed in, proceed directly to payment
        initializeRazorpayPayment();
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

// Handle successful payment
async function handlePaymentSuccess(response) {
    try {
        // Since we don't have a backend server, we'll simulate payment verification
        // In a production environment, you should verify the payment with your server
        
        // Store lifetime access status with the email
        const userEmail = localStorage.getItem('trendsPulseUserEmail');
        localStorage.setItem('trendsPulseAccess', 'lifetime');
        
        // Show success message
        showSuccessMessage();
        
        // Update UI to show lifetime access
        showLifetimeAccessUI(userEmail);
        
        // Remove any trial-related data
        localStorage.removeItem('trendsPulseTrialUsed');
        
        // Redirect to dashboard after a delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('Something went wrong. Please contact support.');
    }
}

// Show success message
function showSuccessMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'payment-message success';
    messageDiv.innerHTML = `
        <div class="message-content">
            <h3>🎉 Payment Successful!</h3>
            <p>Thank you for purchasing TrendsPulse Lifetime Access.</p>
            <p>Redirecting to dashboard...</p>
        </div>
    `;
    document.body.appendChild(messageDiv);
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
