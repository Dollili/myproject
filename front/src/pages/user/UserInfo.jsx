import {Container} from "react-bootstrap";
import {useLocation} from "react-router-dom";
import {dbGet} from "../../assets/api/commonApi";
import {useEffect, useState} from "react";

const UserInfo = () => {
    const location = useLocation();

    const [res, setRes] = useState({
        USER_NM: "",
        USER_ID: "",
    });

    const getInfo = async () => {
        const res = await dbGet("/login/user", location.state);
        if (res) {
            setRes(res);
        } else {
            alert("정보를 가져올 수 없습니다.");
        }
    };

    useEffect(() => {
        getInfo();
    }, []);

    return (
        <>
            <div className="main-container">
                <Container>
                    <h3>회원정보</h3>
                    <div>
                        <label>
                            이름
                            <input name="name" value={res.USER_NM}/>
                        </label>
                        <br/>
                        <label>
                            아이디
                            <input name="id" value={res.USER_ID}/>
                        </label>
                        <br/>
                        <label>
                            가입일자
                            <input name="date" value={res.REGISTER_DATE}/>
                        </label>
                        {/*<label>
              비밀번호
              <input
                type="password"
                name="pwd"
            value={res.USER}
              />
            </label>*/}
                    </div>
                </Container>
            </div>
        </>
    );
};

export default UserInfo;
