const express = require('express');
const router = express.Router();
const { Pool } = require('pg');


const pool = new Pool({
  user: 'ticketmaster',
  host: 'localhost',
  database: 'ticket_tracker',
  password: '$TicketMaster2017!',
  port: 5432,
})

/*
* Provides an authentication mechanism
* @http-param user {string} username
* @http-param passwd {string} password
*/
router.post('/auth', function(req,res,next){

});

/*
* queries for activities based on date
* @http-returns {JSON/String}
* @http-param date {psql-date: yyyy-mm-dd} the date to fetch activities for
*/
router.get('/api/v1/activities/:date', function(req, res, next){
	pool.connect(function(err, client, done) {
  		client.query('SELECT * FROM activities WHERE date=($1)', [req.params.date], (err, result) => {
			if(err){
				console.log(err);
				done();
				return res.status(500).send("Could not connect to database");
			}
			done();
			return res.json(result.rows);
		});
	});
});

/*
* updates database with new activity for provided date
* @http-param date {psql-date: yyyy-mm-dd} the date to store activities for
* @http-param description {string} simple description of task to complete
* @http-param priority {string} importance of activity
* @http-param customer_name {string} name of the customer associated with the ticket.
*/
// TODO: Customers can have the same name but not the same ID. The end user shouldnt see the customer ID. 
// Need solution to figure out which customer the user means if same name is used.
router.post('/api/v1/activities/', function(req, res, next){
	//TODO: LIMIT VALUES OF priorities to either: HIGH, AVERAGE, LOW
	pool.connect(function(err, client, done) {
		customer_id = [];
		client.query('SELECT customer_id FROM customers WHERE customer_name=($1)', [req.body.customer_name], (err, result) => {
			if(err){
				console.log(err);
				done();
				return res.status(500).send("Could not connect to database");
			}
			customer_id.push(result);
		});
  		client.query('INSERT INTO activities(date, description, priority, customer_id) VALUES($1,$2,$3)', [req.body.date, req.body.description, req.body.priority], (err, result) => {
			if(err){
				console.log(err);
				done();
				return res.status(500).send("Could not connect to database");
			}
			done();
			return res.status(200).send(result);
		});
	});
});


/*
* fetches a list of customers
*/
router.get('/api/v1/customers', function(req, res, next){
	pool.query('SELECT * FROM customers', (err, result) => {
		if(err){
			console.log(err);
			return res.status(500).send("Could not connect to database");
		}
		return res.json(result);
	});
});

/*
* fetches info about a specific customer
* @http-param customer {psql-int} customer id number
*/
router.get('/api/v1/customers/:customer', function(req,res,next){
	results = [];
	pool.query('SELECT * FROM customers WHERE customer_id=($1)', [req.params.customer], (err, result) => {
		if(err){
			console.log(err);
			return res.status(500).send("Could not connect to database");
		}
		results.push(result);
	});

	pool.query('SELECT * FROM activities WHERE customer_id=($1)', [req.params.customer], (err, result) => {
		if(err){
			console.log(err);
			return res.status(500).send("Could not connect to database");
		}
		results.push(result);
	});
});


module.exports = router;
