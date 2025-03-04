import "./App.css";
import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function App() {
  const nav = useNavigate();

  return (
    <>
      <main className="App-contents">
        <Button
          onClick={() => {
            nav("/board");
          }}
        >
          시작하기
        </Button>
      </main>
    </>
  );
}

export default App;
