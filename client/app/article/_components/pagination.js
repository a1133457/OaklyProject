"use client"

import React from "react";

export default function Pagination({ totalPages, currentPage, onPageChange }) {
    const pages = [];

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++)pages.push(i)
    } else {
        if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, "...", totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
        } else {
            pages.push(
                1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages
            );
        }

    }

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <a className="page-link" onClick={() => onPageChange(currentPage - 1)} href="#" aria-label="Previous">
                        <span aria-hidden="true"><i className="fa-solid fa-angle-left"></i></span>
                    </a>
                </li>
                {pages.map((page, index) => {
                    page === "..." ? (
                        <li key={index} className="page-item disabled">
                            <span className="page-link">...</span>
                        </li>
                    ) : (
                        <li key={index} className={`page-item ${currentPage === page ? "active" : ""}`}><button className="page-link" onClick={() => onPageChange(page)} href="#">page</button></li>
                    )
                })}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}><button className="page-link" onClick={() => onPageChange(currentPage + 1)} href="#"><i className="fa-solid fa-angle-right"></i></button></li>

            </ul>
        </nav >
    );
}