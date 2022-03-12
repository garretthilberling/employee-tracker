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
    const sql = `SELECT * FROM departments`;
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
    //THEN I am presented with the *job title*, *role id*, the *department* that role belongs to, and the *salary* for that role
    // job title, role id, department, salary
    const sql = `SELECT dept_id, role_title, role_dept, role_salary FROM roles INNER JOIN departments ON roles.role_dept = departments.dept_name`;
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
    const sql = `SELECT role_title FROM roles`;
    db.query(sql, (err, rows) => {
        if (err) {
        console.log(err.message);
        }
        console.table(rows);
    });
}

function addRole () {
    const sql = `SELECT role_title FROM roles`;
    db.query(sql, (err, rows) => {
        if (err) {
        console.log(err.message);
        }
        console.table(rows);
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