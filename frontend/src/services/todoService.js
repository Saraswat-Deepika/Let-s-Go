const Todo = require('../models/Todo');
const Place = require('../models/Place');

class TodoService {
  // Create new todo/itinerary item
  async createTodo(userId, todoData) {
    try {
      const { title, description, placeId, date, time, priority, type } = todoData;

      const todo = new Todo({
        user: userId,
        title,
        description,
        place: placeId,
        date: date || new Date(),
        time,
        priority: priority || 'medium',
        type: type || 'general',
        completed: false
      });

      await todo.save();
      await todo.populate('place');

      return {
        success: true,
        todo: this.formatTodo(todo)
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get all todos for a user
  async getUserTodos(userId, filters = {}) {
    try {
      const query = { user: userId };

      // Apply filters
      if (filters.date) {
        const date = new Date(filters.date);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        query.date = { $gte: date, $lt: nextDay };
      }

      if (filters.type) query.type = filters.type;
      if (filters.completed !== undefined) query.completed = filters.completed;
      if (filters.priority) query.priority = filters.priority;

      const todos = await Todo.find(query)
        .populate('place', 'name location category image')
        .sort({ date: 1, time: 1 });

      return todos.map(todo => this.formatTodo(todo));
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get today's itinerary
  async getTodayItinerary(userId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todos = await Todo.find({
        user: userId,
        date: { $gte: today, $lt: tomorrow }
      })
        .populate('place', 'name location category image rating price')
        .sort({ time: 1 });

      return {
        date: today,
        items: todos.map(todo => this.formatTodo(todo)),
        totalItems: todos.length,
        completedItems: todos.filter(t => t.completed).length
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update todo
  async updateTodo(todoId, userId, updates) {
    try {
      const todo = await Todo.findOneAndUpdate(
        { _id: todoId, user: userId },
        { $set: updates },
        { new: true }
      ).populate('place');

      if (!todo) {
        throw new Error('Todo not found or unauthorized');
      }

      return this.formatTodo(todo);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Toggle todo completion
  async toggleComplete(todoId, userId) {
    try {
      const todo = await Todo.findOne({ _id: todoId, user: userId });
      if (!todo) {
        throw new Error('Todo not found');
      }

      todo.completed = !todo.completed;
      await todo.save();

      return this.formatTodo(todo);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Delete todo
  async deleteTodo(todoId, userId) {
    try {
      const todo = await Todo.findOneAndDelete({ _id: todoId, user: userId });
      if (!todo) {
        throw new Error('Todo not found or unauthorized');
      }
      return { success: true, message: 'Todo deleted successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Generate itinerary from AI plan
  async generateFromAIPlan(userId, planData) {
    try {
      const { date, schedule } = planData;
      const createdTodos = [];

      for (const item of schedule) {
        // Find or create place
        let place = await Place.findOne({ name: item.place });
        
        if (!place) {
          place = await Place.create({
            name: item.place,
            description: item.activity,
            category: 'General',
            location: 'City Center'
          });
        }

        const todo = await this.createTodo(userId, {
          title: item.activity,
          description: `Visit ${item.place}`,
          placeId: place._id,
          date: new Date(date),
          time: item.time,
          type: 'ai-generated',
          priority: 'high'
        });

        createdTodos.push(todo);
      }

      return {
        success: true,
        message: `Created ${createdTodos.length} itinerary items`,
        todos: createdTodos
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get todo statistics
  async getTodoStats(userId) {
    try {
      const stats = await Todo.aggregate([
        { $match: { user: require('mongoose').Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
            },
            byPriority: {
              $push: {
                k: '$priority',
                v: { $cond: [{ $eq: ['$completed', false] }, 1, 0] }
              }
            }
          }
        }
      ]);

      return stats[0] || { total: 0, completed: 0 };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Format todo for response
  formatTodo(todo) {
    return {
      id: todo._id,
      title: todo.title,
      description: todo.description,
      place: todo.place,
      date: todo.date,
      time: todo.time,
      priority: todo.priority,
      type: todo.type,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt
    };
  }
}

module.exports = new TodoService();