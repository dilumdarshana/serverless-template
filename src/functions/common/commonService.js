const { docClientGetItem } = require('#utils/dynamoDbHelper');
const { DYNAMO_TABLE_APPLICATION_STATUS } = require('#utils/constants');

/**
 *
 * @returns response as JSON
 */
const status = async () => {
  const params = {
    TableName: DYNAMO_TABLE_APPLICATION_STATUS,
    Key: {
      id: 1,
    },
  };

  let dynamoDbRes = null;

  // Read status table from DynamoDb
  try {
    dynamoDbRes = await docClientGetItem(params);
  } catch (e) {
    dynamoDbRes = 'error';
  }

  return {
    message: 'success',
    data: {
      serverTime: new Date().toISOString(),
      servicesStatus: {
        dynamodb: dynamoDbRes === 'error' ? 'failed' : 'connected',
      },
    },
  };
};

module.exports = {
  status,
};
