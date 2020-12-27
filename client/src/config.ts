// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'wrlp52xcn4'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-fp5-cjgu.us.auth0.com',            // Auth0 domain
  clientId: 'T9NVk7up7Ew2IFlzPQdRknRzyaP2nEJk',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
