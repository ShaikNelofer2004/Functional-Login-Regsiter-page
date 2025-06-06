import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Box, 
  Grid, 
  Avatar, 
  Fade, 
  Grow,
  Zoom,
  useTheme,
  useMediaQuery,
  Skeleton,
  IconButton,
  Tooltip,
  Divider,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  MdEdit, 
  MdLogout, 
  MdPerson, 
  MdEmail, 
  MdCalendarToday, 
  MdArrowForward,
  MdSettings,
  MdNotifications,
  MdDashboard,
  MdTrendingUp,
  MdAccessTime,
  MdSecurity,
  MdStars,
  MdMoreVert
} from 'react-icons/md';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(6),
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)',
  },
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: 'linear-gradient(-45deg, #1a73e8, #2196f3, #1557b0, #1976d2)',
    backgroundSize: '400% 400%',
    animation: `${gradientAnimation} 15s ease infinite`,
    opacity: 0.1,
    zIndex: 0,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(18),
  height: theme.spacing(18),
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(-45deg, #1a73e8, #2196f3)',
  backgroundSize: '200% 200%',
  animation: `${gradientAnimation} 5s ease infinite`,
  fontSize: '3.5rem',
  fontWeight: 700,
  boxShadow: '0 8px 32px rgba(26, 115, 232, 0.25)',
  border: '4px solid white',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 48px rgba(26, 115, 232, 0.35)',
    animation: `${pulseAnimation} 2s ease-in-out infinite`,
  },
  [theme.breakpoints.down('sm')]: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    fontSize: '2.5rem',
  },
}));

const InfoCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '20px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    '&::before': {
      transform: 'translateX(0)',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: 'linear-gradient(-45deg, #1a73e8, #2196f3)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease-in-out',
  },
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: '12px',
  transition: 'all 0.3s ease-in-out',
  '& svg': {
    fontSize: '1.5rem',
    color: '#1a73e8',
    transition: 'all 0.3s ease-in-out',
  },
  '&:hover': {
    backgroundColor: 'rgba(26, 115, 232, 0.05)',
    transform: 'translateX(4px)',
    '& svg': {
      transform: 'scale(1.1)',
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.8),
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease-in-out',
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    '& .MuiButton-startIcon': {
      transform: 'scale(1.1)',
    },
  },
}));

const QuickActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  padding: theme.spacing(1.5),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
    '& .stat-icon': {
      transform: 'scale(1.1)',
    },
  },
}));

const StatIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
  transition: 'transform 0.3s ease-in-out',
  '& svg': {
    fontSize: '1.8rem',
    color: '#fff',
  },
}));

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    daysActive: 0,
    completionRate: 0,
    totalTasks: 0,
    streak: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        
        // Calculate mock stats
        const createdDate = new Date(response.data.createdAt);
        const today = new Date();
        const daysActive = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
        
        setStats({
          daysActive,
          completionRate: 85,
          totalTasks: 42,
          streak: 7
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <Fade in={!loading} timeout={800}>
      <Container component="main" maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 2, 
          mb: 2,
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}>
          <Tooltip title="Notifications">
            <QuickActionButton>
              <MdNotifications />
            </QuickActionButton>
          </Tooltip>
          <Tooltip title="Settings">
            <QuickActionButton>
              <MdSettings />
            </QuickActionButton>
          </Tooltip>
        </Box>

        <Grid container spacing={4}>
          {/* Welcome Section */}
          <Grid item xs={12}>
            <StyledPaper elevation={0}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={4} display="flex" flexDirection="column" alignItems="center">
                  {loading ? (
                    <Skeleton 
                      variant="circular" 
                      width={theme.spacing(18)} 
                      height={theme.spacing(18)} 
                      sx={{ mb: 3 }}
                    />
                  ) : (
                    <Grow in={!loading} timeout={800}>
                      <StyledAvatar>
                        {user.name.charAt(0).toUpperCase()}
                      </StyledAvatar>
                    </Grow>
                  )}
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Zoom in={!loading} style={{ transitionDelay: '200ms' }}>
                    <Box>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 1,
                          color: 'text.secondary'
                        }}
                      >
                        {getGreeting()},
                      </Typography>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 800,
                          background: 'linear-gradient(-45deg, #1a73e8, #2196f3)',
                          backgroundSize: '200% 200%',
                          animation: `${gradientAnimation} 5s ease infinite`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {user.name}
                      </Typography>
                    </Box>
                  </Zoom>
                </Grid>
              </Grid>
            </StyledPaper>
          </Grid>

          {/* Stats Section */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Fade in={!loading} style={{ transitionDelay: '400ms' }}>
                  <StatCard>
                    <StatIcon sx={{ bgcolor: '#1a73e8' }} className="stat-icon">
                      <MdAccessTime />
                    </StatIcon>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.daysActive}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Days Active
                    </Typography>
                  </StatCard>
                </Fade>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Fade in={!loading} style={{ transitionDelay: '500ms' }}>
                  <StatCard>
                    <StatIcon sx={{ bgcolor: '#4caf50' }} className="stat-icon">
                      <MdTrendingUp />
                    </StatIcon>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.completionRate}%
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Completion Rate
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats.completionRate} 
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </StatCard>
                </Fade>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Fade in={!loading} style={{ transitionDelay: '600ms' }}>
                  <StatCard>
                    <StatIcon sx={{ bgcolor: '#ff9800' }} className="stat-icon">
                      <MdDashboard />
                    </StatIcon>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.totalTasks}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Total Tasks
                    </Typography>
                  </StatCard>
                </Fade>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Fade in={!loading} style={{ transitionDelay: '700ms' }}>
                  <StatCard>
                    <StatIcon sx={{ bgcolor: '#f44336' }} className="stat-icon">
                      <MdStars />
                    </StatIcon>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.streak}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Day Streak
                    </Typography>
                  </StatCard>
                </Fade>
              </Grid>
            </Grid>
          </Grid>

          {/* Profile and Actions Section */}
          <Grid item xs={12} md={6}>
            <Fade in={!loading} style={{ transitionDelay: '800ms' }}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MdPerson />
                      Profile Information
                    </Typography>
                    <IconButton size="small">
                      <MdMoreVert />
                    </IconButton>
                  </Box>
                  
                  <InfoItem>
                    <MdEmail />
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Email Address
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {user.email}
                      </Typography>
                    </Box>
                  </InfoItem>

                  <InfoItem>
                    <MdCalendarToday />
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Member Since
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>
                  </InfoItem>

                  <InfoItem>
                    <MdSecurity />
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Account Status
                      </Typography>
                      <Typography variant="body1" fontWeight={600} sx={{ color: '#4caf50' }}>
                        Active
                      </Typography>
                    </Box>
                  </InfoItem>
                </CardContent>
              </StyledCard>
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Fade in={!loading} style={{ transitionDelay: '900ms' }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2,
                height: '100%',
                justifyContent: 'center'
              }}>
                <ActionButton
                  variant="contained"
                  onClick={() => navigate('/edit-profile')}
                  startIcon={<MdEdit />}
                  sx={{
                    background: 'linear-gradient(-45deg, #1a73e8, #2196f3)',
                    backgroundSize: '200% 200%',
                    animation: `${gradientAnimation} 5s ease infinite`,
                    boxShadow: '0 4px 20px rgba(26, 115, 232, 0.25)',
                    color: 'white',
                    py: 2,
                    '&:hover': {
                      boxShadow: '0 6px 25px rgba(26, 115, 232, 0.35)',
                    },
                  }}
                >
                  Edit Profile
                </ActionButton>
                
                <ActionButton
                  variant="outlined"
                  onClick={handleLogout}
                  startIcon={<MdLogout />}
                  sx={{
                    borderColor: '#1a73e8',
                    borderWidth: '2px',
                    color: '#1a73e8',
                    py: 2,
                    '&:hover': {
                      borderColor: '#1557b0',
                      borderWidth: '2px',
                      backgroundColor: 'rgba(26, 115, 232, 0.05)',
                    },
                  }}
                >
                  Logout
                </ActionButton>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
};

export default Dashboard; 