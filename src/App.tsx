import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Info from "./pages/Info/Info";
import User from "./pages/User/User";
import Login from "./pages/Login/Login";
import NavBar from "./components/NavBar";
import AuthContextProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider, createTheme, CssBaseline, Container } from "@mui/material";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
      },
      background: {
        default: '#f5f5f5',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
        fontSize: 'clamp(1.5rem, 5vw, 2.125rem)',
      },
      h5: {
        fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
      },
      h6: {
        fontSize: 'clamp(1rem, 3vw, 1.25rem)',
      },
      body1: {
        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: '16px',
            paddingRight: '16px',
            '@media (min-width:600px)': {
              paddingLeft: '24px',
              paddingRight: '24px',
            },
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContextProvider>
        <BrowserRouter>
          <NavBar />
          <Container 
            maxWidth="lg" 
            sx={{ 
              mt: { xs: 1, sm: 2 }, 
              mb: { xs: 2, sm: 4 },
              px: { xs: 1, sm: 2, md: 3 }
            }}
          >
            <Routes>
              {/* Публичные маршруты */}
              <Route path="/" element={<Navigate to="/info" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/info" element={<Info />} />
              
              {/* Защищённые маршруты */}
              <Route element={<ProtectedRoute />}>
                <Route path="/user" element={<User />} />
              </Route>
              
              {/* Перенаправление на главную страницу */}
              <Route path="*" element={<Navigate to="/info" replace />} />
            </Routes>
          </Container>
        </BrowserRouter>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;
