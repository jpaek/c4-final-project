import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { TodoItem } from '../../models/TodoItem'

const XAWS = AWSXRay.captureAWS(AWS)


const docClient = new XAWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  const userId = getUserId(event)

  if (!userId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'User does not exist'
      })
    }
  }

  const todoId = uuid.v4()
  const newItem = await createTodo(userId, todoId, newTodo)

  
  return {
    statusCode: 201,
    headers: {                     
      'Access-Control-Allow-Origin': '*'  
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}


async function createTodo(userId: string, todoId: string, newTodo: CreateTodoRequest) {
  const createdAt = new Date().toISOString()

  const newItem: TodoItem = {
    userId,
    createdAt,
    todoId,
    done: false,
    ...newTodo
  }
  await docClient
    .put({
      TableName: todosTable,
      Item: newItem
    })
    .promise()

  return newItem
}