const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('winston-this')('index');
const port = process.env.PORT || config.get('port');
const environment = process.env.NODE_ENV;

logger.info(`NODE_ENV: ${environment}`);

// Express Application initialization
const app = express();

// Adding body-parser
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({
    developer_circles: {
      project: 'Messenger Help In Need Chat Bot',
      description: 'Say hello to the first humanitarian bot... This bot will allow to empower, help and bring communities together',
      repository: 'https://github.com/arielfr/help-in-need-bot',
      participants: [
        {
          name: 'Ariel Rey',
          github: 'https://github.com/arielfr',
        },
        {
          name: 'Horacio Lopez',
          github: 'https://github.com/hdlopez',
        },
      ]
    }
  })
});

app.use(require('./routes/ping'));
app.use(require('./routes/public'));
app.use(require('./routes/webhook'));

app.use((err, req, res, next) => {
  logger.error(err);

  res.status(500).send('Oops, an error ocurred...');
});

app.use((req, res) => {
  res.redirect('/');
});

app.listen(port, function () {
  logger.info(`Application up and running on port ${port}`);
});
