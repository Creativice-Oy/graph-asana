export function base64url(base64Str) {
  return base64Str.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
