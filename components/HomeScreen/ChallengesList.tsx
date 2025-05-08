import React, { useRef, useState } from "react";
import { View, FlatList, Dimensions, StyleSheet } from "react-native";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { HabitData } from "@/components/AddHabitModal/types";
import { format } from "date-fns";
import { dateFormat } from "@/constants/Constants";
import ChallengeCard from "./ChallengeCard";
import PagingIndicator from "./PagingIndicator";

interface ChallengesListProps {
  challenges: ChallengeData[];
  habits: HabitData[];
  selectedDate: string;
}

export default function ChallengesList({
  challenges,
  habits,
  selectedDate,
}: ChallengesListProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width: screenWidth } = Dimensions.get("window");
  const cardsPerPage = 2;
  const pageWidth = screenWidth - 40;
  const cardMargin = 10;
  const cardWidth = (pageWidth - cardMargin * 2) / 2;

  const handlePageChange = (event: any) => {
    const newPage = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setCurrentPage(newPage);
  };

  const chunkArray = (array: any[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={chunkArray(challenges, cardsPerPage)}
        renderItem={({ item: pageItems }) => (
          <View style={{ flexDirection: "row", width: pageWidth }}>
            {pageItems.map((challenge: ChallengeData, itemIndex: number) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                habits={habits}
                selectedDate={format(selectedDate, dateFormat)}
                width={cardWidth}
                isLastInPage={itemIndex % cardsPerPage === cardsPerPage - 1}
              />
            ))}
          </View>
        )}
        keyExtractor={(_, index) => `page-${index}`}
        horizontal
        pagingEnabled
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handlePageChange}
        getItemLayout={(_, index) => ({
          length: pageWidth,
          offset: pageWidth * index,
          index,
        })}
      />
      <PagingIndicator
        isVisible={Math.ceil(challenges.length / cardsPerPage) > 1}
        count={Math.ceil(challenges.length / cardsPerPage)}
        currentIndex={currentPage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10,
  },
});
