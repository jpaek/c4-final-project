import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../../models/TodoItem'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todoAccess')

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getTodos(userId: string): Promise<TodoItem[]> {
    logger.info(`Getting all todos for ${userId}`)

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: process.env.TODO_ID_INDEX,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
    
    return result.Items as TodoItem[]
  }

  async getTodo(userId: string, todoId: string): Promise<TodoItem> {
    logger.info(`Getting a todo with userId ${userId} and todoId ${todoId}`)

    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId and todoId = :todoId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':todoId': todoId
      }
    }).promise()
    
    return result.Items[0] as TodoItem
  }

  async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    logger.info(`Create a todo item ${todoItem}`)
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()

    return todoItem
  }

  async updateTodoItem(updatedTodo: TodoItem) {
    logger.info(`Update a todo item ${updatedTodo}`)
    await this.docClient.update({
    TableName: this.todosTable,
    Key: {
        userId: updatedTodo.userId,
        todoId: updatedTodo.todoId
    },
    UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done, attachmentUrl = :attachmentUrl",
    ExpressionAttributeValues: {
      ":name": updatedTodo.name,
      ":dueDate": updatedTodo.dueDate,
      ":done": updatedTodo.done,
      ":attachmentUrl": updatedTodo.attachmentUrl
    },
    ExpressionAttributeNames: {
      "#name": "name"
    },
    ReturnValues:"UPDATED_NEW"
    }).promise()
  } 

  async deleteTodoItem(userId: string, todoId: string) {
    logger.info(`Delete a todo item with the id ${todoId}`)
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }).promise()
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
