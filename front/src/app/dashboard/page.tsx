"use client";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

interface UserDetails {
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // ユーザーがログインしている場合、ユーザー情報をAPIから取得
          const token = await firebaseUser.getIdToken();
          const response = await fetch(`/api/user/${firebaseUser.uid}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data: UserDetails = await response.json();
          setUserDetails(data);
        } catch (error) {
          console.error("Fetching user data failed", error);
        }
      }
    });

    // コンポーネントがアンマウントされた時にリスナーを解除
    return unsubscribe;
  }, []);

  return (
    <div>
      {userDetails ? (
        <div>
          <h1>Dashboard</h1>
          <p>Name: {userDetails.name}</p>
          <p>Email: {userDetails.email}</p>
          <p>Role: {userDetails.role}</p>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
}
