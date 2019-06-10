/*
* This program will reset your database products quantities to random numbers between 1 and whatever you set maxNum
* to. You need to make sure that the starred variables are the same in your program or this won't work properly
*
*/

var mysql = require("mysql");

var connection = mysql.createConnection({
    host: 'localhost', 
    port: 3306, // * 
    database: 'bamazon', // * 
    user: 'root', // * 
    password: 'root' // * 
});

function magicNumber(maxNum) {
    return Math.ceil(Math.random() * maxNum); // used to set the qty randomly for a product
}

function sqlize(maxNum) {
    // first you need to find out how many things there are in the table
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) console.log(err);
        var len = res.length;
        for (i = 0; i < len; i++) {
            var id = (i + 1).toString();
            var qty = magicNumber(maxNum).toString();
            // make sure your database uses the same column names (stock_quantity and item_id) 
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [qty, id], function(err, res) {
                if (err) console.log(err);
                console.log(res);
            });
        }
    });
}

sqlize(20); // write in your maxNum here as an argument