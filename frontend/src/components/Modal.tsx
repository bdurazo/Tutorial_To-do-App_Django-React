import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

interface TodoItem{
  id?: number,
  title: string,
  description: string,
  completed: boolean,
  priority: string,
}

interface CustomModalProps{
  activeItem: TodoItem,
  toggle: () => void, 
  onSave: (item: TodoItem) => void,
}

const markAsCompleted = (completed: boolean, todo: TodoItem) => ({...todo, completed})

const updateTitle = (title: string, todo: TodoItem) => ({...todo, title})

const updateDescription = (description: string, todo: TodoItem) => ({...todo, description})

const updatePriorityLvl = (priority: string, todo: TodoItem) => ({...todo, priority})

export default function CustomModal(props: CustomModalProps) {
  const {toggle, onSave, activeItem} = props
  const [todo, setTodoValues] = useState(activeItem)

  return (
    <Modal isOpen={true} toggle={toggle}>
      <ModalHeader toggle={toggle}>Todo Item</ModalHeader>

      <ModalBody>
        <Form>

          <FormGroup>
            <Label for="todo-title">Title</Label>
            <Input
              type="text"
              id="todo-title"
              name="title"
              value={todo.title}
              onChange={ (event) => {
                const {target: {value}} = event
                const updatedTodo = updateTitle(value, todo)
                setTodoValues(updatedTodo)
              }}
              placeholder="Enter Todo Title"
            />
          </FormGroup>

          <FormGroup>
            <Label for="todo-description">Description</Label>
            <Input
              type="text"
              id="todo-description"
              name="description"
              value={todo.description}
              onChange={ (event) => {
                const {target: {value}} = event
                const updatedTodo = updateDescription(value, todo)
                setTodoValues(updatedTodo)
              }}
              placeholder="Enter Todo description"
            />
          </FormGroup>

          <FormGroup>
            <Label for="todo-priority">Select priority level</Label>
            <Input 
              type="select" 
              id="todo-priority"
              name="priority" 
              value= {todo.priority}
              onChange={ (event) => {
                const {target: {value}} = event
                const updatedTodo = updatePriorityLvl(value, todo)
                setTodoValues(updatedTodo)
              }}
              >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </Input>
          </FormGroup>

          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                name="completed"
                checked={todo.completed}
                onChange={ (event) => {
                  const {target: {checked}} = event
                  const updatedTodo = markAsCompleted(checked, todo)
                  setTodoValues(updatedTodo)
                }}
                />
              Completed
            </Label>
          </FormGroup>

        </Form>
      </ModalBody>

      <ModalFooter>
        <Button
          color="success"
          onClick={() => onSave(todo)}
        >
          Save
        </Button>
      </ModalFooter>
      
    </Modal>
  );
}