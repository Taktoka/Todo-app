let main = document.querySelector("main");
let themeIcons = document.querySelectorAll(".head i img");
let input = document.getElementById("main-input");
let clearCompleted = document.querySelector(".clear");
let dlist = document.querySelectorAll(".sort li");
let footer = document.querySelector(".footer");
let itemsContainer = document.querySelector(".tasks");
let leftItems = document.querySelector(".count");

themeIcons.forEach((icon) => {
  icon.addEventListener("click", (e) => {
    main.classList.contains("light")
      ? main.classList.remove("light")
      : main.classList.add("light");
  });
});

window.onload = function () {
  input.focus();
};

let tasksArray = [];

if (localStorage.getItem("tasks")) {
  tasksArray = JSON.parse(localStorage.getItem("tasks"));
  leftItems.innerHTML = tasksArray.length;
}

getFromLocal();

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (input.value !== "") {
      addToArray(input.value);
      input.value = "";
    }
  }
});

itemsContainer.addEventListener("click", (e) => {
  if (e.target.className === "cross-box") {
    deleteTaskWith(e.target.parentElement.getAttribute("data-id"));
    e.target.parentElement.remove();
  }
  if (e.target.className === "check-box") {
    togglestatus(e.target.parentElement.getAttribute("data-id"));
    e.target.parentElement.classList.toggle("checked");
  }
});

function addToArray(taskText) {
  let task = {
    id: Date.now(),
    title: input.value,
    completed: false,
  };
  tasksArray.push(task);
  leftItems.innerHTML = tasksArray.length;
  addToPageFrom(tasksArray);
  addToLocalFrom(tasksArray);
}

function addToPageFrom(tasksArray) {
  itemsContainer.innerHTML = "";

  tasksArray.forEach((task) => {
    let newItem = document.createElement("li");
    newItem.draggable = true;

    newItem.className = "new-item";
    if (task.completed) {
      newItem.className = "new-item checked";
    }

    newItem.setAttribute("data-id", task.id);

    let checkBox = document.createElement("div");
    checkBox.className = "check-box";
    newItem.appendChild(checkBox);

    let checkIcon = document.createElement("div");
    checkIcon.className = "check-icon";
    checkBox.appendChild(checkIcon);

    let item = document.createElement("span");
    item.className = "item";
    item.appendChild(document.createTextNode(task.title));
    newItem.appendChild(item);

    let crossBox = document.createElement("div");
    crossBox.className = "cross-box";
    newItem.appendChild(crossBox);

    itemsContainer.prepend(newItem);
    new Sortable(itemsContainer, {
      handle: ".new-item",
      animation: 200,
    });
  });
}

function addToLocalFrom(tasksArray) {
  window.localStorage.setItem("tasks", JSON.stringify(tasksArray));
  window.localStorage.setItem("count", leftItems.innerHTML);
}

function getFromLocal() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addToPageFrom(tasks);
  }
  let count = window.localStorage.getItem("count");
  leftItems.innerHTML = count;
}

function deleteTaskWith(taskId) {
  tasksArray = tasksArray.filter((task) => task.id != taskId);
  leftItems.innerHTML = tasksArray.length;
  addToLocalFrom(tasksArray);
}

function togglestatus(taskId) {
  for (let i = 0; i < tasksArray.length; i++) {
    if (tasksArray[i].id == taskId) {
      tasksArray[i].completed == false
        ? (tasksArray[i].completed = true)
        : (tasksArray[i].completed = false);
      if (tasksArray[i].completed) {
        leftItems.innerHTML--;
      } else {
        leftItems.innerHTML = tasksArray.length;
      }
    }
  }
  addToLocalFrom(tasksArray);
}

dlist.forEach((li) => {
  li.addEventListener("click", (e) => {
    dlist.forEach((li) => {
      li.classList.remove("active");
    });
    if (e.target.className === "active-items") {
      e.target.classList.add("active");
      document.querySelectorAll(".app-body .new-item").forEach((ele) => {
        if (ele.classList.contains("checked")) {
          ele.style.display = "none";
        } else {
          ele.style.display = "flex";
        }
      });
    } else if (e.target.className === "completed-items") {
      e.target.classList.add("active");
      document.querySelectorAll(".app-body .new-item").forEach((ele) => {
        if (!ele.classList.contains("checked")) {
          ele.style.display = "none";
        } else {
          ele.style.display = "flex";
        }
      });
    } else {
      e.target.classList.add("active");

      document.querySelectorAll(".app-body .new-item").forEach((ele) => {
        ele.style.display = "flex";
      });
    }
  });
});

clearCompleted.onclick = function () {
  tasksArray = tasksArray.filter((task) => task.completed == false);
  //   leftItems.innerHTML = tasksArray.length;
  addToPageFrom(tasksArray);
  addToLocalFrom(tasksArray);
};
