import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const ControlPanel = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [buttonStates, setButtonStates] = useState({});
  const [deviceIP, setDeviceIP] = useState("");
  const [loading, setLoading] = useState(false); // Prevents multiple clicks

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem("users")) || {};
      if (users[currentUser]) {
        setCategories(users[currentUser].categories || []);
        setButtonStates(users[currentUser].buttonStates || {});
        setDeviceIP(users[currentUser].selectedDevice || "");
      }
    }
  }, []);

  const toggleButton = async (categoryIndex, buttonIndex) => {
    if (!deviceIP) {
      alert("No device IP selected. Please select a device IP to proceed.");
      return;
    }
  
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;
  
    const key = `${categoryIndex}-${buttonIndex}`;
    setButtonStates((prevState) => {
      const updatedStates = { ...prevState, [key]: !prevState[key] };
  
      // Save button states to local storage
      const users = JSON.parse(localStorage.getItem("users")) || {};
      if (users[currentUser]) {
        users[currentUser].buttonStates = updatedStates;
        localStorage.setItem("users", JSON.stringify(users));
      }
  
      // Send request to ESP32 with CORS enabled
      const command = updatedStates[key] ? "on" : "off";
      const requestUrl = `http://${deviceIP}/${categoryIndex}/${buttonIndex}/${command}`;
  
      console.log(`Sending request to ESP32: ${requestUrl}`);
  
      fetch(requestUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();
        })
        .then((data) => console.log(`ESP32 Response: ${data}`))
        .catch((error) => console.error("Error sending request:", error));
  
      return updatedStates;
    });
  };
  

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="body1" align="left" sx={{ position: "absolute", top: 10, left: 10 }}>
        Device IP: {deviceIP || "Not Set"}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/dashboard")}
        sx={{ mb: 3 }}
      >
        ⬅ Back to Dashboard
      </Button>

      <Grid container spacing={3}>
        {/* Left Sidebar - Category List */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, minHeight: 400 }}>
            <Typography variant="h6">Control Panel</Typography>
            <List>
              {categories.map((category, index) => (
                <React.Fragment key={index}>
                  <ListItem component="div" onClick={() => setSelectedCategory(index)} sx={{ cursor: "pointer" }}>
                    <ListItemText primary={category.name} />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Right Section - Buttons */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3, minHeight: 400 }}>
            {selectedCategory !== null ? (
              <>
                <Typography variant="h5">{categories[selectedCategory]?.name}</Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {categories[selectedCategory].buttons.map((button, btnIndex) => (
                    <Grid item xs={12} sm={6} md={4} key={btnIndex}>
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={loading} // Disable button when loading
                        sx={{
                          backgroundColor: buttonStates[`${selectedCategory}-${btnIndex}`] ? "#4CAF50" : "#D32F2F",
                          color: "#FFF",
                          py: 1.5,
                          fontSize: "1rem",
                        }}
                        onClick={() => toggleButton(selectedCategory, btnIndex)}
                      >
                        {button} {buttonStates[`${selectedCategory}-${btnIndex}`] ? "ON" : "OFF"}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Typography variant="body1">Select a category to view buttons.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ControlPanel;
