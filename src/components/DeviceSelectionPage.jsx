import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Card, CardContent, Typography, MenuItem, Select, FormControl } from "@mui/material";

const DeviceSelectionPage = () => {
  const [deviceIP, setDeviceIP] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem("users")) || {};
      const userDevices = users[currentUser]?.devices || [];
      setDevices(userDevices);
      setSelectedDevice(userDevices[0] || ""); 
    }
  }, []);

  const addDevice = () => {
    if (deviceIP.trim() && !devices.includes(deviceIP)) {
      const updatedDevices = [...devices, deviceIP];
      setDevices(updatedDevices);

      
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        let users = JSON.parse(localStorage.getItem("users")) || {};
        users[currentUser] = { ...users[currentUser], devices: updatedDevices };
        localStorage.setItem("users", JSON.stringify(users));
      }

      setDeviceIP("");
    }
  };

  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);

   
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      let users = JSON.parse(localStorage.getItem("users")) || {};
      users[currentUser] = { ...users[currentUser], selectedDevice: event.target.value };
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Card>
        <CardContent>
          <Typography variant="h5">Device Selection</Typography>
          
       
          <TextField 
            fullWidth 
            label="Enter Device IP" 
            margin="normal" 
            value={deviceIP} 
            onChange={(e) => setDeviceIP(e.target.value)} 
          />
          <Button fullWidth variant="contained" color="primary" onClick={addDevice} style={{ marginBottom: "10px" }}>
            Add Device
          </Button>

          
          <FormControl fullWidth margin="normal">
            <Typography>Select Device</Typography>
            <Select value={selectedDevice} onChange={handleDeviceChange} displayEmpty>
              {devices.length > 0 ? (
                devices.map((device, index) => (
                  <MenuItem key={index} value={device}>{device}</MenuItem>
                ))
              ) : (
                <MenuItem disabled>No devices added</MenuItem>
              )}
            </Select>
          </FormControl>

          <Button fullWidth variant="contained" color="secondary" onClick={() => navigate("/dashboard")} style={{ marginTop: "10px" }}>
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DeviceSelectionPage;
