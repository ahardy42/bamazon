/* remove this DB if it's already there */
DROP DATABASE IF EXISTS bamazon;

/* create, and reference the database */
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity int(10) NULL,
    PRIMARY KEY (item_id)
);

UPDATE products SET stock_quantity = 3 WHERE item_id = 1;
SELECT * FROM products;
SELECT stock_quantity FROM products WHERE item_id = 3;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';

SELECT stock_quantity FROM products WHERE item_id = 1;

UPDATE products SET stock_quantity= stock_quantity+2 WHERE item_id= 9;
