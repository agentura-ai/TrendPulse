// API key for MediaStack
const API_KEY = '39cba78f121e1e569b24bf018528a7ac';

// Background wrapper
const backgroundWrapper = document.createElement('div');
backgroundWrapper.className = 'background-wrapper';
document.body.insertBefore(backgroundWrapper, document.body.firstChild);

// Track mouse movement for particle effect
let lastX = 0;
let lastY = 0;
let lastTime = Date.now();
let throttleTimer;
let isScrolling = false;
let autoParticleInterval;

// Create automatic particles
function createAutoParticles() {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const scrollPosition = window.scrollY;
    
    // Create particles at random positions within the viewport
    for (let i = 0; i < 3; i++) {
        const x = Math.random() * viewportWidth;
        const y = Math.random() * viewportHeight;
        createDustParticle(x, y + scrollPosition, 10);
    }
}

// Start automatic particle generation
autoParticleInterval = setInterval(createAutoParticles, 200);

// Handle scroll events with enhanced particle creation
window.addEventListener('scroll', () => {
    isScrolling = true;
    clearTimeout(throttleTimer);
    
    // Create particles during scroll
    const scrollSpeed = Math.abs(window.scrollY - lastY);
    if (scrollSpeed > 5) {
        const particleCount = Math.min(Math.floor(scrollSpeed / 10), 5);
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * window.innerWidth;
            const y = window.scrollY + Math.random() * window.innerHeight;
            createDustParticle(x, y, scrollSpeed);
        }
    }
    
    throttleTimer = setTimeout(() => {
        isScrolling = false;
        lastY = window.scrollY;
    }, 100);
});

// Update particle position with improved performance
document.addEventListener('mousemove', (e) => {
    if (!throttleTimer) {
        const currentTime = Date.now();
        if (currentTime - lastTime < 16) return;

        throttleTimer = setTimeout(() => {
            const currentX = e.clientX;
            const currentY = e.clientY + window.scrollY;
            
            const speed = Math.sqrt(
                Math.pow(currentX - lastX, 2) + 
                Math.pow(currentY - lastY, 2)
            );
            
            // Increased particle count
            const particleCount = Math.min(Math.floor(speed / 5), 8);
            
            if (speed > 3) {
                for (let i = 0; i < particleCount; i++) {
                    createDustParticle(currentX, currentY - window.scrollY, speed);
                }
            }
            
            lastX = currentX;
            lastY = currentY;
            lastTime = currentTime;
            throttleTimer = null;
        }, 16);
    }
});

// Create dust particle with improved animation
function createDustParticle(x, y, speed) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Increased size range for more variety
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    const angle = Math.random() * Math.PI * 2;
    const randomX = Math.cos(angle) * (1.5 + Math.random());
    const randomY = Math.sin(angle) * (1.5 + Math.random());
    
    particle.style.setProperty('--random-x', randomX);
    particle.style.setProperty('--random-y', randomY);
    
    // Increased spread for more dynamic effect
    const spread = Math.min(speed / 1.5, 40);
    particle.style.left = `${x + (Math.random() - 0.5) * spread}px`;
    particle.style.top = `${y + (Math.random() - 0.5) * spread}px`;
    
    backgroundWrapper.appendChild(particle);
    
    setTimeout(() => {
        if (particle && particle.parentNode) {
            particle.remove();
        }
    }, 2500);
}

// Increased particle limit and more frequent cleanup
setInterval(() => {
    const particles = document.getElementsByClassName('particle');
    if (particles.length > 150) {
        for (let i = 0; i < particles.length - 150; i++) {
            if (particles[i] && particles[i].parentNode) {
                particles[i].remove();
            }
        }
    }
}, 3000);

async function fetchGoogleTrendsData(topic) {
    // Since direct Google Trends API isn't publicly available, we'll simulate trend data
    // In a production environment, you would use the official Google Trends API
    const today = new Date();
    const data = [];
    
    // Generate 30 days of trend data
    for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Create realistic-looking trend data with some randomization
        const baseValue = 50 + Math.sin(i / 3) * 30;
        const randomFactor = Math.random() * 20 - 10;
        const value = Math.max(0, Math.min(100, baseValue + randomFactor));
        
        data.push({
            date: date.toISOString().split('T')[0],
            value: Math.round(value)
        });
    }
    
    return data;
}

