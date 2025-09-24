import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

/**
 * Todo List Step Definitions
 * Maps to todo-list.feature scenarios
 * Test Cases: TC-TODO-001 to TC-TODO-008
 * Requirements: REQ-F-009 (Todo List)
 */

// Given Steps
Given('the todo list is visible', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.waitForTodoListVisible();
  const isVisible = await this.pageObjects.dashboardPage.isTodoListVisible();
  expect(isVisible, 'Todo list should be visible').toBe(true);
});

Given('the todo list is empty', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.clearAllTodos();
  const todoCount = await this.pageObjects.dashboardPage.getTodoCount();
  expect(todoCount, 'Todo list should be empty').toBe(0);
});

Given('the todo list contains {string} in uncompleted state', async function(this: CustomWorld, todoText: string) {
  await this.pageObjects.dashboardPage.addTodo(todoText);
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const todo = todos.find(t => t.text === todoText);
  expect(todo, `Todo "${todoText}" should exist`).toBeDefined();
  expect(todo?.completed, `Todo "${todoText}" should be uncompleted`).toBe(false);
});

Given('the todo list contains {string} in completed state', async function(this: CustomWorld, todoText: string) {
  await this.pageObjects.dashboardPage.addTodo(todoText);
  await this.pageObjects.dashboardPage.toggleTodoCompletion(todoText);
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const todo = todos.find(t => t.text === todoText);
  expect(todo, `Todo "${todoText}" should exist`).toBeDefined();
  expect(todo?.completed, `Todo "${todoText}" should be completed`).toBe(true);
});

Given('the todo list contains multiple items:', async function(this: CustomWorld, dataTable) {
  const rows = dataTable.raw();
  for (const row of rows) {
    const todoText = row[0];
    await this.pageObjects.dashboardPage.addTodo(todoText);
  }
  
  // Verify all items were added
  const todoCount = await this.pageObjects.dashboardPage.getTodoCount();
  expect(todoCount, `Should have ${rows.length} todos`).toBe(rows.length);
});

Given('the todo list contains multiple items with mixed completion states', async function(this: CustomWorld) {
  const testTodos = [
    { text: '重要なタスク1', completed: false },
    { text: '完了済みタスク', completed: true },
    { text: '重要なタスク2', completed: false }
  ];

  for (const todo of testTodos) {
    await this.pageObjects.dashboardPage.addTodo(todo.text);
    if (todo.completed) {
      await this.pageObjects.dashboardPage.toggleTodoCompletion(todo.text);
    }
  }

  this.setTestData('testTodos', testTodos);
});

// When Steps
When('the user enters {string} in the todo text box', async function(this: CustomWorld, todoText: string) {
  await this.pageObjects.dashboardPage.enterTodoText(todoText);
  this.setTestData('enteredTodoText', todoText);
});

When('the user leaves the todo text box empty', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.clearTodoTextBox();
});

When('the user enters a 100-character text in the todo text box', async function(this: CustomWorld) {
  const longText = 'A'.repeat(100);
  await this.pageObjects.dashboardPage.enterTodoText(longText);
  this.setTestData('enteredTodoText', longText);
});

When('the user clicks the {string} button', async function(this: CustomWorld, buttonName: string) {
  if (buttonName === '追加' || buttonName === 'Add') {
    await this.pageObjects.dashboardPage.clickAddTodoButton();
  } else {
    throw new Error(`Unknown button: ${buttonName}`);
  }
  
  // Wait for operation to complete
  await this.page.waitForTimeout(500);
});

When('the user clicks the checkbox for {string}', async function(this: CustomWorld, todoText: string) {
  await this.pageObjects.dashboardPage.toggleTodoCompletion(todoText);
  await this.page.waitForTimeout(500);
});

When('the user clicks the delete button for {string}', async function(this: CustomWorld, todoText: string) {
  await this.pageObjects.dashboardPage.deleteTodo(todoText);
  await this.page.waitForTimeout(500);
});

When('the user adds {string} to the todo list', async function(this: CustomWorld, todoText: string) {
  await this.pageObjects.dashboardPage.addTodo(todoText);
  await this.page.waitForTimeout(500);
});

When('the user marks {string} as completed', async function(this: CustomWorld, todoText: string) {
  await this.pageObjects.dashboardPage.toggleTodoCompletion(todoText);
  await this.page.waitForTimeout(500);
});

