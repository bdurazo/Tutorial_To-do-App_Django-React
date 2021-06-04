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

	const WEEKDAYS = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	
	//Add map function
	return(
		<Nav tabs>
			{ WEEKDAYS.map((weekday: string, i) => (
				<NavItem
					key={i}
					onClick={ () => setWeekDay(WEEKDAYS[i]) }
					className={ stateWeekDay === WEEKDAYS[i] ? "nav-link active" : "nav-link" }
				>
					{WEEKDAYS[i]}
				</NavItem>

			)
			)}

		</Nav>
	);
};

export default TabList;