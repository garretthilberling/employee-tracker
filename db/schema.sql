DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(60) NOT NULL
);

CREATE TABLE roles (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    role_title VARCHAR(60) NOT NULL,
    role_dpt INTEGER,
    role_salary INTEGER NOT NULL,
    FOREIGN KEY (role_dpt) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(30) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    job_title VARCHAR(60) NOT NULL,
    job_dpt INTEGER,
    job_salary INTEGER,
    FOREIGN KEY (job_dpt) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (job_salary) REFERENCES roles(role_salary) ON DELETE CASCADE
);