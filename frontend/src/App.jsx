
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
import SocketProvider from './context/SocketProvider.jsx';
import Notificationpage from './pages/Notificationspage/Notificationspage.jsx';
import LikeProvider from './context/LikesContext.jsx';
import RepostProvider from './context/RepostProvider.jsx';
import DataProvider from './context/DataProvider.jsx';
import UserProfilePage from './pages/ProfilePage/UserProfilePage.jsx';
import { Suspense } from 'react';

const App = () => {

  return (
    <DataProvider>
      <SocketProvider>    
        <NotificationProvider>
          <LikeProvider>
            <RepostProvider>
              <Suspense fallback={<div>Loading Page...</div>}>
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
                      <Route path="/user-profile/:user" element={<UserProfilePage />} />
                      <Route path="/post/:post_id" element={<PostPage />} />
                      <Route path="/edit-profile" element={<EditProfile />} />
                      <Route path="/notifications" element={<Notificationpage />}/>
                    </Route>
                  </Route>
                </Routes>
              </Suspense>

            </RepostProvider>
          </LikeProvider>
        </NotificationProvider>
      </SocketProvider>
    </DataProvider>
      
  );
};

export default App;