// jshint -W097
/* jshint -W014 */
/* global alert, confirm, console, prompt, console */
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
            this.input.value = '';
            const newTodo = {
                value: input,
                completed: false,
                key: this.generateKey()
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
        } else {
            alert('Ошибка! Невозможно добавить пустое дело!');
        }
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompletd.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.dataset.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
                <button class="todo-edit"></button>
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

    dropTodo(element, dalay, background) {
        element.style.zIndex = 100;
        element.style.transitionDuration = dalay + 's';
        element.style.backgroundColor = background;
        const container = element.closest('.todo');
        let offset = 0;
        if (container.matches('.todo-list')) offset = container.offsetTop;
        element.style.transform = `translateY(${(offset + container.clientHeight - element.offsetTop)}px)`;
    }


    moveTodo(element, dalay, background) {
        const
            container = element.closest('.todo'),
            containerCompleted = document.getElementById('completed'),
            oldBackground = element.style.backgroundColor;
        let offset = 0;

        element.style.backgroundColor = background;

        if (container.matches('.todo-list')) {
            offset = container.offsetTop + containerCompleted.clientHeight +
                 container.clientHeight - element.offsetTop;
        } else {
            offset = -element.offsetTop;
        }

        element.style.backgroundColor = oldBackground;
        element.style.transform = `translateY(${offset}px)`;
        element.style.zIndex = 100;
        element.style.transitionDuration = dalay + 's';
    }


    generateKey() {
        return Math.random().toString(36).substr(2, 15);
    }

    delitedItem(target) {
        const li = target.closest('li'),
            key = li.dataset.key;
        if (key) {
            const delay = 2;
            this.dropTodo(li, delay, 'grey');
            setTimeout(() => {
                this.todoData.delete(key);
                this.render();
            }, delay * 1000);
        }
    }

    completedItem(target) {
        const li = target.closest('li'),
            key = li.dataset.key;
        if (key) {
            const delay = 2;
            this.moveTodo(li, delay, 'yellow');
            setTimeout(() => {
                const todo = this.todoData.get(key);
                todo.completed = !todo.completed;
                this.render();
            }, delay * 1000);
        }
    }

    editItem(target) {
        const li = target.closest('li'),
            key = li.dataset.key;
        if (key) {
            const todo = this.todoData.get(key);
            const newValue = prompt(`Редактирование дела ${todo.value}:`, todo.value);
            if (newValue.trim()) {
                todo.value = newValue.trim();
                this.render();
            } else {
                alert('Невозможно записать пустое значение.\n Редактирование отменено!');
            }
        }
    }

    handler(e) {
        const target = e.target;
        if (target.matches('button.todo-remove')) {
            this.delitedItem(target);
        } else if (target.matches('button.todo-complete')) {
            this.completedItem(target);
        } else if (target.matches('button.todo-edit')) {
            this.editItem(target);
        }
    }

    eventListener() {
        document.querySelector('.todo-container').addEventListener('click', this.handler.bind(this));
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
        this.eventListener();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();


