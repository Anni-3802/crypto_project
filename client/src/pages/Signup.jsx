import { useState } from 'react';
import { signupUser } from '../api/auth';
import { setToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signupUser(form);
      
      setToken(res.data.token);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input type="text" className="form-control my-2" name="name" placeholder="Name" onChange={handleChange} />
      <input type="email" className="form-control my-2" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" className="form-control my-2" name="password" placeholder="Password" onChange={handleChange} />
      <button className="btn btn-primary">Register</button>
    </form>
  );
};

export default Signup;
