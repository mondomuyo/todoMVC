



window.onload = function() {
    let curUID = 0;
    let itemCount = 0;
    let todoList = [];
    if(localStorage.getItem("data") === null) {
        todoList = [];
        curUID = 0;
    } else {
        todoList = JSON.parse(localStorage.getItem("data"));
        curUID = Number(localStorage.getItem("curUid"));
    }
    
    let showMode = "All";

    let addTodoDiv = function(ul, uid) {
        var li = document.createElement("li");
        ul.appendChild(li);
        var div = document.createElement("div");
        div.className="todo";
        div.id = "todo-" + uid;
        li.appendChild(div);
        var input = document.createElement("input");
        input.type = "checkbox";
        if(todoList[uid]["status"] === "completed") {
            input.checked = true;
        }
        input.onclick = changeTodoStatus(uid);
        div.appendChild(input);
        var label = document.createElement("label");
        label.innerHTML = todoList[uid]["text"];
        div.appendChild(label);
        var button = document.createElement("button");
        button.innerHTML = "delete"
        button.onclick = deleteTodo(uid);
        div.appendChild(button);
    }

    let updateHTMLTodoList = function() {
        let todos = document.getElementById("todos");
        let activeCount = 0;
        let completedCount = 0;
        todos.innerHTML = "";
        itemCount = 0;
        for(uid in todoList) {
            let curTodo = todoList[uid];
            itemCount++;
            if(curTodo["status"] === "active") {
                activeCount++;
            }
            if(curTodo["status"] === "completed") {
                completedCount++;
            }
            if(showMode === "All" && curTodo["status"] !== "deleted") {
                addTodoDiv(todos, uid);
            } else if(showMode === "Active" && curTodo["status"] === "active") {
                addTodoDiv(todos, uid);
            } else if(showMode === "Completed" && curTodo["status"] === "completed") {
                addTodoDiv(todos, uid);
            }
        }
        if(completedCount === 0) {
            document.getElementById("clear-completed").style.visibility = "hidden";
        } else {
            document.getElementById("clear-completed").style.visibility = "visible";
        }
        updateXXItemLeft(activeCount);
    }

    let updateXXItemLeft = function(count) {
        let itemCountSpan = document.getElementById("item-count");
        let pluralSpan = document.getElementById("plural")
        itemCountSpan.innerHTML = String(count);
        if(count > 1) {
            pluralSpan.innerHTML = "s";
        } else {
            pluralSpan.innerHTML = "";
        }
    }

    let deleteTodo = function(uid) {
        return function() {
            let todos = document.getElementById("todos");
            let lis = todos.getElementsByTagName("li");
            let liToDel = null;
            for(index in lis) {
                let li = lis[index];
                let div = li.getElementsByTagName("div")[0];
                if(div.id === "todo-" + uid) {
                    liToDel = li;
                    break;
                }
            }
            if(liToDel !== null) {
                todoList[uid]["status"] = "deleted";
                updateHTMLTodoList();
            }
        }
    }

    let changeTodoStatus = function(uid) {
        return function() {
            let todos = document.getElementById("todos");
            let lis = todos.getElementsByTagName("li");
            let liToChange = null;
            for(index in lis) {
                let li = lis[index];
                let div = li.getElementsByTagName("div")[0];
                if(div.id === "todo-" + uid) {
                    liToChange = li;
                    break;
                }
            }
            if(liToChange !== null) {
                let div = liToChange.getElementsByTagName("div")[0];
                let checkbox = div.getElementsByTagName("input")[0];
                if(checkbox.checked) {
                    todoList[uid]["status"] = "completed";
                } else {
                    todoList[uid]["status"] = "active";
                }
                updateHTMLTodoList();
            }
        }
    }

    let todoInput = document.getElementById("todo-input");
    todoInput.onchange = function() {
        let curTodo = {};
        curTodo["text"] = todoInput.value;
        curTodo["uid"] = curUID;
        curTodo["status"] = "active";
        todoList[curUID] = curTodo;
        // console.log(JSON.stringify(todoList));
        curUID++;
        updateHTMLTodoList();
        todoInput.value = "";
    }

    let activeButton = document.getElementById("active");
    activeButton.onclick = function() {
        this.className = "footer-button-selected";
        document.getElementById("all").className = "footer-button-unselected";
        document.getElementById("completed").className = "footer-button-unselected";
        showMode = "Active";
        updateHTMLTodoList();
    }

    let allButton = document.getElementById("all");
    allButton.onclick = function() {
        this.className = "footer-button-selected";
        document.getElementById("active").className = "footer-button-unselected";
        document.getElementById("completed").className = "footer-button-unselected";
        showMode = "All";
        updateHTMLTodoList();
    }

    let completedButton = document.getElementById("completed");
    completedButton.onclick = function() {
        this.className = "footer-button-selected";
        document.getElementById("active").className = "footer-button-unselected";
        document.getElementById("all").className = "footer-button-unselected";
        showMode = "Completed";
        updateHTMLTodoList();
    }

    let clearCompletedButton = document.getElementById("clear-completed");
    clearCompletedButton.onclick = function() {
        for(uid in todoList) {
            if(todoList[uid]["status"] === "completed") {
                todoList[uid]["status"] = "deleted";
            }
        }
        updateHTMLTodoList();
    }

    let toggleAllButton = document.getElementById("toggle-all");
    toggleAllButton.onclick = function() {
        if(this.checked) {
            for(uid in todoList) {
                if(todoList[uid]["status"] === "active") {
                    todoList[uid]["status"] = "completed";
                }
            }
        } else {
            for(uid in todoList) {
                if(todoList[uid]["status"] === "completed") {
                    todoList[uid]["status"] = "active";
                }
            }
        }
        updateHTMLTodoList();
    }

    updateHTMLTodoList();

    window.onunload = function() {

        // console.log(JSON.stringify(todoList));
        localStorage.setItem("data", JSON.stringify(todoList));
        localStorage.setItem("curUid", curUID.toString());
        // localStorage.clear();
    }
}

