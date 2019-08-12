import { Injectable } from '@angular/core';
import { TodoItem } from '../classes/todo-item';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
/**
 * @class SuperTodoService - Service class that manages all the todo list interactions
 */
export class SuperTodoService {
  todoItems: TodoItem[];
  constructor(private storage: Storage) {
    this.getItemsFromStorage();
  }
  /**
   * Completes the tasks
   * @param todoItem: the item to complete
   */
  public completeTask(todoItem: TodoItem) {
    todoItem.endDate = new Date(); // Get now as a date;
    // Get the duration of the task by subtracting the start time from the end time
    todoItem.duration = this.msToTime(
      todoItem.endDate.getTime() - todoItem.startDate.getTime()
    );
    todoItem.isDone = true; // Set to done
    this.updateTodoList(todoItem); // Update the todo list
  }

  /**
   * Deletes the item from the todo list
   * @param todoItem the todo item to delete
   */
  public deleteTask(todoItem: TodoItem) {
    this.updateTodoList(todoItem, true); // Update the todo list with the isDelete flag
  }
  /**
   * Adds a new todo item to the the list of todo items
   * @param text the text of the item
   * @param score the score of the item
   */
  public newTodoItem( text: string, score: number) {
    // Generate random id for item
    const itemId = Math.random()
      .toString(36)
      .substr(2, 9);
    // Create a new item object
    const todoItem = new TodoItem(itemId, text, score, new Date());
    // If the array is empty initialize it
    if (this.todoItems == null) {
      this.todoItems = [];
    }
    // Add it to the items array
    this.todoItems.push(todoItem);
    // Save the array to storage
    this.saveItemToStorage();
  }
  /**
   * Returns the list of todo items
   */
  public getTodoItems(): TodoItem[] {
    return this.todoItems;
  }

  /**
   * Gets the list of todo items from storage
   */
  public getItemsFromStorage() {
    return new Promise(response => {
      // Returning it in a promise for reasons
      this.storage
        .get('todoItems')
        .then(items => {
          // console.log('Loaded items from storage: ');
          // console.log(items);
          response(items);
          this.todoItems = items;
        })
        .catch(err => {
          console.log('Error loading items from storage: ' + err);
        });
    });
  }
  /**
   * Updates the todo list either by updating the specific passed item or deleting it
   * @param todoItem the item to update or delete
   * @param isDeleteAction sets if the item should be deleted
   */
  private updateTodoList(todoItem: TodoItem, isDeleteAction = false) {
    // loop of the array
    for (let i = 0; i < this.todoItems.length; i++) {
      if (this.todoItems[i].itemID === todoItem.itemID) {
        // Find the match using the unique id
        if (!isDeleteAction) {
          // if not delete, update the entry
          this.todoItems[i] = todoItem;
        } else {
          this.todoItems.splice(i, 1); // OR delete the entry
        }
      }
    }
    this.saveItemToStorage(); // Save the updated array to storage
  }
  /**
   * Saves the todo items to storage
   */
  private saveItemToStorage() {
    this.storage.set('todoItems', this.todoItems); // Savse the todo list item to storage
  }
  /**
   * Converts milliseconds to a human readable string
   * @param ms the milliseconds to be converted
   */
  private msToTime(ms: number): string {
    const hours = Math.floor(ms / 3600000); // 1 Hour = 36000 Milliseconds
    const minutes = Math.floor((ms % 3600000) / 60000); // 1 Minutes = 60000 Milliseconds
    return hours + ':' + minutes;
  }
}
