import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "returns.db")

def init_db():
    """Initializes the local SQLite database and creates the returns table if it doesn't exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS processed_returns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT,
            category TEXT,
            grade TEXT,
            confidence_score REAL,
            is_fraud INT,
            grading_justification TEXT,
            recommended_route TEXT,
            value_recovery INT,
            routing_reasoning TEXT,
            image_path TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def save_return_record(data, image_path: str):
    """Saves a parsed Gemini grading result directly into SQLite."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO processed_returns (
            product_name, category, grade, confidence_score, is_fraud, 
            grading_justification, recommended_route, value_recovery, routing_reasoning, image_path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.product_name,
        data.detected_category,
        data.grade,
        data.confidence_score,
        1 if data.is_fraud_suspected else 0,
        data.grading_justification,
        data.recommended_route,
        data.estimated_value_recovery_percentage,
        data.routing_reasoning,
        image_path
    ))
    
    conn.commit()
    conn.close()

def get_all_returns():
    """Fetches all history items to display on your local frontend dashboard."""
    conn = sqlite3.connect(DB_PATH)
    # Allows fetching rows as dictionaries for easy JSON serialization
    conn.row_factory = sqlite3.Row 
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM processed_returns ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

# Run initialization when file is imported/executed
init_db()