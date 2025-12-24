import { Text } from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Redirect } from "expo-router";

export default function Index() {
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await SecureStore.getItemAsync("accessToken");
      console.log("Token",token);
      setLoggedInUser(!!token);
      setLoading(false);
    };

    checkLogin();
  }, []);

  if (loading) return <Text>Loading...</Text>;

  // Auto-routing
  if (loggedInUser) return <Redirect href="/(tabs)" />;
  else return <Redirect href="/onboarding" />;
}
