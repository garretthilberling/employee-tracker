const db = require('../db/connect');
const cTable = require('console.table');
const inquirer = require('inquirer');

function programInit() {
    console.log('');
    console.log('Welcome to your Employee Tracker database.');
    setTimeout(() => {
        homeMenu();
    }, 1000);
}

function homeMenu() {
    console.log('');
    inquirer
        .prompt(
            {
                type: 'list',
                name: 'home',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a role', 'Add a department', 'Add an employee', 'Update an employee', 'Exit']
            }
        )
        .then (
            ({ home }) => {
                if (home === 'View all departments') {
                    viewDepts();
                } else if (home === 'View all roles') {
                    viewRoles();
                } else if (home === 'View all employees') {
                    viewEmployees();
                } else if (home === 'Add a role') {
                    addRole();
                } else if (home === 'Add a department') {
                    addDepartment();
                } else if (home === 'Add an employee') {
                    addEmployee();
                } else if (home === 'Update an employee') {
                    updateEmployee();
                } else if (home === 'Exit') {
                    endProgram();
                }
            }
        )
}

function viewDepts () {
    const sql = `SELECT d_id AS id, dept_name AS name FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) {
        console.log(err.message);
        }
        console.log('');
        console.table(rows);
        setTimeout(() => {
            homeMenu();
        }, 800);
    });
}

function viewRoles () {
    //id, title, department, salary
    const sql = `SELECT r_id AS id, role_title AS title, dept_name AS department, role_salary AS salary FROM roles
    LEFT JOIN departments ON roles.dept_id = departments.d_id`;
    db.query(sql, (err, rows) => {
        if (err) {
        console.log(err.message);
        }
        console.log('');
        console.table(rows);
        setTimeout(() => {
            homeMenu();
        }, 800);
    });
}

function viewEmployees () {
    // id, first_name, last_name, title, department, salary, manager
    const sql = `SELECT e_id as id, first_name, last_name, role_title AS title, role_salary AS salary, manager_name FROM employees
    LEFT JOIN roles ON employees.role_id = roles.r_id`;
    db.query(sql, (err, rows) => {
        if (err) {
        console.log(err.message);
        }
        console.table(rows);
        setTimeout(() => {
            homeMenu();
        }, 800);
    });
}

function addRole () {
    // to use our data as choices in inquirer we need to return it as a promise and pass it through with resolve
    const getDepartments = new Promise((resolve, reject) => {
        var departmentsArr = [];
        const sql = `SELECT dept_name FROM departments`;
        db.query(sql, (err, rows) => {
            if (err) {
            console.log(err.message);
            }        
            for (var i = 0; i < rows.length; i++) {
                departmentsArr.push(Object.values(rows[i])[0]);
                    // rows is an array of objects. 
                    // we get the value of each object in the array which would convert it 
                    // to an array of strings. to avoid pushing an array into an array each  
                    // time we push item [0] of the rows array into departmentsArr.
            }
            resolve(departmentsArr);
        });
    });

    getDepartments
    .then((departmentsArr) =>{
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'deptId',
                message: 'Choose the department of your role',
                choices:  departmentsArr,
                filter: deptIdInput => {
                    if (deptIdInput) {
                        return departmentsArr.indexOf(deptIdInput);
                    }
                }
            },
            {
                type: 'text',
                name: 'roleTitle',
                message: 'What is the title of your role?',
                validate: roleTitleInput => {
                    if (roleTitleInput) {
                        return true;
                    } else {
                        console.log('Please enter a title for your role!')
                        return false;
                    }
                }
            },
            {
                type: 'number',
                name: 'roleSalary',
                message: 'What is the salary of your role?',
                validate: roleSalaryInput => {
                    if (!roleSalaryInput || roleSalaryInput === NaN) {
                        console.log('');
                        console.log('Please enter a valid salary for your role! (plain number, no formatting)')
                        return false;
                    } else {
                        return true;
                    }
                },
                filter: roleSalaryInput => {
                    if (!roleSalaryInput || roleSalaryInput === NaN) {
                        return '';
                    } else {
                        return roleSalaryInput;
                    }

                }
            }
        ])
        .then(
            ({ deptId, roleTitle, roleSalary }) => {
                const sql = "INSERT INTO roles (dept_id, role_title, role_salary) VALUES (?,?,?)" 
                const query = [deptId+1, roleTitle, roleSalary] //deptId starts at 0 so we add one so it accurately refelctes the dept the roles is under
                db.query(sql, query, (err, rows) => {
                    if (err) {
                    console.log(err.message);
                    }        
                    console.table(rows);
                    homeMenu();
                });
            }
        )
        
    });
        
}

function addDepartment () {
    inquirer
    .prompt([
        {
            type: 'text',
            name: 'newDept',
            message: 'Enter the department name:'
        }
    ])
    .then(
        ({ newDept }) => {
            const sql = "INSERT INTO departments (dept_name) VALUES (?)";
                const query = [newDept];
                db.query(sql, query, (err, rows) => {
                    if (err) {
                    console.log(err.message);
                    }        
                    console.table(rows);
                    homeMenu();
                });
        }
    )
}

function addEmployee () {
    // to get the job titles from our database
    const getTitles = new Promise((resolve, reject) => {
        var titlesArr = [];
        const sql = `SELECT role_title FROM roles`;
        db.query(sql, (err, rows) => {
            if (err) {
            console.log(err.message);
            }        
            for (var i = 0; i < rows.length; i++) {
                titlesArr.push(Object.values(rows[i])[0]); // same as in addRole()!
            }
            resolve(titlesArr);
        });
    });
    // to get a list of managers for user to choose from
    const getManagerList = new Promise((resolve, reject) => {
        var managerArr = [];
        const sql = `SELECT first_name, last_name FROM employees WHERE manager_id = TRUE`;
        db.query(sql, (err, rows) => {
            if (err) {
            console.log(err.message);
            }        
            for (var i = 0; i < rows.length; i++) {
                managerArr.push(Object.values(rows[i])[0] + ' ' + Object.values(rows[i])[1]); // we need to get the first and last name
            }
            managerArr.push("Employee's manager not listed");
            resolve(managerArr);
        });
    });
    // Promise.all([promises]) allows use to run multiple promises at once so we can pass through the data from each.
    Promise.all([getTitles, getManagerList])
    .then(([titlesArr,managerArr]) => {
        inquirer
        .prompt([
            {
                type: 'text',
                name: 'firstname',
                message: 'Employee First Name:',
                validate: firstnameInput => {
                    if (firstnameInput) {
                        return true;
                    } else {
                        console.log('Please enter a first name!')
                        return false;
                    }
                }
            },
            {
                type: 'text',
                name: 'lastname',
                message: 'Employee Last Name:',
                validate: lastnameInput => {
                    if (lastnameInput) {
                        return true;
                    } else {
                        console.log('Please enter a last name!')
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'roleId',
                message: "Choose the employee's role title",
                choices:  titlesArr,
                filter: roleIdInput => {
                    if (roleIdInput) {
                        return titlesArr.indexOf(roleIdInput);
                    }
                }
            },
            {
                type: 'confirm',
                name: 'isManagerConfirm',
                message: 'Is this employee a manager that oversees other employees?'
            },
            {
                type: 'list',
                name: 'managerName',
                message: 'Select name of manager',
                when: ({ isManagerConfirm }) => {
                    if (!isManagerConfirm) {
                        return true;
                    } else {
                        return false;
                    }
                },
                choices: managerArr
            }
        ])
        .then(
            ({ firstname, lastname, roleId, isManagerConfirm, managerName }) => {
                const sql = "INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_name) VALUES (?,?,?,?,?)";
                const query = [firstname, lastname, roleId+1, isManagerConfirm, managerName];
                db.query(sql, query, (err, rows) => {
                    if (err) {
                    console.log(err.message);
                    }        
                    console.table(rows);
                    homeMenu();
                });
            }
        )
    })
    
}

function updateEmployee () {
    const sql = `SELECT role_title FROM roles`;
    db.query(sql, (err, rows) => {
        if (err) {
        console.log(err.message);
        }
        console.table(rows);
    });
}

function endProgram () {
    console.log('');
    console.log('Thank you for using Employee Tracker!')
    setTimeout(() =>{
        console.log('');
        console.log(`                                   ~ Goodbye`);
    }, 800);
    setTimeout(() =>{
        process.exit(1);
    }, 1300);
}

module.exports = programInit;