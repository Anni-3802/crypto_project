import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

const App = () => (
  <>
    <Navbar />
    <div className="container mt-4">
      <AppRoutes />
    </div>
  </>
);

export default App;
