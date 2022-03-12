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
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a role', 'Add an employee', 'Update an employee', 'Exit']
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
    });
    setTimeout(() => {
        homeMenu();
    }, 800);
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
    });
    setTimeout(() => {
        homeMenu();
    }, 800);
}

function viewEmployees () {
    // id, first_name, last_name, title, department, salary, manager
    const sql = `SELECT e_id as id, first_name, last_name, role_title AS title, role_salary AS salary FROM employees
    LEFT JOIN roles ON employees.role_id = roles.r_id`;
    db.query(sql, (err, rows) => {
        if (err) {
        console.log(err.message);
        }
        console.table(rows);
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
            console.log(departmentsArr);
            resolve(departmentsArr);
            // console.log(rows);
            // console.log(Object.values(rows[1]));
            // console.log(Object.values(rows[1])[0]);
        });
    });

    getDepartments
    .then((departmentsArr) =>{
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'deptName',
                message: 'Choose the department of your role',
                choices:  departmentsArr
            }
        ]);
        
    });
        
}

function addEmployee () {
    const sql = `SELECT role_title FROM roles`;
    db.query(sql, (err, rows) => {
        if (err) {
        console.log(err.message);
        }
        console.table(rows);
    });
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

module.exports = programInit;