import * as uuid from 'uuid'

import { TodoItem } from '../../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest' 

const todoAccess = new TodoAccess()

export async function getTodos(userId: string): Promise<TodoItem[]> {
  return await todoAccess.getTodos(userId)
}

export async function getTodo(userId: string, todoId: string): Promise<TodoItem> {
  return await todoAccess.getTodo(userId, todoId)
}

export async function createTodo(
  userId: string, 
  newTodo: CreateTodoRequest
): Promise<TodoItem> {

  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()

  return await todoAccess.createTodoItem({
    userId,
    createdAt,
    todoId,
    done: false,
    ...newTodo
  })
}

export async function updateTodo(
  userId: string, 
  todoId: string,
  updatedTodo: UpdateTodoRequest
) {
  const todoItem = await todoAccess.getTodo(userId, todoId)
  await todoAccess.updateTodoItem({
    userId,
    todoId,
    attachmentUrl: '',
    createdAt: todoItem.createdAt,
    ...updatedTodo
  })
}

export async function updateAttachmentUrl(
  userId: string, 
  todoId: string
) {
  let todoItem = await todoAccess.getTodo(userId, todoId)
  todoItem.attachmentUrl = `https://${process.env.ATTACHMENTS_S3_BUCKET}.s3.amazonaws.com/${todoId}`
  await todoAccess.updateTodoItem({
    userId,
    todoId,
    ...todoItem
  })
}

export async function deleteTodo(userId: string, todoId: string) {
  await todoAccess.deleteTodoItem(userId, todoId)
}


