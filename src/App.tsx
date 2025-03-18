import * as React from 'react';
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
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import MoveToInboxTwoToneIcon from '@mui/icons-material/MoveToInboxTwoTone';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import RequestList from './pages/RequestList';
import RequestDetails from './pages/RequestDetails';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
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
            <Typography variant="h6" noWrap component="div">
              QuienTiene.com
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem key="Inicio" disablePadding sx={{ display: 'block' }} component={Link} to="/">
              <ListItemButton sx={[ { minHeight: 48, px: 2.5, },
                  open ? { justifyContent: 'initial', } : { justifyContent: 'center', }, ]} >
                <HomeTwoToneIcon sx={[ { minWidth: 0, justifyContent: 'center', },
                    open ? { mr: 3, } : { mr: 'auto', }, ]} >
                  <InboxIcon />
                </HomeTwoToneIcon>
                <ListItemText primary="Inicio" sx={[ open ? { opacity: 1, } : { opacity: 0, }, ]} />
              </ListItemButton>
            </ListItem>
            <ListItem key="Solicitudes" disablePadding sx={{ display: 'block' }} component={Link} to="/requests">
              <ListItemButton sx={[ { minHeight: 48, px: 2.5, },
                  open ? { justifyContent: 'initial', } : { justifyContent: 'center', }, ]} >
                <MoveToInboxTwoToneIcon sx={[ { minWidth: 0, justifyContent: 'center', },
                    open ? { mr: 3, } : { mr: 'auto', }, ]} >
                  <InboxIcon />
                </MoveToInboxTwoToneIcon>
                <ListItemText primary="Solicitudes" sx={[ open ? { opacity: 1, } : { opacity: 0, }, ]} />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Routes>
            <Route path="/" element={<Typography variant="h5">Bienvenido a la aplicación</Typography>} />
            <Route path="/requests" element={<RequestList />} />
            <Route path="/requests/:show_key" element={<RequestDetails />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  )
}

export default App
