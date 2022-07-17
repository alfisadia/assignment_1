import React from "react";

export default ({ todosPerPage, totalTodos, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalTodos / todosPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <nav>
            <ul className='pagination'>
                {/* <li className='page-item'>Prev</li> */}
                {pageNumbers.map(number => (
                    <li key={number} className='page-item'>
                        <a onClick={() => paginate(number)} href='!#' className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
                {/* <li className='page-item'>Next</li> */}
            </ul>
        </nav>
    );
};