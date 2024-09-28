import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:5000/";

const loginstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Login = ({ onLogin }) => {
  const [Loginopen, LoginsetOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const LoginhandleOpen = () => {
    LoginsetOpen(true);
  };

  const LoginhandleClose = () => {
    navigate("/");
    LoginsetOpen(false);
  };

  const LoginHandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", { email, password });
      if (response.data === "success") {
        alert("Login successful!");
        localStorage.setItem('email', email);
        console.log("Email saved in localStorage");
        onLogin(); 
        setEmail("");
        setPassword("");
        LoginhandleClose(); 
      } else {
        alert("Invalid credentials!");
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
    }
  };

  useEffect(() => {
    if (location.pathname === "/login") {
      LoginhandleOpen();
    }
  }, [location]);

  return (
    <div>
      <Modal
        open={Loginopen}
        onClose={LoginhandleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={loginstyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Login
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form onSubmit={LoginHandleSubmit}>
              <div className="d-flex flex-column">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex flex-column">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                id="login"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </form>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default Login;