When('the user deletes {string}', async function(this: CustomWorld, todoText: string) {
  await this.pageObjects.dashboardPage.deleteTodo(todoText);
  await this.page.waitForTimeout(500);
});

When('the browser is closed and reopened', async function(this: CustomWorld) {
  // Store current state for verification
  const currentTodos = await this.pageObjects.dashboardPage.getAllTodos();
  this.setTestData('todosBeforeRestart', currentTodos);

  // Simulate browser restart
  await this.simulateBrowserRestart();
});

When('the user interacts with various todo operations', async function(this: CustomWorld) {
  // Perform a series of typical operations
  await this.pageObjects.dashboardPage.addTodo('Test Item 1');
  await this.pageObjects.dashboardPage.addTodo('Test Item 2');
  await this.pageObjects.dashboardPage.toggleTodoCompletion('Test Item 1');
  await this.page.waitForTimeout(1000);
});

// Then Steps - Success Scenarios
Then('the new todo item should be added to the list', async function(this: CustomWorld) {
  const enteredText = this.getTestData('enteredTodoText');
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const addedTodo = todos.find(todo => todo.text === enteredText);
  expect(addedTodo, `Todo "${enteredText}" should be added to the list`).toBeDefined();
});

Then('the item should be in uncompleted state', async function(this: CustomWorld) {
  const enteredText = this.getTestData('enteredTodoText');
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const addedTodo = todos.find(todo => todo.text === enteredText);
  expect(addedTodo?.completed, 'Todo should be in uncompleted state').toBe(false);
});

Then('the text box should be cleared', async function(this: CustomWorld) {
  const textBoxValue = await this.pageObjects.dashboardPage.getTodoTextBoxValue();
  expect(textBoxValue, 'Text box should be cleared').toBe('');
});

Then('the todo data should be saved in localStorage', async function(this: CustomWorld) {
  const localStorageData = await this.pageObjects.dashboardPage.getTodoDataFromStorage();
  expect(localStorageData, 'Todo data should exist in localStorage').toBeTruthy();
  
  const enteredText = this.getTestData('enteredTodoText');
  const hasTodo = localStorageData.some((todo: any) => todo.text === enteredText);
  expect(hasTodo, `Todo "${enteredText}" should be saved in localStorage`).toBe(true);
});

Then('the item should be marked as completed', async function(this: CustomWorld) {
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const targetTodo = todos.find(todo => todo.text.includes('ワイヤレスイヤホンを検討'));
  expect(targetTodo?.completed, 'Todo should be marked as completed').toBe(true);
});

Then('a strikethrough should be applied to the text', async function(this: CustomWorld) {
  const hasStrikethrough = await this.pageObjects.dashboardPage.hasTodoStrikethrough('ワイヤレスイヤホンを検討');
  expect(hasStrikethrough, 'Strikethrough should be applied').toBe(true);
});

Then('a checkmark should appear in the checkbox', async function(this: CustomWorld) {
  const isChecked = await this.pageObjects.dashboardPage.isTodoChecked('ワイヤレスイヤホンを検討');
  expect(isChecked, 'Checkbox should be checked').toBe(true);
});

Then('the localStorage should be updated', async function(this: CustomWorld) {
  const localStorageData = await this.pageObjects.dashboardPage.getTodoDataFromStorage();
  const targetTodo = localStorageData.find((todo: any) => todo.text.includes('ワイヤレスイヤホンを検討'));
  expect(targetTodo?.completed, 'localStorage should reflect completion status').toBe(true);
});

Then('the item should be marked as uncompleted', async function(this: CustomWorld) {
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const targetTodo = todos.find(todo => todo.text.includes('ワイヤレスイヤホンを検討'));
  expect(targetTodo?.completed, 'Todo should be marked as uncompleted').toBe(false);
});

Then('the strikethrough should be removed from the text', async function(this: CustomWorld) {
  const hasStrikethrough = await this.pageObjects.dashboardPage.hasTodoStrikethrough('ワイヤレスイヤホンを検討');
  expect(hasStrikethrough, 'Strikethrough should be removed').toBe(false);
});

Then('the checkbox should be unchecked', async function(this: CustomWorld) {
  const isChecked = await this.pageObjects.dashboardPage.isTodoChecked('ワイヤレスイヤホンを検討');
  expect(isChecked, 'Checkbox should be unchecked').toBe(false);
});

Then('{string} should be removed from the list', async function(this: CustomWorld, todoText: string) {
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const removedTodo = todos.find(todo => todo.text === todoText);
  expect(removedTodo, `Todo "${todoText}" should be removed from the list`).toBeUndefined();
});

