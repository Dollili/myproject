import {Pagination} from "react-bootstrap";
import React, {useState} from "react";

const Paging = ({total, pageItem, currentPage}) => {
    //total : 데이터 수
    //pageItem : 필요한 페이지 수
    //currentPage: 선택한 페이지
    const [activePage, setPage] = useState(1);
    const totalPages = Math.ceil(total / pageItem); // 페이지 수

    const handlePageChange = (pageNumber) => {
        currentPage(pageNumber);
        setPage(pageNumber);
    };

    return (
        <Pagination className="pagination-custom">
            <Pagination.Prev
                onClick={() => activePage > 1 && handlePageChange(activePage - 1)}
                disabled={activePage === 1}
            />

            {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                    key={i + 1}
                    active={i + 1 === activePage}
                    onClick={() => handlePageChange(i + 1)}
                >
                    {i + 1}
                </Pagination.Item>
            ))}

            <Pagination.Next
                onClick={() => activePage < total && handlePageChange(activePage + 1)}
                disabled={activePage === totalPages}
            />
        </Pagination>
    );
};

export default Paging;
