import React, { useState, useEffect} from 'react';
import Modal from "./components/Modal";
import axios from "axios";
import {
  Badge
} from "reactstrap";

interface BadgesColors{
  lowPriorityColor: string,
  mediumPriorityColor: string,
  highPriorityColor: string,
  urgentPriorityColor: string
}

interface TodoItem{
  id?: number,
  title: string,
  description: string,
  completed: boolean,
  priority: string,
}

interface AppProps{ 
  viewCompletedItems: boolean,
  isModalActive: boolean,
}

const modalToggling = (appProps: AppProps) => {
  const {isModalActive} = appProps
  return{...appProps, isModalActive: !isModalActive };
};

const updateTodoItemsList = async (setTodoItemsList: (todoItems: TodoItem[]) => void) => {
  const { data } = await axios.get("/api/todos/");
  setTodoItemsList( data );
};

const handleDelete = async (item: TodoItem, setTodoItemsList: (todoItems: TodoItem[]) => void) => {
  await axios.delete(`/api/todos/${item.id}/`);
  updateTodoItemsList( setTodoItemsList );
};

const createItem = () => ({ title: "", description: "", completed: false, priority: "Low", priorityColor: "secondary" })

const displayCompleted = (status: boolean, appProps: AppProps) => ({...appProps, viewCompletedItems: status});

const asignBadgeColor = (todoItemPriority: string, badgesColors: BadgesColors) => {
  const {lowPriorityColor, mediumPriorityColor, highPriorityColor, urgentPriorityColor} = badgesColors
  switch(todoItemPriority){
    case "Low":
      console.log(lowPriorityColor)
      return lowPriorityColor
    case "Medium":
      return mediumPriorityColor
    case "High":
      return highPriorityColor
    case "Urgent":
      return urgentPriorityColor
    default:
      return lowPriorityColor
  }
}

export default function App(){

  const badgesColors: BadgesColors = {
    lowPriorityColor: "success",
    mediumPriorityColor: "primary",
    highPriorityColor: "warning",
    urgentPriorityColor: "danger"
  }  

  const baseItem: TodoItem = {  
    title: "",
    description: "",
    completed: false,
    priority: "Low",
  }

  const baseAppProps: AppProps = {
    viewCompletedItems: false,
    isModalActive: false,
  }

  const [ActiveItem, setActiveItem] = useState(baseItem)
  const [ListItems, setList] = useState<TodoItem[]>([])
  const [appProps, setAppProps] = useState(baseAppProps)

  useEffect(() => {
    updateTodoItemsList(setList)
  },[]);

  function toggle(){
    const {viewCompletedItems, isModalActive} = appProps
    setAppProps({ viewCompletedItems: viewCompletedItems, isModalActive: !isModalActive });
  };

  async function handleSubmit(item: TodoItem){
    toggle()

    if (item.id) {
      await axios.put(`/api/todos/${item.id}/`, item)
    updateTodoItemsList(setList)
      return;
    }
    await axios.post("/api/todos/", item)
    updateTodoItemsList(setList)
  };

  const renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          onClick={() => {
            setAppProps(displayCompleted(true, appProps))
            updateTodoItemsList(setList)
          }}
          className={appProps.viewCompletedItems ? "nav-link active" : "nav-link"}
        >
          Complete
        </span>
        <span
          onClick={() => {
            setAppProps(displayCompleted(false, appProps))
            updateTodoItemsList(setList)
          }}
          className={appProps.viewCompletedItems ? "nav-link" : "nav-link active"}
        >
          Incomplete
        </span>
      </div>
    );
  };

  const renderTodoItems = () => {
    const { viewCompletedItems } = appProps;
    const newItems = ListItems.filter(
      (item: TodoItem) => item.completed === viewCompletedItems
    );
    

    return newItems.map((todoItem: TodoItem) => (
      <li
        key={todoItem.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            appProps.viewCompletedItems ? "completed-todo" : ""
          }`}
          title={todoItem.description}
        >
          {todoItem.title}   

          <br></br>
          
          <span>
              <Badge color={ String( asignBadgeColor(todoItem.priority, badgesColors) )}>
                {todoItem.priority}
              </Badge>
          </span>
        </span>

        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => {
              setAppProps(modalToggling(appProps))
              setActiveItem(todoItem)
              }
            }
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={
              () => handleDelete(todoItem, setList) 
            }
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  return (
    <main className="container">
      <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
      <div className="row">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="mb-4">
              <button
                className="btn btn-primary"
                onClick={ () => {
                    setAppProps(modalToggling(appProps))
                    setActiveItem(createItem)
                  }
                }
              >
                Add task
              </button>
            </div>
            {renderTabList()}
            <ul className="list-group list-group-flush border-top-0">
              {renderTodoItems()}
            </ul>
          </div>
        </div>
      </div>
      {appProps.isModalActive ? ( 
          <Modal
            activeItem={ActiveItem}
            toggle={toggle}
            onSave={handleSubmit}
          />
      ) : null}
    </main>
  );
}