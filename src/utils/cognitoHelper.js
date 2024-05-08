/**
 * Cognito helper
 */
const {
  CognitoIdentityProviderClient,
  AdminSetUserPasswordCommand,
  AdminDeleteUserCommand,
  AdminInitiateAuthCommand,
  AdminCreateUserCommand,
  GlobalSignOutCommand,
  GetUserCommand,
  ChangePasswordCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

// Create an Amazon Cognito service client object.
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.LAMBDA_REGION });

const updateCognitoUserPassword = async (email, password, userPoolId) => {
  const params = {
    Password: password,
    UserPoolId: userPoolId,
    Username: email,
    Permanent: true,
  };

  const command = new AdminSetUserPasswordCommand(params);
  await cognitoClient.send(command);
};

const deleteCognitoUser = async (email, userPoolId) => {
  const params = {
    UserPoolId: userPoolId,
    Username: email,
  };

  const command = new AdminDeleteUserCommand(params);
  return cognitoClient.send(command);
};

const signUpCognitoUser = async (email, password, userPoolId, customData) => {
  const {
    siteId,
    userId,
    smeId,
    role,
  } = customData;
  const params = {
    UserPoolId: userPoolId,
    Username: email,
    UserAttributes: [{
      Name: 'email',
      Value: email,
    },
    {
      Name: 'email_verified',
      Value: 'true',
    },
    {
      Name: 'custom:role',
      Value: role,
    }],
    MessageAction: 'SUPPRESS',
  };

  const command = new AdminCreateUserCommand(params);
  const response = await cognitoClient.send(command);

  if (response.User) {
    await updateCognitoUserPassword(email, password, userPoolId);
  }
};

const adminIntiateAuth = async (email, password, userPoolId, clientId) => {
  const params = {
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    UserPoolId: userPoolId,
    ClientId: clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  const command = new AdminInitiateAuthCommand(params);
  return cognitoClient.send(command);
};

const adminIntiateAuthRefreshToken = async (refreshToken, userPoolId, clientId) => {
  const params = {
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    UserPoolId: userPoolId,
    ClientId: clientId,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  };

  const command = new AdminInitiateAuthCommand(params);
  return cognitoClient.send(command);
};

const globalSignOut = async (accessToken) => {
  const params = {
    AccessToken: accessToken,
  };
  const command = new GlobalSignOutCommand(params);
  return cognitoClient.send(command);
};

const getCognitoUserFromToken = async (token) => {
  const params = {
    AccessToken: token,
  };

  const command = new GetUserCommand(params);
  return cognitoClient.send(command);
};

const buildAuthorizerResponse = (principleId, effect, extraData) => (
  {
    principalId: principleId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: '*',
        },
      ],
    },
    context: extraData,
  }
);

const changePassword = async (token, previousPassword, proposedPassword) => {
  const params = {
    AccessToken: token,
    PreviousPassword: previousPassword,
    ProposedPassword: proposedPassword,
  };

  const command = new ChangePasswordCommand(params);
  return cognitoClient.send(command);
};

module.exports = {
  cognitoClient,
  signUpCognitoUser,
  updateCognitoUserPassword,
  deleteCognitoUser,
  adminIntiateAuth,
  adminIntiateAuthRefreshToken,
  globalSignOut,
  getCognitoUserFromToken,
  buildAuthorizerResponse,
  changePassword,
};
