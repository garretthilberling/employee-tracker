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
('Front End Software Developer', 4, 100000),
('Back End Software Developer', 4, 100000),
('Full Stack Web Developer', 5, 90000);

INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_name)
VALUES
-- these are the managers of each department. managers report to CEO Jeremiah Jeffery
('Mitch', 'Mitchell', 1, 1, 'Jeremiah Jeffery'), 
('Ricky', 'Randall', 3, 1, 'Jeremiah Jeffery'),
('Rebecca', 'Rogers', 2, 1, 'Jeremiah Jeffery'),
('Samantha', 'Smith', 4, 1, 'Jeremiah Jeffery'),
('Quincy', 'Quiverton', 5, 1, 'Jeremiah Jeffery'),
('Andrea', 'Anderson', 6, 1, 'Jeremiah Jeffery');

