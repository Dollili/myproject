import './App.css';
import React from "react";
import {Table} from "react-bootstrap";

function App() {

    return (
        <>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>날짜</th>
                    <th>추천</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </Table>
        </>
    );
}

export default App;
