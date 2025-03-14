import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import RequestList from './pages/RequestList';

const drawerWidth = 1240;

function App() {
  const [open, setOpen] = useState(false);

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        {/* AppBar */}
        <AppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Lista de Solicitudes
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Drawer
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
          width={drawerWidth}
        >
          <List>
            <ListItem component={Link} to="/">
              <ListItemText primary="Inicio" />
            </ListItem>
            <ListItem component={Link} to="/requests">
              <ListItemText primary="Solicitudes" />
            </ListItem>
            <ListItem component={Link} to="/profile">
              <ListItemText primary="Perfil" />
            </ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Routes>
            <Route path="/requests" element={<RequestList />} />
            <Route path="/" element={<Typography variant="h5">Bienvenido a la aplicación</Typography>} />
          </Routes>
        </Box>
      </Box>
    </Router>
  )
}

export default App
