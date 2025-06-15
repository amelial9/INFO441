import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import apiRouter from './routes/api/v3/apiv3.js';

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
    secret: "as9eu034htov9ny9yn3n",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}))

const authConfig = {
    auth: {
      clientId: "8e193022-b025-4a78-853a-f7c1ccf42a0d",
      authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
      clientSecret: "YY28Q~VwE5fE8r8sXfRhFi7E32psSemisxct0aZB",
      redirectUri: "https://a6.example-domain.me/redirect"
      // redirectUri: "http://localhost:3000/redirect"
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

export default app;
