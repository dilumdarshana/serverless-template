const { DYNAMO_TABLE_TODO } = require('#utils/constants');
const {
  getCurrentTimestamp,
} = require('#utils/commonHelper');
const {
  docClientPut,
} = require('#utils/dynamoDbHelper');

/**
 *
 * @returns response as JSON
 */
const createTodo = async (data) => {
  try {
    const { task } = data;

    const paramsPutTag = {
      Item: {
        task,
        status: false,
        createdAt: getCurrentTimestamp(),
      },
      TableName: DYNAMO_TABLE_TODO,
    };

    await docClientPut(paramsPutTag);

    return {
      data: task,
      message: 'TodoCreatedSuccessfully',
    };
  } catch (err) {
    console.log('Error on createTodo', err);
    throw err;
  }
};

module.exports = {
  createTodo,
};
