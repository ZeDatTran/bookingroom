import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, Box, Snackbar, Alert,
  AppBar, Toolbar, IconButton
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCredentials } from '../../store/authSlice';
import api from '../../api/api';
import Footer from './Footer';

function Profile() {
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    gender: '',
    birthDate: '',
    address: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token, refreshToken, user: authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        setUser({
          id: res.data.data.id,
          name: res.data.data.name,
          email: res.data.data.email,
          phone: res.data.data.phone,
          gender: res.data.data.gender,
          birthDate: res.data.data.birthDate ? new Date(res.data.data.birthDate).toISOString().split('T')[0] : '',
          address: res.data.data.address,
          password: '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi khi tải thông tin hồ sơ');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const updateData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        birthDate: user.birthDate,
        address: user.address,
      };
      if (user.password) {
        updateData.password = user.password;
      }
      const res = await api.put('/auth/update', updateData);
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi cập nhật hồ sơ');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', { refreshToken });
      dispatch(clearCredentials());
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      dispatch(clearCredentials());
      navigate('/login');
    }
  };

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            HCMUT - Không gian học tập
          </Typography>
          <Button color="inherit" onClick={() => navigate('/user/search')}>
            Trang chủ
          </Button>
          <Button color="inherit" onClick={() => navigate('/user/notifications')}>
            Thông báo
          </Button>
          <Button color="inherit" onClick={() => navigate('/user/profile')}>
            Hồ sơ
          </Button>
          {authUser?.role === 'admin' && (
            <Button color="inherit" onClick={() => navigate('/admin')}>
              Quản trị
            </Button>
          )}
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Hồ sơ cá nhân</Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Mã sinh viên"
            name="id"
            value={user.id}
            disabled
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tên"
            name="name"
            value={user.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Số điện thoại"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Giới tính"
            name="gender"
            value={user.gender}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Ngày sinh"
            name="birthDate"
            type="date"
            value={user.birthDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Địa chỉ"
            name="address"
            value={user.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mật khẩu"
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
            Cập nhật
          </Button>
        </Box>

        <Snackbar
          open={!!error || !!success}
          autoHideDuration={6000}
          onClose={() => {
            setError('');
            setSuccess('');
          }}
        >
          <Alert
            severity={error ? 'error' : 'success'}
            onClose={() => {
              setError('');
              setSuccess('');
            }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Container>

      <Footer />
    </>
  );
}

export default Profile;