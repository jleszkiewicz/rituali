import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useEffect, useState, useCallback } from "react";
import OfflineScreen from "./OfflineScreen";
import { useDispatch, useSelector } from "react-redux";
import { setHabits } from "@/src/store/habitsSlice";
import { selectUserId } from "@/src/store/userSlice";
import { fetchUserHabits } from "@/src/service/apiService";

interface ScreenWrapperProps {
  children: React.ReactNode;
  showOfflineScreen?: boolean;
}

const ScreenWrapper = ({
  children,
  showOfflineScreen = true,
}: ScreenWrapperProps) => {
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const habits = await fetchUserHabits(userId);
      dispatch(setHabits(habits));
    } catch (error) {
      // Handle error silently
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch("https://www.google.com", {
          method: "HEAD",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (isMounted) {
          setIsConnected(response.ok);
        }
      } catch (error) {
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };

    checkConnection();
    const intervalId = setInterval(checkConnection, 3000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {!showOfflineScreen || isConnected ? (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.PrimaryPink]}
              tintColor={Colors.PrimaryPink}
            />
          }
        >
          {children}
        </ScrollView>
      ) : (
        <OfflineScreen />
      )}
    </SafeAreaView>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.White,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    marginHorizontal: 20,
  },
});
