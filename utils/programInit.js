const db = require("../db/connect");
const cTable = require("console.table");
const inquirer = require("inquirer");

function programInit() {
  console.log("");
  console.log("Welcome to your Employee Tracker database.");
  setTimeout(() => {
    homeMenu();
  }, 1000);
}

function homeMenu() {
  console.log("");
  inquirer
    .prompt({
      type: "list",
      name: "home",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "View employees by department",
        "Add a role",
        "Add a department",
        "Add an employee",
        "Update an employee",
        "Exit",
      ],
    })
    .then(({ home }) => {
      if (home === "View all departments") {
        viewDepts();
      } else if (home === "View all roles") {
        viewRoles();
      } else if (home === "View all employees") {
        viewEmployees();
      } else if (home === "View employees by department") {
        viewEmployeesByDept();
      } else if (home === "Add a role") {
        addRole();
      } else if (home === "Add a department") {
        addDepartment();
      } else if (home === "Add an employee") {
        addEmployee();
      } else if (home === "Update an employee") {
        updateEmployee();
      } else if (home === "Exit") {
        endProgram();
      }
    });
}

function viewDepts() {
  const sql = `SELECT d_id AS id, dept_name AS name FROM departments`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err.message);
    }
    console.log("");
    console.table(rows);
    setTimeout(() => {
      homeMenu();
    }, 800);
  });
}

function viewRoles() {
  //id, title, department, salary
  const sql = `SELECT r_id AS id, role_title AS title, dept_name AS department, role_salary AS salary FROM roles
    LEFT JOIN departments ON roles.dept_id = departments.d_id`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err.message);
    }
    console.log("");
    console.table(rows);
    setTimeout(() => {
      homeMenu();
    }, 800);
  });
}

