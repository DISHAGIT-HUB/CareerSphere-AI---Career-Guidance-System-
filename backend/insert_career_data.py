from database import SessionLocal
from models import Career, Degree

db = SessionLocal()

careers = [
    {
        "career_name": "AI Engineer",
        "stream": "Science",
        "description": "Build AI systems and machine learning models.",
        "degrees": ["B.Tech Computer Engineering", "B.Sc Artificial Intelligence"]
    },
    {
        "career_name": "Data Scientist",
        "stream": "Science",
        "description": "Analyze large data sets to find insights.",
        "degrees": ["B.Sc Data Science", "B.Tech IT"]
    },
    {
        "career_name": "Chartered Accountant",
        "stream": "Commerce",
        "description": "Financial expert managing accounts and audits.",
        "degrees": ["B.Com", "CA"]
    },
    {
        "career_name": "Graphic Designer",
        "stream": "Arts",
        "description": "Design visual content and branding.",
        "degrees": ["Bachelor of Fine Arts", "BA Design"]
    }
]

for c in careers:

    # Check if career already exists
    existing = db.query(Career).filter(Career.career_name == c["career_name"]).first()

    if existing:
        print(f"{c['career_name']} already exists. Skipping...")
        continue

    career = Career(
        career_name=c["career_name"],
        stream=c["stream"],
        description=c["description"]
    )

    db.add(career)
    db.commit()
    db.refresh(career)

    for d in c["degrees"]:
        degree = Degree(
            degree_name=d,
            duration="3-4 Years",
            career_id=career.id
        )
        db.add(degree)

    db.commit()

print("Career data inserted successfully!")