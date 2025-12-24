import {
  FlatList,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import React from "react";
import { useTheme } from "@/src/context/theme.context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { videoLessonsData } from "@/src/configs/constants";
import { verticalScale } from "react-native-size-matters";
import SourceCodeCard from "@/src/components/cards/source.code.card";

export default function ResourcesScreen() {
  const { theme } = useTheme();
  const bottomTabBarHeight = useBottomTabBarHeight();

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.dark ? "#131313" : "#fff",
        flex: 1,
      }}
    >
        <View style={{ paddingBottom: bottomTabBarHeight - 20 }}>
          <FlatList
            data={videoLessonsData}
            renderItem={({ item }) => <SourceCodeCard item={item} />}
            showsVerticalScrollIndicator={false}
            style={{
              paddingTop: verticalScale(10),
            }}
          />
        </View>
    </SafeAreaView>
  );
}

