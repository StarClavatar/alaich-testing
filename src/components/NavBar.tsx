import { AppBar, Box, Container, Toolbar, Button, Typography, Avatar, useMediaQuery, IconButton, Menu, MenuItem, Badge } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '@mui/material/styles';

export default function NavBar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDropdownMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/info");
    handleMenuClose();
    handleDropdownMenuClose();
  };

  const handleInfoClick = () => {
    navigate("/info");
    handleMenuClose();
    handleDropdownMenuClose();
  };

  const handleProfileClick = () => {
    navigate("/user");
    handleMenuClose();
    handleDropdownMenuClose();
  };

  const handleLoginClick = () => {
    navigate("/login");
    handleMenuClose();
    handleDropdownMenuClose();
  };

  // На мобильных устройствах - всегда используем дропдаун
  const useMobileDropdown = isMobile;

  return (
    <AppBar position="static" sx={{ mb: 2, borderRadius: 0 }}>
      <Toolbar>
        <Container maxWidth="xl">
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              width: '100%' 
            }}
          >
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold', 
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                fontSize: isMobile ? '0.9rem' : '1.25rem'
              }}
            >
              <Avatar sx={{ 
                mr: 1, 
                bgcolor: 'secondary.main', 
                width: isMobile ? 30 : 40, 
                height: isMobile ? 30 : 40 
              }}>T</Avatar>
              {"Тестовое приложение"}
            </Typography>
            
            {useMobileDropdown ? (
              // Мобильная версия - всегда используем дропдаун
              <>
                <IconButton
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                  edge="end"
                >
                  <Badge 
                    color="secondary" 
                    variant="dot" 
                    invisible={!token}
                  >
                    <MoreVertIcon />
                  </Badge>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleInfoClick}>Информация</MenuItem>
                  {token && <MenuItem onClick={handleProfileClick}>Профиль</MenuItem>}
                  {token ? (
                    <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                  ) : (
                    <MenuItem onClick={handleLoginClick}>Войти</MenuItem>
                  )}
                </Menu>
              </>
            ) : (
              // Десктопная версия - обычные кнопки
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained" 
                  color="info" 
                  component={Link} 
                  to="/info"
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: 'info.dark' }
                  }}
                >
                  Информация
                </Button>
                
                {token && (
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    component={Link} 
                    to="/user"
                    sx={{ 
                      color: 'white', 
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: 'secondary.dark' }
                    }}
                  >
                    Профиль
                  </Button>
                )}
                
                {token ? (
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={handleLogout}
                    sx={{ 
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: 'error.dark' }
                    }}
                  >
                    Выйти
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    color="success" 
                    component={Link} 
                    to="/login"
                    sx={{ 
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: 'success.dark' }
                    }}
                  >
                    Войти
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
