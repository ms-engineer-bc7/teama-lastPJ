"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Login() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const userData = {
        name: result.user.displayName,
        uid: result.user.uid,
        email: result.user.email,
      };

      // APIを呼び出してユーザーデータをサーバーに送信
      const response = await fetch("/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      console.log("Google認証時レスポンス", response);

      if (response.ok) {
        console.log("response.ok:", response.ok);
        console.log("Google認証時POSTされたデータ:", userData);
        router.push("/calendar");
      } else {
        throw new Error("Failed to save user data");
      }
    } catch (error) {
      console.error("サインインに失敗しました:", error);
      router.push("/error");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <button
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white"
          onClick={signInWithGoogle}
        >
          ログイン
        </button>
        <p className="mt-5">
          <Link href="/">トップページに戻る</Link>
        </p>
      </div>
    </>
  );
}
