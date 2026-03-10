import React from 'react';
import { useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import LoadingSpinner from './components/LoadingSpinner';

export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner message="Starting WorkFlo…" />;
  if (!isAuthenticated) return <LoginScreen />;
  return <HomeScreen />;
}
