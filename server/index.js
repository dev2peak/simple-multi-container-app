// Common
const keys = require('./keys');

// Express set-up
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client set-up
const { Pool } = require('pg');
const pgClient = new Pool({
    host: keys.pgHost,
    port: keys.pgPort,
    user: keys.pgUser,
    password: keys.pgPassword,
    database: keys.pgDatabase
});

pgClient.on('connect', () => {
    console.log('<DEBUG> Creating Table (if not exists): value_store ...');
    console.log('<DEBUG> ' + keys.pgHost + ':' + keys.pgPort + "/" + keys.pgDatabase + " for " + keys.pgUser + "/" + keys.pgPassword);

    pgClient
      .query('create table if not exists value_store (number integer)')
      .catch((err) => console.log(err));
  });

// Redis Client set-up
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

// Express routes
app.get('/', (req, res) => {
    console.log('<DEBUG> Received empty request ...');
    res.send('Echo');
});

// Return all persisted values from DB
app.get('/fib/values', async (req, res) => {
    const values = await pgClient.query('select * from value_store');

    console.log('<DEBUG> Serving database values for request /fib/values');
    res.send(values.rows);
});

// Return the most recent values from redis cache
app.get('/fib/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

// Accept a new request, and update DB
app.post('/fib/values', async (req, res) => {
    const index = req.body.index;
    console.log('<DEBUG> Received new POST request for: ' + index);

    if (parseInt(index) > 99) {
        return res.status(422).send('Index too high.');
    }

    redisClient.hset('values', index, 'None');
    redisPublisher.publish('insert', index);

    // TODO: Optimize for handling duplicate enteries
    pgClient.query('insert into value_store(number) values ($1)', [index]);

    res.send({ working: true })
});

app.listen(5000, err => {
    console.log('<DEBUG> Listening API Server on port 5000 ...');
});

