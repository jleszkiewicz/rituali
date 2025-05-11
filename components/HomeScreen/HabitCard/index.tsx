import React, { useState, useRef } from "react";
import { View, StyleSheet, Animated, PanResponder } from "react-native";
import { Colors } from "@/constants/Colors";
import { HabitData } from "@/components/AddHabitModal/types";
import { useDispatch, useSelector } from "react-redux";
import { selectHabits, setHabits } from "@/src/store/habitsSlice";
import { updateHabitCompletion } from "@/src/service/apiService";
import { isAfter, parseISO } from "date-fns";
import DeleteHabitModal from "../../modals/DeleteHabitModal";
import HabitCardContent from "./HabitCardContent";
import HabitActions from "./HabitActions";

interface HabitCardProps {
  habit: HabitData;
  selectedDate: string;
  onEdit: (habit: HabitData) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  selectedDate,
  onEdit,
}) => {
  const dispatch = useDispatch();
  const habits = useSelector(selectHabits);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;

  const isFutureDate = isAfter(parseISO(selectedDate), new Date());
  const isCompleted = habit.completionDates.some((date: string) => {
    if (!date) return false;
    return date === selectedDate;
  });

  const toggleCompletion = async () => {
    if (isLoading || isFutureDate) return;

    setIsLoading(true);
    try {
      const updatedCompletionDates = isCompleted
        ? habit.completionDates.filter((date: string) => date !== selectedDate)
        : [...habit.completionDates, selectedDate];

      const updatedHabits = habits.map((h) =>
        h.id === habit.id
          ? { ...h, completionDates: updatedCompletionDates }
          : h
      );
      dispatch(setHabits(updatedHabits));
      await updateHabitCompletion(habit.id, updatedCompletionDates);
    } catch (error) {
      console.error("Error updating habit completion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          pan.setValue({ x: gestureState.dx, y: 0 });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          Animated.spring(pan, {
            toValue: { x: -160, y: 0 },
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
            borderTopEndRadius: pan.x.interpolate({
              inputRange: [-160, 0],
              outputRange: [0, 10],
              extrapolate: "clamp",
            }),
            borderBottomEndRadius: pan.x.interpolate({
              inputRange: [-160, 0],
              outputRange: [0, 10],
              extrapolate: "clamp",
            }),
          },
        ]}
        {...panResponder.panHandlers}
      >
        <HabitCardContent
          habit={habit}
          selectedDate={selectedDate}
          isCompleted={isCompleted}
          isLoading={isLoading}
          isFutureDate={isFutureDate}
          onToggleCompletion={toggleCompletion}
        />
      </Animated.View>

      <HabitActions
        pan={pan}
        onEdit={() => {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
          onEdit(habit);
        }}
        onDelete={() => {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
          setIsDeleteModalVisible(true);
        }}
      />

      <DeleteHabitModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        habitId={habit.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 5,
    height: 60,
  },
  card: {
    margin: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    backgroundColor: Colors.White,
    height: "100%",
  },
});

export default HabitCard;
