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
      // サインイン成功時の処理
      await signInWithPopup(auth, provider);
      // 成功後、カレンダーページへリダイレクト
      router.push("/calendar");
    } catch (error) {
      // サインイン失敗時の処理
      console.error("サインインに失敗しました:", error);
      // エラーページへリダイレクト
      redirect("/error");
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
