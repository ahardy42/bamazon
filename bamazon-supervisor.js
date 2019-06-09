var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require("table");

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'bamazon',
    user: 'root',
    password: 'root'
});

// ========================= logging functions ===================================

function printProductSales(result) {
    var data = [];
    var tableCols = ["Department ID", "Department Name", "Overhead Costs", "Product Sales", "Profit"];
    data.push(tableCols);
    result.forEach(element => {
        // get the row and push the row
        var row = [element.department_id, element.department_name, element.overhead_costs, element.sales, element.profit]
        data.push(row);
    });
    var output = table.table(data);
    console.log(output);
};

function printDepartments(result) {
    var data = [];
    var tableCols = ["Department ID", "Department Name", "Overhead Costs"];
    data.push(tableCols);
    result.forEach(element => {
        var row = [element.department_id, element.department_name, element.overhead_costs];
        data.push(row);
    });
    var output = table.table(data);
    console.log(output);
}

// ========================= mysql queries ===================================

function getSalesData(printFunc) {
    var sql = `SELECT products.department_name, departments.department_id, departments.overhead_costs, SUM(products.sales) AS sales, SUM(products.sales) - departments.overhead_costs AS profit
    FROM products
    INNER JOIN departments
    ON products.department_name = departments.department_name
    GROUP BY departments.department_id, department_name, departments.overhead_costs`;
    connection.query(sql, function(err, res) {
        if (err) console.log(err);
        // print results of the query using selected function
        printFunc(res);
    });
    connection.end();
};

function addDepartment(printFunc) {
    var sqlinner = "SELECT * FROM departments";
    var sqlouter = "INSERT INTO departments ( department_name, overhead_costs ) VALUES ( ?, ? )";
    getAnswers(newDeptPrompt).then(function(answers) {
        connection.query(sqlouter, [answers.deptName, answers.overhead], function(err, res) {
            if (err) console.log(err);
            // run a second nested query to print the resulting table
            connection.query(sqlinner, function(err, res) {
                if (err) console.log(err);
                printFunc(res);
            });
            connection.end();
        });
    });
};

function runApp(selection) {
    switch(selection) {
        case "View Product Sales by Department":
            getSalesData(printProductSales);
            break;
        case "Create New Department":
            addDepartment(printDepartments);
            break;
    };
};

// ========================= inquirer prompts ===================================

var listPrompt = [
    {
        type: "list",
        message: "Hello Supervisor, what would you like to do today?",
        choices: [
            "View Product Sales by Department",
            "Create New Department"
        ],
        name: "selection"
    }
];

var newDeptPrompt = [
    {
        type: "input",
        message: "What is the name of the department you would like to add?",
        name: "deptName"
    },
    {
        type: "number",
        message: "What Overhead Costs does this department have?",
        name: "overhead"
    }
];

async function getAnswers(prompts) {
    var answers = await inquirer.prompt(prompts);
    return answers;
};

// ========================= run the app ===================================
getAnswers(listPrompt).then(function(answers) {
    runApp(answers.selection);
});