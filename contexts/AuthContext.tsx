import { auth } from "@/utils/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isEmailVerified: boolean;
  profileImageUri: string | null;
  userInitials: string;
  updateProfileImage: (newImageUri: string) => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isEmailVerified: false,
  profileImageUri: null,
  userInitials: "A",
  updateProfileImage: () => {},
  refreshUserData: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string>("A");
  const db = getFirestore();

  const fetchUserData = async (currentUser: User) => {
    try {
      // Set initial data from Firebase Auth
      if (currentUser.photoURL) {
        setProfileImageUri(currentUser.photoURL);
      }

      const displayName = currentUser.displayName;
      const email = currentUser.email;

      if (displayName) {
        const nameInitials = displayName
          .split(" ")
          .map((name) => name.charAt(0).toUpperCase())
          .join("")
          .substring(0, 2);
        setUserInitials(nameInitials);
      } else if (email) {
        setUserInitials(email.charAt(0).toUpperCase());
      }

      // Try to get additional data from Firestore
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          if (userData.photoURL) {
            setProfileImageUri(userData.photoURL);
          }

          const fullName = userData.fullName || userData.name;
          if (fullName) {
            const nameInitials = fullName
              .split(" ")
              .map((name: string) => name.charAt(0).toUpperCase())
              .join("")
              .substring(0, 2);
            setUserInitials(nameInitials);
          }
        }
      } catch (firestoreError) {
        console.log(
          "Could not fetch user data from Firestore:",
          firestoreError
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user);
    }
  };

  const updateProfileImage = (newImageUri: string) => {
    setProfileImageUri(newImageUri);
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser);
      } else {
        setUser(null);
        setProfileImageUri(null);
        setUserInitials("A");
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const isEmailVerified = user?.emailVerified || false;

  const value: AuthContextType = {
    user,
    loading,
    isEmailVerified,
    profileImageUri,
    userInitials,
    updateProfileImage,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
