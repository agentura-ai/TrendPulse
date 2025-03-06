// Razorpay configuration
const options = {
    key: 'rzp_live_qBnxFH7Aqj8mEw', // Replace with your Razorpay Key ID
    amount: 1000, // Amount in paise (₹10 * 100)
    currency: 'INR',
    name: 'TrendsPulse',
    description: 'Lifetime Access',
    image: '/trends-ai/images/2025030122275204.png', // Your logo
    handler: function(response) {
        // Handle successful payment
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

function openRazorpay() {
    // Create new instance only if not already created
    if (!razorpayInstance) {
        razorpayInstance = new Razorpay(options);
    }
    razorpayInstance.open();
}

// Handle successful payment
async function handlePaymentSuccess(response) {
    try {
        // Send payment verification to your server
        const verificationResponse = await fetch('/verify-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
            }),
        });

        const data = await verificationResponse.json();

        if (data.success) {
            // Payment verified successfully
            localStorage.setItem('trendsPulseAccess', 'lifetime');
            showSuccessMessage();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showErrorMessage('Payment verification failed');
        }
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
