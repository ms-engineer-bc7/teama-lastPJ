"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { User } from "../../../@type";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";

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
    href: "/partner",
    icon: <FontAwesomeIcon icon={faCalendar} style={{ fontSize: "21px" }} />,
  },
  {
    name: "Counseling",
    href: "/partnerCounseling",
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

export default function PartnerMenu(props: MenuProps) {
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
  const router = useRouter();

  // ログアウトボタンを押したときの処理
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

  const handleMenuItemClick = (href: string) => {
    setActiveMenuItem(href);
  };

  return (
    <div className="menu-container shadow-md h-full bg-[#adcdd0]">
      {/* 管理画面 プロフィール */}
      <div className="flex flex-col justify-center items-center w-full px-12 py-10">
        <div className="avatar mr-3">
          <Image
            src="/img/profile_partner.svg"
            alt="Avatar"
            width={200}
            height={200}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold mt-3 text-white">
            {props.user?.name}
          </h3>
          <p className="text-sm mt-2 text-white">
            {props.user?.role == "user" ? "女性" : "パートナー"}
          </p>
        </div>
      </div>

      {/* メニュー */}
      <div className="flex flex-col items-center text-white">
        <nav className="menu bg-[#adcdd0] p-3 rounded-lg">
          {menuItems.map((item, index) =>
            // Logoutの項目だけ特別な処理を行う
            item.name === "Logout" ? (
              <a
                key={index}
                href={item.href}
                className={`menu-item flex items-center p-3 px-9 rounded transition-colors duration-200 ease-in-out mt-4 mb-7 ${
                  activeMenuItem === item.href
                    ? "text-black bg-white hover:shadow-md" // クリックしたとき
                    : "hover:bg-white hover:text-black hover:shadow-md" // ホバーしたとき
                }`}
                onClick={(e) => {
                  e.preventDefault(); // ページ遷移を防ぐ
                  handleClick(item.href);
                }}
                // onClick={() => handleClick(item.href)} // handleClickを呼び出す
              >
                <div
                  className="icon w-10 flex justify-center items-center"
                  style={{
                    color: activeMenuItem === item.href ? "#000000" : undefined, // メニューがアクティブなとき
                  }}
                >
                  {item.icon}
                </div>
                <span className="ml-3 text-lg font-medium">{item.name}</span>
              </a>
            ) : (
              <Link href={item.href} key={index} legacyBehavior>
                <a
                  className={`menu-item flex items-center p-3 px-9 rounded transition-colors duration-200 ease-in-out mt-4 mb-7 ${
                    activeMenuItem === item.href
                      ? "text-black bg-white hover:shadow-md" // クリックしたとき
                      : "hover:bg-white hover:text-black hover:shadow-md" // ホバーしたとき
                  }`}
                  onClick={() => handleClick(item.href)}
                  // onMouseEnterとonMouseLeaveのイベントハンドラはそのままにする
                >
                  <div
                    className="icon w-10 flex justify-center items-center"
                    style={{
                      color:
                        activeMenuItem === item.href ? "#000000" : undefined,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span className="ml-3 text-lg font-medium">{item.name}</span>
                </a>
              </Link>
            )
          )}
        </nav>
      </div>
    </div>
  );
}
