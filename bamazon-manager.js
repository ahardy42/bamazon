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
}