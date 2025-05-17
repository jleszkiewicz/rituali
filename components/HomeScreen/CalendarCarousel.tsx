import React, { useCallback } from "react";
import { Dimensions, View } from "react-native";
import { format, subDays, addDays } from "date-fns";
import CalendarElement from "./CalendarElement";
import { dateFormat } from "@/constants/Constants";
import debounce from "lodash/debounce";
import Carousel from "react-native-reanimated-carousel";

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
  const todayIndex = days.findIndex(
    (d) => format(d, dateFormat) === format(new Date(), dateFormat)
  );

  const chunkArray = (array: Date[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  const pages = chunkArray(days, ITEMS_PER_PAGE);
  const initialPage = Math.floor(todayIndex / ITEMS_PER_PAGE);

  const debouncedSetSelectedDate = useCallback(
    debounce((date: Date) => {
      setSelectedDate(date);
    }, 100),
    [setSelectedDate]
  );

  return (
    <View style={{ width: PAGE_WIDTH, alignSelf: "center" }}>
      <Carousel
        loop={false}
        width={PAGE_WIDTH}
        height={80}
        data={pages}
        defaultIndex={initialPage}
        renderItem={({ item: pageItems }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: PAGE_WIDTH,
            }}
          >
            {pageItems.map((day: Date) => (
              <View key={day.toISOString()} style={{ width: ITEM_WIDTH }}>
                <CalendarElement
                  item={day}
                  selectedDate={selectedDate}
                  itemWidth={ITEM_WIDTH}
                  setSelectedDate={debouncedSetSelectedDate}
                />
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

export default CalendarCarousel;
