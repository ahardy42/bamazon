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

// prompts
var prompts = [
    {
        type: "input",
        name: "item",
        message: "What item would you like to purchase?"
    },
    {
        type: "number",
        name: "quantity",
        message: "How many would you like to buy?"
    }
];

// functions
var displayItems = function(res) {
    // create a table with the data from res (array)
    var data = [];
    var tableCols = ["ID", "Product", "Price"];
    data.push(tableCols);
    res.forEach(element => {
        var row = [element.item_id, element.product_name, element.price];
        data.push(row);
    });
    // log that table!
    var output = table.table(data);
    console.log(output);
}

// queries 
var allProductQuery = async function() {
    var query = await connection.query("SELECT * FROM products", function(err, res) {
        if (err) console.log(err);
        return res;
    });
};

var idQtyQuery = async function(id) {
    var query = await connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", [id], function(err, res) {
        if (err) console.log(err);
        return res;
    });
};

