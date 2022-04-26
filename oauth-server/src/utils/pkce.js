import crypto from 'crypto';
import { base64url } from './base64.js';

export function generateVerifier() {
  return base64url(crypto.randomBytes(64).toString('base64'));
}

export function generateChallenge(verifier) {
  return base64url(
    crypto.createHash('sha256').update(verifier).digest('base64'),
  );
}
