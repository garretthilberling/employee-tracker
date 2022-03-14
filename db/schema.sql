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
    -- id defaults to 0 because no one has an id of 0. 
    manager_id INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (role_id) REFERENCES roles(r_id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employees(e_id) ON DELETE CASCADE
);

SELECT e.e_id as id, concat(e.first_name,' ', e.last_name) AS employee, concat(m.first_name, ' ', m.last_name) AS manager, e.role_title AS title, e.role_salary AS salary FROM (SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.r_id) AS e, employees m WHERE m.e_id = e.manager_id;

SELECT e.e_id as id, concat(e.first_name,' ', e.last_name) AS employee, e.role_title AS title, e.role_salary AS salary, e.dept_name AS department, CASE WHEN e.manager_id = e.e_id THEN concat('N/A') ELSE concat(m.first_name, ' ', m.last_name) END AS manager FROM (SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.r_id LEFT JOIN departments ON roles.dept_id = departments.d_id) AS e, employees m WHERE m.e_id = e.manager_id;