function viewEmployees() {
  // id, first_name, last_name, title, department, salary, manager
  const sql = ` SELECT e.e_id as id, concat(e.first_name,' ', e.last_name) AS employee, e.role_title AS title, e.role_salary AS salary, e.dept_name AS department, 
                CASE WHEN e.manager_id = e.e_id THEN concat('N/A') ELSE concat(m.first_name, ' ', m.last_name) END AS manager 
                FROM (SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.r_id LEFT JOIN departments ON roles.dept_id = departments.d_id) AS e, employees m 
                WHERE m.e_id = e.manager_id; `;
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

function viewEmployeesByDept() {
    const getDepartments = new Promise((resolve, reject) => {
        var departmentsArr = [];
        const sql = `SELECT dept_name FROM departments`;
        db.query(sql, (err, rows) => {
          if (err) {
            console.log(err.message);
          }
          for (var i = 0; i < rows.length; i++) {
            departmentsArr.push(Object.values(rows[i])[0]);
          }
          resolve(departmentsArr);
        });
      });
    
      getDepartments.then((departmentsArr) => {
        inquirer
          .prompt([
            {
                type: "list",
                name: "deptId",
                message: "Choose the department of your role",
                choices: departmentsArr,
                filter: (deptIdInput) => {
                  if (deptIdInput) {
                    return departmentsArr.indexOf(deptIdInput);
                }
              }
            }
      ])
      .then(({ deptId }) => {
        const sql =
        `SELECT e_id as id, first_name, last_name, role_title AS title, role_salary AS salary, manager_name FROM employees
        LEFT JOIN roles ON employees.role_id = roles.r_id
        WHERE dept_id = ?`;
        const query = [deptId+1]; 
        db.query(sql, query, (err, rows) => {
        if (err) {
          console.log(err.message);
        }
        console.table(rows);
        homeMenu();
      });
      });
  });
}

function addRole() {
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

  getDepartments.then((departmentsArr) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "deptId",
          message: "Choose the department of your role",
          choices: departmentsArr,
          filter: (deptIdInput) => {
            if (deptIdInput) {
              return departmentsArr.indexOf(deptIdInput);
            }
          },
        },
        {
          type: "text",
          name: "roleTitle",
          message: "What is the title of your role?",
          validate: (roleTitleInput) => {
            if (roleTitleInput) {
              return true;
            } else {
              console.log("Please enter a title for your role!");
              return false;
            }
          },
        },
        {
          type: "number",
          name: "roleSalary",
          message: "What is the salary of your role?",
          validate: (roleSalaryInput) => {
            if (!roleSalaryInput || roleSalaryInput === NaN) {
              console.log("");
              console.log(
                "Please enter a valid salary for your role! (plain number, no formatting)"
              );
              return false;
            } else {
              return true;
            }
          },
          filter: (roleSalaryInput) => {
            if (!roleSalaryInput || roleSalaryInput === NaN) {
              return "";
            } else {
              return roleSalaryInput;
            }
          },
        },
      ])
      .then(({ deptId, roleTitle, roleSalary }) => {
        const sql =
          "INSERT INTO roles (dept_id, role_title, role_salary) VALUES (?,?,?)";
        const query = [deptId + 1, roleTitle, roleSalary]; //deptId starts at 0 so we add one so it accurately refelctes the dept the roles is under
        db.query(sql, query, (err, rows) => {
          if (err) {
            console.log(err.message);
          }
          console.log('');
            console.log(`                                   Success!`);
            inquirer
            .prompt (
              {
                type: 'confirm',
                name: 'results',
                message: 'See results?'
              }
            ).then(({ results }) => {
              if (results) {
                console.log('');
                viewRoles();
              } else {
                homeMenu();
              }
            });
        });
      });
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "text",
        name: "newDept",
        message: "Enter the department name:",
      },
    ])
    .then(({ newDept }) => {
      const sql = "INSERT INTO departments (dept_name) VALUES (?)";
      const query = [newDept];
      db.query(sql, query, (err, rows) => {
        if (err) {
          console.log(err.message);
        }
        console.log('');
            console.log(`                                   Success!`);
            inquirer
            .prompt (
              {
                type: 'confirm',
                name: 'results',
                message: 'See results?'
              }
            ).then(({ results }) => {
              if (results) {
                console.log('');
                viewDepts();
              } else {
                homeMenu();
              }
            });
      });
    });
}

