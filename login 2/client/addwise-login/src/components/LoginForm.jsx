import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Fade,
  Grow,
  Zoom,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { MdVisibility, MdVisibilityOff, MdEmail, MdLock, MdArrowForward } from 'react-icons/md';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
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
    height: '200px',
    background: 'linear-gradient(-45deg, #1a73e8, #2196f3, #1557b0, #1976d2)',
    backgroundSize: '400% 400%',
    opacity: 0.05,
    animation: `${gradientAnimation} 15s ease infinite`,
    zIndex: 0,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
  position: 'relative',
  zIndex: 1,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease-in-out',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1a73e8',
        borderWidth: '2px',
      },
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
        borderColor: '#1a73e8',
      },
      '& .MuiInputAdornment-root svg': {
        color: '#1a73e8',
        transform: 'scale(1.1)',
      },
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.12)',
    transition: 'all 0.3s ease-in-out',
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#1a73e8',
    },
  },
  '& .MuiInputAdornment-root': {
    '& svg': {
      transition: 'all 0.3s ease-in-out',
      fontSize: '1.3rem',
    },
  },
}));

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  padding: theme.spacing(1.8),
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: 600,
  letterSpacing: '0.5px',
  background: 'linear-gradient(-45deg, #1a73e8, #2196f3)',
  backgroundSize: '200% 200%',
  animation: `${gradientAnimation} 5s ease infinite`,
  boxShadow: '0 4px 20px rgba(26, 115, 232, 0.25)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 25px rgba(26, 115, 232, 0.35)',
    animation: `${pulseAnimation} 1s ease-in-out infinite`,
  },
  '&.Mui-disabled': {
    background: 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)',
  },
  '& .MuiButton-endIcon': {
    marginLeft: theme.spacing(1),
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover .MuiButton-endIcon': {
    transform: 'translateX(4px)',
  },
}));

const GoogleButtonWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  '& > div': {
    width: '100% !important',
  },
  '& iframe': {
    width: '100% !important',
    borderRadius: '12px !important',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
  }
}));

const LoginForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      setSuccess(true);
      localStorage.setItem('token', response.data.token);
      
      // Add a small delay for the success animation
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('http://localhost:5000/api/auth/google', {
        credential: credentialResponse.credential
      });
      
      localStorage.setItem('token', response.data.token);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.response?.data?.message || 'Failed to login with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Container component="main" maxWidth="xs">
        <StyledPaper elevation={0}>
          <Grow in={true} timeout={800}>
            <Typography 
              component="h1" 
              variant={isMobile ? "h4" : "h3"}
              sx={{ 
                fontWeight: 800,
                mb: 1,
                background: 'linear-gradient(-45deg, #1a73e8, #2196f3)',
                backgroundSize: '200% 200%',
                animation: `${gradientAnimation} 5s ease infinite`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
              }}
            >
              Welcome to Addwise
            </Typography>
          </Grow>
          <Zoom in={true} style={{ transitionDelay: '200ms' }}>
            <Typography 
              variant="h6" 
              color="textSecondary" 
              sx={{ 
                mt: 1, 
                mb: 4,
                fontWeight: 500,
                textAlign: 'center',
                opacity: 0.9,
              }}
            >
              Please sign in to continue
            </Typography>
          </Zoom>

          {error && (
            <Fade in={true}>
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  mb: 3,
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.1)',
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem',
                  },
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          <StyledForm onSubmit={handleSubmit}>
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdEmail color="#666" />
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdLock color="#666" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ 
                        color: '#666',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          color: '#1a73e8',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'flex-end', 
              mt: 1 
            }}>
              <Link 
                to="/forgot-password" 
                style={{ 
                  color: '#1a73e8', 
                  textDecoration: 'none', 
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'all 0.3s ease-in-out',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#1557b0';
                  e.target.style.transform = 'translateX(4px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#1a73e8';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              endIcon={success ? null : <MdArrowForward />}
            >
              {loading ? (
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    color: 'white',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} 
                />
              ) : success ? (
                'Success!'
              ) : (
                'Sign In'
              )}
            </StyledButton>

            <Box sx={{ 
              my: 3, 
              display: 'flex', 
              alignItems: 'center',
              opacity: 0.8,
            }}>
              <Divider sx={{ 
                flex: 1,
                borderColor: 'rgba(0, 0, 0, 0.08)',
              }} />
              <Typography 
                variant="body2" 
                color="textSecondary" 
                sx={{ 
                  mx: 2,
                  fontWeight: 500,
                }}
              >
                OR
              </Typography>
              <Divider sx={{ 
                flex: 1,
                borderColor: 'rgba(0, 0, 0, 0.08)',
              }} />
            </Box>

            <GoogleButtonWrapper>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setError('Failed to login with Google. Please try again.');
                }}
                useOneTap
                theme="filled_blue"
                shape="rectangular"
                size="large"
                text="continue_with"
                locale="en"
                type="standard"
                ux_mode="popup"
              />
            </GoogleButtonWrapper>

            <Typography 
              variant="body1" 
              align="center" 
              sx={{ 
                mt: 4,
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{ 
                  color: '#1a73e8', 
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'all 0.3s ease-in-out',
                  display: 'inline-block',
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#1557b0';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#1a73e8';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Sign up
              </Link>
            </Typography>
          </StyledForm>
        </StyledPaper>
      </Container>
    </Fade>
  );
};

export default LoginForm; 