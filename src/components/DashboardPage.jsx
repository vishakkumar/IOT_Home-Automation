import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [newButtons, setNewButtons] = useState({});
  const [editCategoryIndex, setEditCategoryIndex] = useState(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(currentUser);
      const users = JSON.parse(localStorage.getItem("users")) || {};
      if (users[currentUser]) {
        setCategories(users[currentUser].categories || []);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const saveCategories = (updatedCategories) => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    users[user] = { categories: updatedCategories };
    localStorage.setItem("users", JSON.stringify(users));
  };

  const addCategory = () => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory === "") return; 

    const updatedCategories = [...categories, { name: trimmedCategory, buttons: [] }];
    setCategories(updatedCategories);
    setNewCategory("");
    saveCategories(updatedCategories);
  };

  const deleteCategory = (index) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
    setSelectedCategory(null);
    saveCategories(updatedCategories);
  };

  const handleButtonInputChange = (categoryIndex, value) => {
    setNewButtons({ ...newButtons, [categoryIndex]: value });
  };

  const addButton = () => {
    if (selectedCategory === null) return;
    const trimmedButton = (newButtons[selectedCategory] || "").trim();
    if (trimmedButton === "") return; 

    const updatedCategories = [...categories];
    updatedCategories[selectedCategory].buttons.push(trimmedButton);
    setCategories(updatedCategories);
    setNewButtons({ ...newButtons, [selectedCategory]: "" });
    saveCategories(updatedCategories);
  };

  const deleteButton = (buttonIndex) => {
    if (selectedCategory === null) return;

    const updatedCategories = [...categories];
    updatedCategories[selectedCategory].buttons.splice(buttonIndex, 1);
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
     
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Dashboard - {user}
          </Typography>
          <Button sx={{ background: "white" }} onClick={() => navigate("/device-selection")}>
            Device Selection Page
          </Button>
          <Button sx={{ background: "white", marginLeft: "10px" }} onClick={() => navigate("/control-panel")}>
            Control Panel
          </Button>
          <Button color="secondary" variant="contained" onClick={logout} style={{ marginLeft: "10px" }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
       
        <Grid item xs={3}>
          <Paper style={{ padding: "15px", height: "80vh", overflowY: "auto" }}>
            <Typography variant="h6">Categories</Typography>
            <TextField
              fullWidth
              label="New Category"
              margin="normal"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button fullWidth variant="contained" color="primary" onClick={addCategory}>
              Add Category
            </Button>
            <Divider style={{ margin: "15px 0" }} />
            <List>
              {categories.map((category, index) => (
                <ListItem key={index} button selected={selectedCategory === index} onClick={() => setSelectedCategory(index)}>
                  <ListItemText primary={category.name} />
                  <IconButton size="small" onClick={() => setEditCategoryIndex(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => deleteCategory(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

      
        <Grid item xs={9}>
          {selectedCategory !== null && (
            <Paper style={{ padding: "20px", height: "80vh", overflowY: "auto" }}>
              <Typography variant="h6">{categories[selectedCategory]?.name} - Buttons</Typography>
              <TextField
                fullWidth
                label="New Button"
                margin="normal"
                value={newButtons[selectedCategory] || ""}
                onChange={(e) => handleButtonInputChange(selectedCategory, e.target.value)}
              />
              <Button fullWidth variant="contained" sx={{background:"yellowgreen"}} onClick={addButton}>
                Add Button
              </Button>

            
              <Grid container spacing={2} style={{ marginTop: "20px" }}>
                {categories[selectedCategory].buttons.map((button, btnIndex) => (
                  <Grid item xs={6} sm={4} key={btnIndex}>
                    <Paper
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography>{button}</Typography>
                      <IconButton size="small" color="error" onClick={() => deleteButton(btnIndex)}>
                        <DeleteIcon />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