Then('{string} should remain in the list', async function(this: CustomWorld, todoText: string) {
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const remainingTodo = todos.find(todo => todo.text === todoText);
  expect(remainingTodo, `Todo "${todoText}" should remain in the list`).toBeDefined();
});

Then('the item should be removed from localStorage', async function(this: CustomWorld) {
  const localStorageData = await this.pageObjects.dashboardPage.getTodoDataFromStorage();
  const removedTodoExists = localStorageData.some((todo: any) => todo.text === 'ワイヤレスイヤホンを検討');
  expect(removedTodoExists, 'Todo should be removed from localStorage').toBe(false);
});

Then('the todo list should contain:', async function(this: CustomWorld, dataTable) {
  const expectedTodos = dataTable.hashes();
  const actualTodos = await this.pageObjects.dashboardPage.getAllTodos();

  for (const expectedTodo of expectedTodos) {
    const actualTodo = actualTodos.find(todo => todo.text === expectedTodo.Product || todo.text === expectedTodo.TodoText);
    expect(actualTodo, `Todo "${expectedTodo.Product || expectedTodo.TodoText}" should exist`).toBeDefined();
    
    if (expectedTodo.Status) {
      const isCompleted = expectedTodo.Status === 'completed';
      expect(actualTodo?.completed, `Todo should have correct completion status`).toBe(isCompleted);
    }
  }
});

Then('data integrity should be maintained', async function(this: CustomWorld) {
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const localStorageData = await this.pageObjects.dashboardPage.getTodoDataFromStorage();
  
  expect(todos.length, 'UI and localStorage should have same number of todos').toBe(localStorageData.length);
  
  for (const todo of todos) {
    const storageMatch = localStorageData.find((stored: any) => stored.text === todo.text);
    expect(storageMatch, `Todo "${todo.text}" should exist in localStorage`).toBeDefined();
    expect(storageMatch.completed, `Completion status should match for "${todo.text}"`).toBe(todo.completed);
  }
});

Then('localStorage should reflect all changes', async function(this: CustomWorld) {
  const localStorageData = await this.pageObjects.dashboardPage.getTodoDataFromStorage();
  expect(localStorageData, 'localStorage should contain todo data').toBeTruthy();
  expect(Array.isArray(localStorageData), 'localStorage data should be an array').toBe(true);
});

Then('the todo item should be restored', async function(this: CustomWorld) {
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const restoredTodo = todos.find(todo => todo.text === '重要なタスク');
  expect(restoredTodo, 'Todo should be restored after page reload').toBeDefined();
});

Then('the completion state should be maintained', async function(this: CustomWorld) {
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const todo = todos.find(todo => todo.text === '重要なタスク');
  expect(todo?.completed, 'Completion state should be maintained').toBe(false);
});

Then('the todo functionality should work normally', async function(this: CustomWorld) {
  // Test basic functionality still works
  await this.pageObjects.dashboardPage.addTodo('Test functionality');
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const testTodo = todos.find(todo => todo.text === 'Test functionality');
  expect(testTodo, 'Should be able to add new todos').toBeDefined();
});

Then('all todo items should be restored', async function(this: CustomWorld) {
  const expectedTodos = this.getTestData('testTodos');
  const actualTodos = await this.pageObjects.dashboardPage.getAllTodos();
  
  expect(actualTodos.length, 'All todos should be restored').toBe(expectedTodos.length);
  
  for (const expectedTodo of expectedTodos) {
    const actualTodo = actualTodos.find(todo => todo.text === expectedTodo.text);
    expect(actualTodo, `Todo "${expectedTodo.text}" should be restored`).toBeDefined();
  }
});

Then('all completion states should be maintained', async function(this: CustomWorld) {
  const expectedTodos = this.getTestData('testTodos');
  const actualTodos = await this.pageObjects.dashboardPage.getAllTodos();
  
  for (const expectedTodo of expectedTodos) {
    const actualTodo = actualTodos.find(todo => todo.text === expectedTodo.text);
    expect(actualTodo?.completed, `Completion state for "${expectedTodo.text}" should be maintained`).toBe(expectedTodo.completed);
  }
});

Then('new todo operations should work normally', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.addTodo('New test todo');
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const newTodo = todos.find(todo => todo.text === 'New test todo');
  expect(newTodo, 'Should be able to add new todos after restart').toBeDefined();
});

