import React from "react";
import {
	Nav,
	NavItem,
} from "reactstrap";

interface TabListProps {
    setWeekDay: (weekDay: string) => void,
    stateWeekDay: string
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const TabList = (props: TabListProps) => {
	const {setWeekDay, stateWeekDay} = props;

	return(
		<Nav tabs>
            
			<NavItem
				onClick={ () => setWeekDay("Monday") }
				className={ stateWeekDay === "Monday" ? "nav-link active" : "nav-link" }
			>
                Monday
			</NavItem>

			<NavItem
				onClick={ () => setWeekDay("Tuesday") }
				className={ stateWeekDay === "Tuesday" ? "nav-link active" : "nav-link" }
			>
                Tuesday
			</NavItem>

			<NavItem
				onClick={ () => setWeekDay("Wednesday") }
				className={ stateWeekDay === "Wednesday" ? "nav-link active" : "nav-link" }
			>
                Wednesday
			</NavItem>

			<NavItem
				onClick={ () => setWeekDay("Thursday") }
				className={ stateWeekDay === "Thursday" ? "nav-link active" : "nav-link" }
			>
                Thursday
			</NavItem>

			<NavItem
				onClick={ () => setWeekDay("Friday") }
				className={ stateWeekDay === "Friday" ? "nav-link active" : "nav-link" }
			>
                Friday
			</NavItem>

			<NavItem
				onClick={ () => setWeekDay("Saturday") }
				className={ stateWeekDay === "Saturday" ? "nav-link active" : "nav-link" }
			>
                Saturday
			</NavItem>

			<NavItem
				onClick={ () => setWeekDay("Sunday") }
				className={ stateWeekDay === "Sunday" ? "nav-link active" : "nav-link" }
			>
                Sunday
			</NavItem>

		</Nav>
	);
};

export default TabList;