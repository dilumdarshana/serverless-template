/**
 * Authentication related utils
 *
 */
const { getCognitoUserFromToken, buildAuthorizerResponse } = require('#utils/cognitoHelper');
const {
  ROLES: {
    SME_ADMIN,
  },
} = require('#utils/constants');
const { InterceptError } = require('#utils/errorHelper');

const doAuth = async (event) => {
  const { headers: { authorization: accessToken } } = event;
  const effect = 'Allow';
  let cognitoUserId = null;

  // sending extra data which extracted from cognito response. This data might help to process/validate
  // data from lambda
  const extraData = {};

  try {
    const { Username: userName, UserAttributes: userAttributes } = await getCognitoUserFromToken(accessToken);
    cognitoUserId = userName;

    userAttributes.forEach((element) => {
      const { Name: name, Value: value } = element;
      switch (name) {
        case 'email':
          extraData.email = value;
          break;
        case 'custom:role':
          extraData.role = value;
          break;
        default:
      }
    });

    const { smeId, userId } = event.pathParameters || {};
    // Check if requested route matches logged in users sme_id (only if it exists in the route)
    if (smeId && smeId === extraData.sme_id) {
      if ((extraData.role === SME_ADMIN) || !userId) {
        // Allow SME admin access to routes with same SME ID
        // Allow access if not a user endpoint but SME ID matches
        return buildAuthorizerResponse(cognitoUserId, effect, extraData);
      }
      if (userId && userId === extraData.user_id) {
        // Allow SME user access to routes when User ID matches
        return buildAuthorizerResponse(cognitoUserId, effect, extraData);
      }
      // Can't access
      return buildAuthorizerResponse('user', 'deny');
    }

    return buildAuthorizerResponse(cognitoUserId, effect, extraData);
  } catch (error) {
    console.log(`Lambda authorizer error - ${extraData.user_id}`, error);
    if (error.message === 'Access Token has expired') {
      return buildAuthorizerResponse(cognitoUserId, 'Allow', { isAuthTokenExpired: true });
    }

    if (error.message === 'Access Token has been revoked') {
      return buildAuthorizerResponse(cognitoUserId, 'Allow', { isUserLoggedOut: true });
    }

    return buildAuthorizerResponse('user', 'deny');
  }
};

const checkAuthorization = (permisionList, currentRole, message = 'AccessDenied') => {
  if (!permisionList.includes(currentRole)) {
    throw InterceptError(message, 400);
  }
};

module.exports = {
  doAuth,
  checkAuthorization,
};
