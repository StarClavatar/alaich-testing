import { AppBar, Box, Container, Toolbar, Button, Typography, Avatar } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function NavBar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/info");
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            width: '100%' 
          }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold', 
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Avatar sx={{ mr: 1, bgcolor: 'secondary.main' }}>T</Avatar>
              Тестовое приложение
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                color="info" 
                component={Link} 
                to={token ? "/info" : "/info"}
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
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
