"use client";
import { useRouter } from 'next/navigation';
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";

import { User } from '../../../@type';

export default function Role() {
  const router = useRouter();
  const [authUser] = useAuthState(auth);
  const [user, setUser] = useState<User>()

  const getUserInfo = async () => {
    fetch(`/api/users/${authUser.uid}`, {
      headers: {
        'Authorization': `Bearer ${authUser.accessToken}`
      }
    })
      .then(async res => {
        const data = await res.json();
        setUser(data)
        if (data.role == "") return
        if (data.role == "user") {
          router.push('/calendar');
        } else if (data.role == "partner") {
          router.push('/partner');
        }
      })
      .catch(err => {
        router.push('/login')
      })
  }

  useEffect(() => {
    if (!authUser) return
    getUserInfo()
  }, [authUser])

  const handleWomanClick = () => {
    fetch(`/api/users/${authUser.uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "uid": user?.uid,
        "email": user?.email,
        "role": "user",
      }),
    }).then(res => {
      router.push('/calendar');
    }).catch(err => {
      alert("サーバーエラーです。もう一度やり直してください。")
    })
  };

  const handlePartnerClick = () => {
    fetch(`/api/users/${authUser.uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "uid": user?.uid,
        "email": user?.email,
        "role": "partner",
      }),
    }).then(res => {
      router.push('/partner');
    }).catch(err => {
      alert("サーバーエラーです。もう一度やり直してください。")
    })
  };


  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div>
          <h2 className="text-center mb-6">タイプを選択してください</h2>
          {user && user?.role == "" &&
            <div className="flex flex-col space-y-6">
              <button className="for-woman border-2 border-black hover:border-orange-500 rounded-lg p-4 transition-colors duration-300" onClick={handleWomanClick}>
                <p className="font-bold mb-2" >女性</p>
                <p>
                  治療の記録や治療金額の見積もり、カウンセリングなどを利用できます。
                  <br />
                  また、治療に向けたメッセージも受け取ることができます。
                </p>
              </button>

              <button className="for-partner border-2 border-black hover:border-orange-500 rounded-lg p-4 transition-colors duration-300 mt-2.5" onClick={handlePartnerClick}>
                <p className="font-bold mb-2">パートナー</p>
                <p>
                  女性版で入力されたスケジュールを閲覧できます。
                  <br />
                  また、治療のサポートに向けたメッセージを受け取ることができます。
                </p>
              </button>
            </div>}
        </div>
      </div>
    </>
  );
}
