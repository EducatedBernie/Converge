"""
Call Claude once at simulation start to generate a persona×variant conversion matrix.
Returns a dict keyed by (persona_name, variant_id) -> probability.
Falls back to dot-product scoring if the API call fails.
"""
import json
import anthropic
from config import ANTHROPIC_API_KEY
from engine.conversion import compute_conversion_probability


def build_scoring_prompt(personas, steps, variants):
    """Build the prompt that asks Claude to score all persona-variant pairs."""
    persona_block = ""
    for p in personas:
        persona_block += f"\n- **{p.name}**: {p.description}"

    variant_block = ""
    for v in variants:
        step_name = next((s.name for s in steps if s.id == v.step_id), "unknown")
        c = v.content
        variant_block += (
            f"\n- **V{v.id}** (Step: {step_name}): "
            f"headline=\"{c.get('headline', '')}\", "
            f"subtext=\"{c.get('subtext', '')}\", "
            f"cta=\"{c.get('cta', '')}\""
        )

    prompt = f"""You are simulating user behavior for an onboarding funnel A/B testing system.

Below are 5 user personas and {len(variants)} onboarding flow variants across 4 funnel steps (welcome, use_case, first_task, conversion).

**Personas:**{persona_block}

**Variants:**{variant_block}

For each persona-variant pair, estimate the probability (0.0 to 1.0) that this persona would convert (proceed to the next step) when shown this variant.

CRITICAL realism constraints — this must model a real SaaS onboarding funnel:
- Welcome step: best-case conversion is 0.40-0.55. Poor matches: 0.15-0.25.
- Use case step: best-case 0.35-0.50. Poor matches: 0.10-0.20.
- First task step: best-case 0.30-0.45. Poor matches: 0.10-0.20.
- Conversion step: best-case 0.20-0.35. Poor matches: 0.05-0.15.
- NO probability above 0.55. Real funnels have massive drop-off.
- The total end-to-end conversion rate (all 4 steps) should be roughly 2-8% for most persona-variant paths.
- A well-matched persona-variant pair should still only convert ~40-50% at step 1.
- Step context matters: anxious users hesitate most at the conversion step, impatient users drop off when content is long, etc.

Return ONLY a JSON object with this exact structure — no other text:
{{
  "scores": [
    {{"persona": "<name>", "variant_id": <id>, "probability": <float>}},
    ...
  ]
}}

Include one entry for every persona-variant combination ({len(personas) * len(variants)} total)."""

    return prompt


def generate_conversion_matrix(personas, steps, variants):
    """Call Claude to generate persona×variant conversion probabilities.
    Returns dict of (persona_name, variant_id) -> float probability."""

    matrix = {}

    # Try Claude API
    if ANTHROPIC_API_KEY:
        try:
            client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
            prompt = build_scoring_prompt(personas, steps, variants)

            response = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=2048,
                messages=[{"role": "user", "content": prompt}],
            )

            text = response.content[0].text.strip()
            # Handle potential markdown code fences
            if text.startswith("```"):
                text = text.split("\n", 1)[1]
                text = text.rsplit("```", 1)[0]

            data = json.loads(text)
            for entry in data["scores"]:
                key = (entry["persona"], entry["variant_id"])
                prob = max(0.05, min(0.55, float(entry["probability"])))
                matrix[key] = prob

            print(f"[scorer] Claude generated {len(matrix)} conversion scores")
            return matrix

        except Exception as e:
            print(f"[scorer] Claude API failed ({e}), falling back to dot-product")

    # Fallback: dot-product scoring
    for p in personas:
        for v in variants:
            prob = compute_conversion_probability(p.preferences, v.features)
            matrix[(p.name, v.id)] = prob

    print(f"[scorer] Using dot-product fallback ({len(matrix)} scores)")
    return matrix
