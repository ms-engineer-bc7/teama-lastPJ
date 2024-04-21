"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
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
    href: "/partner",
    icon: <FontAwesomeIcon icon={faCalendar} style={{ fontSize: "21px" }} />,
  },
  {
    name: "Counseling",
    href: "/partnerCounseling",
    icon: <FontAwesomeIcon icon={faHeart} style={{ fontSize: "21px" }} />,
  },
];

export default function PartnerMenu(props: MenuProps) {
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);

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
      <div className="flex flex-col items-center mt-6">
        <nav className="menu bg-white p-3 rounded-lg">
          {menuItems.map((item, index) => (
            <Link href={item.href} key={index} legacyBehavior>
              <a
                className={`menu-item flex items-center p-3 px-9 rounded transition-colors duration-200 ease-in-out mt-4 mb-7 ${
                  activeMenuItem === item.href
                    ? "bg-[#83B99C] text-white hover:bg-[#83B99C]"
                    : "hover:bg-[#83B99C] hover:text-white hover:shadow-md"
                }`}
                onMouseEnter={(e) => {
                  if (activeMenuItem !== item.href) {
                    e.currentTarget.style.backgroundColor = "#83B99C";
                    e.currentTarget.style.color = "#FFFFFF";
                    const iconElement = e.currentTarget.querySelector(
                      ".icon"
                    ) as HTMLElement; // HTMLElementとしてキャスト
                    if (iconElement) {
                      iconElement.style.color = "#FFFFFF"; // 要素が存在する場合のみ色を変更
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeMenuItem !== item.href) {
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.color = "";

                    // .icon 要素を HTMLElement として取得
                    const iconElement = e.currentTarget.querySelector(
                      ".icon"
                    ) as HTMLElement | null;

                    // iconElement が存在する場合のみスタイルを変更
                    if (iconElement) {
                      iconElement.style.color = "";
                    }
                  }
                }}
                onClick={() => handleMenuItemClick(item.href)}
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
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
