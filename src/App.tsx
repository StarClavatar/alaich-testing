import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Info from "./pages/Info/Info";
import User from "./pages/User/User";
import Login from "./pages/Login/Login";
import NavBar from "./components/NavBar";
import AuthContextProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import TabLayout from "./components/TabLayout";
import { ThemeProvider, createTheme, CssBaseline, Container } from "@mui/material";

function App() {
  // Создаем тему с улучшенными цветами
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
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContextProvider>
        <BrowserRouter>
          <NavBar />
          <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
            <Routes>
              {/* Публичные маршруты */}
              <Route path="/" element={<Navigate to="/info" replace />} />
              <Route path="/login" element={<Login />} />
              
              {/* Защищённые маршруты с вкладками через TabLayout */}
              <Route element={<ProtectedRoute />}>
                <Route element={<TabLayout />}>
                  <Route path="/info" element={<Info />} />
                  <Route path="/user" element={<User />} />
                </Route>
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
