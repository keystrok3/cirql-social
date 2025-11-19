
import {  Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage.jsx';
import './App.css';
import LoginPage from './pages/LoginPage.jsx';
import Home from './pages/Homepage/Home.jsx';
import Profilepage from './pages/ProfilePage/Profilepage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import EditProfile from './pages/ProfilePage/EditProfile.jsx';
import MainLayout from './pages/Homepage/MainLayout.jsx';
import PostPage from './pages/Postpage/Postpage.jsx';
import NotificationProvider from './context/NotificationContext.jsx';

const App = () => {

  return (
        <NotificationProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected + Layout routes */}
            <Route element={<ProtectedRoute />}>
              {/* Main layout (desktop only) */}
              <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profilepage />} />
                <Route path="/post/:post_id" element={<PostPage />} />
                <Route path="/edit-profile" element={<EditProfile />} />
              </Route>
            </Route>
          </Routes>
        </NotificationProvider>
  );
};

export default App;