import {Pagination} from "react-bootstrap";
import React, {useState} from "react";

const Paging = ({cnt}) => {
    const [activePage, setPage] = useState(1);
    const total = cnt;
    const pageItem = 10;
    const pageCnt = 5;

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    return (
        <div className="pagination">
            <Pagination>
                <Pagination.Prev
                    onClick={() => activePage > 1 && handlePageChange(activePage - 1)}
                    disabled={activePage === 1}
                />

                {[...Array(pageCnt)].map((_, i) => (
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
                    disabled={activePage === total}
                />
            </Pagination>
        </div>
    );
};

export default Paging;
