import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email && password) {
      let users = JSON.parse(localStorage.getItem("users")) || {};

      if (!users[email]) {
        users[email] = { categories: [] }; 
        localStorage.setItem("users", JSON.stringify(users));
      }

      localStorage.setItem("currentUser", email); 
      navigate("/dashboard");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.saymedia-content.com/.image/t_share/MTkyOTkyMzE2OTQ3MDQ3NjQ1/website-background-templates.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        objectFit: "contain",
      }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.15)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <CardContent>
            <Typography variant="h5" align="center" color="white" gutterBottom>
              Login
            </Typography>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                style: { color: "white" },
              }}
              sx={{
                input: { color: "white" },
                label: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "#90caf9" },
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: { color: "white" },
              }}
              sx={{
                input: { color: "white" },
                label: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "#90caf9" },
                },
              }}
            />
            <Button fullWidth  onClick={handleLogin} sx={{ background:'rgba(174, 31, 179, 0.8)',color:'white', marginTop: "10px" }}>
              Login
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
