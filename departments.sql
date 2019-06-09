USE bamazon;

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(200) NOT NULL,
    overhead_costs DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments ( department_name, overhead_costs )
VALUES ("Bikes", 2000.00), ("Skis", 1500.00);

SELECT * FROM departments;