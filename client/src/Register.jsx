import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:5000/";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Register = () => {
  const [Registeropen, RegistersetOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const RegisterhandleOpen = () => {
    RegistersetOpen(true);
  };

  const RegisterhandleClose = () => {
    navigate("/");
    RegistersetOpen(false);
  };

  const RegisterHandleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post("/register", { name, email, password });
      if (response.data.success) {
        alert("Registration successful!");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        RegisterhandleClose(); // Close modal after successful registration
        navigate("/login"); // Navigate to login after registration
      } else {
        alert(response.data.message);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        console.error("There was an error registering!", error);
      }
    }
  };

  useEffect(() => {
    if (location.pathname === "/register") {
      RegisterhandleOpen();
    }
  }, [location]);

  return (
    <div>
      <Modal
        open={Registeropen}
        onClose={RegisterhandleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Register
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form onSubmit={RegisterHandleSubmit}>
              <div className="d-flex flex-column">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex flex-column">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex flex-column">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex flex-column">
                <label htmlFor="confpassword">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" id="registers" variant="contained" sx={{ mt: 2 }}>
                Register
              </Button>
            </form>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default Register;
