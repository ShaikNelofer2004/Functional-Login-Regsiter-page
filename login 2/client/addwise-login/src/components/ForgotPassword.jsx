import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setSuccess('OTP has been sent to your email');
      setStep(2);
      setResendDisabled(true);
      setCountdown(60); // 60 seconds cooldown
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      setSuccess('OTP verified successfully');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      setSuccess('Password reset successful');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 600, color: '#1a73e8', mb: 1 }}>
          Reset Password
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          {step === 1 && "Enter your email to receive an OTP"}
          {step === 2 && "Enter the 4-digit OTP sent to your email"}
          {step === 3 && "Enter your new password"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={
          step === 1 ? handleSendOTP : 
          step === 2 ? handleVerifyOTP : 
          handleResetPassword
        } sx={{ width: '100%' }}>
          {step === 1 && (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              sx={{ mb: 2 }}
            />
          )}

          {step === 2 && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Enter OTP"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                inputProps={{ maxLength: 4, pattern: '[0-9]*' }}
                autoFocus
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button
                  type="button"
                  disabled={resendDisabled}
                  onClick={handleSendOTP}
                  sx={{ color: '#1a73e8' }}
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                </Button>
                <Typography variant="caption" color="textSecondary">
                  OTP valid for 10 minutes
                </Typography>
              </Box>
            </>
          )}

          {step === 3 && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 3 }}
              />
            </>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 2, mb: 2, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : (
              step === 1 ? 'Send OTP' :
              step === 2 ? 'Verify OTP' :
              'Reset Password'
            )}
          </Button>

          <Typography variant="body2" align="center">
            <Link to="/" style={{ color: '#1a73e8', textDecoration: 'none' }}>
              Back to Login
            </Link>
          </Typography>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default ForgotPassword; 