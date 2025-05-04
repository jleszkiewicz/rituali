import React, { useEffect, useRef, useCallback } from "react";
import {
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { format, subDays, addDays } from "date-fns";
import CalendarElement from "./CalendarElement";
import { dateFormat } from "@/constants/Constants";
import debounce from "lodash/debounce";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEMS_PER_PAGE = 7;
const ITEM_WIDTH = (SCREEN_WIDTH - 40) / ITEMS_PER_PAGE;
const PAGE_WIDTH = SCREEN_WIDTH - 40;

const generateDays = (daysBefore = 30, daysAfter = 30) => {
  const days = [];
  for (let i = daysBefore; i > 0; i--) {
    days.push(subDays(new Date(), i));
  }
  days.push(new Date());
  for (let i = 1; i <= daysAfter; i++) {
    days.push(addDays(new Date(), i));
  }
  return days;
};

interface Props {
  selectedDate: Date;
  setSelectedDate: (arg: Date) => void;
}

const CalendarCarousel = ({ selectedDate, setSelectedDate }: Props) => {
  const days = generateDays();
  const flatListRef = useRef<FlatList<Date>>(null);

  const todayIndex = days.findIndex(
    (d) => format(d, dateFormat) === format(new Date(), dateFormat)
  );

  const initialScrollIndex = Math.max(
    todayIndex - Math.floor(ITEMS_PER_PAGE / 2) + 1,
    0
  );

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: initialScrollIndex,
        animated: false,
      });
    }, 0);
  }, []);

  const debouncedSetSelectedDate = useCallback(
    debounce((date: Date) => {
      setSelectedDate(date);
    }, 100),
    [setSelectedDate]
  );

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const pageIndex = Math.round(offsetX / PAGE_WIDTH);
      flatListRef.current?.scrollToOffset({
        offset: pageIndex * PAGE_WIDTH,
        animated: true,
      });
    },
    []
  );

  return (
    <FlatList
      ref={flatListRef}
      data={days}
      renderItem={({ item }) => (
        <CalendarElement
          item={item}
          selectedDate={selectedDate}
          itemWidth={ITEM_WIDTH}
          setSelectedDate={debouncedSetSelectedDate}
        />
      )}
      keyExtractor={(item) => item.toISOString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={PAGE_WIDTH}
      decelerationRate="fast"
      getItemLayout={(_, index) => ({
        length: ITEM_WIDTH,
        offset: ITEM_WIDTH * index,
        index,
      })}
      style={{ flexGrow: 0 }}
      onMomentumScrollEnd={onMomentumScrollEnd}
      initialScrollIndex={initialScrollIndex}
      removeClippedSubviews={true}
      maxToRenderPerBatch={7}
      windowSize={5}
    />
  );
};

export default CalendarCarousel;
