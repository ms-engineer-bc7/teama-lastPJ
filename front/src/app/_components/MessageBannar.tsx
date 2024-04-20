"use client";
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from "react";
import styles from "./banner.module.css";

type MessageBannerProps = {
  id: string;
  messages: {
    alert_message_for_u: string;
    alert_message_for_p: string;
  };
  role: 'user' | 'partner';
};

export default function MessageBannar({ id, messages, role }: MessageBannerProps) {
  const pathname = usePathname(); // usePathnameフックを使用
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false); // バナー表示の状態を管理
  const [bannerStyle, setBannerStyle] = useState(styles.notificationBanner);
  const [imageURL, setImageURL] = useState('/img/dog.png'); 
  const bannerRef = useRef(null);

  //ユーザーとパートナーでフキダシ色（CSS）・画像変更
  useEffect(() => {
    if  (pathname === "/calendar" && role === 'user') { //ユーザー用カレンダー
      setShowBanner(true); // バナーを表示
      // ユーザー用メッセージ、不要な引用符を削除
      setMessage(messages.alert_message_for_u.replace(/「|」/g, "")); 
      setBannerStyle(`${styles.notificationBanner} ${styles.userBanner}`);
      setImageURL("/img/dog.png"); // 画像URL
    } else if (pathname === "/partner" && role === 'partner') { //パートナー用カレンダー
      setShowBanner(true); // バナーを表示
      // パートナー用メッセージ、不要な引用符を削除
      setMessage(messages.alert_message_for_p.replace(/「|」/g, "")); 
      setBannerStyle(`${styles.notificationBanner} ${styles.partnerBanner}`);
      setImageURL("/img/lady.png"); // 画像URL
    } else {
      setShowBanner(true); // バナーを表示
      setBannerStyle(styles.notificationBanner);
    }
  }, [id, role, messages]);


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
            className={`${bannerStyle} ${styles.fadeup}`}
            ref={bannerRef}
          >
            <button className={styles.closeButton} onClick={handleClose}>×</button>
            {message}
            <img
              src={imageURL} // 状態から画像のURLを設定
              alt="Commenting icon"
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
