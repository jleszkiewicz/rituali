import { useRef, useState } from "react";
import { FlatList, Dimensions } from "react-native";

interface UsePaginationFlatListProps {
  itemsPerPage?: number;
  initialPage?: number;
  itemMargin?: number;
}

interface UsePaginationFlatListReturn {
  flatListRef: React.RefObject<FlatList>;
  currentPage: number;
  handlePageChange: (event: any) => void;
  pageWidth: number;
  cardWidth: number;
  flatListProps: {
    horizontal: boolean;
    pagingEnabled: boolean;
    snapToAlignment: "start";
    decelerationRate: "fast";
    showsHorizontalScrollIndicator: boolean;
    onMomentumScrollEnd: (event: any) => void;
    getItemLayout: (_: any, index: number) => {
      length: number;
      offset: number;
      index: number;
    };
    contentContainerStyle: {
      paddingHorizontal: number;
    };
  };
}

export const usePaginationFlatList = ({
  itemsPerPage = 1,
  initialPage = 0,
  itemMargin = 10,
}: UsePaginationFlatListProps = {}): UsePaginationFlatListReturn => {
  const flatListRef = useRef<FlatList>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const screenWidth = Dimensions.get("window").width;
  const pageWidth = screenWidth;
  const totalMargins = itemMargin * (itemsPerPage - 1);
  const cardWidth = (pageWidth - totalMargins) / itemsPerPage;

  const handlePageChange = (event: any) => {
    const newPage = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setCurrentPage(newPage);
  };

  const flatListProps = {
    horizontal: true,
    pagingEnabled: true,
    snapToAlignment: "start" as const,
    decelerationRate: "fast" as const,
    showsHorizontalScrollIndicator: false,
    onMomentumScrollEnd: handlePageChange,
    getItemLayout: (_: any, index: number) => ({
      length: pageWidth,
      offset: pageWidth * index,
      index,
    }),
    contentContainerStyle: {
      paddingHorizontal: 0,
    },
  };

  return {
    flatListRef,
    currentPage,
    handlePageChange,
    pageWidth,
    cardWidth,
    flatListProps,
  };
}; 