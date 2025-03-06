import "./App.css";
import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";

function App() {
    const nav = useNavigate();
    const [user, setUser] = useState({});
    const [check, setCheck] = useState(false);

    const userObj = (e) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    };

    const login = (type) => {
        if (type) {
            user["role"] = "M";
        } else {
            user["role"] = "U";
        }
        console.log(user)
    };

    useEffect(() => {
    }, [check, user]);

    return (
        <div className="App-contents">
            <div className="login">
                <div className="login-Form">
                    <input
                        name="userId"
                        value={userObj.userId || ""}
                        placeholder="id"
                        onChange={(e) => {
                            userObj(e);
                        }}
                    />
                    <input
                        name="pwd"
                        value={userObj.pwd || ""}
                        placeholder="password"
                        onChange={(e) => {
                            userObj(e);
                        }}
                    />
                </div>
                <Button
                    onClick={() => {
                        login(check);
                    }}
                >
                    로그인
                </Button>
            </div>
            <div className="choice-Form">
                <Link to={"/board"}>회원가입</Link>
                <label>
                    관리자
                    <input
                        type="checkbox"
                        checked={check}
                        onChange={() => {
                            setCheck(!check);
                        }}
                    />
                </label>
            </div>
        </div>
    );
}

export default App;
