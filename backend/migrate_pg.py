from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text('ALTER TABLE profiles ADD COLUMN github_url VARCHAR;'))
        conn.commit()
    except Exception as e:
        print(f"github_url error: {e}")

    try:
        conn.execute(text('ALTER TABLE profiles ADD COLUMN linkedin_url VARCHAR;'))
        conn.commit()
    except Exception as e:
        print(f"linkedin_url error: {e}")

    try:
        conn.execute(text('ALTER TABLE profiles ADD COLUMN resume_path VARCHAR;'))
        conn.commit()
    except Exception as e:
        print(f"resume_path error: {e}")
        
print("PostgreSQL Migration Complete!")
