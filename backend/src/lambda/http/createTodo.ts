import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createTodo } from '../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  const userId = getUserId(event)

  if (!userId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'User does not exist'
      }),
      headers: {                     
        'Access-Control-Allow-Origin': '*'  
      }
    }
  }
  const newItem = await createTodo(userId, newTodo)
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