import { useEffect, useState } from 'react';
import { signupUser } from '../api/auth';
import { setToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signupUser(form);
      setToken(res.data.token);
      alert('Register Successfully!!')
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  useEffect(() => {
    const elements = document.querySelectorAll('.floating-coin');
    const coins = Array.from(elements).map((el) => ({
      el,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      dx: (Math.random() * 1 + 0.2) * (Math.random() < 0.5 ? -1 : 1), // Speed X
      dy: (Math.random() * 1 + 0.2) * (Math.random() < 0.5 ? -1 : 1), // Speed Y
      rotation: Math.random() * 360,
      dRotation: Math.random() * 2 + 0.2 // Spin speed
    }));

    const update = () => {
      coins.forEach((coin) => {
        const el = coin.el;
        const rect = el.getBoundingClientRect();

        if (coin.x <= 0 || coin.x + rect.width >= window.innerWidth) coin.dx *= -1;
        if (coin.y <= 0 || coin.y + rect.height >= window.innerHeight) coin.dy *= -1;

        coin.x += coin.dx;
        coin.y += coin.dy;
        coin.rotation += coin.dRotation;

        el.style.left = `${coin.x}px`;
        el.style.top = `${coin.y}px`;
        el.style.transform = `rotate(${coin.rotation}deg)`;
      });

      requestAnimationFrame(update);
    };

    update();
  }, []);



  return (
    <main className='position-relative'>
      <img id="coin1" className="floating-coin" src="public/images/bitcoin.png" alt="bitcoin" />
      <img id="coin2" className="floating-coin" src="public/images/ethereum.png" alt="ethereum" />
      <img id="coin3" className="floating-coin" src="public/images/solana.png" alt="solana" />
      <img id="coin4" className="floating-coin" src="public/images/bitcoin.png" alt="bitcoin" />
      <img id="coin5" className="floating-coin" src="public/images/ethereum.png" alt="ethereum" />
      <img id="coin6" className="floating-coin" src="public/images/solana.png" alt="solana" />


      <div className='container'>
        <div className='form-container'>
          <form className="stackedForm" onSubmit={handleSubmit}>
            <ul className="wrapper">
              <li style={{ '--i': 4 }}>
                <input
                  required
                  placeholder="Name"
                  type="text"
                  name="name"
                  className="input"
                  onChange={handleChange}
                />
              </li>
              <li style={{ '--i': 3 }}>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  className="input"
                  onChange={handleChange}
                />
              </li>
              <li style={{ '--i': 2 }}>
                <input
                  name="password"
                  required
                  placeholder="Password"
                  type="password"
                  className="input"
                  onChange={handleChange}
                />
              </li>
              <button type="submit" style={{ '--i': 1 }}><span>Register</span></button>
            </ul>
          </form>

        </div>

      </div>

    </main>
  );
};

export default Signup;
