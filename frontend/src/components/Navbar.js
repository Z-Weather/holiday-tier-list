import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme
} from '@mui/material';
import {
  Add
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          🎉 Holiday Tier List
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={() => navigate('/create')}
            sx={{ textTransform: 'none' }}
          >
            Create List
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;