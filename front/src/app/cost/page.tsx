"use client";
import React, { useState, useEffect } from "react";//
import { useRouter } from "next/navigation";
import { auth } from "../firebase";//
import { useAuthState } from "react-firebase-hooks/auth";//
import { getUserInfo } from "../fetch";//
import { User } from "../../../@type";//
import Menu from "../_components/Menu";

export default function Cost() {
  const router = useRouter();//
  const [authUser] = useAuthState(auth);//
  const [user, setUser] = useState<User>();//
  const [isLoading, setIsLoading] = useState(false);//
  const [name, setName] = useState<string>("");//

  // ユーザー名の取得・メニューバーに表示
  // return文　<div>で囲み<Menu user={user}/>を入れる
  useEffect(() => {
    if (!authUser) return; //authUserがnullまたは未定義の場合、何もしない
    getUserInfo(authUser)
      .then(async (res) => {
        const data = await res.json();
        setUser(data);
        setName(data.name);
        console.log("ログイン中のユーザー名:",data.name); //ログイン中のユーザー名確認
        if (data.role == "") router.push("/role");
        if (data.role == "partner") router.push("/partner");
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("ユーザー情報取得エラー:", err);
      });
    },[authUser]) //authUserにすることでリロードしても表示される

  return (
    <div className="flex w-full bg-[#F4F1EA]">
      <div className="flex-shrink-0 sticky top-0">
        <Menu user={user}/>
      </div>

      {/* 金額目安 */}
      <div className="flex-grow flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2 pt-8 mb-6">治療金額目安</h1>
        <div className="flex justify-center items-start items-stretch flex-wrap">
          {/* ----- 人工授精 ----- */}
          <div className="flex flex-col items-center px-10 py-6 w-[290px] m-4 bg-white rounded-[35px] shadow-md">
            <img
              src="/img/price-1.svg"
              alt="人工授精"
              className="w-[190px] mb-6"
            />
            <h2 className="text-2xl font-extrabold mb-9">人工授精</h2>
            <h3 className="text-base font-extrabold mb-2">- 自費診療 -</h3>
            <ul className="mb-[170px]">
              <li className="flex items-center">
                <span className="text-sm">・診察、検査、薬代：30,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・人工授精1回：20,000円</span>
              </li>
            </ul>
            <div className="text-2xl font-bold border-b-2 w-[200px] text-center border-gray-300 pb-[37px] mb-10 text-[#ee9b00]">
              50,000円
            </div>
            <h3 className="text-base font-extrabold mb-2">- 保険適用 -</h3>
            <ul className="mb-[299px]">
              <li className="flex items-center">
                <span className="text-sm">・診察、検査、薬代：9,500円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・人工授精1回：5,460円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・一般不妊管理料：750円</span>
              </li>
            </ul>
            <div className="text-2xl font-bold pb-3 mt-1 text-[#ee9b00]">
              15,710円
            </div>
          </div>

          {/* ----- 体外受精 ----- */}
          <div className="flex flex-col items-center px-10 py-6 w-[290px] m-4 bg-white rounded-[35px] shadow-md">
            <img
              src="/img/price-2.svg"
              alt="体外受精"
              className="w-[190px] mb-6"
            />
            <h2 className="text-2xl font-extrabold mb-9">体外受精</h2>

            {/* 体外受精 自費診療 */}
            <h3 className="text-base font-extrabold mb-2">- 自費診療 -</h3>
            <ul className="mb-4">
              <li className="flex items-center">
                <span className="text-sm font-bold">＜採卵＞</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・診察、検査、薬代：70,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・採卵10個：104,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・体外受精：42,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・培養5個：60,000円</span>
              </li>
              <li className="flex items-center mb-3">
                <span className="text-sm">・胚凍結5個：70,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm font-bold">＜移植＞</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・診察、検査、薬代：50,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・凍結融解移植：120,000円</span>
              </li>
            </ul>
            <div className="mt-1 text-2xl font-bold border-b-2 w-[200px] text-center border-gray-300 pb-9 mb-9 text-[#ee9b00]">
              516,000円
            </div>

            {/* 体外授精 保険適用 */}
            <h3 className="text-base font-extrabold mb-2">- 保険適用 -</h3>
            <ul className="mb-6">
              <li className="flex items-center">
                <span className="text-sm font-bold">＜採卵＞</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・診察、検査、薬代：35,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・採卵10個：31,200円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・体外受精：12,600円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・培養5個：18,000円</span>
              </li>
              <li className="flex items-center mb-3">
                <span className="text-sm">・胚凍結5個：21,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm font-bold">＜移植＞</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・診察、検査、薬代：15,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・凍結融解移植：36,000円</span>
              </li>
            </ul>

            {/* 体外受精 適用条件 */}
            <h3 className="text-base font-extrabold mb-2">- 適用条件 -</h3>
            <ul className="mb-4">
              <li className="flex items-center">
                <span className="text-sm">
                  ・治療開始時の妻の年齢が40歳未満：1子につき最大6回まで
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">
                  ・治療開始時の妻の年齢が40歳以上43歳未満：1子につき最大3回まで
                </span>
              </li>
            </ul>
            <div className="text-2xl font-bold pb-3 mt-1 text-[#ee9b00]">
              168,800円
            </div>
          </div>

          {/* ----- 顕微授精 ----- */}
          <div className="flex flex-col items-center px-10 py-6 w-[290px] m-4 bg-white rounded-[35px] shadow-md">
            <img
              src="/img/price-3.svg"
              alt="顕微授精"
              className="w-[190px] mb-6"
            />
            <h2 className="text-2xl font-extrabold mb-9">顕微授精</h2>

            {/* 顕微授精 自費診療 */}
            <h3 className="text-base font-extrabold mb-2">- 自費診療 -</h3>
            <ul className="mb-4">
              <li className="flex items-center">
                <span className="text-sm font-bold">＜採卵＞</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・診察、検査、薬代：70,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・採卵10個：104,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・顕微受精：128,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・培養5個：60,000円</span>
              </li>
              <li className="flex items-center mb-3">
                <span className="text-sm">・胚凍結5個：70,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm font-bold">＜移植＞</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・診察、検査、薬代：50,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・凍結融解移植：120,000円</span>
              </li>
            </ul>
            <div className="mt-1 text-2xl font-bold border-b-2 w-[200px] text-center border-gray-300 pb-9 mb-9 text-[#ee9b00]">
              602,000円
            </div>

            {/* 顕微授精 保険適用 */}
            <h3 className="text-base font-extrabold mb-2">- 保険適用 -</h3>
            <ul className="mb-6">
              <li className="flex items-center">
                <span className="text-sm font-bold">＜採卵＞</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・診察、検査、薬代：35,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・採卵10個：31,200円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・顕微受精：38,400円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・培養5個：18,000円</span>
              </li>
              <li className="flex items-center mb-3">
                <span className="text-sm">・胚凍結5個：21,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm font-bold">＜移植＞</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・診察、検査、薬代：15,000円</span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">・凍結融解移植：36,000円</span>
              </li>
            </ul>

            {/* 適用条件 */}
            <h3 className="text-base font-extrabold mb-2">- 適用条件 -</h3>
            <ul className="mb-4">
              <li className="flex items-center">
                <span className="text-sm">
                  ・治療開始時の妻の年齢が40歳未満：1子につき最大6回まで
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-sm">
                  ・治療開始時の妻の年齢が40歳以上43歳未満：1子につき最大3回まで
                </span>
              </li>
            </ul>
            <div className="mt-1 text-2xl font-bold pb-3 mt-2 text-[#ee9b00]">
              194,600円
            </div>
          </div>
        </div>

        {/* 注意書き */}
        <div className="flex justify-end w-[965px]">
          <p className="text-sm mt-5 mb-12">
            ※金額は病院や個人によって異なるため、あくまで目安です。
          </p>
        </div>
      </div>
    </div>
  );
}