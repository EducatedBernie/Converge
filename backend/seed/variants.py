# 2 seed variants per step. Each variant has content (what the user sees)
# and features (0-1 scores on the same dimensions as persona preferences).
# Variant A and B for each step are intentionally different strategies.

VARIANTS = [
    # Step 1: Welcome
    {
        "step_number": 1,
        "generation": 0,
        "content": {
            "headline": "Get started in 30 seconds",
            "subtext": "No setup required. Jump right in.",
            "cta": "Start now",
        },
        "features": {
            "urgency": 0.8,
            "detail": 0.1,
            "social_proof": 0.1,
            "simplicity": 0.9,
            "reassurance": 0.1,
        },
    },
    {
        "step_number": 1,
        "generation": 0,
        "content": {
            "headline": "Trusted by 10,000+ teams worldwide",
            "subtext": "See why leading companies choose us. Read case studies and reviews.",
            "cta": "See the proof",
        },
        "features": {
            "urgency": 0.2,
            "detail": 0.6,
            "social_proof": 0.9,
            "simplicity": 0.3,
            "reassurance": 0.7,
        },
    },
    # Step 2: Use Case
    {
        "step_number": 2,
        "generation": 0,
        "content": {
            "headline": "What brings you here today?",
            "subtext": "Pick your goal and we'll customize your experience.",
            "cta": "Choose your path",
        },
        "features": {
            "urgency": 0.4,
            "detail": 0.3,
            "social_proof": 0.2,
            "simplicity": 0.8,
            "reassurance": 0.4,
        },
    },
    {
        "step_number": 2,
        "generation": 0,
        "content": {
            "headline": "Here's exactly what you can do",
            "subtext": "Detailed feature breakdown with real examples from teams like yours.",
            "cta": "Explore features",
        },
        "features": {
            "urgency": 0.2,
            "detail": 0.9,
            "social_proof": 0.5,
            "simplicity": 0.3,
            "reassurance": 0.4,
        },
    },
    # Step 3: First Task
    {
        "step_number": 3,
        "generation": 0,
        "content": {
            "headline": "Try it yourself — takes 10 seconds",
            "subtext": "Click the button below to create your first item. No commitment.",
            "cta": "Create one now",
        },
        "features": {
            "urgency": 0.7,
            "detail": 0.1,
            "social_proof": 0.1,
            "simplicity": 0.9,
            "reassurance": 0.5,
        },
    },
    {
        "step_number": 3,
        "generation": 0,
        "content": {
            "headline": "Follow this guided walkthrough",
            "subtext": "Step-by-step tutorial with tips from power users. You'll be an expert in 5 minutes.",
            "cta": "Start tutorial",
        },
        "features": {
            "urgency": 0.2,
            "detail": 0.8,
            "social_proof": 0.4,
            "simplicity": 0.4,
            "reassurance": 0.7,
        },
    },
    # Step 4: Conversion
    {
        "step_number": 4,
        "generation": 0,
        "content": {
            "headline": "You're all set — go Pro today",
            "subtext": "Limited time: 50% off your first month. Upgrade now.",
            "cta": "Upgrade now",
        },
        "features": {
            "urgency": 0.9,
            "detail": 0.2,
            "social_proof": 0.3,
            "simplicity": 0.7,
            "reassurance": 0.2,
        },
    },
    {
        "step_number": 4,
        "generation": 0,
        "content": {
            "headline": "Join 10,000+ happy teams",
            "subtext": "30-day money-back guarantee. Cancel anytime. No questions asked.",
            "cta": "Start free trial",
        },
        "features": {
            "urgency": 0.3,
            "detail": 0.4,
            "social_proof": 0.8,
            "simplicity": 0.5,
            "reassurance": 0.9,
        },
    },
]
