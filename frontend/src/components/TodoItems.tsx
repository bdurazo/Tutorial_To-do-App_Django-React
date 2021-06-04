import axios from "axios";
import React, { useState, useEffect} from "react";

import {
	Badge,
	ButtonGroup,
	Button,
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

interface TodoItem {
    id?: number,
    title: string,
    description: string,
    completed: boolean,
    priority: number,
    weekday: string,
}

interface Props{ 
    weekDay: string,
    currentPage: number,
	refreshFlag: boolean,
	setRefreshFlag: (flag: boolean) => void,
	setCurrentPage: (page: number) => void,
    setPagesCount: (pages: number) => void,
    handleDelete: (todoItem: TodoItem) => void,
    toggle: () => void
    setActiveItem: (todoItem: TodoItem) => void,
}

const badgesColors: BadgesColors = {
	lowPriorityColor: "success",
	mediumPriorityColor: "primary",
	highPriorityColor: "warning",
	urgentPriorityColor: "danger"
}; 



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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const TodoItems = (props: Props) => {
	const {weekDay, currentPage, refreshFlag, setRefreshFlag, setPagesCount, setCurrentPage, handleDelete, toggle, setActiveItem} = props;

	const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
	const [viewCompletedItems, setviewCompletedItems] = useState(Boolean);
	const [sortingOption, setSortingOption] = useState("title");

  
	useEffect(() => {
		refreshList();
	}, [sortingOption, currentPage]);

	useEffect(() => {
		setCurrentPage( 1 );
		strictRefreshList();
	}, [weekDay, viewCompletedItems, refreshFlag]);

	const refreshList = async () => {
		const { data } = await axios.get(`/api/todos/?completed=${ viewCompletedItems }&ordering=${ sortingOption }&weekday=${ weekDay }&page=${ currentPage }`);
		const {results, count} = data;
		setPagesCount( Math.ceil(count/4) );
		setTodoItems( results );
	};

	const strictRefreshList = async () => {
		const { data } = await axios.get(`/api/todos/?completed=${ viewCompletedItems }&ordering=${ sortingOption }&weekday=${ weekDay }&page=1`);
		const {results, count} = data;
		setPagesCount( Math.ceil(count/4) );
		setTodoItems( results );
	};

	return(
		<div>	
			<ButtonGroup  
				size="sm"
			>
				<Button
					outline color="success"
					active={viewCompletedItems}
					onClick={() => {
						setviewCompletedItems(true);
                
					}}
				>
              Completed
				</Button>

				<Button
					outline color="danger"
					active={!viewCompletedItems}
					onClick={() => {
						setviewCompletedItems(false);
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
						setSortingOption("title");
					}}
					>
                      Alphabetically {"↓"}
					</DropdownItem>

					<DropdownItem divider />

					<DropdownItem onClick={() => {
						setSortingOption("-title");
					}}
					>
                      Alphabetically {"↑"}
					</DropdownItem>

					<DropdownItem divider />

					<DropdownItem onClick={() => {
						setSortingOption("priority");
					}}
					>
                      By priority {"↓"}
					</DropdownItem>

					<DropdownItem divider />

					<DropdownItem onClick={() => {
						setSortingOption("-priority");
					}}
					>
                      By priority {"↑"}
					</DropdownItem>

				</DropdownMenu>
			</UncontrolledButtonDropdown>

			<ul className="list-group list-group-flush border-top-0">              
				{ todoItems.map((todoItem: TodoItem) => (
					<li
						key={todoItem.id}
						className="list-group-item d-flex justify-content-between align-items-center"
					>
						<span
							className={`todo-title mr-2 ${
								viewCompletedItems ? "completed-todo" : ""
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
									toggle();
									setActiveItem(todoItem);
									setRefreshFlag(!refreshFlag);
								}}
							>
                                Edit
							</button>
								
							<button
								className="btn btn-danger"
								onClick={() => {
									handleDelete(todoItem);
									setRefreshFlag(!refreshFlag);
								}}
							>
                                Delete
							</button>
						</span>
					</li>
				))}
			</ul>
			<br></br>
		</div>
	);
};

export default TodoItems;