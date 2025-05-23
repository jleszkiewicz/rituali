import { View } from "react-native";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import { t } from "@/src/service/translateService";
import FriendRequestForm from "@/components/FriendsScreen/FriendRequestForm";

const FriendsScreen = () => {
  return (
    <ScreenWrapper showOfflineScreen={false}>
      <ScreenHeader title={t("friends")} />
      <FriendRequestForm />
    </ScreenWrapper>
  );
};

export default FriendsScreen;
