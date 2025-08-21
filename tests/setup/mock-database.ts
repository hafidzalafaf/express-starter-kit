// Mock database operations for testing
export const mockDatabase = {
  users: [] as any[],
  todos: [] as any[],
  
  // Reset mocks
  reset() {
    this.users = [];
    this.todos = [];
  },
  
  // User operations
  findUserByEmail(email: string) {
    return Promise.resolve(this.users.find(u => u.email === email));
  },
  
  findUserById(id: number) {
    return Promise.resolve(this.users.find(u => u.id === id));
  },
  
  createUser(userData: any) {
    const user = {
      id: this.users.length + 1,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.users.push(user);
    return Promise.resolve(user);
  },
  
  // Todo operations
  findTodosByUserId(userId: number) {
    return Promise.resolve(this.todos.filter(t => t.user_id === userId));
  },
  
  createTodo(todoData: any) {
    const todo = {
      id: this.todos.length + 1,
      ...todoData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.todos.push(todo);
    return Promise.resolve(todo);
  }
};
