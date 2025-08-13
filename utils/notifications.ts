// Notification utility functions
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Sends a status change notification to a user
 * @param userId - The ID of the user to notify
 * @param userName - The name of the user
 * @param newStatus - The new status ('active' or 'inactive')
 * @returns Promise<boolean> - Returns true if notification was sent successfully
 */
export const sendStatusChangeNotification = async (
  userId: string,
  userName: string,
  newStatus: string
): Promise<boolean> => {
  try {
    // Get user document to check if they exist and get notification preferences
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (!userDoc.exists()) {
      console.error("User not found:", userId);
      return false;
    }

    const userData = userDoc.data();
    const userEmail = userData.email;

    // Create notification document in Firestore
    const notificationData = {
      userId,
      userName,
      userEmail,
      type: "status_change",
      title: "Account Status Changed",
      message: `Your account has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
      status: newStatus,
      timestamp: serverTimestamp(),
      read: false,
    };

    // Add notification to the notifications collection
    await addDoc(collection(db, "notifications"), notificationData);

    // Here you could add additional notification methods like:
    // - Email notification
    // - Push notification
    // - SMS notification
    // For now, we'll just store it in Firestore

    console.log(`Notification sent to ${userName} (${userEmail}) about status change to ${newStatus}`);
    return true;
  } catch (error) {
    console.error("Error sending status change notification:", error);
    return false;
  }
};

/**
 * Sends a general notification to a user
 * @param userId - The ID of the user to notify
 * @param title - The notification title
 * @param message - The notification message
 * @param type - The type of notification (optional)
 * @returns Promise<boolean> - Returns true if notification was sent successfully
 */
export const sendNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string = "general"
): Promise<boolean> => {
  try {
    const notificationData = {
      userId,
      type,
      title,
      message,
      timestamp: serverTimestamp(),
      read: false,
    };

    await addDoc(collection(db, "notifications"), notificationData);
    console.log(`Notification sent to user ${userId}: ${title}`);
    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
};

/**
 * Gets unread notifications for a user
 * @param userId - The ID of the user
 * @returns Promise<any[]> - Array of unread notifications
 */
export const getUserNotifications = async (userId: string): Promise<any[]> => {
  try {
    // This would typically involve querying the notifications collection
    // For now, return an empty array as a placeholder
    return [];
  } catch (error) {
    console.error("Error getting user notifications:", error);
    return [];
  }
};
