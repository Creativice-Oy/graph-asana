import crypto from 'crypto';
import Koa from 'koa';
import Router from '@koa/router';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { generateChallenge, generateVerifier } from './utils/pkce.js';

dotenv.config();

const app = new Koa();
const router = new Router();

const ASANA_OAUTH_USER_AUTH_URI = 'https://app.asana.com/-/oauth_authorize';
const ASANA_TOKEN_EXCHANGE_URI = 'https://app.asana.com/-/oauth_token';
const ASANA_REDIRECT_URI = 'http://localhost:5000/redirect';

const pkceVerifier = generateVerifier();
const pkceChallenge = generateChallenge(pkceVerifier);
const stateHash = crypto.randomBytes(32).toString('hex');

router.get('/', ({ response }) => {
  response.body = '<a href="/install">Get Asana OAuth token</a>';
});

router.get('/install', ({ response }) => {
  const options = {
    client_id: process.env.CLIENT_ID,
    redirect_uri: ASANA_REDIRECT_URI,
    response_type: 'code',
    state: stateHash,
    code_challenge_method: 'S256',
    code_challenge: pkceChallenge,
  };

  const url = new URL(ASANA_OAUTH_USER_AUTH_URI);
  url.search = new URLSearchParams(options).toString();

  response.redirect(url);
});

router.get('/redirect', async ({ request, response }) => {
  const code = request.query.code;
  const returnedState = request.query.state;

  if (returnedState !== stateHash)
    throw new Error(
      'State returned by endpoint does not match generated state.',
    );

  if (code) {
    const options = {
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: ASANA_REDIRECT_URI,
      code,
      code_verifier: pkceVerifier,
    };

    const url = new URL(ASANA_TOKEN_EXCHANGE_URI);
    url.search = new URLSearchParams(options).toString();

    const res = await fetch(url, { method: 'post' });

    response.body = await res.json();
  } else {
    response.redirect('/');
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(5000, (e) => {
  if (e) {
    console.error(e);
  } else {
    console.log(`OAuth server running at http://localhost:5000`);
  }
});