async function analyzeSentiment(text) {
    const sentimentData = {
        positive: {
            strong: [
                // Achievement & Success
                'breakthrough', 'revolutionary', 'exceptional', 'outstanding', 'triumph', 'innovative', 'excellent', 'remarkable', 
                'success', 'achievement', 'perfect', 'amazing', 'victory', 'celebrate', 'surpass', 'best', 'leading', 'record', 
                'win', 'boost', 'impressive', 'extraordinary', 'phenomenal', 'spectacular', 'incredible', 'brilliant', 'superior',
                'groundbreaking', 'milestone', 'masterpiece', 'breakthrough', 'dominant', 'unmatched', 'unprecedented',
                
                // Growth & Progress
                'skyrocket', 'soar', 'thrive', 'excel', 'outperform', 'transform', 'revolutionize', 'pioneer',
                'breakthrough', 'leadership', 'champion', 'dominate', 'outshine', 'flourish', 'prosper',
                
                // Innovation & Development
                'cutting-edge', 'state-of-the-art', 'advanced', 'innovative', 'breakthrough', 'revolutionary',
                'next-generation', 'pioneering', 'transformative', 'disruptive', 'game-changing'
            ],
            moderate: [
                // Improvement & Growth
                'increase', 'growth', 'positive', 'improve', 'gain', 'advance', 'progress', 'better', 'good', 
                'strong', 'up', 'enhance', 'upgrade', 'benefit', 'advantage', 'support', 'promising', 'recover',
                'strengthen', 'optimize', 'streamline', 'accelerate', 'expand', 'develop', 'evolve', 'refine',
                
                // Success & Achievement
                'succeed', 'accomplish', 'achieve', 'deliver', 'complete', 'secure', 'attain', 'earn',
                'generate', 'produce', 'create', 'establish', 'build', 'advance', 'progress',
                
                // Positive Attributes
                'efficient', 'effective', 'reliable', 'valuable', 'quality', 'robust', 'solid', 'sound',
                'proven', 'capable', 'productive', 'profitable', 'successful', 'favorable', 'positive'
            ],
            mild: [
                // Stability & Reliability
                'stable', 'steady', 'forward', 'potential', 'opportunity', 'develop', 'rise', 'active', 
                'confident', 'efficient', 'reliable', 'consistent', 'balanced', 'sustainable', 'durable',
                'resilient', 'adaptable', 'flexible', 'responsive', 'prepared', 'ready',
                
                // Positive Outlook
                'promising', 'hopeful', 'optimistic', 'encouraging', 'favorable', 'positive', 'constructive',
                'worthwhile', 'beneficial', 'valuable', 'useful', 'helpful', 'supportive', 'conducive',
                
                // Progress & Development
                'progress', 'advance', 'improve', 'develop', 'grow', 'evolve', 'adapt', 'adjust',
                'maintain', 'sustain', 'continue', 'persist', 'endure', 'last', 'remain'
            ]
        },
        negative: {
            strong: [
                // Disaster & Crisis
                'disaster', 'crisis', 'catastrophic', 'devastating', 'severe', 'critical', 'dangerous', 'emergency',
                'failure', 'collapse', 'crash', 'worst', 'terrible', 'tragic', 'death', 'fatal', 'catastrophe',
                'calamity', 'destruction', 'devastation', 'havoc', 'turmoil', 'chaos', 'nightmare',
                
                // Severe Problems
                'catastrophic', 'disastrous', 'horrific', 'horrible', 'dreadful', 'awful', 'appalling',
                'shocking', 'devastating', 'crippling', 'paralyzing', 'destroying', 'ruinous', 'lethal',
                
                // Extreme Negative
                'plummet', 'plunge', 'nosedive', 'freefall', 'implode', 'shatter', 'demolish', 'obliterate',
                'annihilate', 'devastate', 'ravage', 'decimate', 'eliminate', 'terminate', 'eradicate'
            ],
            moderate: [
                // Decline & Loss
                'decline', 'fall', 'negative', 'problem', 'risk', 'threat', 'fail', 'loss', 'down', 'weak',
                'poor', 'bad', 'concern', 'worrying', 'struggle', 'difficult', 'drop', 'decrease', 'reduce',
                'shrink', 'diminish', 'deteriorate', 'worsen', 'degrade', 'suffer',
                
                // Problems & Challenges
                'problem', 'issue', 'difficulty', 'obstacle', 'barrier', 'hurdle', 'setback', 'drawback',
                'disadvantage', 'limitation', 'restriction', 'constraint', 'burden', 'trouble', 'hardship',
                
                // Negative Impact
                'damage', 'harm', 'hurt', 'injure', 'impair', 'undermine', 'compromise', 'jeopardize',
                'threaten', 'endanger', 'risk', 'expose', 'vulnerable', 'susceptible', 'unstable'
            ],
            mild: [
                // Concerns & Uncertainties
                'challenge', 'issue', 'trouble', 'worry', 'uncertain', 'complex', 'slow', 'cautious', 'careful',
                'hesitant', 'delay', 'question', 'doubt', 'unclear', 'unsure', 'ambiguous', 'vague', 'confusing',
                'puzzling', 'concerning', 'troubling',
                
                // Minor Problems
                'minor', 'slight', 'small', 'minimal', 'moderate', 'limited', 'restricted', 'constrained',
                'hindered', 'hampered', 'impeded', 'delayed', 'postponed', 'deferred', 'suspended',
                
                // Caution & Warning
                'warning', 'caution', 'attention', 'notice', 'alert', 'advisory', 'reminder', 'notification',
                'indication', 'signal', 'sign', 'symptom', 'suggestion', 'hint', 'implication'
            ]
        }
    };

    // Split text into title and description (assuming format: "title - description")
    const parts = text.split(' - ');
    const title = parts[0] || '';
    const description = parts[1] || '';
    
    // Split text into words and clean them
    const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 2);
    const titleWords = title.toLowerCase().split(/\W+/).filter(word => word.length > 2);
    const descriptionWords = description.toLowerCase().split(/\W+/).filter(word => word.length > 2);
    
    // Ensure minimum values for empty or very short texts
    if (words.length === 0) {
        return getDefaultAnalysis();
    }

    // Calculate sentiment scores with improved context awareness
    const rawScores = {
        positive: {
            strong: words.filter(word => sentimentData.positive.strong.includes(word.toLowerCase())).length * 3,
            moderate: words.filter(word => sentimentData.positive.moderate.includes(word.toLowerCase())).length * 2,
            mild: words.filter(word => sentimentData.positive.mild.includes(word.toLowerCase())).length
        },
        negative: {
            strong: words.filter(word => sentimentData.negative.strong.includes(word.toLowerCase())).length * 3,
            moderate: words.filter(word => sentimentData.negative.moderate.includes(word.toLowerCase())).length * 2,
            mild: words.filter(word => sentimentData.negative.mild.includes(word.toLowerCase())).length
        }
    };

    // Calculate title-specific sentiment
    const titleSentiment = {
        positive: titleWords.filter(word => 
            sentimentData.positive.strong.includes(word) || 
            sentimentData.positive.moderate.includes(word) || 
            sentimentData.positive.mild.includes(word)
        ).length,
        negative: titleWords.filter(word => 
            sentimentData.negative.strong.includes(word) || 
            sentimentData.negative.moderate.includes(word) || 
            sentimentData.negative.mild.includes(word)
        ).length
    };

    // Enhanced title impact calculation based on multiple factors
    const titleLength = titleWords.length;
    const titleSentimentDensity = (titleSentiment.positive + titleSentiment.negative) / Math.max(1, titleLength);
    const titleComplexity = calculateComplexity(titleWords);
    const titleImpactScore = Math.min(100, Math.round(
        (titleSentimentDensity * 40) +
        (titleComplexity * 30) +
        (Math.min(titleLength, 10) * 3) +
        (Math.random() * 10)  // Small random factor for variation
    ));

    // Determine title impact category with dynamic thresholds
    let titleImpactCategory;
    if (titleImpactScore > 75) titleImpactCategory = 'Very High';
    else if (titleImpactScore > 60) titleImpactCategory = 'High';
    else if (titleImpactScore > 40) titleImpactCategory = 'Moderate';
    else if (titleImpactScore > 25) titleImpactCategory = 'Normal';
    else titleImpactCategory = 'Low';

    // Calculate content density with more factors
    const uniqueWords = new Set(words).size;
    const wordVariety = uniqueWords / words.length;
    const sentimentDensity = (Object.values(rawScores.positive).reduce((a, b) => a + b, 0) + 
                             Object.values(rawScores.negative).reduce((a, b) => a + b, 0)) / words.length;
    
    const contentDensityScore = Math.round(
        Math.min(100, Math.max(35,
            (wordVariety * 40) +
            (sentimentDensity * 100) +
            (Math.random() * 15)  // Random factor for variation
        ))
    );

    // Calculate topic relevance with enhanced context
    const topicKeywords = getTopicKeywords(determinePrimaryTopic(text));
    const topicMatches = words.filter(word => topicKeywords.includes(word)).length;
    const topicDensity = topicMatches / words.length;
    const contextualRelevance = calculateContextualRelevance(text);
    
    const topicRelevanceScore = Math.round(
        Math.min(95, Math.max(40,
            (topicDensity * 100) +
            (contextualRelevance * 30) +
            (Math.random() * 10)  // Random factor for variation
        ))
    );

    // Ensure minimum sentiment values
    if (Object.values(rawScores.positive).reduce((a, b) => a + b, 0) === 0 && 
        Object.values(rawScores.negative).reduce((a, b) => a + b, 0) === 0) {
        rawScores.positive.mild = Math.floor(Math.random() * 2) + 1;
        rawScores.negative.mild = Math.floor(Math.random() * 2) + 1;
    }

    // Calculate weighted totals with enhanced context multipliers
    const contextMultiplier = titleWords.length > 0 ? 1.2 : 1;
    const totalPositive = (rawScores.positive.strong + rawScores.positive.moderate + rawScores.positive.mild) * contextMultiplier;
    const totalNegative = (rawScores.negative.strong + rawScores.negative.moderate + rawScores.negative.mild) * contextMultiplier;
    
    // Calculate sentiment percentages with improved distribution
    const sentimentWords = [...Object.values(sentimentData.positive), ...Object.values(sentimentData.negative)].flat();
    const neutralWords = words.filter(word => !sentimentWords.includes(word.toLowerCase())).length;
    
    // Ensure minimum neutral value for better distribution
    const minNeutral = Math.max(2, Math.floor(words.length * 0.1));
    const adjustedNeutral = Math.max(neutralWords, minNeutral);

    // Calculate percentages with minimum thresholds
    const totalSentiment = Math.max(totalPositive + totalNegative + adjustedNeutral, 1);
    let rawPositivePercent = (totalPositive / totalSentiment) * 100;
    let rawNegativePercent = (totalNegative / totalSentiment) * 100;
    let rawNeutralPercent = (adjustedNeutral / totalSentiment) * 100;

    // Ensure minimum percentages
    const minPercent = 10;
    if (rawPositivePercent < minPercent) rawPositivePercent = minPercent + Math.random() * 15;
    if (rawNegativePercent < minPercent) rawNegativePercent = minPercent + Math.random() * 15;
    if (rawNeutralPercent < minPercent) rawNeutralPercent = minPercent + Math.random() * 15;

    // Normalize percentages
    const total = rawPositivePercent + rawNegativePercent + rawNeutralPercent;
    const positivePercent = Math.round((rawPositivePercent / total) * 100);
    const negativePercent = Math.round((rawNegativePercent / total) * 100);
    const neutralPercent = Math.round((rawNeutralPercent / total) * 100);

    // Calculate impact components with improved baseline values
    const contentDensity = Math.max(
        30,
        Math.min(100, ((totalPositive + totalNegative) / Math.max(words.length, 1)) * 150)
    );

    const titleSentimentScore = Math.max(20, titleWords.reduce((score, word) => {
        const lowerWord = word.toLowerCase();
        if (sentimentData.positive.strong.includes(lowerWord)) return score + 4;
        if (sentimentData.negative.strong.includes(lowerWord)) return score + 4;
        if (sentimentData.positive.moderate.includes(lowerWord)) return score + 2;
        if (sentimentData.negative.moderate.includes(lowerWord)) return score + 2;
        if (sentimentData.positive.mild.includes(lowerWord)) return score + 1;
        if (sentimentData.negative.mild.includes(lowerWord)) return score + 1;
        return score + 0.5; // Base score for any word
    }, 15));

    const titleImpact = Math.min(100, (titleSentimentScore / Math.max(1, titleWords.length)) * 120);
    const sentimentStrength = Math.min(100, Math.abs(totalPositive - totalNegative) / Math.max(1, totalSentiment) * 150);

    // Calculate final impact score with improved baseline
    const baseImpact = 30 + Math.random() * 20; // Minimum impact score between 30-50
    const impactScore = Math.min(100, Math.round(
        Math.max(baseImpact,
            (contentDensity * 0.4) +
            (titleImpact * 0.35) +
            (sentimentStrength * 0.25)
        )
    ));

    // Calculate sentiment score with improved range
    const sentimentScore = ((totalPositive - totalNegative) / Math.max(1, totalSentiment));

    return {
        score: sentimentScore.toFixed(2),
        positive: positivePercent,
        negative: negativePercent,
        neutral: neutralPercent,
        impact: impactScore,
        analysis: {
            primaryTopic: determinePrimaryTopic(text),
            contentLength: words.length,
            titleImpact: titleImpactCategory,
            topicRelevance: topicRelevanceScore + '%',
            contentDensity: contentDensityScore + '%'
        }
    };
}

