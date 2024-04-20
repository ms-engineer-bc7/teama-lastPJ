"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from "react";
import styles from "./banner.module.css";

const IMAGE_URL = "/img/dog.png";

export default function TodayMessageBannar() {
    const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false); // バナー表示の状態を管理
  const [bannerStyle, setBannerStyle] = useState(styles.notificationBanner);
  const bannerRef = useRef(null);

  //idが変更されたときにfetchMessageを呼び出す
  useEffect(() => {
    //バックエンドにイベントIDを送信し、生成されたメッセージを取得する関数
    const fetchTodaysMessage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        //メッセージ生成APIへのリクエスト　"/api/events/today" `/api/events/${id}/generate-message`
        const response = await fetch("/api/events/today" , {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log(`Today Response status: ${response.status}`);

        if (!response.ok) {
          throw new Error("Failed to generate today's message");
        }

        // レスポンスからJSONデータを取得
        const data = await response.json();
        console.log("Today Received data:", data);
         //取得したメッセージ不要な引用符を削除
        setMessage(data.message.replace(/「/g, "").replace(/」/g, ""));
        setShowBanner(true); // バナーを表示
      } catch (error: any) {
        console.error("Failed to load today's message:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodaysMessage(); //関数を呼び出し
  }, []); 


  const handleClose = () => {
    // バナー非表示のアニメーションクラスを追加する
    if (bannerRef.current) {
      bannerRef.current.classList.add(styles.fadeDown);
    }
    // アニメーションが終わるのを待ってから状態を更新
    const animationDuration = 1000; // ここでアニメーションの時間をミリ秒で指定します。
    setTimeout(() => setShowBanner(false), animationDuration);
  };
  
  return (
    <div>
      {showBanner && (
        <div className={styles.notificationContainer}>
          <div
            id="notification-banner"
            className={`${styles.notificationBanner} ${styles.fadeup}`}
            ref={bannerRef}
          >
            <button className={styles.closeButton} onClick={handleClose}>×</button>
            {message}
            <img
              src={IMAGE_URL}
              alt="Commenting Dog"
              className={`${styles.float}`}
            />
          </div>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}
