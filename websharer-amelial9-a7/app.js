import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import apiRouter from './routes/api/v3/apiv3.js';
import userInfoRouter from './routes/api/v3/userInfo.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import models from './models.js';

import sessions from 'express-session'
import WebAppAuthProvider from 'msal-node-wrapper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "random_session_secret_123456789",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}))

const authConfig = {
    auth: {
      clientId: "random-client-id-123456789",
      authority: "https://login.microsoftonline.com/random-tenant-id-123456",
      clientSecret: "random_client_secret_987654321",
      redirectUri: "https://a7.example-domain.me/redirect"
      //redirectUri: "http://localhost:3000/redirect"
    },
    system: {
      loggerOptions: {
        loggerCallback(logLevel, message, containsPii) {
          console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: 3
      }
    }
};

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.use((req, res, next) => {
    req.models = models;
    next();
})

app.get('/signin', (req, res, next) => {
    return req.authContext.login({
      postLoginRedirectUri: "/"
    })(req, res, next);
});

app.get('/signout', (req, res, next) => {
    return req.authContext.logout({
      postLogoutRedirectUri: "/"
    })(req, res, next);
});

app.use(authProvider.interactionErrorHandler());

app.use('/api/v3', apiRouter);
app.use('/api/v3/userinfo', userInfoRouter);

export default app;