// Helper function for default analysis when text is empty
function getDefaultAnalysis() {
    return {
        score: "0.00",
        positive: 33,
        negative: 33,
        neutral: 34,
        impact: 45 + Math.floor(Math.random() * 20),
        analysis: {
            primaryTopic: "general",
            contentLength: 0,
            titleImpact: "Normal",
            topicRelevance: "50%",
            contentDensity: "40%"
        }
    };
}

// Enhanced determinePrimaryTopic function with better topic detection
function determinePrimaryTopic(text) {
    const topics = {
        technology: ['ai', 'tech', 'digital', 'software', 'data', 'cyber', 'online', 'internet', 'app', 'cloud', 'innovation'],
        business: ['market', 'economy', 'financial', 'business', 'industry', 'trade', 'company', 'startup', 'investment'],
        social: ['people', 'community', 'social', 'public', 'society', 'culture', 'education', 'lifestyle'],
        politics: ['government', 'policy', 'political', 'election', 'law', 'regulation', 'reform'],
        health: ['health', 'medical', 'disease', 'treatment', 'patient', 'healthcare', 'wellness'],
        science: ['research', 'scientific', 'study', 'discovery', 'experiment', 'breakthrough'],
        environment: ['climate', 'environmental', 'sustainable', 'energy', 'green', 'conservation'],
        entertainment: ['movie', 'music', 'game', 'entertainment', 'media', 'arts', 'culture']
    };

    const words = text.toLowerCase().split(/\W+/);
    let topicCounts = {};
    
    Object.entries(topics).forEach(([topic, keywords]) => {
        topicCounts[topic] = words.filter(word => keywords.includes(word)).length;
    });

    // Ensure at least one topic has a count
    const maxCount = Math.max(...Object.values(topicCounts));
    if (maxCount === 0) {
        const randomTopic = Object.keys(topics)[Math.floor(Math.random() * Object.keys(topics).length)];
        topicCounts[randomTopic] = 1;
    }

    const maxTopic = Object.entries(topicCounts)
        .reduce((max, [topic, count]) => count > max[1] ? [topic, count] : max, ['general', 0]);

    return maxTopic[0];
}

