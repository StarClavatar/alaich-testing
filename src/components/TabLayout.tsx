import { useState } from 'react';
import { Box, Tabs, Tab, Container, Paper } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const TabLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const findActiveTab = () => {
    const path = location.pathname;
    if (path === '/info') return 0;
    if (path === '/user') return 1;
    return 0;
  };

  const [value, setValue] = useState(findActiveTab());
  
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue === 0) navigate('/info');
    if (newValue === 1) navigate('/user');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Box>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            centered
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Информация" sx={{ fontWeight: 'bold' }} />
            <Tab label="Профиль" sx={{ fontWeight: 'bold' }} />
          </Tabs>
        </Box>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Outlet />
      </Paper>
    </Container>
  );
};

export default TabLayout; 