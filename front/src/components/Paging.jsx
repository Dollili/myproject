import { Pagination } from "react-bootstrap";
import React, { useState } from "react";

const Paging = () => {
  const [activePage, setPage] = useState(1);
  const total = 5;
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <Pagination>
      <Pagination.Prev
        onClick={() => activePage > 1 && handlePageChange(activePage - 1)}
        disabled={activePage === 1}
      />

      {[...Array(total)].map((_, i) => (
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
  );
};

export default Paging;