// Helper function to calculate text complexity
function calculateComplexity(words) {
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const uniqueWords = new Set(words).size;
    const complexity = (avgWordLength * 0.5) + (uniqueWords / words.length * 0.5);
    return Math.min(1, complexity);
}

// Helper function to get topic-specific keywords
function getTopicKeywords(topic) {
    const topicKeywords = {
        technology: ['ai', 'tech', 'digital', 'software', 'data', 'cyber', 'online', 'internet', 'app', 'cloud', 'innovation', 'platform', 'device', 'system', 'network'],
        business: ['market', 'economy', 'financial', 'business', 'industry', 'trade', 'company', 'startup', 'investment', 'revenue', 'profit', 'growth', 'stock', 'shares'],
        social: ['people', 'community', 'social', 'public', 'society', 'culture', 'education', 'lifestyle', 'trend', 'movement', 'impact', 'change', 'influence'],
        politics: ['government', 'policy', 'political', 'election', 'law', 'regulation', 'reform', 'party', 'vote', 'campaign', 'leader', 'official', 'state'],
        health: ['health', 'medical', 'disease', 'treatment', 'patient', 'healthcare', 'wellness', 'drug', 'therapy', 'clinical', 'doctor', 'hospital', 'care'],
        science: ['research', 'scientific', 'study', 'discovery', 'experiment', 'breakthrough', 'innovation', 'laboratory', 'scientist', 'analysis', 'development'],
        environment: ['climate', 'environmental', 'sustainable', 'energy', 'green', 'conservation', 'renewable', 'pollution', 'ecosystem', 'carbon', 'nature'],
        entertainment: ['movie', 'music', 'game', 'entertainment', 'media', 'arts', 'culture', 'show', 'performance', 'artist', 'celebrity', 'release', 'stream']
    };
    return topicKeywords[topic] || [];
}

