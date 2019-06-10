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

// ================================== logging functions ====================================

function displayItems(result) {
    // create a table with the data from res (array)
    var data = [];
    var tableCols = ["ID", "Product", "Price", "stock"];
    data.push(tableCols);
    result.forEach(element => {
        var row = [element.item_id, element.product_name, element.price, element.stock_quantity];
        data.push(row);
    });
    // log that table!
    var output = table.table(data);
    console.log(output); // prints a table
}

function printPrice(qty, result) {
    if (qty > result[0].stock_quantity) {
        console.log("sorry, we don't have enough items for your order");
        return false;
    } else {
        console.log(`Excellent choice, that will be $${qty * parseFloat(result[0].price)}`);
        return true;
    }
}


// =============================== mysql queries =====================================================
function productQuery(selector) {
    connection.query(`SELECT ${selector} FROM products`, function(err, res) {
        if (err) console.log(err);

        displayItems(res); // display the table
        idPrompt(prompts).then(function(answers) {
            var id = answers.id;
            var qty = answers.qty;
            idQtyQuery(id, qty);
        });
    });
};

function idQtyQuery(id, qty) {
    connection.query(`SELECT stock_quantity, price FROM products WHERE item_id = ${id}`, function(err, res) {
        if (err) console.log("you threw an error",err);
        // print the result
        var bool = printPrice(qty, res);
        idQtyUpdate(id, qty, bool);
    });
};

function idQtyUpdate(id, qty, bool) {
    // if bool === true, then update qty otherwise, don't because you'll end up w/ a negative qty
    if (bool) {
        connection.query(`UPDATE products SET stock_quantity = stock_quantity - ${qty}, sales = price * ${qty} + IFNULL(sales,0) WHERE item_id = ${id}`, function (err, res) {
            if (err) console.log(err);
        });
    }
    connection.end(); // this is the last query to perform, so end the connection.
}

// ================================== prompts ===============================================

var prompts = [
    {
        type: "input",
        name: "id",
        message: "What item id would you like to purchase?"
    },
    {
        type: "number",
        name: "qty",
        message: "How many would you like to buy?"
    }
];
// ============================== inquirer functions ====================================

async function idPrompt(promptArray) {
    var answers = await inquirer.prompt(promptArray);
    return answers;
}

// =================================== function to start the program =======================
productQuery("*");