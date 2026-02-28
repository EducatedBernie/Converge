import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "converge.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

# Simulation defaults
DEFAULT_USERS_PER_SEC = 5
DEFAULT_TOTAL_USERS = 500
DEFAULT_AGENT_TRIGGER_INTERVAL = 100  # trigger agent every N users

# Persona names for population mix
PERSONA_NAMES = ["impatient", "skeptical", "casual", "goal_oriented", "anxious"]
DEFAULT_POPULATION_MIX = {name: 0.2 for name in PERSONA_NAMES}