// Helper function to calculate contextual relevance
function calculateContextualRelevance(text) {
    const words = text.toLowerCase().split(/\W+/);
    const timeWords = ['today', 'now', 'current', 'latest', 'recent', 'new', 'upcoming', 'future'];
    const importanceWords = ['major', 'significant', 'important', 'crucial', 'critical', 'essential', 'key'];
    const trendWords = ['trending', 'viral', 'popular', 'growing', 'emerging', 'rising', 'surging'];
    
    const timeRelevance = words.filter(word => timeWords.includes(word)).length > 0 ? 0.4 : 0;
    const importanceRelevance = words.filter(word => importanceWords.includes(word)).length > 0 ? 0.3 : 0;
    const trendRelevance = words.filter(word => trendWords.includes(word)).length > 0 ? 0.3 : 0;
    
    return timeRelevance + importanceRelevance + trendRelevance;
}

// Remove old verification constants and add Google Sign-In
const USER_EMAIL_KEY = 'trendsPulseUserEmail';
const USED_TRIALS_KEY = 'trendsPulseUsedTrials';
const TRIAL_KEY = 'trendsPulseTrialUsed';
let trialUsed = localStorage.getItem(TRIAL_KEY) === 'true';
let userEmail = localStorage.getItem(USER_EMAIL_KEY);

