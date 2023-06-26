module.exports = Object.freeze({
  // dynamodb tables
  DYNAMO_TABLE_APPLICATION_STATUS: `application-status-${process.env.LAMBDA_STAGE}`,
  DYNAMO_TABLE_TODO: `todo-${process.env.LAMBDA_STAGE}`,
});
