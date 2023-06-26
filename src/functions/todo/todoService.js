// const { DYNAMO_TABLE_TODO } = require('#utils/constants');

/**
 *
 * @returns response as JSON
 */
const createTodo = async (data) => {
  try {
    const { task } = data;

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
