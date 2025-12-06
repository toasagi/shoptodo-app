import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Given Steps
Given('the todo list is empty', async function(this: CustomWorld) {
  // Clear all todos by clicking the delete button (second .todo-btn in each item)
  // Skip items that are just "empty" placeholder
  const todos = await this.page.locator('.todo-item .todo-controls').all();

  for (const controls of todos) {
    // The delete button is the second button in todo-controls
    const deleteBtn = controls.locator('.todo-btn').last();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await this.page.waitForTimeout(300);
    }
  }

  // Verify todo list is empty (0 items with controls = no real todos)
  const count = await this.page.locator('.todo-item .todo-controls').count();
  expect(count, 'Todo list should be empty').toBe(0);
});

Given('the user has added todo {string}', async function(this: CustomWorld, todoText: string) {
  // Add todo directly
  await this.page.locator('#todo-input').fill(todoText);
  await this.page.locator('#add-todo-btn').click();
  await this.page.waitForTimeout(500);

  // Verify todo was added (check for real todo items with controls)
  const todoCount = await this.page.locator('.todo-item .todo-controls').count();
  expect(todoCount, `Todo "${todoText}" should be added`).toBeGreaterThan(0);
});

// When Steps
When('the user enters todo text {string}', async function(this: CustomWorld, text: string) {
  await this.dashboardPage.enterTodoText(text);
});

When('the user clicks the add todo button', async function(this: CustomWorld) {
  await this.dashboardPage.clickAddTodoButton();
});

When('the user toggles completion for {string}', async function(this: CustomWorld, todoText: string) {
  // Find the todo and click the first button (toggle) in todo-controls
  const todos = await this.page.locator('.todo-item').all();
  for (const todo of todos) {
    const text = await todo.locator('.todo-text').textContent();
    if (text?.includes(todoText)) {
      // First button is toggle, second is delete
      await todo.locator('.todo-controls .todo-btn').first().click();
      await this.page.waitForTimeout(300);
      break;
    }
  }
});

When('the user deletes the todo {string}', async function(this: CustomWorld, todoText: string) {
  // Find the todo and click the second button (delete) in todo-controls
  const todos = await this.page.locator('.todo-item').all();
  for (const todo of todos) {
    const text = await todo.locator('.todo-text').textContent();
    if (text?.includes(todoText)) {
      // Second button is delete
      await todo.locator('.todo-controls .todo-btn').last().click();
      await this.page.waitForTimeout(300);
      break;
    }
  }
});

// Then Steps
Then('the todo {string} should appear in the list', async function(this: CustomWorld, todoText: string) {
  // Check if any todo item contains the text
  const todoItems = await this.page.locator('.todo-item .todo-text').all();
  let found = false;
  for (const item of todoItems) {
    const text = await item.textContent();
    if (text?.includes(todoText)) {
      found = true;
      break;
    }
  }
  expect(found, `Todo "${todoText}" should appear in the list`).toBe(true);
});

Then('the todo {string} should not appear in the list', async function(this: CustomWorld, todoText: string) {
  // Check that no todo item contains the text
  const todoItems = await this.page.locator('.todo-item .todo-text').all();
  let found = false;
  for (const item of todoItems) {
    const text = await item.textContent();
    if (text?.includes(todoText)) {
      found = true;
      break;
    }
  }
  expect(found, `Todo "${todoText}" should not appear in the list`).toBe(false);
});

Then('the todo count should be {int}', async function(this: CustomWorld, count: number) {
  // Count real todos (items with controls, not the "empty" placeholder)
  const actualCount = await this.page.locator('.todo-item .todo-controls').count();
  expect(actualCount, `Todo count should be ${count}`).toBe(count);
});

Then('the todo {string} should be marked as completed', async function(this: CustomWorld, todoText: string) {
  // Check if the todo text has the 'completed' class (strikethrough)
  const todos = await this.page.locator('.todo-item').all();
  let isCompleted = false;

  for (const todo of todos) {
    const textElement = todo.locator('.todo-text');
    const text = await textElement.textContent();
    if (text?.includes(todoText)) {
      const className = await textElement.getAttribute('class') || '';
      isCompleted = className.includes('completed');
      break;
    }
  }

  expect(isCompleted, `Todo "${todoText}" should be marked as completed`).toBe(true);
});
