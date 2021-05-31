import React, { useState, useEffect} from 'react';
import Modal from "./components/Modal";
import axios from "axios";
import {
  Badge,
  Nav,
  ButtonToolbar,
  ButtonGroup,
  Button,
  NavItem,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
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
  weekday: string,
}

interface AppProps{ 
  viewCompletedItems: boolean,
  isModalActive: boolean,
  dayToView: string,
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

const createItem = () => ({ title: "", description: "", completed: false, priority: "Low", priorityColor: "secondary", weekday: "Monday" })

const displayCompleted = (status: boolean, appProps: AppProps) => ({...appProps, viewCompletedItems: status});

const displaySpecificDay = (day: string, appProps: AppProps) => ({...appProps, dayToView: day})

const asignBadgeColor = (todoItemPriority: string, badgesColors: BadgesColors) => {
  const {lowPriorityColor, mediumPriorityColor, highPriorityColor, urgentPriorityColor} = badgesColors
  switch(todoItemPriority){
    case "Low":
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
    weekday: "Monday",
  }

  const baseAppProps: AppProps = {
    viewCompletedItems: false,
    isModalActive: false,
    dayToView: "Monday",
  }

  const [ActiveItem, setActiveItem] = useState(baseItem)
  const [ListItems, setList] = useState<TodoItem[]>([])
  const [appProps, setAppProps] = useState(baseAppProps)


  useEffect(() => {
    updateTodoItemsList(setList)
  },[]);

  const toggle = () => {
    const {viewCompletedItems, isModalActive, dayToView} = appProps
    setAppProps({ viewCompletedItems, isModalActive: !isModalActive, dayToView});
  };

  const handleSubmit = async (item: TodoItem) => {
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
      <div>
          <Nav tabs>
              <NavItem
                  onClick={() => {
                    setAppProps(displaySpecificDay("Monday", appProps))
                    updateTodoItemsList(setList)
                  }}
                  className={appProps.dayToView === "Monday" ? "nav-link active" : "nav-link"}
                >
                  Monday
              </NavItem>
              <NavItem
                  onClick={() => {
                    setAppProps(displaySpecificDay("Tuesday", appProps))
                    updateTodoItemsList(setList)
                  }}
                  className={appProps.dayToView === "Tuesday" ? "nav-link active" : "nav-link"}
                >
                  Tuesday
              </NavItem>
              <NavItem
                  onClick={() => {
                    setAppProps(displaySpecificDay("Wednesday", appProps))
                    updateTodoItemsList(setList)
                  }}
                  className={appProps.dayToView === "Wednesday" ? "nav-link active" : "nav-link"}
                >
                  Wednesday
              </NavItem>
              <NavItem
                  onClick={() => {
                    setAppProps(displaySpecificDay("Thursday", appProps))
                    updateTodoItemsList(setList)
                  }}
                  className={appProps.dayToView === "Thursday" ? "nav-link active" : "nav-link"}
                >
                  Thursday
              </NavItem>
              <NavItem
                  onClick={() => {
                    setAppProps(displaySpecificDay("Friday", appProps))
                    updateTodoItemsList(setList)
                  }}
                  className={appProps.dayToView === "Friday" ? "nav-link active" : "nav-link"}
                >
                  Friday
              </NavItem>
              <NavItem
                  onClick={() => {
                    setAppProps(displaySpecificDay("Saturday", appProps))
                    updateTodoItemsList(setList)
                  }}
                  className={appProps.dayToView === "Saturday" ? "nav-link active" : "nav-link"}
                >
                  Saturday
              </NavItem>
              <NavItem
                  onClick={() => {
                    setAppProps(displaySpecificDay("Sunday", appProps))
                    updateTodoItemsList(setList)
                  }}
                  className={appProps.dayToView === "Sunday" ? "nav-link active" : "nav-link"}
                >
                  Sunday
              </NavItem>
          </Nav>

          <br></br>

          <ButtonToolbar>
            <ButtonGroup  
              size="sm"
            >
              <Button
                outline color="success"
                active={appProps.viewCompletedItems}
                onClick={() => {
                  setAppProps(displayCompleted(true, appProps))
                  updateTodoItemsList(setList)
                  
                }}
              >
                Completed
              </Button>
              <Button
                outline color="danger"
                active={!appProps.viewCompletedItems}
                onClick={() => {
                  setAppProps(displayCompleted(false, appProps))
                  updateTodoItemsList(setList)
                }}
              >
                Incompleted
              </Button>
            </ButtonGroup>
            
            <ButtonGroup size="sm">
                <UncontrolledButtonDropdown >
                  
                  <DropdownToggle caret>
                    Sort
                  </DropdownToggle>

                  <DropdownMenu>

                    <DropdownItem >
                      Alphabetically
                    </DropdownItem>

                    <DropdownItem divider />

                    <DropdownItem>
                      By priority
                    </DropdownItem>

                  </DropdownMenu>
              </UncontrolledButtonDropdown>
            </ButtonGroup>
          </ButtonToolbar>
      </div>
    );
  };

  const renderTodoItems = () => {
    const { viewCompletedItems, dayToView } = appProps;
    const newItems = ListItems.filter(
      (item: TodoItem) => {
        return (item.completed === viewCompletedItems && item.weekday === dayToView)
      }
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
        <div className="col-md-8 col-sm-10 mx-auto p-0">
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