const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');

const { mongoUrl } = require('./utils/mongoUrl');
const { corsOptions } = require('./utils/corsOption');

const { limiter } = require('./middlewares/limiter');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');

const { PORT = 3001 } = process.env;

mongoose.connect(mongoUrl, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useCreateIndex: true,
})
  // eslint-disable-next-line no-console
  .then(console.log('connected to data base'));

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(cors(corsOptions));

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(error);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}`);
});
