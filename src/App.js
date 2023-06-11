import logo from './logo.svg';
import './App.css';
import LoginForm from './pages/login';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes/routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <BrowserRouter>
      <Router/>
      <ToastContainer/>
    </BrowserRouter>
  );
}

export default App;
