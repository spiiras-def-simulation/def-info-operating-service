const http = require('http');
const express = require('express');
const config = require('config');

const { createApolloServer } = require('./apollo');

const app = express();

const port = process.env.PORT || config.port || 3000;
app.set('port', port);

const httpServer = http.createServer(app);

createApolloServer(app, httpServer);

httpServer.listen(port, () => {
  console.log(`server ready at port ${port}`);
  console.log(`subscriptions ready at port ${port}\n`);
});
