// jshint -W097
/* jshint -W014 */
// global alert, confirm, console, prompt
/* jshint esversion: 6 */
'use strict';


class Todo {

    constructor(form, input, totList, toDoCompletd) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(totList);
        this.todoCompletd = document.querySelector(toDoCompletd);
        this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
    }

    addToStorage() {
        localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
    }

    addTodo(e) {
        e.preventDefault();
        const input = this.input.value.trim();
        if (input) {
            const newTodo = {
                value: input,
                completed: false,
                key: this.generateKey()
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
        }
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompletd.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem = (todo) => {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.dataset.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>
            `);
        if (todo.completed) {
            this.todoCompletd.append(li);
        } else {
            this.todoList.append(li);
        }

    }

    generateKey() {
        return Math.random().toString(36).substr(2, 15);
    }

    delitedItem() {

    }

    completedItem() {

    }

    handler() {

    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
