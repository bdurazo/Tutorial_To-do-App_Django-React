import React, { useState } from "react";
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
  priority: number,
  weekday: string,
}

interface CustomModalProps{
  activeItem: TodoItem,
  toggle: () => void, 
  onSave: (item: TodoItem) => void,
}

const markAsCompleted = (completed: boolean, todo: TodoItem) => ({...todo, completed});

const updateTitle = (title: string, todo: TodoItem) => ({...todo, title});

const updateDescription = (description: string, todo: TodoItem) => ({...todo, description});

const updatePriorityLvl = (priority: number, todo: TodoItem) => ({...todo, priority});

const updateWeekday = (weekday: string, todo: TodoItem) => ({...todo, weekday});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const CustomModal = (props: CustomModalProps) => {
	const {toggle, onSave, activeItem} = props;
	const [todo, setTodoValues] = useState(activeItem);

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
								const {target: {value}} = event;
								const updatedTodo = updateTitle(value, todo);
								setTodoValues(updatedTodo);
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
								const {target: {value}} = event;
								const updatedTodo = updateDescription(value, todo);
								setTodoValues(updatedTodo);
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
							value= { todo.priority }
							onChange={ (event) => {
								const {target: {value}} = event;
								const updatedTodo = updatePriorityLvl(Number( value ), todo);
								console.log(updatedTodo);
								setTodoValues(updatedTodo);
							}}
						>
							<option value={4}>Low</option>
							<option value={3}>Medium</option>
							<option value={2}>High</option>
							<option value={1}>Urgent</option>
						</Input>
					</FormGroup>

					<FormGroup>
						<Label for="todo-weekday">Select the day of the week</Label>
						<Input 
							type="select" 
							id="todo-weekday"
							name="weekday" 
							value= {todo.weekday}
							onChange={ (event) => {
								const {target: {value}} = event;

								const updatedTodo = updateWeekday(value, todo);
								setTodoValues(updatedTodo);
							}}
						>
							<option>Monday</option>
							<option>Tuesday</option>
							<option>Wednesday</option>
							<option>Thursday</option>
							<option>Friday</option>
							<option>Saturday</option>
							<option>Sunday</option>            
						</Input>
					</FormGroup>

					<FormGroup check>
						<Label check>
							<Input
								type="checkbox"
								name="completed"
								checked={todo.completed}
								onChange={ (event) => {
									const {target: {checked}} = event;
									const updatedTodo = markAsCompleted(checked, todo);
									setTodoValues(updatedTodo);
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
};

export default CustomModal;