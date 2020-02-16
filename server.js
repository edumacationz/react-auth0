const { Envirator } = require('@status/envirator');
const { Http } = require('@status/codes');
const checkScope = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const express = require('express');
const jwt = require('express-jwt');

const env = new Envirator();
const app = express();

env.load('.env');

const checkRole = (role) => {
  return (request, response, next) => {
    const assignedRoles = request.user['http://localhost:3000/roles'];

    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    } else {
      return response.status(Http.Unauthorized).send('Insufficient role');
    }
  }
}

const {
  REACT_APP_API_URL: api,
  REACT_APP_AUTH0_DOMAIN: domain,
  REACT_APP_AUTH0_AUDIENCE: audience,
} = env.provideMany(['REACT_APP_API_URL', 'REACT_APP_AUTH0_AUDIENCE', 'REACT_APP_AUTH0_DOMAIN']);

const issuer = `https://${domain}/`;


const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`
  }),
  audience,
  issuer,
  algorithms: ['RS256']
});





app.get('/public', function (_request, response) {
  response.json({
    message: 'hello from a public api!'
  });
});

app.get('/private', checkJwt, function (_request, response) {
  response.json({
    message: 'hello from a private api!'
  });
});

app.get('/admin', [checkJwt, checkRole('admin')], function (_request, response) {
  response.json({
    message: 'Hello from an admin api!'
  });
});


app.get('/courses', [checkJwt, checkScope(['read:courses'])], function (_request, response) {
  response.json({
    courses: [
      { id: 1, title: 'Building Apps with React and Redux' },
      { id: 2, title: 'Creating Reusable React Components' },
    ]
  });
});

app.listen(3001, () => console.log(`API server listening on ${api}`));