"use client";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { User } from "../../../@type";
import { LoadingSpinner } from "../_components/LoadingSpinner";

export default function Role() {
  const router = useRouter();
  const [authUser] = useAuthState(auth);
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  const getUserInfo = async () => {
    if (!authUser) {
      return;
    }
    fetch(`/api/users/${authUser.uid}`, {
      headers: {
        Authorization: `Bearer ${authUser.accessToken}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        setUser(data);
        if (data.role == "user") {
          router.push("/calendar");
        } else if (data.role == "partner") {
          router.push("/partner");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        router.push("/login");
      });
  };

  useEffect(() => {
    setIsLoading(true);
    if (!authUser) return;
    getUserInfo();
  }, [authUser]);

  const handleWomanClick = () => {
    setIsLoading(true);
    fetch(`/api/users/${user?.uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: user?.uid,
        email: user?.email,
        role: "user",
      }),
    })
      .then((res) => {
        if (res.status == 200) {
          router.push("/calendar");
          return;
        }
        setIsLoading(false);
        alert("サーバーエラーです。もう一度やり直してください。");
      })
      .catch((err) => {
        alert("サーバーエラーです。もう一度やり直してください。");
      });
  };

  const handlePartnerClick = () => {
    setIsLoading(true);
    fetch(`/api/users/${user?.uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: user?.uid,
        email: user?.email,
        role: "partner",
      }),
    })
      .then((res) => {
        if (res.status == 200) {
          router.push("/partner");
          return;
        }
        setIsLoading(false);
        alert("サーバーエラーです。もう一度やり直してください。");
      })
      .catch((err) => {
        alert("サーバーエラーです。もう一度やり直してください。");
      });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-6">
          {user && user?.role == "" && (
            <>
              <h1 className="text-center mb-6">タイプを選択してください</h1>
              <div
                style={{ marginTop: "15px" }}
                className="flex flex-col space-y-8"
              >
                {/* 女性用ボタン */}
                <button
                  style={{ backgroundColor: "#EDCE7A" }}
                  className="for-woman rounded-lg p-5 pl-4 transition-colors mt-2.5 flex"
                  onClick={handleWomanClick}
                >
                  <div style={{ width: "140px" }} className="mr-6">
                    <img src="/img/role-w.svg" alt="" className="w-full" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-bold mb-2">女性</h2>
                    <p>
                      治療のスケジュール管理や治療金額の見積もり、カウンセリングを利用できます。
                      <br />
                      また、治療に向けたメッセージも受け取ることができます。
                    </p>
                  </div>
                </button>

                {/* パートナー用ボタン */}
                <button
                  style={{ backgroundColor: "#ADCDD0" }}
                  className="for-partner rounded-lg p-5 pl-4 transition-colors mt-2.5 flex"
                  onClick={handlePartnerClick}
                >
                  <div style={{ width: "140px" }} className="mr-6">
                    <img src="/img/role-p.svg" alt="" className="w-full" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-bold mb-2">パートナー</h2>
                    <p>
                      女性版で入力されたスケジュールの閲覧と、カウンセリングの利用ができます。
                      <br />
                      また、治療のサポートに向けたメッセージを受け取ることができます。
                    </p>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
        {isLoading && <LoadingSpinner />}
      </div>
    </>
  );
}
