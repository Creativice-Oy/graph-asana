# Development

This integration focuses on [Asana](https://asana.com/) and is using
[Asana API](https://developers.asana.com/docs) for interacting with the Asana
resources.

## Provider account setup

### In Asana

1. [Setup OAuth](https://developers.asana.com/docs/oauth)
   1. Register Application, you can use [oauth-server](../oauth-server/) for
      this.
   2. Take note of the client ID and secret.
2. Get Access Token
   - From the setup OAuth server, you can obtain access token.
     1. Start the oauth server.
     2. Once you access on the browser, there should be a link to
        `Get Asana OAuth token`. Click on it.
     3. You may be redirected to Asana requesting to authorize the application.
     4. Once the server is authorized, you will be redirected and automatically
        receive the access and refresh token.
   - Alternatively, you can manually generate a
     [personal access token](https://developers.asana.com/docs/personal-access-token).

## Authentication

Provide the `ACCESS_TOKEN` to the `.env`. You can use
[`.env.example`](../.env.example) as a reference.

The Access token will be used to authorize requests.
