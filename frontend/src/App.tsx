import React, { useState } from "react";
import Modal from "./components/Modal";
import Pagination from "./components/Pagination";
import TabList from "./components/TabList";
import TodoItems from "./components/TodoItems";
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

interface TodoItem{
  id?: number,
  title: string,
  description: string,
  completed: boolean,
  priority: number,
  weekday: string,
}

interface AppState{ 
  isModalActive: boolean,
  dayToView: string,
}

const handleDelete = async (item: TodoItem) => {
	const { id } = item;
	await axios.delete(`/api/todos/${id}/`);
};

const createItem = () => ({ title: "", description: "", completed: false, priority: 4, priorityColor: "secondary", weekday: "Monday" });


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const App = () => {

	const baseStateItem: TodoItem = {  
		title: "",
		description: "",
		completed: false,
		priority: 4, // 4 Represents Low value
		weekday: "Monday",
	};

	const baseAppState: AppState = {
		isModalActive: false,
		dayToView: "Monday",
	};

	const [activeItem, setActiveItem] = useState(baseStateItem);
	const [appStateAtributes, setAppStateAtributes] = useState(baseAppState);
	const [weekday, setWeekday] = useState("Monday");
	const [pagesCount, setPagesCount] = useState(1);
	const [currentPage, setSetCurrentPage] = useState(1);
	const [refreshFlag, setRefreshFlag] = useState(false);


	const handlePageClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, i: number) => setSetCurrentPage(i+1);

	const handlePreviousClick = () => setSetCurrentPage( currentPage - 1 );

	const handleNextClick = () => setSetCurrentPage( currentPage + 1 );

	const toggle = () => {
		const {isModalActive, dayToView} = appStateAtributes;
		setAppStateAtributes({ isModalActive: !isModalActive, dayToView});
	};

	const handleSubmit = async (todoItem: TodoItem) => {
		toggle();

		if (todoItem.id) {
			await axios.put(`/api/todos/${todoItem.id}/`, todoItem);
			setRefreshFlag(!refreshFlag);
			return;
		}
		await axios.post("/api/todos/", todoItem);
		setRefreshFlag(!refreshFlag);
	};

	return (
		<main className="container">
			<h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
			<div className="row">
				<div className="col-md-8 col-sm-10 mx-auto p-4">
					<div className="card p-3">
						<div className="mb-4">
							<button
								className="btn btn-primary"
								onClick={ () => {
									toggle();
									setActiveItem(createItem);
								}
								}
							>
                Add task
							</button>
						</div>

						<TabList
							setWeekDay = {setWeekday}
							stateWeekDay = {weekday}
						/>

						<br></br>

						<TodoItems
							weekDay= {weekday}
							currentPage= {currentPage}
							refreshFlag={refreshFlag}
							setRefreshFlag= {setRefreshFlag}
							setCurrentPage= {setSetCurrentPage}
							setPagesCount= {setPagesCount} 
							handleDelete= {handleDelete}
							toggle= {toggle}
							setActiveItem= {setActiveItem}				
						/>
						<span className="d-flex justify-content-xl-center align-self-center">
							<Pagination
								pagesCount={pagesCount}
								currentPage={currentPage}
								handleNextClick={handleNextClick}
								handlePageClick={handlePageClick}
								handlePreviousClick={handlePreviousClick}
							/>
						</span>
					</div>
				</div>
			</div>
			{appStateAtributes.isModalActive ? ( 
				<Modal
					activeItem={activeItem}
					toggle={toggle}
					onSave={handleSubmit}
				/>
			) : null}
		</main>
	);
};

export default App;