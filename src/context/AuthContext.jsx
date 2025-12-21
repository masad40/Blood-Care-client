import React, { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { app } from "../firebase/firebaseConfig";
import axios from "axios";

export const AuthContext = createContext(null);

const auth = getAuth(app);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("donor");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
     
        fetchUserRole(currentUser.email);
      } else {
        
        setRole("donor");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  
  const fetchUserRole = async (email) => {
    try {
      const res = await axios.get(`https://blood-donation-server-tan.vercel.app/users/role/${email}`);
      const fetchedRole = res.data?.role || "donor";
      setRole(fetchedRole);
      // console.log("Fetched role from backend:", fetchedRole); 
    } catch (err) {
      console.error("Role fetch error:", err);
      setRole("donor"); 
    } finally {
      setLoading(false);
    }
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    setRole("donor");
    return signOut(auth).finally(() => setLoading(false));
  };

  const updateProfileInfo = (name, photoURL) => {
    if (auth.currentUser) {
      return updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      }).then(() => {
        setUser({ ...auth.currentUser });
      });
    }
    return Promise.reject("No user logged in");
  };
// console.log(user)
  const authInfo = {
    user,
    loading,
    role,
    createUser,
    signInUser,
    logOut,
    updateProfileInfo,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;