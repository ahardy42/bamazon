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

function printForSale(result) {
    var data = [];
    var tableCols = ["ID", "Name", "Price", "items in stock"];
    data.push(tableCols);
    result.forEach(element => {
        var row = [element.item_id, element.product_name, element.price, element.stock_quantity];
        data.push(row);
    });
    var output = table.table(data);
    console.log(output);
};

function printLowInventory(result) {
    var data = [];
    var tableCols = ["ID", "Name"];
    data.push(tableCols);
    result.forEach(element => {
        var row = [element.item_id, element.product_name];
        data.push(row);
    });
    var output = table.table(data);
    console.log(`These Products Have Low Inventory:\n${output}`);
};

// ================================ mysql queries =======================================

function getProducts(printFunc) {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) console.log(err);
        // print results of the query using selected function
        printFunc(res);
    });
    connection.end();
};

function runApp(selection) {
    switch (selection) {
        case "Add item to inventory":
            
            getAnswers(inventoryAddPrompt)
            .then(function(answers) {
                var qty = answers.qty;
                var id = answers.id;
                connection.query("UPDATE products SET stock_quantity= ? WHERE item_id= ?", [qty, id], function(err, res) {
                    if (err) console.log(err);
                    console.log(res);
                    getProducts(printForSale);
                });
            });
            break;
        case "Add new Product":
            getAnswers(productAddPrompt)
            .then(function(answers) {
                var name = answers.name;
                var department = answers.department;
                var price = answers.price.toFixed(2);
                var qty = answers.qty;
                connection.query(`INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES (${name},${department},${price},${qty})`, function(err, res) {
                    if (err) console.log(err);
                    console.log(res);
                    getProducts(printForSale);
                });
            });
            break;
        case "View Products for Sale":
            getProducts(printForSale);
            break;
        case "View Low Inventory Items":
            getProducts(printLowInventory);
            break;
    }
};

// ================================= inquirer prompts ===================================

var listPrompt = [
    {
        type: "list",
        message: "Please select an option from below",
        choices: [
            "View Products for Sale",
            "View Low Inventory Items",
            "Add item to inventory",
            "Add new Product"
        ],
        name: "selection"
    }
];

var inventoryAddPrompt = [
    {
        type: "input",
        message: "What ID are you updating?",
        name: "id"
    },
    {
        type: "number",
        message: "How many would you like to add?",
        name: "qty"
    }
];

var productAddPrompt = [
    {
        type: "input",
        message: "What is the name of the item?",
        name: "name"
    },
    {
        type: "input",
        message: "What department are you adding it to?",
        name: "department"
    },
    {
        type: "number",
        message: "How much is it selling for?",
        name: "price"
    },
    {
        type: "number",
        message: "How many would you like to add?",
        name: "qty"
    }
];

async function getAnswers(promptArray) {
    var answers = await inquirer.prompt(promptArray);
    return answers;
}

// run it!
getAnswers(listPrompt)
.then(function(answers) {
    runApp(answers.selection);
});