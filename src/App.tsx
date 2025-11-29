import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import AccountCircle from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import HowToRegTwoToneIcon from '@mui/icons-material/HowToRegTwoTone';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';
import MenuIcon from '@mui/icons-material/Menu';
import MoveToInboxTwoToneIcon from '@mui/icons-material/MoveToInboxTwoTone';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import RequestList from './pages/RequestList';
import RequestDetails from './pages/RequestDetails';
import UserForm from './components/UserForm';
import SignIn from './pages/SignIn';
import { Link, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { t } from 'i18next';
import Profile from './pages/Profile';
import StoreConfirmation from './pages/StoreConfirmation';
import axiosInstance from './api/axiosInstance';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    backgroundColor: '#eef2f1', // Set background color
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': {
            ...openedMixin(theme),
            backgroundColor: '#effff5', // Set background color
          },
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': {
            ...closedMixin(theme),
            backgroundColor: '#eef2f1', // Set background color
          },
        },
      },
    ],
  }),
);

function App() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    const publicPaths = ['/signin', '/users/new'];
    const requestPathRegex = /^\/requests\/[a-zA-Z0-9]+$/;
    console.log("Current Path:", window.location.pathname, window.location.pathname.startsWith('/stores/confirm'));
    if (window.location.pathname.startsWith('/stores/confirm')) {
      return;
    }

    if (!token && (!publicPaths.includes(window.location.pathname) && !requestPathRegex.test(window.location.pathname))) {
      void navigate('/signin');
      return;
    }
  }, [navigate]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = async () => {
    try {
      await axiosInstance.delete(`${import.meta.env.VITE_API_BASE_URL}/users/sign_out`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      handleClose();
      void navigate('/signin');
    }
  };

  const handleProfile = () => {
    handleClose();
    void navigate('/profile');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: '#1A1A1A' }}>
        <Toolbar>
          <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={[
          {
            marginRight: 5,
          },
          open && { display: 'none' },
        ]}
          >
        <MenuIcon />
          </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <img src="/quien_tiene_logo_d.png" alt="QuienTiene Logo" style={{ height: 40, marginRight: 8 }} />
        <Typography variant="h6" component="div">
          QuienTiene.com
        </Typography>
        </Box>

          {isAuthenticated && (
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={() => { void handleLogOut(); }}>Logout</MenuItem>
          </Menu>
        </div>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer variant="permanent" open={open} sx={{ '& .MuiDrawer-paper': { backgroundColor: '#1A1A1A', color: '#FFFFFF' } }}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} sx={{ color: '#FFFFFF' }}>
        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ backgroundColor: '#FFFFFF' }} />
        <List>
          <ListItem key="Inicio" disablePadding sx={{ display: 'block' }} component={Link} to="/">
        <ListItemButton onClick={handleDrawerClose} sx={[ { minHeight: 48, px: 2.5, color: '#FFFFFF' },
            open ? { justifyContent: 'initial' } : { justifyContent: 'center' } ]}>
          <HomeTwoToneIcon sx={[ { minWidth: 0, justifyContent: 'center', color: '#FFFFFF' },
          open ? { mr: 3 } : { mr: 'auto' } ]} />
          <ListItemText primary="Inicio" sx={[ open ? { opacity: 1 } : { opacity: 0 } ]} />
        </ListItemButton>
          </ListItem>
          {isAuthenticated ? (
        <ListItem key="Solicitudes" disablePadding sx={{ display: 'block' }} component={Link} to="/requests">
          <ListItemButton onClick={handleDrawerClose} sx={[ { minHeight: 48, px: 2.5, color: '#FFFFFF' },
            open ? { justifyContent: 'initial' } : { justifyContent: 'center' } ]}>
            <MoveToInboxTwoToneIcon sx={[ { minWidth: 0, justifyContent: 'center', color: '#FFFFFF' },
          open ? { mr: 3 } : { mr: 'auto' } ]} />
            <ListItemText primary="Solicitudes" sx={[ open ? { opacity: 1 } : { opacity: 0 } ]} />
          </ListItemButton>
        </ListItem>
          ) : (
        <>
          <ListItem key="Login" disablePadding sx={{ display: 'block' }} component={Link} to="/signin">
            <ListItemButton onClick={handleDrawerClose} sx={[{ minHeight: 48, px: 2.5, color: '#FFFFFF' },
            open ? { justifyContent: 'initial' } : { justifyContent: 'center' }]}>
          <LoginTwoToneIcon sx={[{ minWidth: 0, justifyContent: 'center', color: '#FFFFFF' },
          open ? { mr: 3 } : { mr: 'auto' }]} />
          <ListItemText primary={t('login')} sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
            </ListItemButton>
          </ListItem>
          <ListItem key="Signup" disablePadding sx={{ display: 'block' }} component={Link} to="/users/new">
            <ListItemButton onClick={handleDrawerClose} sx={[{ minHeight: 48, px: 2.5, color: '#FFFFFF' },
            open ? { justifyContent: 'initial' } : { justifyContent: 'center' }]}>
          <HowToRegTwoToneIcon sx={[{ minWidth: 0, justifyContent: 'center', color: '#FFFFFF' },
          open ? { mr: 3 } : { mr: 'auto' }]} />
          <ListItemText primary={t('signUp')} sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
            </ListItemButton>
          </ListItem>
        </>
          )}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 0.5, sm: 3 } }}>
        <DrawerHeader />
        <Routes>
          <Route path="/" element={<Typography variant="h5">Bienvenido a la aplicación</Typography>} />
          <Route path="/requests" element={<RequestList isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/requests/:show_key" element={<RequestDetails isAuthenticated={isAuthenticated} />} />
          <Route path="/users/new" element={<UserForm user={undefined} />} />
          <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/profile" element={<Profile isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/stores/confirm/:confirmation_token" element={<StoreConfirmation />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App;
