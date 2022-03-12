INSERT INTO departments (dept_name)
VALUES
('Sales'),
('Customer Service'),
('Marketing'),
('Software Development'),
('Web Development');

INSERT INTO roles (role_title, dept_id, role_salary)
VALUES
('Sales Representative', 1, 80000),
('Customer Service Agent', 2, 60000),
('SEO Specialist', 3, 60000),
('Front End Software Developer (Senior)', 4, 100000),
('Back End Software Developer (Senior)', 4, 100000),
('Full Stack Web Developer (Senior)', 5, 90000);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Mitch', 'Mitchell', 1, 1)