import AuthenticatedRoute from "./AuthenticatedRoute";
import HomeScreen from "./HomeScreen";

export default function TabHomeScreen() {
  return (
    <AuthenticatedRoute>
      <HomeScreen />
    </AuthenticatedRoute>
  );
}
