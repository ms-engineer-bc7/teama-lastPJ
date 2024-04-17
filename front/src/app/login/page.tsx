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
  const [duser, setDuser] = useState<User>()
  useEffetc(() => {
    fetch("/api/user/?uid=").then(res => setDuser(res.json()))
  })
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
        router.push("/role");
      } else {
        throw new Error("Failed to save user data");
      }
    } catch (error) {
      console.error("サインインに失敗しました:", error);
      router.push("/error");
    }
  };
  return (
    // 親のdivをflexコンテナとして定義
    <div className="flex min-h-screen bg-white">
      {/* 画像のdiv */}
      <div className="w-1/2 flex justify-center items-center">
        <img src="/toppage.png" alt="toppage-image" />
      </div>

      {/* ボタンのdiv */}
      <div className="w-1/2 flex flex-col justify-center items-center">
        {/* 新規登録ボタン */}
        <button
          className="mb-4 rounded-md bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-600"
          onClick={signInWithGoogle}
        >
          新規登録
        </button>

        {/* グーグルでログインボタン */}
        <button
          className="rounded-md bg-green-300 px-6 py-3 text-sm font-semibold text-white hover:bg-green-400"
          onClick={signInWithGoogle}
        >
          グーグルでログイン
        </button>

        {/* トップページに戻るリンク */}
        <p className="mt-5">
          <Link href="/">トップページに戻る</Link>
        </p>
      </div>
    </div>
  );
}

