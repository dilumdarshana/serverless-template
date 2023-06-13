/**
 * Dynamodb custom connection strings and custom wrappers
 *
 */
const {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
} = require('@aws-sdk/client-dynamodb');

// Update necessary configs/credentials
// AWS.config.update({ region: process.env.LAMBDA_REGION });

const getDynamoDbConfig = () => (process.env.LOCAL === 'true'
  ? { region: process.env.LAMBDA_REGION }
  : {});

// Using dynamodb client abstract
const dDbClient = new DynamoDBClient({ ...getDynamoDbConfig() });

// Get data for a given filter
const dbClientGetItem = (params) => dDbClient.send(new GetItemCommand(params));

// Get data for a given filter
const dbClientQuery = (params) => dDbClient.send(new QueryCommand(params));

// Create a new item
const dbClientPut = (params) => dDbClient.send(new PutItemCommand(params));

// Update existing item entry
const dbClientUpdate = (params) => dDbClient.send(new UpdateItemCommand(params));

// Delete item
const dbClientDelete = (params) => dDbClient.send(new DeleteItemCommand(params));

// Scan items
const dbClientScan = (params) => dDbClient.send(new ScanCommand(params));

module.exports = {
  getDynamoDbConfig,
  dDbClient,
  dbClientGetItem,
  dbClientQuery,
  dbClientPut,
  dbClientUpdate,
  dbClientDelete,
  dbClientScan,
};