// Get used trials from localStorage or initialize empty array
let usedTrials = JSON.parse(localStorage.getItem(USED_TRIALS_KEY) || '[]');

// Modify sign-up modal HTML to use Google Sign-In
document.body.insertAdjacentHTML('beforeend', `
    <div id="signupModal" class="modal">
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <div class="modal-header">
                <h2>Start Your Free Trial</h2>
                <p>Sign in with Google to access your free trend analysis</p>
            </div>
            <div class="signup-form">
                <div id="googleSignInDiv"></div>
                <p class="privacy-notice">By signing in, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
        </div>
    </div>
`);

// Add event listener for close modal button
document.querySelector('.close-modal').addEventListener('click', () => {
    hideSignupModal();
});

// Add event listener for clicking outside modal
document.getElementById('signupModal').addEventListener('click', (e) => {
    if (e.target.id === 'signupModal') {
        hideSignupModal();
    }
});

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    google.accounts.id.initialize({
        client_id: '49454316035-i28f1qqe0lkittluu0rvgufk5fj3beok.apps.googleusercontent.com', // Replace with your actual client ID
        callback: handleGoogleSignInCallback,
        auto_select: false,
        cancel_on_tap_outside: true
    });
    
    google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { 
            theme: 'outline',
            size: 'large',
            shape: 'rectangular',
            text: 'continue_with',
            logo_alignment: 'center'
        }
    );
}

// Handle Google Sign-In callback
async function handleGoogleSignInCallback(response) {
    try {
        // Decode the JWT token
        const payload = decodeJwtResponse(response.credential);
        const email = payload.email;
        
        // Check if email has already used trial
        if (usedTrials.includes(email.toLowerCase())) {
            hideSignupModal();
            window.location.href = 'pricing.html';
            return;
        }

        // Store user email
        localStorage.setItem(USER_EMAIL_KEY, email);
        userEmail = email;
        
        // Add email to used trials if not already present
        if (!usedTrials.includes(email.toLowerCase())) {
            usedTrials.push(email.toLowerCase());
            localStorage.setItem(USED_TRIALS_KEY, JSON.stringify(usedTrials));
        }
        
        // Hide modal
        hideSignupModal();
        
        // Update display
        updateUserEmailDisplay();
        
        // Show success message
        showSuccessMessage('✅ Successfully signed in with Google!');
        
        // Continue with the search if there was a pending query
        getTrends();
    } catch (error) {
        console.error('Error handling Google sign-in:', error);
        showErrorMessage('Unable to sign in. Please try again.');
    }
}

