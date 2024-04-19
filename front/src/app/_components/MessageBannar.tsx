"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./banner.module.css";

const IMAGE_URL = "/img/dog.png";

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
        setMessage(data.message.substring(0, 200)); //取得したメッセージ200文字
        setShowBanner(true); // バナーを表示
      } catch (error: any) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessage(); //関数を呼び出し
  }, [id]); //idが変更された時にuseEffectを実行


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
