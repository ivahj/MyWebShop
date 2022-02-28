const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {startDatabase} = require('./database/mongo');
const {insertProduct, getProducts, deleteProduct, updateProduct} = require('./database/products');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// defining the Express app
const app = express();

// defining an array to work as the database (temporary solution)
const products = [
  {title: 'Hello, world (again)!'}
];

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://<AUTH0_DOMAIN>/.well-known/jwks.json`
  }),
  
  // Validate the audience and the issuer.
  audience: '<API_IDENTIFIER>',
  issuer: `https://<AUTH0_DOMAIN>/`,
  algorithms: ['RS256']
});

app.post('/', async (req, res) => {
  const newProduct = req.body;
  await insertProduct(newProduct);
  res.send({ message: 'New product inserted.' });
});

// endpoint to delete an ad
app.delete('/:id', async (req, res) => {
  await deleteProduct(req.params.id);
  res.send({ message: 'Product removed.' });
});

app.put('/:id', async (req, res) => {
  const updateProduct = req.body;
  await updateProduct(req.params.id, updateProduct);
  res.send({ message: 'Product updated.' });
});

// defining an endpoint to return all products
app.get('/', async (req, res) => {
    res.send(await getProducts());
  });
  
// start the in-memory MongoDB instance
startDatabase().then(async () => {
    await insertProduct({title: 'Hello, now from the in-memory database!'});
  
    // start the server
    app.listen(3001, async () => {
      console.log('listening on port 3001');
    });
  });