import { auth, db } from "@/utils/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

// User info interface based on the app usage
interface UserInfo {
  uid: string;
  email: string;
  role: string;
  status?: string;
  name?: string;
  phone?: string;
  photoURL?: string;
  [key: string]: any; // For any additional fields
}

// Auth context type
interface AuthContextType {
  user: User | null;
  userInfo: UserInfo | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfileImage: (imageUrl: string) => void;
  refreshUserData: () => Promise<void>;
  // Computed properties for easier access
  profileImageUri?: string;
  userInitials?: string;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      await fetchUserData(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (firebaseUser: User | null) => {
    try {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Fetch additional user info from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInfo({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            role: userData.role || "user",
            status: userData.status || "enabled",
            name: userData.name || userData.fullName,
            phone: userData.phone || userData.phoneNumber,
            photoURL: userData.photoURL || firebaseUser.photoURL,
            ...userData,
          });
        } else {
          // Fallback user info if no document exists
          setUserInfo({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            role: "user", // Default role
            status: "enabled", // Default status
            photoURL: firebaseUser.photoURL || undefined,
          });
        }
      } else {
        setUser(null);
        setUserInfo(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileImage = (imageUrl: string) => {
    if (userInfo) {
      setUserInfo({
        ...userInfo,
        photoURL: imageUrl,
      });
    }
  };

  const refreshUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setLoading(true);
      await fetchUserData(currentUser);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await auth.signOut();
      setUser(null);
      setUserInfo(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Helper function to get initials from name
  const getInitials = (name?: string, email?: string): string => {
    if (name) {
      const names = name.trim().split(/\s+/);
      if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
      }
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(
        0
      )}`.toUpperCase();
    }

    if (email) {
      return email.charAt(0).toUpperCase();
    }

    return "U"; // Default fallback
  };

  const value: AuthContextType = {
    user,
    userInfo,
    loading,
    signOut,
    updateProfileImage,
    refreshUserData,
    profileImageUri: userInfo?.photoURL,
    userInitials: getInitials(userInfo?.name, userInfo?.email),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
