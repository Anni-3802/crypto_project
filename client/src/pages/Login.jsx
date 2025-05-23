import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { UserAuth } from '../context/UserAuth';

const Login = () => {
  const { login } = useContext(UserAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      sessionStorage.setItem("username",res.data.user.name)
      console.log(res)
      login(res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" className="form-control my-2" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" className="form-control my-2" name="password" placeholder="Password" onChange={handleChange} />
      <button className="btn btn-success">Login</button>
    </form>
  );
};

export default Login;
