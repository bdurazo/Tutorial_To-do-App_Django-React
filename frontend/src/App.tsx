import React, { useState, useEffect} from "react";
import Modal from "./components/Modal";
import axios from "axios";
import {
	Badge,
	Nav,
	ButtonGroup,
	Button,
	NavItem,
	UncontrolledButtonDropdown,
	DropdownToggle,
	DropdownItem,
	DropdownMenu
} from "reactstrap";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

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
  priority: number,
  weekday: string,
}

interface AppProps{ 
  viewCompletedItems: boolean,
  isModalActive: boolean,
  dayToView: string,
  sortingOption: string
}

const modalToggling = (appProps: AppProps) => {
	const {isModalActive} = appProps;
	return{...appProps, isModalActive: !isModalActive };
};

const updateTodoItemsList = async (appProps: AppProps, setTodoItemsList: (todoItems: TodoItem[]) => void) => {
	const {viewCompletedItems, dayToView, sortingOption} = appProps;
	const { data } = await axios.get(`/api/todos/?completed=${ viewCompletedItems }&ordering=${ sortingOption }&weekday=${ dayToView }`);

	setTodoItemsList( data );
};

const handleDelete = async (item: TodoItem, appProps: AppProps, setTodoItemsList: (todoItems: TodoItem[]) => void) => {
	const { id } = item;
	await axios.delete(`/api/todos/${id}/`);
	updateTodoItemsList( appProps,  setTodoItemsList );
};

const createItem = () => ({ title: "", description: "", completed: false, priority: 4, priorityColor: "secondary", weekday: "Monday" });

const updateDisplayCompletedOption = (status: boolean, appProps: AppProps) => ({...appProps, viewCompletedItems: status});

const updateSortingOption = (status: string, appProps: AppProps) => ({...appProps, sortingOption: status});

const displaySpecificDay = (day: string, appProps: AppProps) => ({...appProps, dayToView: day});

const asignBadgeColor = (todoItemPriority: number, badgesColors: BadgesColors) => {
	const {lowPriorityColor, mediumPriorityColor, highPriorityColor, urgentPriorityColor} = badgesColors;
	switch(todoItemPriority){
	case 4:
		return lowPriorityColor;
	case 3:
		return mediumPriorityColor;
	case 2:
		return highPriorityColor;
	case 1:
		return urgentPriorityColor;
	default:
		return lowPriorityColor;
	}
};

const asignPriorityTag = (priorityLvl: number) => {
	switch(priorityLvl){
	case 4:
		return "Low";
	case 3:
		return "Medium";
	case 2:
		return "High";
	case 1:
		return "Urgent";
	default:
		return 4;
	}
};

