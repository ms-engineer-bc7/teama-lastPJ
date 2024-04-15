"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./banner.module.css";

export default function MessageBannar({ id }: { id: string }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false); // バナー表示の状態を管理
  const bannerRef = useRef(null);

  //idが変更されたときにfetchMessageを呼び出す
  useEffect(() => {
    //バックエンドにイベントIDを送信し、生成されたメッセージを取得する関数
    const fetchMessage = async () => {
      if (!id) return; // idがない場合は処理をスキップ

      setIsLoading(true);
      setError(null);

      try {
        //メッセージ生成APIへのリクエスト
        const response = await fetch(`/api/events/${id}/generate-message`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
          throw new Error("Failed to generate message");
        }

        // レスポンスからJSONデータを取得
        const data = await response.json();
        console.log("Received data:", data);
        setMessage(data.message); // 取得したメッセージを状態に設定
        setShowBanner(true); // バナーを表示

        // 5秒後にバナーを非表示 今は短めに設定
        setTimeout(() => {
          hideBanner();
        }, 5000);
      } catch (error: any) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage(); //関数を呼び出し
  }, [id]); //idが変更された時にuseEffectを実行

  // バナー　CSSフェードアウトと同時に上にスライドして消えるアニメーション追加
  //バナーを非表示にする関数
  const hideBanner = () => {
    const banner = document.getElementById("notification-banner");
    if (banner) {
      banner.style.opacity = "0"; // バナーをフェードアウト
      banner.style.transform = "translateY(-100%)"; // バナーをスライドアップ
      setTimeout(() => {
        // アニメーションの完了を1秒後に待つ
        setShowBanner(false);
      }, 1000); // アニメーションの完了後にバナーの状態を非表示に設定
    }
  };

  return (
    <div>
      {showBanner && (
        <div
          id="notification-banner"
          className={`fixed top-0 inset-x-0 bg-blue-500 text-white text-sm p-4 text-center shadow-md z-50 ${styles.notificationBanner}`}
          ref={bannerRef}
        >
          {message}
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}
