from typing import Tuple

import numpy as np

# Feature dimensions — used as fallback when no Claude matrix is available
FEATURE_DIMS = ["urgency", "detail", "social_proof", "simplicity", "reassurance"]


def compute_conversion_probability(persona_prefs: dict, variant_features: dict) -> float:
    """Dot product fallback. Used when Claude scoring is unavailable."""
    persona_vec = np.array([persona_prefs.get(d, 0.0) for d in FEATURE_DIMS])
    variant_vec = np.array([variant_features.get(d, 0.0) for d in FEATURE_DIMS])
    raw = np.dot(persona_vec, variant_vec) / len(FEATURE_DIMS)
    return float(np.clip(raw, 0.0, 1.0))


def simulate_conversion_with_matrix(
    persona_name: str,
    variant_id: int,
    matrix: dict,
    noise: float = 0.08,
) -> Tuple[bool, float]:
    """Use the Claude-generated probability matrix. Returns (converted, match_score)."""
    prob = matrix.get((persona_name, variant_id), 0.3)
    noisy_prob = prob + np.random.uniform(-noise, noise)
    noisy_prob = float(np.clip(noisy_prob, 0.01, 0.99))
    converted = bool(np.random.random() < noisy_prob)
    return converted, prob


def simulate_conversion(persona_prefs: dict, variant_features: dict, noise: float = 0.1) -> Tuple[bool, float]:
    """Dot-product fallback. Returns (converted, match_score)."""
    prob = compute_conversion_probability(persona_prefs, variant_features)
    noisy_prob = prob + np.random.uniform(-noise, noise)
    noisy_prob = float(np.clip(noisy_prob, 0.01, 0.99))
    converted = bool(np.random.random() < noisy_prob)
    return converted, prob
