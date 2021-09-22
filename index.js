const http = require('http');
const express = require('express');
const config = require('config');

const { createApolloServer } = require('./apollo');

const app = express();

const port = process.env.PORT || config.port || 5300;
app.set('port', port);

const httpServer = http.createServer(app);

createApolloServer(app, httpServer);

httpServer.listen(port, () => {
  console.log(`Server ready at port ${port}`);
  console.log(`Subscriptions ready at port ${port}`);
});
