
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3333/v1',
  ssoWellKnown: 'https://lemur-17.cloud-iam.com/auth/realms/sso-dev/.well-known/openid-configuration',
  ssoAuthority : 'https://lemur-17.cloud-iam.com/auth/realms/sso-dev',
  ssoRedirectUrl : 'http://localhost:4200/',
  ssoPostLogoutRedirect : 'http://localhost:4200/',
  ssoClientId : 'g24-library-front',
  ssoScope : 'openid profile offline_access',
  uploadMaxSize: '10'
};
