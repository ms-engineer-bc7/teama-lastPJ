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
  user?: User
}

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
    <div className="menu-container rounded-lg shadow-md min-h-screen">
      {/* 管理画面 プロフィール */}
      <div
        style={{ backgroundColor: "#83B99C" }}
        className="flex flex-col justify-center items-center w-full mb-5 px-12 py-10"
      >
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
          <h3 className="text-lg font-bold mt-3 text-white">{props.user?.name}</h3>
          <p className="text-sm mt-2 text-white">{props.user?.role == 'partner' ? 'パートナー' : '女性'}</p>
        </div>
      </div>

      {/* メニュー */}
      <div className="flex flex-col items-center mt-6">
        <nav className="menu bg-white p-3 rounded-lg">
          {menuItems.map((item, index) =>
            // Logoutの項目だけ特別な処理を行う
            item.name === "Logout" ? (
              <a
                key={index}
                href={item.href}
                className={`menu-item flex items-center p-3 px-9 rounded transition-colors duration-200 ease-in-out mt-4 mb-7 ${activeMenuItem === item.href
                  ? "bg-[#83B99C] text-white hover:bg-[#83B99C]"
                  : "hover:bg-[#83B99C] hover:text-white hover:shadow-md"
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
                    color: activeMenuItem === item.href ? "#FFFFFF" : undefined,
                  }}
                >
                  {item.icon}
                </div>
                <span className="ml-3 text-lg font-medium">{item.name}</span>
              </a>
            ) : (
              <Link href={item.href} key={index} legacyBehavior>
                <a
                  className={`menu-item flex items-center p-3 px-9 rounded transition-colors duration-200 ease-in-out mt-4 mb-7 ${activeMenuItem === item.href
                    ? "bg-[#83B99C] text-white hover:bg-[#83B99C]"
                    : "hover:bg-[#83B99C] hover:text-white hover:shadow-md"
                    }`}
                  onClick={() => handleClick(item.href)}
                // onMouseEnterとonMouseLeaveのイベントハンドラはそのままにする
                >
                  <div
                    className="icon w-10 flex justify-center items-center"
                    style={{
                      color:
                        activeMenuItem === item.href ? "#FFFFFF" : undefined,
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
