
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage.jsx';
import './App.css';
import LoginPage from './pages/LoginPage.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import Home from './pages/Homepage/Home.jsx';

const App = () => {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/register' element={<RegisterPage />}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/home' element={<Home />}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
};

export default App;
