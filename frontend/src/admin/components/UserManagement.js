import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Snackbar, Alert, Box, MenuItem, AppBar, Toolbar, IconButton
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCredentials } from '../../store/authSlice';
import api from '../../api/api';
import Footer from './Footer';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    id: '',
    name: '',
    password: '',
    email: '',
    phone: '',
    gender: 'Nam',
    birthDate: '',
    address: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token, refreshToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/all-users');
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách người dùng');
    }
  };

  const handleOpen = (user = null) => {
    setEditUser(user);
    if (user) {
      setNewUser({
        id: user.id,
        name: user.name,
        password: '',
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
        address: user.address,
        role: user.role
      });
    } else {
      setNewUser({
        id: '',
        name: '',
        password: '',
        email: '',
        phone: '',
        gender: 'Nam',
        birthDate: '',
        address: '',
        role: 'user'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      if (!newUser.id || newUser.id.length < 6) {
        setError('Mã sinh viên phải có ít nhất 6 ký tự');
        return;
      }
      if (!newUser.name || newUser.name.length < 2) {
        setError('Tên phải có ít nhất 2 ký tự');
        return;
      }
      if (!editUser && (!newUser.password || newUser.password.length < 6)) {
        setError('Mật khẩu phải có ít nhất 6 ký tự');
        return;
      }

      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        gender: newUser.gender,
        birthDate: newUser.birthDate,
        address: newUser.address,
        role: newUser.role
      };
      if (newUser.password) {
        userData.password = newUser.password;
      }

      if (editUser) {
        await api.put(`/admin/user/${editUser._id}`, userData);
        setSuccess('Cập nhật người dùng thành công');
      } else {
        await api.post('/admin/user', userData);
        setSuccess('Thêm người dùng thành công');
      }
      fetchUsers();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu người dùng');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/admin/user/${userId}`);
      setSuccess('Xóa người dùng thành công');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi xóa người dùng');
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
            HCMUT - Quản trị
          </Typography>
          <Button color="inherit" onClick={() => navigate('/admin')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate('/admin/users')}>
            Quản lý người dùng
          </Button>
          <Button color="inherit" onClick={() => navigate('/admin/spaces')}>
            Quản lý phòng
          </Button>
          <Button color="inherit" onClick={() => navigate('/admin/user')}>
            Thông tin cá nhân
          </Button>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Quản lý người dùng</Typography>
        <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>
          Thêm người dùng
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã sinh viên</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleOpen(user)} sx={{ mr: 1 }}>
                    Sửa
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(user._id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{editUser ? 'Sửa người dùng' : 'Thêm người dùng'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Mã sinh viên"
                value={newUser.id}
                onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
                fullWidth
                required
                disabled={!!editUser}
              />
              <TextField
                label="Tên"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Mật khẩu"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                fullWidth
                required={!editUser}
              />
              <TextField
                label="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                fullWidth
              />
              <TextField
                label="Số điện thoại"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                fullWidth
              />
              <TextField
                label="Địa chỉ"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                fullWidth
              />
              <TextField
                select
                label="Giới tính"
                value={newUser.gender}
                onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                fullWidth
              >
                {['Nam', 'Nữ', 'Khác'].map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Ngày sinh"
                type="date"
                value={newUser.birthDate}
                onChange={(e) => setNewUser({ ...newUser, birthDate: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                label="Vai trò"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                fullWidth
              >
                {['user', 'admin'].map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button onClick={handleSave} variant="contained">Lưu</Button>
          </DialogActions>
        </Dialog>

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

export default UserManagement;