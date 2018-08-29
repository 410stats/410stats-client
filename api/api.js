'use strict';
const Hapi = require('hapi')
const Boom = require('boom')
const Joi = require('joi')
const Catbox = require('catbox')
const Memory = require('catbox-memory')
const moment = require('moment')

const mysql = require('mysql2/promise');

var pool;

if (process.env.NODE_ENV === "production") {
  console.log("Production mode");
  pool = mysql.createPool({
    host: 'localhost',
    user: '410stats_api',
    database: '410stats',
    password: 'lQYnhUV9FXBS4icb',
    debug: false
  });
} else {
  console.log("Dev mode");
  pool = mysql.createPool({
    host: '188.166.175.66',
    user: 'dev_api',
    database: '410stats_dev',
    password: 'ebDBLxZvLtdRJovh',
    debug: false
  });
}


// Add the route
/*server.route({
    method:'GET',
    path:'/hello',
    handler:function(request,h) {

        return'hello world';
    }
});*/



const client = new Catbox.Client(Memory);
client.start();
// Create a server with a host and port

const startServer = async function() {

  const server = Hapi.server({
    host: '0.0.0.0',
    port: 8000
  });
  server.app.pool = pool;
  server.app.cacheClient = client;

  await server.register(
    [require('./routes/stats'), require('./routes/connected'), require('./routes/search'), require('./routes/misc')]
  );


  await server.start();
  console.log(`Server started at ${server.info.uri}`);
};

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});


//SELECT * FROM `topics` WHERE dateSupression IS NOT NULL AND MATCH(titre) AGAINST ('"[PHOTO] la plus belle entre ces"') ORDER BY datePremierePage DESC
