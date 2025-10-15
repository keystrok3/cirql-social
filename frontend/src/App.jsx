
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage.jsx';
import './App.css';
import LoginPage from './pages/LoginPage.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import Home from './pages/Homepage/Home.jsx';
import Profilepage from './pages/ProfilePage/Profilepage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import EditProfile from './pages/ProfilePage/EditProfile.jsx';

const App = () => {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/register' element={<RegisterPage />}/>
          <Route path='/login' element={<LoginPage />}/>

          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<Home />}/>
            <Route path='/home' element={<Home />}/>
            <Route path='/profile' element={<Profilepage />}/>
            <Route path='/edit-profile' element={<EditProfile />}/>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
};

export default App;
