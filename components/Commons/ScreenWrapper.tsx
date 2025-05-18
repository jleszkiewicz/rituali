import { StyleSheet, SafeAreaView, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import OfflineScreen from "./OfflineScreen";

interface ScreenWrapperProps {
  children: React.ReactNode;
  showOfflineScreen?: boolean;
}

const ScreenWrapper = ({
  children,
  showOfflineScreen = true,
}: ScreenWrapperProps) => {
  const [isConnected, setIsConnected] = useState(true);

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
        <View style={styles.content}>{children}</View>
      ) : (
        <OfflineScreen />
      )}
    </SafeAreaView>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.ButterYellow,
    flex: 1,
  },
  content: {
    flex: 1,
    marginHorizontal: 20,
  },
});
