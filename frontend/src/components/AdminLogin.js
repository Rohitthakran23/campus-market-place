import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./login.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUserName] = useState('atharv');
  const [password, setPassword] = useState('');

  const handleApi = () => {
    console.log({ username, password });

    const url = "http://127.0.0.1:3001/adminlogin";
    const data = { username, password };
    axios.post(url, data)
      .then((res) => {
        console.log(res.data);
        if (res.data.message) {
          if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.userId);
            localStorage.setItem('userName', res.data.username);
            localStorage.setItem('isAdmin', res.data.isAdmin);
            navigate('/admin');  // Navigate after setting the localStorage
          }
          alert(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err, 20);
        alert("Server Error");
      });
  }

  return (
    <div className="content">
      <div className="flex-div">
        <div className ="name-content" style={{'width': '400px'}}>
          <h1 className ="logo" style={{'color':'red'}}>Admin Panel </h1>
          <p>Connect where buying and selling meet seamless connections.</p>
        </div>
        <form>
          <input type="text" placeholder="Username" required value={username} onChange={(e) => setUserName(e.target.value)} />
          <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="login" type="button" onClick={handleApi}>Log In</button>
          <hr />
          {/* <button className="create-account" type="button" onClick={() => navigate('/signup')}>Create New Account</button> */}
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
