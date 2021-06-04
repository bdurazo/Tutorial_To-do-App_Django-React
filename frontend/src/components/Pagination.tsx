import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

interface PaginationProps{
	pagesCount: number,
	currentPage: number,
	handlePageClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, i: number) => void,
	handlePreviousClick: () => void,
	handleNextClick: () => void
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function CustomPagination(paginationProps: PaginationProps){
	const{pagesCount, currentPage, handlePageClick, handlePreviousClick, handleNextClick} = paginationProps;

	return (
		<Pagination aria-label="Page navigation example">

			<PaginationItem disabled={currentPage <= 1}>
				<PaginationLink onClick={handlePreviousClick} previous href="#" />
			</PaginationItem>
			
			{[...Array(pagesCount)].map((pageRepresentation, i) => (
				<PaginationItem active={i === currentPage - 1} key={i}>
					<PaginationLink onClick={e => {
						handlePageClick(e, i);
					}} href="#">
						{i + 1}
					</PaginationLink>
				</PaginationItem>
			)
			)
			}

			<PaginationItem disabled={currentPage > pagesCount - 1}>
				<PaginationLink onClick={handleNextClick} next href="#" />
			</PaginationItem>
		</Pagination>
	);
}

