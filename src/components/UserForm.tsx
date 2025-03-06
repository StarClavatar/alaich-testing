import { Box, FormGroup, TextField, Button, Paper, Typography, InputAdornment, Alert, CircularProgress } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Person, Lock } from "@mui/icons-material";

export default function UserForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    if (!email.trim() || !password.trim()) {
      setError("Пожалуйста, заполните все поля");
      setLoading(false);
      return;
    }
    
    try {
      await login(email, password);
      navigate("/info");
    } catch {
      setError("Неверный email или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: "450px", 
          width: "100%",
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          align="center"
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Вход в систему
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <FormGroup sx={{ width: "100%", gap: 3 }}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="Пароль"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <Button 
              variant="contained" 
              type="submit"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ 
                mt: 2, 
                height: 50,
                fontSize: "1rem",
                fontWeight: "bold" 
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Войти"}
            </Button>
            
            <Typography variant="body2" align="center" sx={{ mt: 2, color: "text.secondary" }}>
              Тестовые данные: aleksei@example.com / lkJlkn8hj
            </Typography>
          </FormGroup>
        </form>
      </Paper>
    </Box>
  );
}
