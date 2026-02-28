# Feature dimensions: urgency, detail, social_proof, simplicity, reassurance
# Each persona has a preference vector (0-1) across these dimensions.
# Conversion probability = dot product of persona preferences × variant features.

PERSONAS = [
    {
        "name": "impatient",
        "description": "Wants to get started immediately. Skips long explanations. Responds to urgency and simplicity.",
        "preferences": {
            "urgency": 0.9,
            "detail": 0.1,
            "social_proof": 0.3,
            "simplicity": 0.9,
            "reassurance": 0.2,
        },
    },
    {
        "name": "skeptical",
        "description": "Needs proof before committing. Looks for data, testimonials, and detailed explanations.",
        "preferences": {
            "urgency": 0.2,
            "detail": 0.8,
            "social_proof": 0.9,
            "simplicity": 0.3,
            "reassurance": 0.5,
        },
    },
    {
        "name": "casual",
        "description": "Low commitment, browsing. Responds to easy, low-friction experiences.",
        "preferences": {
            "urgency": 0.3,
            "detail": 0.2,
            "social_proof": 0.4,
            "simplicity": 0.8,
            "reassurance": 0.3,
        },
    },
    {
        "name": "goal_oriented",
        "description": "Knows exactly what they want. Responds to clear value propositions and detailed feature info.",
        "preferences": {
            "urgency": 0.5,
            "detail": 0.9,
            "social_proof": 0.4,
            "simplicity": 0.5,
            "reassurance": 0.3,
        },
    },
    {
        "name": "anxious",
        "description": "Worried about making the wrong choice. Needs reassurance, guarantees, and social proof.",
        "preferences": {
            "urgency": 0.1,
            "detail": 0.5,
            "social_proof": 0.7,
            "simplicity": 0.6,
            "reassurance": 0.9,
        },
    },
]
