import NotificationScreen from "@/src/screens/notification/notification.screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function index() {
  return     <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationScreen />
    </GestureHandlerRootView>
}