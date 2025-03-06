import {
  Typography,
  Button,
  Modal,
  Box,
  CircularProgress,
  Paper,
  Divider,
  Avatar,
  Chip,
  Skeleton
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { PersonOutline, FormatQuoteOutlined, CheckCircleOutline } from "@mui/icons-material";

interface UserData {
  id: number;
  email: string;
  fullname: string;
  token: string;
}

interface StepStatus {
  title: string;
  completed: boolean;
}

export default function User() {
  const { token, logout } = useContext(AuthContext);
  const [user, setUser] = useState<UserData | null>(null);
  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState<string | null>(null);
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [steps, setSteps] = useState<StepStatus[]>([
    { title: "Запрос автора...", completed: false },
    { title: "Запрос цитаты...", completed: false }
  ]);
  const [combinedResult, setCombinedResult] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoadingProfile(true);
    try {
      const response = await axios.get("http://localhost:5001/api/profile", {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdate = async () => {
    setOpen(true);
    setLoading(true);
    setCombinedResult(null);
    
    // Сбрасываем состояние шагов
    setSteps([
      { title: "Запрос автора...", completed: false },
      { title: "Запрос цитаты...", completed: false }
    ]);
    
    // Создаем новый AbortController для отмены запросов
    const controller = new AbortController();
    setAbortController(controller);

    try {
      // Первый запрос - получение автора
      setAuthor(null);
      setQuote(null);
      
      console.log("Sending request to /api/author");
      const authorResponse = await axios.get("http://localhost:5001/api/author", {
        withCredentials: true,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (authorResponse.data.success) {
        const authorData = authorResponse.data.data;
        setAuthor(authorData.name);
        
        // Отмечаем первый шаг как завершенным
        setSteps(prev => [
          { ...prev[0], completed: true },
          prev[1]
        ]);
        
        // Второй запрос - получение цитаты для автора
        console.log(`Sending request to /api/quote with authorId=${authorData.authorId}`);
        const quoteResponse = await axios.get(
          `http://localhost:5001/api/quote?authorId=${authorData.authorId}`,
          {
            withCredentials: true,
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        
        if (quoteResponse.data.success) {
          const quoteData = quoteResponse.data.data;
          setQuote(quoteData.quote);
          
          // Отмечаем второй шаг как завершенным
          setSteps(prev => [
            prev[0],
            { ...prev[1], completed: true }
          ]);
          
          // Объединяем имя автора и цитату в результат
          setCombinedResult(`${authorData.name}: ${quoteData.quote}`);
        }
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request was cancelled");
      } else {
        console.error("Failed to fetch author or quote", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    
    // Отменяем текущие запросы
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PersonOutline color="primary" sx={{ fontSize: 30, mr: 1 }} />
        <Typography variant="h4" component="h1">
          Профиль пользователя
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {loadingProfile ? (
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={30} width="50%" sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={20} width="30%" sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={40} width={120} />
        </Box>
      ) : user ? (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                mb: 3,
                borderRadius: 2,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.light',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    mr: 3,
                    boxShadow: 2
                  }}
                >
                  {user.fullname.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Welcome, {user.fullname.split(' ')[0]}!
                  </Typography>
                  <Chip 
                    label={user.email} 
                    variant="outlined" 
                    color="primary" 
                    size="small"
                  />
                </Box>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={handleUpdate}
                  sx={{ 
                    fontWeight: 'bold',
                    mr: 2,
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4
                    }
                  }}
                >
                  Update
                </Button>
                
                <Button 
                  variant="outlined"
                  color="error"
                  onClick={async () => { await logout(); }}
                  sx={{ 
                    fontWeight: 'medium',
                    boxShadow: 1,
                    '&:hover': {
                      boxShadow: 3
                    }
                  }}
                >
                  Sign out
                </Button>
              </Box>
            </Paper>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            {author && quote && (
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  bgcolor: 'background.paper',
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: 6
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '5px',
                    height: '100%',
                    bgcolor: 'primary.light'
                  }
                }}
              >
                <FormatQuoteOutlined 
                  sx={{ 
                    fontSize: 40, 
                    color: 'primary.light',
                    display: 'block',
                    mb: 1
                  }} 
                />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontStyle: 'italic', 
                    mb: 3,
                    lineHeight: 1.6
                  }}
                >
                  "{quote}"
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    textAlign: 'right', 
                    fontWeight: 'bold',
                    color: 'text.secondary'
                  }}
                >
                  — {author}
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      ) : (
        <Typography variant="body1">Не удалось загрузить данные профиля</Typography>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: '90%', sm: 400 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '5px',
              height: '100%',
              bgcolor: 'primary.light'
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2" fontWeight="bold">
              Запрашиваем цитату
            </Typography>
            {loading ? 
              <CircularProgress size={24} sx={{ color: 'primary.main' }} /> : 
              <CheckCircleOutline color="success" sx={{ fontSize: 28 }} />
            }
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', py: 2 }}>
              <Box sx={{ mb: 3 }}>
                {steps.map((step, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1.5,
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: step.completed ? 'success.light' : 'background.default',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        bgcolor: step.completed ? 'success.main' : 'grey.400',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {step.completed ? '✓' : index + 1}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {step.title}
                      </Typography>
                      {step.completed && (
                        <Typography variant="caption" color="success.dark">
                          Выполнено
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
              
              <Button 
                variant="contained" 
                color="error" 
                onClick={handleClose}
                sx={{ 
                  alignSelf: 'center', 
                  mt: 2,
                  fontWeight: 'bold',
                  boxShadow: 2,
                  '&:hover': { boxShadow: 4 }
                }}
              >
                Отменить
              </Button>
            </Box>
          ) : (
            <Box>
              {author && quote && (
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2.5, 
                    borderRadius: 2, 
                    bgcolor: 'background.default',
                    mb: 3
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', lineHeight: 1.6 }}>
                    "{quote}"
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1, textAlign: 'right', fontWeight: 'bold' }}>
                    — {author}
                  </Typography>
                </Paper>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button 
                  variant="contained" 
                  onClick={handleClose}
                  sx={{ 
                    fontWeight: 'bold',
                    boxShadow: 2,
                    '&:hover': { boxShadow: 4 }
                  }}
                >
                  Закрыть
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
