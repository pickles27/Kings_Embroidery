var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded( {extended: false});
var portDecision = process.env.PORT || 3000;
var pg = require('pg');
var connectionString = 'postgress://localhost:5432/jobstwo';

app.use(bodyParser.json());

app.listen( portDecision, function () {
  console.log("3000 is up!");
});//end server up

app.get('/', urlencodedParser, function (req, res) {
  console.log('base url hit');
  res.sendFile(path.resolve('public/index.html'));
});



app.get('/all', function (req, res) {
  console.log('in get /all');
  pg.connect(connectionString, function (err, client, done) {
      if (err){
        console.log(err);
      }else{
        var alljobs = [];
        var queryResults = client.query('SELECT * FROM jobs');
        //console.log(queryResults);
        queryResults.on('row', function (row) {
          alljobs.push(row);
          //console.log('alljobs', alljobs[0]);
        });
        queryResults.on('end', function () {
          done();
          return res.json(alljobs);
          //end queryResults function
        });//end queryResults on function
      }//end else
  });//end pg connect
});//end app.get

app.post('/newjob', urlencodedParser, function (req, res) {
  console.log('in .post newjob');
  console.log('req.body', req.body.company);
  var company = req.body.company;
  var duedate = req.body.duedate;
  var pieces = req.body.pieces;
  console.log(company, duedate, pieces);
  pg.connect(connectionString, function (err, client, done) {
      if (err){
        console.log(err);
      }else{
        console.log('connected to database');
        var queryResults = client.query('INSERT INTO jobs (company, pieces, duedate) VALUES($1, $2, $3)', [company, pieces, duedate]);
        queryResults.on('end', function () {
          done();
          res.send({success: true});
        });//end query
      }//end else
    });//end pg conect

  //create variables from req
});

app.delete('/delete', urlencodedParser, function (req, res) {
  console.log('in delete');
  console.log(req.body.id);
  var id = req.body.id;
  pg.connect(connectionString, function (err, client, done) {
    if (err){
      console.log(err);
    }else{
      console.log('connected to database in delete');
      client.query('DELETE from jobs WHERE id = $1', [id]);
      done();
      res.send({success: true});
    }
  });
});

app.post('/edit', urlencodedParser, function (req, res) {
  console.log('in edit post');
  console.log(req.body);
  var id = req.body.id;
  var pieces = req.body.pieces;
  pg.connect(connectionString, function (err, client, done) {
    if (err){
      console.log(err);
    }else{
      console.log('connected to db in edit');
      client.query('UPDATE jobs SET pieces = $1 WHERE id = $2', [pieces, id]);
      done();
      res.send({success: true});
    }
  });
});

app.use(express.static('public'));
