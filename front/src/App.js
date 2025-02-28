import "./App.css";
import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function App() {
  const nav = useNavigate();

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "gray.100",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Button
          onClick={() => {
            nav("/board");
          }}
        >
          시작하기
        </Button>
      </div>
    </>
  );
}

export default App;
