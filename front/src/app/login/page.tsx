"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserInfo } from "../fetch";

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
      // databaseにデータが存在しているか確認
      const res = await getUserInfo(result.user);

      // 404の場合、ユーザーを作成
      if (res.status == 404) {
        // APIを呼び出してユーザーデータをサーバーに送信
        const response = await fetch("/api/users/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
          .then((res) => {
            router.push("/role");
          })
          .catch((err) => alert("ユーザーの作成に失敗しました。"));
      } else {
        // 画面遷移
        console.log(res);
        const data = await res.json();
        if (data.role === "") router.push("/role");
        if (data.role === "user") router.push("/calendar");
        if (data.role === "partner") router.push("/partner");
      }
    } catch (error) {
      console.error("サインインに失敗しました:", error);
      redirect("/error");
    }
  };
  return (
    <div className="flex min-h-screen w-full">
      {/* 左側画像 */}
      <div className="h-screen overflow-hidden flex-shrink-0">
        <img src="/img/login.svg" alt="" className="" />
      </div>

      {/* ボタン */}
      <div className="flex flex-col justify-center items-center flex-grow">
        {/* 新規登録・ログイン */}
        <button
          style={{
            marginBottom: "50px",
            marginTop: "50px",
            backgroundColor: "#8883a4",
          }}
          className="rounded-md px-6 py-3 text-sm font-semibold text-white hover:bg-green-400"
          onClick={signInWithGoogle}
        >
          Google で 新規登録 / ログイン
        </button>

        {/* トップページへ */}
        <p>
          <Link href="/">トップページに戻る</Link>
        </p>
      </div>
    </div>
  );
}
