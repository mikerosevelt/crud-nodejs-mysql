const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

// Create db connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'crud_nodejs'
});

conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});

// Set views file
app.set('views', path.join(__dirname, 'views'));
// Set views engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Set public folder as static folder for static file
app.use('/assets', express.static(__dirname + '/public'));

// Route homepage
app.get('/', (req, res) => {
    let sql = "SELECT * FROM product";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('product_view', {
            results: results
        });
    });
});

// Insert data
app.post('/save', (req, res) => {
    let data = { product_name: req.body.product_name, product_price: req.body.product_price };
    let sql = "INSERT INTO product SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Update data
app.post('/update', (req, res) => {
    let sql = `UPDATE product SET product_name='${req.body.product_name}', product_price='${req.body.product_price}' WHERE product_id='${req.body.id}'`;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    })
})

// Delete data
app.post('/delete', (req, res) => {
    let sql = `DELETE FROM product WHERE product_id='${req.body.product_id}'`;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    })
})

// Server
app.listen(8000, () => {
    console.log('Server is running at port 8000');
})