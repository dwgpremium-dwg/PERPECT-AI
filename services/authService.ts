import { User, UserRole } from '../types';
import { db } from '../firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc, 
  deleteDoc,
  Timestamp 
} from "firebase/firestore";

const CURRENT_USER_KEY = 'perpect_ai_current_user';
const USERS_COLLECTION = 'users';

// --- DATABASE OPERATIONS ---

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        username: data.username,
        password: data.password,
        role: data.role as UserRole,
        isActive: data.isActive,
        expirationDate: data.expirationDate,
      });
    });
    
    // Safety check: ensure admin exists in UI even if DB is empty initially
    if (!users.find(u => u.username === 'admin')) {
        // Only for fallback display, real admin should be in DB
        console.warn("No admin found in DB. Please create an admin user in Firestore manually.");
    }
    
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const saveUser = async (user: User): Promise<void> => {
  try {
    // Check if updating or creating
    if (user.id && user.id.length > 20) { // Firestore IDs are usually long strings
      // Update existing
      const userRef = doc(db, USERS_COLLECTION, user.id);
      await updateDoc(userRef, {
        password: user.password,
        isActive: user.isActive,
        expirationDate: user.expirationDate || null
      });
    } else {
      // Create new
      // Check for duplicate username first
      const q = query(collection(db, USERS_COLLECTION), where("username", "==", user.username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        throw new Error("Username already exists");
      }

      await addDoc(collection(db, USERS_COLLECTION), {
        username: user.username,
        password: user.password,
        role: user.role,
        isActive: user.isActive,
        expirationDate: user.expirationDate || null,
        createdAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, USERS_COLLECTION, userId));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// --- AUTHENTICATION ---

export const login = async (username: string, password: string): Promise<User | null> => {
  try {
    // 1. Query Firestore for user
    const q = query(
      collection(db, USERS_COLLECTION), 
      where("username", "==", username),
      where("password", "==", password) // Note: In production, hash passwords!
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Fallback for Hardcoded Initial Admin if DB is not set up yet
      if (username === 'admin' && password === '1234') {
          return {
            id: 'local-admin',
            username: 'admin',
            role: UserRole.ADMIN,
            isActive: true,
            isOnline: true
          };
      }
      return null;
    }

    const docData = querySnapshot.docs[0].data();
    const userId = querySnapshot.docs[0].id;
    const user: User = {
      id: userId,
      username: docData.username,
      password: docData.password,
      role: docData.role as UserRole,
      isActive: docData.isActive,
      expirationDate: docData.expirationDate,
      isOnline: true
    };

    // 2. Check Status
    if (!user.isActive) return null;

    // 3. Check Expiration
    if (user.expirationDate) {
      const today = new Date();
      const expDate = new Date(user.expirationDate);
      // Reset time parts for accurate date comparison
      today.setHours(0,0,0,0);
      expDate.setHours(0,0,0,0);
      
      if (expDate < today) return null;
    }

    // 4. Set Session
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;

  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const generateId = () => "temp_" + Math.random().toString(36).substr(2, 9);