export default function App(){

	const badgesColors: BadgesColors = {
		lowPriorityColor: "success",
		mediumPriorityColor: "primary",
		highPriorityColor: "warning",
		urgentPriorityColor: "danger"
	};  

	const baseItem: TodoItem = {  
		title: "",
		description: "",
		completed: false,
		priority: 4, // 4 Represents Low value
		weekday: "Monday",
	};

	const baseAppProps: AppProps = {
		viewCompletedItems: false,
		isModalActive: false,
		dayToView: "Monday",
		sortingOption: "title"
	};

	const [activeItem, setActiveItem] = useState(baseItem);
	const [todoItemsList, setList] = useState<TodoItem[]>([]);
	const [appProps, setAppProps] = useState(baseAppProps);


	useEffect(() => {
		updateTodoItemsList(appProps, setList);
	},[appProps]);

	const toggle = () => {
		const {viewCompletedItems, isModalActive, dayToView, sortingOption: sortingStyle} = appProps;
		setAppProps({ viewCompletedItems, isModalActive: !isModalActive, dayToView, sortingOption: sortingStyle});
	};

	const handleSubmit = async (todoItem: TodoItem) => {
		toggle();

		if (todoItem.id) {
			await axios.put(`/api/todos/${todoItem.id}/`, todoItem);
			updateTodoItemsList(appProps, setList);
			return;
		}
		await axios.post("/api/todos/", todoItem);
		updateTodoItemsList(appProps, setList);
	};

	const renderTabList = () => {
		return (
			<div>
				<Nav tabs>
					<NavItem
						onClick={() => {
							setAppProps(displaySpecificDay("Monday", appProps));
						}}
						className={appProps.dayToView === "Monday" ? "nav-link active" : "nav-link"}
					>
                  Monday
					</NavItem>
					<NavItem
						onClick={() => {
							setAppProps(displaySpecificDay("Tuesday", appProps));
						}}
						className={appProps.dayToView === "Tuesday" ? "nav-link active" : "nav-link"}
					>
                  Tuesday
					</NavItem>
					<NavItem
						onClick={() => {
							setAppProps(displaySpecificDay("Wednesday", appProps));
						}}
						className={appProps.dayToView === "Wednesday" ? "nav-link active" : "nav-link"}
					>
                  Wednesday
					</NavItem>
					<NavItem
						onClick={() => {
							setAppProps(displaySpecificDay("Thursday", appProps));
						}}
						className={appProps.dayToView === "Thursday" ? "nav-link active" : "nav-link"}
					>
                  Thursday
					</NavItem>
					<NavItem
						onClick={() => {
							setAppProps(displaySpecificDay("Friday", appProps));
						}}
						className={appProps.dayToView === "Friday" ? "nav-link active" : "nav-link"}
					>
                  Friday
					</NavItem>
					<NavItem
						onClick={() => {
							setAppProps(displaySpecificDay("Saturday", appProps));
						}}
						className={appProps.dayToView === "Saturday" ? "nav-link active" : "nav-link"}
					>
                  Saturday
					</NavItem>
					<NavItem
						onClick={() => {
							setAppProps(displaySpecificDay("Sunday", appProps));
						}}
						className={appProps.dayToView === "Sunday" ? "nav-link active" : "nav-link"}
					>
                  Sunday
					</NavItem>
				</Nav>

				<br></br>
          
				<ButtonGroup  
					size="sm"
				>
					<Button
						outline color="success"
						active={appProps.viewCompletedItems}
						onClick={() => {
							setAppProps(updateDisplayCompletedOption(true, appProps));
                
						}}
					>
              Completed
					</Button>

					<Button
						outline color="danger"
						active={!appProps.viewCompletedItems}
						onClick={() => {
							setAppProps(updateDisplayCompletedOption(false, appProps));
						}}
					>
              Incompleted
					</Button>
				</ButtonGroup>

				<UncontrolledButtonDropdown className="float-right" size="sm">
					<DropdownToggle  caret>
                    Sort
					</DropdownToggle>

					<DropdownMenu>

						<DropdownItem onClick={() => {
							setAppProps(updateSortingOption("title", appProps));
						}
						}
						>
                      Alphabetically
						</DropdownItem>

						<DropdownItem divider />

						<DropdownItem onClick={() => {
							setAppProps(updateSortingOption("priority", appProps));
						}
						}
						>
                      By priority
						</DropdownItem>

					</DropdownMenu>
				</UncontrolledButtonDropdown>
          
			</div>
		);
	};

	const renderTodoItems = () => {
		const newItems = todoItemsList;

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
							{asignPriorityTag(todoItem.priority)}
						</Badge>
					</span>
				</span>

				<span>
					<button
						className="btn btn-secondary mr-2"
						onClick={() => {
							setAppProps(modalToggling(appProps));
							setActiveItem(todoItem);
						}
						}
					>
            Edit
					</button>
					<button
						className="btn btn-danger"
						onClick={
							() => handleDelete(todoItem, appProps, setList)
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
									setAppProps(modalToggling(appProps));
									setActiveItem(createItem);
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
					activeItem={activeItem}
					toggle={toggle}
					onSave={handleSubmit}
				/>
			) : null}
		</main>
	);
}