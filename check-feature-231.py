#!/usr/bin/env python3
"""Check Feature 231 dependencies to verify no partial update occurred"""

import json
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from api.database import Feature, create_database

PROJECT_DIR = Path(__file__).parent.resolve()
engine, session_maker = create_database(PROJECT_DIR)
session = session_maker()

try:
    feature_a = session.query(Feature).filter(Feature.id == 231).first()
    feature_b = session.query(Feature).filter(Feature.id == 232).first()

    if feature_a:
        print(f"Feature A (ID 231):")
        print(f"  Name: {feature_a.name}")
        print(f"  Dependencies: {feature_a.dependencies}")
    else:
        print("Feature A (ID 231) not found")

    if feature_b:
        print(f"\nFeature B (ID 232):")
        print(f"  Name: {feature_b.name}")
        print(f"  Dependencies: {feature_b.dependencies}")
    else:
        print("Feature B (ID 232) not found")
finally:
    session.close()
