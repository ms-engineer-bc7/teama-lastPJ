"use client";

import { useState } from "react";
import styles from "./banner.module.css";

export default function messageBannar() {
  const [message, setMessage] = useState("");
  const [showBanner, setShowBanner] = useState(false); // バナー表示の状態を管理
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // バナー　CSSフェードアウトと同時に上にスライドして消えるアニメーション追加
  //バナーを非表示にする関数
  const hideBanner = () => {
    const banner = document.getElementById("notification-banner");
    if (banner) {
      banner.style.opacity = "0";
      banner.style.transform = "translateY(-100%)";
      setTimeout(() => {
        // アニメーションの完了を1秒後に待つ
        setShowBanner(false);
      }, 1000); // アニメーションの完了後にバナーの状態を非表示に設定
    }
  };

  // メッセージを非同期に取得する
  const fetchMessage = async (eventId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // const eventId = 2; // 適切なイベントIDに置き換える
      const response = await fetch(`/api/generate-message?eventId=${eventId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error("Failed to generate message");
      }

      // レスポンスのJSONを解析
      const data = await response.json();
      console.log("Received data:", data);
      setMessage(data.message);
      setShowBanner(true); // バナーを表示

      // 3秒後にバナーを非表示 今は短めに設定
      setTimeout(() => {
        hideBanner();
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => fetchMessage(2)}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
      >
        {isLoading ? "保存中..." : "保存する"}
      </button>
      {showBanner && (
        <div
          id="notification-banner"
          className={`fixed top-0 inset-x-0 bg-blue-500 text-white text-sm p-4 text-center shadow-md z-50 ${styles.notificationBanner}`}
        >
          {message}
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
