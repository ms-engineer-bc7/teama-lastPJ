"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import { User } from "../../../@type";

type MenuProps = {
  user?: User;
};

interface MenuItem {
  name: string;
  href: string;
  icon?: React.ReactElement;
}

const menuItems: MenuItem[] = [
  {
    name: "Calendar",
    href: "/calendar",
    icon: <FontAwesomeIcon icon={faCalendar} style={{ fontSize: "21px" }} />,
  },
  {
    name: "Price",
    href: "/price",
    icon: (
      <FontAwesomeIcon
        icon={faHandHoldingDollar}
        style={{ fontSize: "21px" }}
      />
    ),
  },
  {
    name: "Counseling",
    href: "/counseling",
    icon: <FontAwesomeIcon icon={faHeart} style={{ fontSize: "21px" }} />,
  },
  {
    name: "Logout",
    href: "/logout",
    icon: (
      <FontAwesomeIcon
        icon={faArrowRightFromBracket}
        style={{ fontSize: "21px" }}
      />
    ),
  },
];

export default function Menu(props: MenuProps) {
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
  const router = useRouter();

  // ログインボタンを押したときの処理
  const handleClick = (href: string) => {
    if (href === "/logout") {
      auth
        .signOut()
        .then(() => {
          // サインアウト成功後、ログイン画面に遷移
          router.push("/login");
        })
        .catch((error) => {
          console.error("Sign out error", error);
        });
    } else {
      setActiveMenuItem(href);
    }
  };

  // メニューをクリックしたときの処理
  const handleMenuItemClick = (href: string) => {
    setActiveMenuItem(href);
  };

  return (
    <div className="menu-container shadow-md h-full bg-[#EDCE7A]">
      {/* 管理画面 プロフィール */}
      <div className="flex flex-col justify-center items-center w-full mb-5 px-12 py-10 bg-[#EDCE7A]">
        <Link href={"/dashboard"}>
          <div className="avatar mr-3">
            <Image
              src="/img/profile.svg"
              alt="Avatar"
              width={200}
              height={200}
              className="rounded-full"
            />
          </div>
        </Link>
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold mt-3 text-white">
            {props.user?.name}
          </h3>
          <p className="text-sm mt-2 text-white">
            {props.user?.role == "partner" ? "パートナー" : "女性"}
          </p>
        </div>
      </div>

      {/* メニュー */}
      <div className="flex flex-col items-center mt-6 text-white">
        <nav className="menu p-3 rounded-lg w-full">
          {menuItems.map((item, index) => (
            <Link href={item.href} key={index} legacyBehavior>
              <a
                className={`menu-item flex items-center p-3 px-9 rounded-tr-lg rounded-br-lg transition-colors duration-200 ease-in-out mt-4 mb-7 hover:bg-white ${
                  activeMenuItem === item.href
                    ? "hover:bg-white text-white"
                    : "hover:bg-white hover:text-black hover:shadow-md"
                }`}
                style={{
                  // zIndexは親要素に対してrelativeが適用されていることを前提としています
                  position: "relative",
                  zIndex: 1,
                }}
                onClick={() => handleClick(item.href)}
              >
                {/* 擬似要素と同じ機能をするspanタグを追加します */}
                <span
                  className="absolute inset-0 transition-all ease-in-out duration-200"
                  style={{
                    // zIndexを使って背景色のspanタグをコンテンツの下に配置します
                    zIndex: -1,
                    // メニュー項目のactive状態に応じて背景色を設定します
                    backgroundColor:
                      activeMenuItem === item.href ? "#FFFFFF" : "#EDCE7A",
                    // ホバー時の背景色の変化はspanタグのクラスを変更することで対応します
                    borderRadius: "0.5rem",
                  }}
                ></span>
                {/* ここにアイコンとテキスト */}
                <div
                  className="icon w-10 flex justify-center items-center"
                  style={{
                    color: activeMenuItem === item.href ? "#FFFFFF" : undefined,
                  }}
                >
                  {item.icon}
                </div>
                <span className="ml-3 text-lg font-medium">{item.name}</span>
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
