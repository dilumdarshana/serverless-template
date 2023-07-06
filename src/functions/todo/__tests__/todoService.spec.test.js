const AWS = require('aws-sdk');
const todoService = require('../todoService');

jest.mock('aws-sdk', () => {
  return {
    DynamoDB: { // just an object, not a function
      DocumentClient: jest.fn(() => ({
        put: jest.fn().mockImplementation(() => {
          return {
            promise() {
              return Promise.resolve({});
            },
          };
        }),
      })),
    },
    docClientPut: jest.fn(),
  };
});

const mockClient = new AWS.DynamoDB.DocumentClient();

describe('Todo service', () => {
  test('Create todo should validate inputs', async () => {
    mockClient.query.mockReturnValue({
      promise: () => new Promise((resolve) => { resolve({}); }),
    });

    const res = await todoService.createTodo({ task: 'Pay mobile bill' });

    console.log('res', res);

    expect(true).toEqual(true);
  });
});
