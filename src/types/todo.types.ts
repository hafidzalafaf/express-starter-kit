export interface Todo {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'done';
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  status?: 'pending' | 'done';
}

export interface TodoResponse {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'done';
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
