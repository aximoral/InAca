import random
import uuid
from faker import Faker
from database import SessionLocal
import models

fake = Faker()

def generate_mock_embedding():
    return [random.uniform(-1, 1) for _ in range(384)]

def seed_data():
    db = SessionLocal()
    from database import engine, Base
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()

    print("Creating core skills...")
    skill_names = ["Python", "React", "Machine Learning", "Data Analysis", "Project Management", "UI/UX Design", "Cloud Computing", "Cybersecurity", "DevOps"]
    skills = []
    for name in skill_names:
        skill = models.Skill(name=name, category="Technical")
        db.add(skill)
        skills.append(skill)
    db.commit()

    print("Creating Demo Users...")
    demo_creds = [
        ("student@demo.com", models.RoleEnum.STUDENT, "Demo", "Student", "A passionate learner."),
        ("recruiter@demo.com", models.RoleEnum.RECRUITER, "Demo", "Recruiter", "Looking for top talent."),
        ("academician@demo.com", models.RoleEnum.ACADEMICIAN, "Demo", "Professor", "Bridging the gap between theory and practice."),
        ("institution@demo.com", models.RoleEnum.INSTITUTION, "Demo", "Institution", "Managing academic excellence.")
    ]
    
    demo_users = {}
    for email, role, fname, lname, bio in demo_creds:
        u = models.User(email=email, password="password123", role=role)
        db.add(u)
        db.commit()
        db.add(models.Profile(user_id=u.id, first_name=fname, last_name=lname, bio=bio, organization_name="SkillSync Demo", embedding=generate_mock_embedding()))
        demo_users[role] = u
    db.commit()

    print("Creating Institutions and Academicians...")
    # Institutions
    for i in range(3):
        inst = models.User(email=fake.email(), role=models.RoleEnum.INSTITUTION)
        db.add(inst)
        db.commit()
        db.add(models.Profile(user_id=inst.id, first_name=fake.company(), last_name="University", organization_name=fake.company() + " University", embedding=generate_mock_embedding()))
    
    # Academicians
    for i in range(5):
        acad = models.User(email=fake.email(), role=models.RoleEnum.ACADEMICIAN)
        db.add(acad)
        db.commit()
        db.add(models.Profile(user_id=acad.id, first_name=fake.first_name(), last_name=fake.last_name(), organization_name="State University", bio="Professor of Computer Science", embedding=generate_mock_embedding()))
    db.commit()

    print("Creating Recruiters and Jobs...")
    recruiter = models.User(email="recruiter@techcorp.com", role=models.RoleEnum.RECRUITER)
    db.add(recruiter)
    db.commit()
    
    db.add(models.Profile(
        user_id=recruiter.id,
        first_name="Alice",
        last_name="Smith",
        organization_name="TechCorp Industries",
        bio="Hiring the best tech talent.",
        embedding=generate_mock_embedding()
    ))

    jobs = []
    for _ in range(10):
        j = models.Job(
            recruiter_id=recruiter.id,
            title=fake.job(),
            description=fake.catch_phrase(),
            embedding=generate_mock_embedding()
        )
        db.add(j)
        jobs.append(j)
    db.commit()

    print("Creating Live Projects & FDPs...")
    for _ in range(5):
        p = models.Project(
            title="Industry Collab: " + fake.catch_phrase(),
            description=fake.text(),
            type=random.choice([models.ProjectTypeEnum.LIVE_PROJECT, models.ProjectTypeEnum.FDP]),
            sponsor_id=recruiter.id
        )
        db.add(p)
    db.commit()

    print("Creating Courses...")
    courses_data = [
        {
            "title": "CS50's Introduction to Programming with Python",
            "provider": "Harvard University / edX",
            "description": "Learn how to read and write code as well as how to test and \"debug\" it. Designed for students with or without prior programming experience.",
            "url": "https://www.edx.org/learn/python/harvard-university-cs50-s-introduction-to-programming-with-python"
        },
        {
            "title": "Machine Learning Specialization",
            "provider": "Stanford / DeepLearning.AI",
            "description": "A foundational online program created in collaboration between DeepLearning.AI and Stanford Online, taught by Andrew Ng.",
            "url": "https://www.coursera.org/specializations/machine-learning-introduction"
        },
        {
            "title": "Google Data Analytics Professional Certificate",
            "provider": "Google / Coursera",
            "description": "Get on the fast track to a career in Data Analytics. Learn in-demand skills like SQL, Tableau, and R programming.",
            "url": "https://www.coursera.org/professional-certificates/google-data-analytics"
        },
        {
            "title": "Meta Front-End Developer Professional Certificate",
            "provider": "Meta / Coursera",
            "description": "Launch your career as a front-end developer. Build job-ready skills for an in-demand career and earn a credential from Meta.",
            "url": "https://www.coursera.org/professional-certificates/meta-front-end-developer"
        },
        {
            "title": "AWS Cloud Practitioner Essentials",
            "provider": "Amazon Web Services",
            "description": "Learn the fundamentals of the AWS Cloud, including basic cloud concepts, security, architecture, and pricing.",
            "url": "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/"
        }
    ]
    
    courses = []
    for data in courses_data:
        c = models.Course(
            title=data["title"],
            provider=data["provider"],
            description=data["description"],
            url=data["url"],
            embedding=generate_mock_embedding()
        )
        db.add(c)
        courses.append(c)
    db.commit()

    print("Creating Students and Applications...")
    students = []
    for _ in range(30):
        student = models.User(email=fake.email(), role=models.RoleEnum.STUDENT)
        db.add(student)
        db.commit()
        students.append(student)
        
        db.add(models.Profile(
            user_id=student.id,
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            organization_name="State University",
            bio=fake.catch_phrase(),
            embedding=generate_mock_embedding()
        ))
        
        # Add random skills
        for skill in random.sample(skills, k=random.randint(2, 5)):
            db.add(models.UserSkill(user_id=student.id, skill_id=skill.id, proficiency=random.randint(1, 5)))
            
        # Add random applications
        for job in random.sample(jobs, k=random.randint(0, 3)):
            db.add(models.Application(student_id=student.id, job_id=job.id, status=random.choice(list(models.ApplicationStatusEnum))))

        # Add random enrollments
        for course in random.sample(courses, k=random.randint(0, 2)):
            db.add(models.Enrollment(student_id=student.id, course_id=course.id, status="COMPLETED"))

    db.commit()
    print("Seed data generated successfully! The DB is fully populated.")

if __name__ == "__main__":
    seed_data()