function addEmployee() {
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
    const sql = `SELECT first_name, last_name FROM employees FULL OUTER JOIN ON employees.manager_id = employees.e_id`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err.message);
      }
      for (var i = 0; i < rows.length; i++) {
        managerArr.push(
          Object.values(rows[i])[0] + " " + Object.values(rows[i])[1]
        ); // we need to get the first and last name
      }
      managerArr.push("Employee's manager not listed");
      resolve(managerArr);
    });
  });
  // we get the ids the same way
  const getManIdList = new Promise((resolve, reject) => {
    var manIdArr = [];
    const sql = `SELECT e_id FROM employees WHERE is_manager = 1`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err.message);
      }
      for (var i = 0; i < rows.length; i++) {
        manIdArr.push(
          Object.values(rows[i])[0]
        );
      }
      resolve(manIdArr);
    });
  });
  // Promise.all([promises]) allows use to run multiple promises at once so we can pass through the data from each.
  Promise.all([getTitles, getManagerList, getManIdList]).then(([titlesArr, managerArr, manIdArr]) => {
    inquirer
      .prompt([
        {
          type: "text",
          name: "firstname",
          message: "Employee First Name:",
          validate: (firstnameInput) => {
            if (firstnameInput) {
              return true;
            } else {
              console.log("Please enter a first name!");
              return false;
            }
          },
        },
        {
          type: "text",
          name: "lastname",
          message: "Employee Last Name:",
          validate: (lastnameInput) => {
            if (lastnameInput) {
              return true;
            } else {
              console.log("Please enter a last name!");
              return false;
            }
          },
        },
        {
          type: "list",
          name: "roleId",
          message: "Choose the employee's role title",
          choices: titlesArr,
          filter: (roleIdInput) => {
            if (roleIdInput === "Employee's manager not listed") {
              return 0; // no one has an e_id of 0, so no manager will be assigned.
            } else {
              return titlesArr.indexOf(roleIdInput);
            }
          },
        },
        {
          type: "confirm",
          name: "isManagerConfirm",
          message: "Is this employee a manager that oversees other employees?",
        },
        {
          type: "list",
          name: "managerName",
          message: "Select name of manager",
          when: ({ isManagerConfirm }) => {
            if (!isManagerConfirm) {
              return true;
            } else {
              return false;
            }
          },
          choices: managerArr,
        }
      ])
      .then(
        ({ firstname, lastname, roleId, isManagerConfirm, managerName }) => {
          const getIndex = () => {
            return managerArr.indexOf(managerName); // we set up the manIdArr exactly the same as this array so we can use the index of this answer to get the corresponding manager_id
          }
          const getManId = () => {
            return manIdArr.indexOf(getIndex);
          }
          const sql =
            `INSERT INTO employees (first_name, last_name, role_id, is_manager, manager_name, manager_id) VALUES (?,?,?,?,?,?)`;
          const query = [
            firstname,
            lastname,
            (roleId + 1),
            isManagerConfirm,
            managerName,
            getManId
          ]; 
          db.query(sql, query, (err, rows) => {
            if (err) {
              console.log(err.message);
            }
            console.log('');
            console.log(`                                   Success!`);
            inquirer
            .prompt (
              {
                type: 'confirm',
                name: 'results',
                message: 'See results?'
              }
            ).then(({ results }) => {
              if (results) {
                console.log('');
                viewEmployees();
              } else {
                homeMenu();
              }
            })
          });
        }
      );
  });
}

function updateEmployee() {
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

  const getEmployees = new Promise((resolve, reject) => {
    var employeesArr = [];
    const sql = `SELECT first_name, last_name FROM employees`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err.message);
      }
      for (var i = 0; i < rows.length; i++) {
        employeesArr.push(
          Object.values(rows[i])[0] + " " + Object.values(rows[i])[1]
        ); // same as in addRole()!
      }
      resolve(employeesArr);
    });
  });

  Promise.all([getTitles, getEmployees]).then(([titlesArr, employeesArr]) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeName",
          message: "Which employee would you like to update?",
          choices: employeesArr,
          filter: (employeeNameInput) => {
            if (employeeNameInput) {
              return employeesArr.indexOf(employeeNameInput);
            } //since the list will be ordered by id we can return the index and use that as e_id
          },
        },
        {
          type: "list",
          name: "employeeRole",
          message: "Select the new role for this employee.",
          choices: titlesArr,
          filter: (employeeRoleInput) => {
            if (employeeRoleInput) {
              return titlesArr.indexOf(employeeRoleInput);
            }
          },
        },
      ])
      .then(({ employeeName, employeeRole }) => {
        const sql = "UPDATE employees SET role_id = ? WHERE e_id = ?";
        const query = [employeeRole + 1, employeeName + 1];
        db.query(sql, query, (err, rows) => {
          if (err) {
            console.log(err.message);
          }
          console.log('');
            console.log(`             Success!`);
            inquirer
            .prompt (
              {
                type: 'confirm',
                name: 'results',
                message: 'See results?'
              }
            ).then(({ results }) => {
              if (results) {
                console.log('');
                viewEmployees();
              } else {
                homeMenu();
              }
            })
        });
      });
  });
}

function endProgram() {
  console.log("");
  console.log("Thank you for using Employee Tracker!");
  setTimeout(() => {
    console.log("");
    console.log(`                     Goodbye`);
  }, 800);
  setTimeout(() => {
    process.exit(1); //exits the terminal process
  }, 1300);
}

module.exports = programInit;