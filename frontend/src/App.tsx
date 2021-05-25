import React, { useState, useEffect } from 'react';
import Modal from "./components/Modal";
import axios from "axios";



interface todoItem{
  id?: number,
  title: string,
  description: string,
  completed: boolean,
}


export default function App(){
  const baseItem: todoItem = {  
    title: "",
    description: "",
    completed: false,
  }
  const [ActiveItem, setActiveItem] = useState(baseItem)
  
  const [ListItems, setList] = useState([])

  const [AppProps, setAppProps] = useState({ viewCompleted: false,
                                        modal: false,
                                      })

  function refreshList(){
    axios
      .get("/api/todos/")
      .then((res) => setList(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    refreshList();
  },[])

  function toggle(){
    setAppProps({ viewCompleted: AppProps.viewCompleted, modal: !AppProps.modal });
  };

  function handleSubmit(item: todoItem){
    toggle();

    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item)
        .then((res) => refreshList());
      return;
    }
    axios
      .post("/api/todos/", item)
      .then((res) => refreshList());
  };

  function handleDelete(item: todoItem){
    axios
      .delete(`/api/todos/${item.id}/`)
      .then((res) => refreshList());
  };

  function createItem(){
    setActiveItem({ title: "", description: "", completed: false });
    setAppProps({ viewCompleted: AppProps.viewCompleted, modal: !AppProps.modal });
  };

  function editItem(item: todoItem){
    toggle()
    setActiveItem({id: item.id, title: item.title, description: item.description, completed: item.completed });
  };

  function displayCompleted(status: boolean){
    if (status) {
      return setAppProps({ viewCompleted: true, modal: AppProps.modal })

    }
    return setAppProps({ viewCompleted: false, modal: AppProps.modal })
  };

  function renderTabList(){
    return (
      <div className="nav nav-tabs">
        <span
          onClick={() => displayCompleted(true)}
          className={AppProps.viewCompleted ? "nav-link active" : "nav-link"}
        >
          Complete
        </span>
        <span
          onClick={() => displayCompleted(false)}
          className={AppProps.viewCompleted ? "nav-link" : "nav-link active"}
        >
          Incomplete
        </span>
      </div>
    );
  };

  function renderItems(){
    const { viewCompleted } = AppProps;
    const newItems = ListItems.filter(
      (item: todoItem) => item.completed === viewCompleted
    );

    return newItems.map((item: todoItem) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            AppProps.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => editItem(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(item)}
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
                onClick={createItem}
              >
                Add task
              </button>
            </div>
            {renderTabList()}
            <ul className="list-group list-group-flush border-top-0">
              {renderItems()}
            </ul>
          </div>
        </div>
      </div>
      {AppProps.modal ? (
        <Modal
          activeItem={ActiveItem}
          toggle={toggle}
          onSave={handleSubmit}
        />
      ) : null}
    </main>
  );
}

