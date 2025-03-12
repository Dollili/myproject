import {dbGet, dbPost} from "../../assets/api/commonApi";
import {useEffect, useState} from "react";
import {Button, Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const Register = () => {
    const nav = useNavigate();
    const [user, setUser] = useState({
        name: "",
        id: "",
        pwd: "",
        pwd2: "",
    });
    const [inf, setInf] = useState(false);
    const [id_check, setIdCheck] = useState(false);

    const objChange = (e) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    };

    const sameId = async () => {
        const res = await dbGet("login/sameId", {id: user.id});
        if (res) {
            alert("중복");
            setIdCheck(false);
        } else {
            alert("사용가능");
            setIdCheck(true);
        }
    };

    const crossPwd = () => {
        if (user.pwd.length > 0) {
            user.pwd === user.pwd2 ? setInf(true) : setInf(false);
        }
    };

    const join_check = () => {
        const name = !!user.name;
        const pwd = user.pwd.length >= 6;
        return name && pwd && inf && id_check;
    };

    const join = async () => {
        console.log(join_check())
        if (join_check()) {
            const res = await dbPost("login/join", user);
            if (res === 1) {
                alert("가입 완료");
                nav("/");
            }
        } else {
            alert("재확인 필요");
        }
    };

    useEffect(() => {
        crossPwd();
    }, [inf, user]);

    useEffect(() => {
        console.log(user)
    }, [user, id_check]);

    return (
        <>
            <div className="main-container">
                <Container>
                    <h3>회원가입</h3>
                    <div>
                        <label>
                            이름
                            <input
                                name="name"
                                onChange={(e) => {
                                    objChange(e);
                                }}
                            />
                        </label>
                        <br/>
                        <label>
                            아이디
                            <input
                                name="id"
                                onChange={(e) => {
                                    objChange(e);
                                }}
                            />
                        </label>
                        <Button
                            onClick={() => {
                                sameId();
                            }}
                        >
                            중복확인
                        </Button>
                        <br/>
                        <label>
                            비밀번호
                            <input
                                type="password"
                                name="pwd"
                                onChange={(e) => {
                                    objChange(e);
                                }}
                            />
                            <p>비밀번호는 6자리 이상</p>
                        </label>
                        <br/>
                        <label>
                            비밀번호 확인
                            <input
                                type="password"
                                name="pwd2"
                                onChange={(e) => {
                                    objChange(e);
                                }}
                            />
                            <p>{inf ? "일치" : "불일치"}</p>
                        </label>
                    </div>
                    <Button
                        onClick={() => {
                            join();
                        }}
                    >
                        회원가입
                    </Button>
                </Container>
            </div>
        </>
    );
};

export default Register;