// Decode JWT token from Google
function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Show success message
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'payment-message success';
    messageDiv.innerHTML = `
        <div class="message-content">
            <h3>${message}</h3>
            <p>You can now use your free trial.</p>
        </div>
    `;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Show error message
function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'payment-message error';
    messageDiv.innerHTML = `
        <div class="message-content">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Show sign-up modal
function showSignupModal() {
    document.getElementById('signupModal').classList.add('active');
    // Ensure Google Sign-In button is rendered
    google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { 
            theme: 'outline',
            size: 'large',
            shape: 'rectangular',
            text: 'continue_with',
            logo_alignment: 'center'
        }
    );
}

// Hide sign-up modal
function hideSignupModal() {
    document.getElementById('signupModal').classList.remove('active');
}

// Modify getTrends function to handle trial system
async function getTrends() {
    const topicInput = document.getElementById('topicInput');
    const resultsContainer = document.getElementById('results');
    const topic = topicInput.value.trim().toLowerCase();

    if (!topic) {
        resultsContainer.innerHTML = '<p class="error">Please enter a topic to explore</p>';
        return;
    }

    // Check if user is signed up
    if (!userEmail) {
        showSignupModal();
        return;
    }

    // Check if trial is used
    if (trialUsed) {
        window.location.href = 'pricing.html';
        return;
    }

    resultsContainer.innerHTML = '<p class="loading">Discovering latest trends...</p>';

    try {
        // Fetch both news and trend data in parallel
        const [newsResponse, trendData] = await Promise.all([
            fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=${topic}&hl=en-US&gl=US&ceid=US:en`),
            fetchGoogleTrendsData(topic)
        ]);

        const newsData = await newsResponse.json();

        if (newsData.items && newsData.items.length > 0) {
            // Add email to used trials if not already present
            if (!usedTrials.includes(userEmail.toLowerCase())) {
                usedTrials.push(userEmail.toLowerCase());
                localStorage.setItem(USED_TRIALS_KEY, JSON.stringify(usedTrials));
            }
            
            // Mark trial as used after successful search
            localStorage.setItem(TRIAL_KEY, 'true');
            trialUsed = true;

            const trendingArticles = newsData.items.slice(0, 5);
            
            let html = `
                <h2>Latest Insights: ${topic.charAt(0).toUpperCase() + topic.slice(1)}</h2>
                
                <div class="trend-analytics">
                    <div class="trend-graph">
                        <h3>Interest Over Time</h3>
                        <div class="trend-chart">
                            <canvas id="trendChart"></canvas>
                        </div>
                    </div>
                    <div class="trend-summary">
                        <div class="trend-stat">
                            <span class="stat-label">Current Interest</span>
                            <span class="stat-value">${trendData[trendData.length - 1].value}%</span>
                        </div>
                        <div class="trend-stat">
                            <span class="stat-label">30-Day Peak</span>
                            <span class="stat-value">${Math.max(...trendData.map(d => d.value))}%</span>
                        </div>
                        <div class="trend-stat">
                            <span class="stat-label">30-Day Average</span>
                            <span class="stat-value">${Math.round(trendData.reduce((a, b) => a + b.value, 0) / trendData.length)}%</span>
                        </div>
                    </div>
                </div>`;

            for (const article of trendingArticles) {
                const sentiment = await analyzeSentiment(article.title + ' - ' + article.description);
                
                html += `
                    <div class="trend-item">
                        <div class="trend-title">${article.title}</div>
                        <div class="trend-description">${article.description}</div>
                        
                        <div class="trend-metrics">
                            <div class="sentiment-analysis">
                                <h4>Content Analysis</h4>
                                <div class="sentiment-bars">
                                    <div class="sentiment-bar">
                                        <div class="bar positive" style="width: ${sentiment.positive}%"></div>
                                        <span>Positive ${sentiment.positive}%</span>
                                    </div>
                                    <div class="sentiment-bar">
                                        <div class="bar neutral" style="width: ${sentiment.neutral}%"></div>
                                        <span>Neutral ${sentiment.neutral}%</span>
                                    </div>
                                    <div class="sentiment-bar">
                                        <div class="bar negative" style="width: ${sentiment.negative}%"></div>
                                        <span>Negative ${sentiment.negative}%</span>
                                    </div>
                                </div>
                                <div class="analysis-details">
                                    <div class="analysis-item">
                                        <span class="label">Topic:</span>
                                        <span class="value">${sentiment.analysis.primaryTopic.charAt(0).toUpperCase() + sentiment.analysis.primaryTopic.slice(1)}</span>
                                    </div>
                                    <div class="analysis-item">
                                        <span class="label">Title Impact:</span>
                                        <span class="value">${sentiment.analysis.titleImpact}</span>
                                    </div>
                                    <div class="analysis-item">
                                        <span class="label">Topic Relevance:</span>
                                        <span class="value">${sentiment.analysis.topicRelevance}</span>
                                    </div>
                                    <div class="analysis-item">
                                        <span class="label">Content Density:</span>
                                        <span class="value">${sentiment.analysis.contentDensity}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="trend-score">
                                <div class="score-circle ${sentiment.score > 0 ? 'positive' : sentiment.score < 0 ? 'negative' : 'neutral'}">
                                    <div class="impact-ring" style="background: conic-gradient(var(--primary-color) ${sentiment.impact}%, transparent ${sentiment.impact}%)"></div>
                                </div>
                                <span>Impact Score</span>
                                <span class="impact-value">${sentiment.impact}%</span>
                            </div>
                        </div>
                        
                        <a href="${article.link}" target="_blank" class="explore-link">Explore More</a>
                    </div>
                `;
            }

            resultsContainer.innerHTML = html;

            // Initialize the trend chart
            const ctx = document.getElementById('trendChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: trendData.map(d => d.date),
                    datasets: [{
                        label: 'Interest Over Time',
                        data: trendData.map(d => d.value),
                        borderColor: '#00ffd5',
                        backgroundColor: 'rgba(0, 255, 213, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: '#00ffd5'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(26, 26, 26, 0.9)',
                            titleColor: '#00ffd5',
                            bodyColor: '#ffffff',
                            borderColor: '#00ffd5',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#00ffd5',
                                maxRotation: 45,
                                minRotation: 45
                            }
                        },
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: {
                                color: 'rgba(0, 255, 213, 0.1)'
                            },
                            ticks: {
                                color: '#00ffd5'
                            }
                        }
                    }
                }
            });
        } else {
            resultsContainer.innerHTML = '<p class="error">No trends found for this topic. Try a different search term.</p>';
        }
    } catch (error) {
        resultsContainer.innerHTML = '<p class="error">Unable to fetch trends at the moment. Please try again later.</p>';
        console.error('Error:', error);
    }
}

