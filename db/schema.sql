DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    d_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(60) NOT NULL
);

CREATE TABLE roles (
    r_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    role_title VARCHAR(100) NOT NULL,
    dept_id INTEGER,
    role_salary INTEGER NOT NULL,
    FOREIGN KEY (dept_id) REFERENCES departments(d_id) ON DELETE CASCADE
);

CREATE TABLE employees (
    e_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    -- manager_id tells whether or not the employee is a manager
    manager_id BOOLEAN NOT NULL,
    manager_name VARCHAR(60), 
    FOREIGN KEY (role_id) REFERENCES roles(r_id) ON DELETE CASCADE
);