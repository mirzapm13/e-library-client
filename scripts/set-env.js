const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from `.env` file
const environment = process.env.NODE_ENV || 'development';
const envFile = `.env${environment === 'production' ? '.prod' : ''}`;
const result = dotenv.config({ path: envFile });

if (result.error) {
  console.error(`Error loading ${envFile} file`, result.error);
  process.exit(1);
}

// Prepare Angular environment file content
const environmentFileContent = `
export const environment = {
  production: ${environment === 'production'},
  apiUrl: '${process.env.API_URL}',
  ssoAuthority : '${process.env.SSO_AUTHORITY}',
  ssoRedirectUrl : '${process.env.SSO_REDIRECT_URL}',
  ssoPostLogoutRedirect : '${process.env.SSO_POST_LOGOUT_REDIRECT}',
  ssoClientId : '${process.env.SSO_CLIENT_ID}',
  ssoScope : '${process.env.SSO_SCOPE}'
};
`;

// Write to Angular environment file
const targetPath = `./src/environments/environment.ts`;
fs.writeFileSync(targetPath, environmentFileContent, { encoding: 'utf8' });

console.log(`Environment variables set for ${environment}`);
