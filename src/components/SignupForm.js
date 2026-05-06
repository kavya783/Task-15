import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent
} from "@mui/material";
import Colors from "../colors";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Theme } from "../GlobalStyles";

function SignupForm() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState({});
   const navigate = useNavigate(); 

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.firstname) newErrors.firstname = "First Name is required";
    if (!form.lastname) newErrors.lastname = "Last Name is required";

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

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password required";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validate();
  setError(validationErrors);

  if (Object.keys(validationErrors).length !== 0) return;

  try {
    const email = form.email.trim();

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      form.password
    );

    const user = userCredential.user;

    await set(ref(db, "users/" + user.uid), {
      firstname: form.firstname,
      lastname: form.lastname,
      email: email
    });

    toast.success("Signup Successful ");
     navigate("/"); 

    setForm({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: ""
    });

  } catch (error) {
    console.log(error);

  
    if (error.code === "auth/email-already-in-use") {
      toast.error("Email already registered");
    } else if (error.code === "auth/invalid-email") {
      toast.error("Invalid Email format");
    } else {
      toast.error(error.message);
    }
  }
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.white,
        px: 2,
     
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 400, p: 2,mt:15 }}>
        <CardContent sx={{mt:1}}>

          <Typography variant="h5" textAlign="center" sx={{mt:1,fontSize:Theme.headings}}>
            Signup
          </Typography>

          <form onSubmit={handleSubmit}>

            <TextField
              label="First Name"
              name="firstname"
              fullWidth
              margin="normal"
              value={form.firstname}
              onChange={handleChange}
              error={!!error.firstname}
              helperText={error.firstname}
              sx={{mb:2,height:50}}
            />

            <TextField
              label="Last Name"
              name="lastname"
              fullWidth
              margin="normal"
              value={form.lastname}
              onChange={handleChange}
              error={!!error.lastname}
              helperText={error.lastname}
                sx={{mb:2,height:50}}
            />

            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={handleChange}
              error={!!error.email}
              helperText={error.email}
                sx={{mb:2,height:50}}
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
                sx={{mb:2,height:50}}
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              margin="normal"
              value={form.confirmPassword}
              onChange={handleChange}
              error={!!error.confirmPassword}
              helperText={error.confirmPassword}
                sx={{mb:4,height:50}}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2,background:Colors.yellow,borderRadius:4,color:Colors.black,fontSize:Theme.font14Bold}}
            >
              Signup
            </Button>

          </form>

        </CardContent>
      </Card>
    </Box>
  );
}

export default SignupForm;