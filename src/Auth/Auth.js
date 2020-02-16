import { Envirator } from '@status/envirator';
import auth0 from 'auth0-js';

const env = new Envirator();

// eslint-disable-next-line no-unused-vars
let _idToken = null;
let _accessToken = null;
let _scopes = null;
let _expiresAt = null;


const {
  REACT_APP_AUTH0_CALLBACK: redirectUri,
  REACT_APP_AUTH0_AUDIENCE: audience,
  REACT_APP_AUTH0_CLIENTID: clientID,
  REACT_APP_AUTH0_DOMAIN: domain,
} = env.provideMany(
  [
    'REACT_APP_AUTH0_CALLBACK',
    'REACT_APP_AUTH0_CLIENTID',
    'REACT_APP_AUTH0_DOMAIN',
    'REACT_APP_AUTH0_AUDIENCE'
  ]
);

const REDIRECTON_ON_LOGIN = 'redirect_on_login';

export default class Auth {
  constructor(history) {
    console.log('creating new auth');
    this.history = history;
    this.userProfile = null;
    this.requestedScopes = 'openid profile email read:courses';
    this.auth0 = new auth0.WebAuth(
      {
        domain,
        audience,
        clientID,
        redirectUri,
        responseType: 'token id_token',
        scope: this.requestedScopes,
      }
    );
  }

  login = () => {
    localStorage.setItem(REDIRECTON_ON_LOGIN, JSON.stringify(this.history.location));
    this.auth0.authorize();
  };

  handleAuthentication = hasLoggedIn => {
    this.auth0.parseHash((error, authResult) => {
      if (authResult?.accessToken && authResult?.idToken) {
        hasLoggedIn(true);
        this.setSession(authResult);
        const redirectLocation = JSON.parse(localStorage.getItem(REDIRECTON_ON_LOGIN)) || '/';
        this.history.push(redirectLocation);

      } else if (error) {
        hasLoggedIn(false);
        this.history.push("/");
        alert(`Error: ${error.error}. Check console for further details`);
        console.log(error);
      }
      localStorage.removeItem(REDIRECTON_ON_LOGIN);
    });
  };

  setSession = authResult => {
    _expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    _scopes = authResult.scope || this.requestedScopes || '';

    _accessToken = authResult.accessToken;
    _idToken = authResult.idToken;

    this.scheduleTokenRenewal();
  };

  logout = () => {
    this.auth0.logout({
      clientID,
      returnTo: 'http://localhost:3000'
    });
  }

  userHasScopes(scopes) {
    const grantedScopes = (_scopes || '').split(" ");

    const hasScope = scopes.every(scope => grantedScopes.includes(scope));

    return hasScope;
  }

  getAccessToken = () => {
    if (!_accessToken) {
      throw new Error('No access token found');
    }

    return _accessToken;
  };

  getProfile = cb => {
    if (this.userProfile) {
      return cb(this.userProfile, null);
    }

    this.auth0.client.userInfo(this.getAccessToken(), (error, profile) => {
      this.userProfile = profile;
      cb(profile, error);
    });
  }

  renewToken(cb) {
    this.auth0.checkSession({}, (error, result) => {
      if (error) {
        console.log(`Error: ${error.error} - ${error.error_description}.`);
      } else {
        this.setSession(result);
      }

      if (cb) {
        cb(error, result);
      }
    })
  }

  scheduleTokenRenewal() {
    const delay = _expiresAt - Date.now();

    if (delay > 0) {
      setTimeout(() => this.renewToken(), delay);
    }
  }

  get isAuthenticated() {
    return new Date().getTime() < _expiresAt;
  }
}