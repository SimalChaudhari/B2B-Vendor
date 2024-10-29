// useAuthToken.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthToken = () => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Optional: track loading state
  const [error, setError] = useState(null); // Optional: track errors

  useEffect(() => {
    const fetchAuthToken = async () => {
      try {
        const tokenData = await AsyncStorage.getItem('authToken');
        const Data = await AsyncStorage.getItem('userData');
        setToken(tokenData);
        setUserData(Data);
      } catch (error) {
        console.error("Error fetching authToken:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthToken();
  }, []);

  return { token, userData, loading, error };
};

export default useAuthToken;
