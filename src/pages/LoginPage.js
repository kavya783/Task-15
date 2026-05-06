import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,

} from "@mui/material";
import { Link } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import Colors from "../colors";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth} from "../firebase";

import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { Theme } from "../GlobalStyles";



function LoginPage() {
  const [error, setError] = useState({});
  const navigate = useNavigate();




  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
   const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      console.log(user); 

      navigate("/profilepage");
    } catch (error) {
      console.error(error);
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!form.email.includes("@")) {
      newErrors.email = "Invalid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Min 6 characters required";
    }

    return newErrors;
  };



 
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setError(validationErrors);

    if (Object.keys(validationErrors).length !== 0) return;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      console.log(userCredential.user);

      toast.success("Login Successful ");

      navigate("/profilepage");

    } catch (error) {
      toast.error("Invalid Email or Password ");
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/profilepage");
      }
    });

    return () => unsubscribe();
  }, [navigate]);
   console.log(handleGoogleLogin,"sadsfdgf")
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        px: 2
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 380,
          p: { xs: 2, sm: 3 },
          mt: { xs: 20, md: 20, lg: 15 },
          borderRadius: 4,
        }}
      >
        <CardContent>

          <Typography
            variant="h5"
            textAlign="center"
            mb={2}
            fontSize={{ xs: 20, sm: 24 }}
            sx={{ fontSize: Theme.headings }}


          >
            Login
          </Typography>

          <form onSubmit={handleSubmit}>

            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={handleChange}
              error={!!error.email}
              helperText={error.email}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={form.password}
              onChange={handleChange}
              error={!!error.password}
              helperText={error.password}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                mb: 2,
                color: Colors.black,
                background: Colors.yellow,
                borderRadius: 4,
                fontSize: Theme.font16Bold


              }}

            >
              Login
            </Button>

            <Typography textAlign="center" sx={{ ml: { xs: 12, sm: 20 } }}>OR</Typography>


            <Button
                 onClick={handleGoogleLogin}
              variant="outlined"
              fullWidth
              sx={{ mt: 1, mb: 2, color: Colors.black }}
            >
              <GoogleIcon sx={{ mr: { xs: 1 } }} />
              Continue with Google
            </Button>


            <Typography textAlign="center" sx={{ fontSize: Theme.font14SemiBold }}>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                Create an account
              </Link>
            </Typography>

          </form>

        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;