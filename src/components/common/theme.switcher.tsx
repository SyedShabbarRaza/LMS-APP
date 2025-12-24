import React, { useState, useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

import { useTheme } from "@/src/context/theme.context";
import { scale, verticalScale } from "react-native-size-matters";
import { IsAndroid, IsHaveNotch, IsIPAD } from "@/themes/app.constant";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  // local boolean that mirrors the actual theme.dark
  const [isOn, setIsOn] = useState(Boolean(theme.dark));

  // keep Animated.Value stable across renders
  const animatedValue = useRef(new Animated.Value(theme.dark ? 1 : 0)).current;

  // When theme.dark changes in context (maybe from another screen),
  // sync local state and animate to the correct position.
  useEffect(() => {
    setIsOn(Boolean(theme.dark));
    Animated.timing(animatedValue, {
      toValue: theme.dark ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [theme.dark, animatedValue]);

  const toggleSwitch = () => {
    const newValue = !isOn;

    // Play local animation immediately for snappy UX
    Animated.timing(animatedValue, {
      toValue: newValue ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // update local UI state
    setIsOn(newValue);

    // notify context to change actual theme (this should update theme.dark)
    // If toggleTheme is synchronous or async, our effect above will re-sync.
    toggleTheme();
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, scale(19)],
  });

  return (
    <TouchableOpacity onPress={toggleSwitch} style={styles.switchContainer}>
      <Animated.View
        style={[
          styles.circle,
          { transform: [{ translateX }] },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    width: IsAndroid ? scale(44) : scale(42),
    height: !IsHaveNotch
      ? verticalScale(23)
      : IsIPAD
      ? verticalScale(28)
      : verticalScale(20),
    borderRadius: scale(13),
    backgroundColor: "#D9D9D9",
    padding: scale(2),
    justifyContent: "center",
  },
  circle: {
    width: IsAndroid ? scale(20) : scale(18),
    height: IsAndroid ? scale(20) : scale(18),
    borderRadius: scale(11),
    backgroundColor: "#6D55FE",
  },
});
