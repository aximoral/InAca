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
    
    print("Clearing old data...")
    db.query(models.Enrollment).delete()
    db.query(models.CourseSkill).delete()
    db.query(models.Course).delete()
    db.query(models.Project).delete()
    db.query(models.Application).delete()
    db.query(models.JobSkill).delete()
    db.query(models.Job).delete()
    db.query(models.UserSkill).delete()
    db.query(models.Skill).delete()
    db.query(models.Profile).delete()
    db.query(models.User).delete()
    db.commit()

    print("Creating core skills...")
    skill_names = ["Python", "React", "Machine Learning", "Data Analysis", "Project Management", "UI/UX Design", "Cloud Computing", "Cybersecurity", "DevOps"]
    skills = []
    for name in skill_names:
        skill = models.Skill(name=name, category="Technical")
        db.add(skill)
        skills.append(skill)
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
    courses = []
    for _ in range(8):
        c = models.Course(
            title=fake.catch_phrase() + " Certification",
            provider=random.choice(["Coursera", "Udemy", "edX", "TechCorp Academy"]),
            description=fake.text(),
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
