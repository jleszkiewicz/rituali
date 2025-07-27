import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { HabitData } from "@/components/AddHabitModal/types";
import { format } from "date-fns";
import { dateFormat } from "@/constants/Constants";
import ChallengeCard from "./ChallengeCard";
import PageIndicator from "../Commons/PageIndicator";
import Carousel from "react-native-reanimated-carousel";

interface ChallengesListProps {
  challenges: ChallengeData[];
  habits: HabitData[];
  selectedDate: string;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const PAGE_WIDTH = SCREEN_WIDTH - 20;
const ITEM_MARGIN = 10;
const CARD_WIDTH = (PAGE_WIDTH - ITEM_MARGIN) / 2;

export default function ChallengesList({
  challenges,
  habits,
  selectedDate,
}: ChallengesListProps) {
  const chunkArray = (array: ChallengeData[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  const pages = chunkArray(challenges, 2);
  const [currentPage, setCurrentPage] = React.useState(0);

  return (
    <View style={styles.container}>
      <View
        style={{ width: PAGE_WIDTH, alignSelf: "center", overflow: "visible" }}
      >
        <Carousel
          loop={false}
          width={PAGE_WIDTH}
          height={200}
          data={pages}
          onSnapToItem={setCurrentPage}
          style={{ paddingHorizontal: ITEM_MARGIN, overflow: "visible" }}
          renderItem={({ item: pageItems }) => (
            <View
              style={{
                flexDirection: "row",
                width: PAGE_WIDTH - ITEM_MARGIN * 2,
                overflow: "visible",
              }}
            >
              {pageItems.map((challenge: ChallengeData, idx: number) => (
                <View
                  key={challenge.id}
                  style={{
                    width: CARD_WIDTH,
                    marginRight: idx === 0 ? ITEM_MARGIN : 0,
                  }}
                >
                  <ChallengeCard
                    challenge={challenge}
                    habits={habits}
                    selectedDate={format(selectedDate, dateFormat)}
                    width={CARD_WIDTH}
                  />
                </View>
              ))}
            </View>
          )}
        />
      </View>
      <PageIndicator
        isVisible={pages.length > 1}
        count={pages.length}
        currentIndex={currentPage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 0,
  },
});
