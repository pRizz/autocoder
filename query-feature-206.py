#!/usr/bin/env python3
import sqlite3
import json

db = sqlite3.connect('features.db')
db.row_factory = sqlite3.Row
cursor = db.cursor()

# Get feature 206
cursor.execute('SELECT * FROM features WHERE id = 206')
row = cursor.fetchone()
if row:
    print(json.dumps(dict(row), indent=2, default=str))
else:
    print("Feature 206 not found")
    # Show max id
    cursor.execute('SELECT MAX(id), COUNT(*) FROM features')
    max_id, count = cursor.fetchone()
    print(f"Max ID: {max_id}, Total features: {count}")

db.close()
