import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import TrackerScreen from "./components/TrackerScreen";
import HealthDataDisplay from "./components/HealthDataDisplay";
import { Session } from "@supabase/supabase-js";
import { MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!session) {
    return <Auth />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Track") {
              iconName = "add-circle";
            } else if (route.name === "Journal") {
              iconName = "book";
            }

            return (
              <MaterialIcons name={iconName as any} size={size} color={color} />
            );
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
        })}
      >
        <Tab.Screen name="Track" options={{ title: "Daily Tracker" }}>
          {() => <TrackerScreen session={session} />}
        </Tab.Screen>
        <Tab.Screen name="Journal" options={{ title: "Journal" }}>
          {() => <HealthDataDisplay session={session} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
