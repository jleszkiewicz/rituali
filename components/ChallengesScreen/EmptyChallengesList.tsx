import { Colors } from "@/constants/Colors";
import { ThemedText } from "../Commons/ThemedText";
import { View, Image } from "react-native";
import { StyleSheet } from "react-native";

const EmptyChallengesList = ({
  imageWidth,
  textColor,
  title,
  description,
}: {
  imageWidth: number;
  textColor: string;
  title: string;
  description: string;
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/illustrations/empty_list.png")}
        style={[styles.image, { width: imageWidth, height: imageWidth }]}
      />
      <ThemedText style={[styles.title, { color: textColor }]}>
        {title}
      </ThemedText>
      <ThemedText style={[styles.description, { color: textColor }]}>
        {description}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "bold",
    color: Colors.PrimaryGray,
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    textAlign: "center",
  },
  image: {
    width: 250,
    height: 250,
  },
});

export default EmptyChallengesList;
