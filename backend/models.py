import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, Integer, ForeignKey, Enum, DateTime, Float
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
from sqlalchemy.orm import relationship
from database import Base

class RoleEnum(enum.Enum):
    STUDENT = "STUDENT"
    ACADEMICIAN = "ACADEMICIAN"
    RECRUITER = "RECRUITER"
    INSTITUTION = "INSTITUTION"

class ApplicationStatusEnum(enum.Enum):
    PENDING = "PENDING"
    SHORTLISTED = "SHORTLISTED"
    REJECTED = "REJECTED"

class ProjectTypeEnum(enum.Enum):
    LIVE_PROJECT = "LIVE_PROJECT"
    FDP = "FDP"
    MENTORSHIP = "MENTORSHIP"
    RESEARCH_PROPOSAL = "RESEARCH_PROPOSAL"

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False, default="password123")
    role = Column(Enum(RoleEnum), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    profile = relationship("Profile", back_populates="user", uselist=False)
    skills = relationship("UserSkill", back_populates="user")
    jobs = relationship("Job", back_populates="recruiter")
    applications = relationship("Application", back_populates="student")
    projects = relationship("Project", back_populates="sponsor")
    enrollments = relationship("Enrollment", back_populates="student")
    project_applications = relationship("ProjectApplication", back_populates="academician")

class Profile(Base):
    __tablename__ = "profiles"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    bio = Column(Text, nullable=True)
    organization_name = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)
    embedding = Column(Vector(384), nullable=True)

    user = relationship("User", back_populates="profile")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False, index=True)
    category = Column(String, nullable=True)

    user_skills = relationship("UserSkill", back_populates="skill")
    job_skills = relationship("JobSkill", back_populates="skill")
    course_skills = relationship("CourseSkill", back_populates="skill")

class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.id"))
    proficiency = Column(Integer, nullable=True) # 1-5

    user = relationship("User", back_populates="skills")
    skill = relationship("Skill", back_populates="user_skills")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recruiter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    embedding = Column(Vector(384), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    recruiter = relationship("User", back_populates="jobs")
    required_skills = relationship("JobSkill", back_populates="job")
    applications = relationship("Application", back_populates="job")

class JobSkill(Base):
    __tablename__ = "job_skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"))
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.id"))

    job = relationship("Job", back_populates="required_skills")
    skill = relationship("Skill", back_populates="job_skills")

class Application(Base):
    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"))
    status = Column(Enum(ApplicationStatusEnum), default=ApplicationStatusEnum.PENDING)
    applied_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")

class Course(Base):
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    url = Column(String, nullable=True)
    embedding = Column(Vector(384), nullable=True)
    
    course_skills = relationship("CourseSkill", back_populates="course")
    enrollments = relationship("Enrollment", back_populates="course")

class CourseSkill(Base):
    __tablename__ = "course_skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"))
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.id"))

    course = relationship("Course", back_populates="course_skills")
    skill = relationship("Skill", back_populates="course_skills")

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"))
    status = Column(String, default="ENROLLED") # ENROLLED, COMPLETED

    student = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    type = Column(Enum(ProjectTypeEnum), nullable=False)
    sponsor_id = Column(UUID(as_uuid=True), ForeignKey("users.id")) # Usually a Recruiter
    
    sponsor = relationship("User", back_populates="projects")
    applications = relationship("ProjectApplication", back_populates="project")

class ProjectApplication(Base):
    __tablename__ = "project_applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    academician_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    status = Column(String, default="PENDING")

    academician = relationship("User", back_populates="project_applications")
    project = relationship("Project", back_populates="applications")