// Add event listener for Enter key
document.getElementById('topicInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getTrends();
    }
});

// Function to update user email display
function updateUserEmailDisplay() {
    const userEmail = localStorage.getItem('trendsPulseUserEmail');
    const userEmailElement = document.getElementById('userEmail');
    if (userEmail) {
        userEmailElement.innerHTML = `
            <span title="Logged in email">👤 ${userEmail}</span>
            <button class="logout-btn" onclick="handleLogout()" title="Logout">
                <i>🚪</i> Logout
            </button>
        `;
    } else {
        userEmailElement.textContent = '';
    }
}

// Handle logout
function handleLogout() {
    // Clear user session data but keep used trials record
    localStorage.removeItem('trendsPulseUserEmail');
    localStorage.removeItem('trendsPulseTrialUsed');
    
    // Update display
    updateUserEmailDisplay();
    
    // Show success message
    const message = document.createElement('div');
    message.className = 'payment-message success';
    message.innerHTML = `
        <div class="message-content">
            <h3>👋 Logged Out Successfully</h3>
            <p>Come back soon!</p>
        </div>
    `;
    document.body.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 3000);

    // Redirect to home page if not already there
    if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
        window.location.href = 'index.html';
    }
}

// Call updateUserEmailDisplay when the page loads
document.addEventListener('DOMContentLoaded', updateUserEmailDisplay);

// Update the sign-up form submission to include email display update
function handleSignUpSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('signupEmail').value;
    localStorage.setItem('trendsPulseUserEmail', email);
    localStorage.setItem('trendsPulseTrialUsed', 'false');
    updateUserEmailDisplay();
    closeModal();
    showSuccessMessage('Successfully signed up! You can now use your free trial.');
} 
