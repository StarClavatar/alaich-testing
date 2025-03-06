import { Typography, Box, Skeleton, Card, CardContent, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { infoApi } from "../../api/apiClient";
import { InfoOutlined } from "@mui/icons-material";

export default function Info() {
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      if (info) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const response = await infoApi.getInfo({ forceRefresh: false });
        if (response.success) {
          setInfo(response.data.info);
        }
      } catch (error) {
        console.error("Failed to fetch info", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [info]);

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <InfoOutlined color="primary" sx={{ fontSize: 30, mr: 1 }} />
        <Typography variant="h4" component="h1">
          Информация
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {loading ? (
        <Box>
          <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={100} />
        </Box>
      ) : (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography 
              variant="body1" 
              sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: info || 'Информация не найдена' }} 
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