Then('the todo should be added successfully', async function(this: CustomWorld) {
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const addedTodo = todos.find(todo => todo.text.includes('ワイヤレスイヤホンのレビューを確認'));
  expect(addedTodo, 'Todo should be added successfully').toBeDefined();
});

Then('the user can continue browsing products', async function(this: CustomWorld) {
  // Verify that we can still navigate and browse products
  const isProductCatalogAccessible = await this.pageObjects.dashboardPage.isProductCatalogVisible();
  expect(isProductCatalogAccessible, 'Product catalog should remain accessible').toBe(true);
});

Then('the todo should remain visible on the dashboard', async function(this: CustomWorld) {
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const targetTodo = todos.find(todo => todo.text.includes('ワイヤレスイヤホンのレビューを確認'));
  expect(targetTodo, 'Todo should remain visible on dashboard').toBeDefined();
});

// Error and Validation Steps
Then('a validation error {string} should be displayed', async function(this: CustomWorld, expectedError: string) {
  const errorMessage = await this.pageObjects.dashboardPage.getTodoValidationError();
  expect(errorMessage, 'Validation error should be displayed').toContain(expectedError);
});

Then('no todo item should be added', async function(this: CustomWorld) {
  const todoCountBefore = this.getTestData('todoCountBefore') || 0;
  const todoCountAfter = await this.pageObjects.dashboardPage.getTodoCount();
  expect(todoCountAfter, 'No todo item should be added').toBe(todoCountBefore);
});

Then('the long text should be displayed properly with text wrapping', async function(this: CustomWorld) {
  const longText = this.getTestData('enteredTodoText');
  const isTextWrapped = await this.pageObjects.dashboardPage.isTodoTextWrappedProperly(longText);
  expect(isTextWrapped, 'Long text should wrap properly').toBe(true);
});

Then('no performance degradation should occur', async function(this: CustomWorld) {
  // Basic performance check - ensure page is still responsive
  const startTime = Date.now();
  await this.pageObjects.dashboardPage.clickAddTodoButton();
  const endTime = Date.now();
  
  const responseTime = endTime - startTime;
  expect(responseTime, 'Operation should complete quickly').toBeLessThan(2000);
});

Then('the script should not be executed', async function(this: CustomWorld) {
  // Check for XSS prevention
  let alertFired = false;
  
  this.page.on('dialog', async (dialog) => {
    alertFired = true;
    await dialog.dismiss();
  });
  
  await this.page.waitForTimeout(2000);
  expect(alertFired, 'Script should not be executed').toBe(false);
});

Then('the text should be displayed as plain text', async function(this: CustomWorld) {
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const scriptTodo = todos.find(todo => todo.text.includes('<script>'));
  expect(scriptTodo, 'Script should be displayed as plain text').toBeDefined();
  expect(scriptTodo?.text, 'Should contain the literal script tag').toContain('<script>alert(\'XSS\')</script>');
});

Then('no XSS alert should appear', async function(this: CustomWorld) {
  // Additional XSS check
  let alertAppeared = false;
  
  this.page.on('dialog', async (dialog) => {
    if (dialog.message().includes('XSS')) {
      alertAppeared = true;
    }
    await dialog.dismiss();
  });
  
  await this.page.waitForTimeout(1000);
  expect(alertAppeared, 'XSS alert should not appear').toBe(false);
});

Then('all operations should provide immediate visual feedback', async function(this: CustomWorld) {
  // Test visual feedback for operations
  await this.pageObjects.dashboardPage.addTodo('Feedback test');
  
  // Check that the todo appears immediately
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const feedbackTodo = todos.find(todo => todo.text === 'Feedback test');
  expect(feedbackTodo, 'Todo should appear immediately after adding').toBeDefined();
});

Then('the interface should remain responsive', async function(this: CustomWorld) {
  // Test interface responsiveness
  const startTime = Date.now();
  await this.pageObjects.dashboardPage.getTodoCount();
  const endTime = Date.now();
  
  const responseTime = endTime - startTime;
  expect(responseTime, 'Interface should remain responsive').toBeLessThan(1000);
});

Then('no unexpected behavior should occur', async function(this: CustomWorld) {
  // Check for console errors or exceptions
  const logs = await this.page.evaluate(() => {
    // Return any console errors that might have been logged
    return (window as any).errorLogs || [];
  });
  
  expect(logs.length, 'No console errors should occur').toBe(0);
});