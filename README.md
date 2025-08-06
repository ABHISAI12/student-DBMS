Student Database Management System
Project Overview
This is a full-stack web application designed to manage student records within a university or educational institution. It provides a robust backend for data storage and authentication, coupled with a responsive and user-friendly frontend for interacting with the data. The system implements role-based access control, allowing different types of users (Admins, Teachers, Students) to have varying levels of permissions.

This project demonstrates proficiency in modern web development stacks, database design, and secure authentication practices, making it an excellent addition to a developer's portfolio.

Features
User Authentication: Secure login system with hashed passwords using bcryptjs and JSON Web Tokens (JWT) for session management.

Role-Based Access Control (RBAC):

Admins: Full CRUD (Create, Read, Update, Delete) access to student records.

Teachers: Read, Create, and Update access to student records.

Students: Read-only access to student records.

Student Management:

View a comprehensive list of all students.
Add new student records (Admin, Teacher).
Edit existing student details (Admin, Teacher).
Delete student records (Admin only).

Structured Database: A well-normalized MySQL database schema to manage various entities like students, departments, teachers, courses, enrollments, and grades.

Responsive UI: A clean and formal user interface built with React and plain CSS, ensuring usability across different devices.

Technologies Used
This project leverages a modern full-stack architecture:

Frontend
React.js: A JavaScript library for building user interfaces.
Plain CSS: Custom CSS for styling, ensuring a formal and clean aesthetic.
react-router-dom: (Installed, though current app uses state-based view switching) For declarative routing in React applications.
axios: (Installed, though current app uses native fetch) A promise-based HTTP client for making API requests.

Backend
Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.
Express.js: A fast, unopinionated, minimalist web framework for Node.js.
MySQL2 (with Promises): MySQL client for Node.js, providing asynchronous database interactions.
bcryptjs: Library for hashing passwords securely.
jsonwebtoken (JWT): For creating and verifying secure tokens for authentication.
cors: Node.js middleware for enabling Cross-Origin Resource Sharing.
dotenv: For loading environment variables from a .env file.

Database
MySQL: A powerful open-source relational database management system.

Database Schema
The database is named university_db and consists of the following tables, demonstrating a normalized structure with relationships:

users
id (INT, PK, AUTO_INCREMENT)
username (VARCHAR, UNIQUE, NOT NULL)
password (VARCHAR, NOT NULL) - Stores bcrypt hashed passwords.
role (ENUM('admin', 'teacher', 'student'), NOT NULL, DEFAULT 'student')
created_at (TIMESTAMP)

departments
dept_id (INT, PK, AUTO_INCREMENT)
dept_name (VARCHAR, UNIQUE, NOT NULL)
head_of_department (VARCHAR)

students
student_id (INT, PK, AUTO_INCREMENT)
first_name (VARCHAR, NOT NULL)
last_name (VARCHAR, NOT NULL)
email (VARCHAR, UNIQUE, NOT NULL)
date_of_birth (DATE)
enrollment_date (DATE)
major_dept_id (INT, FK to departments)
gpa (DECIMAL(3, 2))
created_at (TIMESTAMP)
updated_at (TIMESTAMP)

teachers
teacher_id (INT, PK, AUTO_INCREMENT)
first_name (VARCHAR, NOT NULL)
last_name (VARCHAR, NOT NULL)
email (VARCHAR, UNIQUE, NOT NULL)
phone_number (VARCHAR)
hire_date (DATE)
dept_id (INT, FK to departments)

courses
course_id (INT, PK, AUTO_INCREMENT)
course_code (VARCHAR, UNIQUE, NOT NULL)
course_title (VARCHAR, NOT NULL)
credits (DECIMAL(2, 1), NOT NULL)
dept_id (INT, FK to departments)

teacher_id (INT, FK to teachers, NULLABLE) - Allows courses to exist without an assigned teacher.

description (TEXT)

enrollments
enrollment_id (INT, PK, AUTO_INCREMENT)
student_id (INT, FK to students, NOT NULL)
course_id (INT, FK to courses, NOT NULL)
enrollment_date (DATE)
semester (VARCHAR)
UNIQUE (student_id, course_id) - Ensures a student enrolls in a course only once.

grades
grade_id (INT, PK, AUTO_INCREMENT)
enrollment_id (INT, FK to enrollments, NOT NULL)
grade (VARCHAR(5), NOT NULL)
grade_date (DATE)


