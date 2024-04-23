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
      <div className="h-screen w-5/12 overflow-hidden flex-shrink-0">
        {/* <div className="h-screen overflow-hidden flex-shrink-0"> */}
        <img
          src="/img/login.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* アプリ紹介、ボタン */}
      <div
        style={{ paddingLeft: "150px", paddingRight: "150px" }}
        className="flex flex-col justify-center items-center flex-grow px-15"
      >
        {/* アプリ紹介 */}
        <p>
          Sharecle（シェアクル）は、不妊治療のあゆみをサポートするアプリ。
          <br />
          パートナーや職場とのコミュニケーションをスムーズにするカレンダー機能により、治療スケジュールを一目で把握。
          身体や心に寄り添ったメッセージで毎日を励まし、カップルでのカウンセリングを通じて、理解と共感を深めるサポートを提供します。
          <br />
          不妊治療の道のりを、もっと心強く支えられるように。
        </p>

        {/* 横線 */}
        <hr
          style={{
            width: "100%",
            borderColor: "#d1d5db",
            borderWidth: "1px",
            marginTop: "50px",
            marginBottom: "50px",
          }}
        />

        {/* 新規登録・ログイン */}
        <button
          className="bg-[#17274d] hover:bg-[#20317a] rounded-full px-6 py-4 text-sm font-semibold text-white"
          onClick={signInWithGoogle}
        >
          Google で 新規登録 &emsp; / &emsp; ログイン
        </button>

        {/* トップページへ */}
        {/* <p>
          <Link href="/">トップページに戻る</Link>
        </p> */}
      </div>
    </div>
  );
}
