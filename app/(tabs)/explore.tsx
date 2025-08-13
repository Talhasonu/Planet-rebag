import AuthenticatedRoute from "../../components/AuthenticatedRoute";
import DealScreen from "../../components/DealScreen/DealScreen";

export default function TabDealScreen() {
  return (
    <AuthenticatedRoute>
      <DealScreen />
    </AuthenticatedRoute>
  );
}
