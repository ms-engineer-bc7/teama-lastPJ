"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

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
  { name: "Price", href: "/price", icon: <WorkoutsIcon /> },
  { name: "Counseling", href: "/counseling", icon: <MealPlanIcon /> },
];

export default function Menu() {
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
            src="/img/profile.svg"
            alt="Avatar"
            width={200}
            height={200}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold mt-3 text-white">ユーザー名</h3>
          <p className="text-sm mt-2 text-white">ロール</p>
        </div>
      </div>

      {/* メニュー */}
      <div className="flex flex-col items-center">
        <nav className="menu bg-white p-3 rounded-lg">
          {menuItems.map((item, index) => (
            <Link href={item.href} key={index} legacyBehavior>
              <a
                className={`menu-item flex items-center p-3 rounded transition-colors duration-200 ease-in-out mt-4 ${
                  activeMenuItem === item.href
                    ? "bg-green-300"
                    : "hover:bg-green-100"
                }`}
                onClick={() => handleMenuItemClick(item.href)}
              >
                {item.icon && (
                  <div className="flex items-center justify-center p-3 rounded-l-lg">
                    {item.icon}
                  </div>
                )}
                <span
                  style={{ marginTop: "1.8px" }}
                  className={`ml-2 text-lg font-medium ${
                    item.icon ? "ml-5" : ""
                  }`}
                >
                  {item.name}
                </span>
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

// Placeholder icon components
function DashboardIcon() {
  return null;
}

function WorkoutsIcon() {
  return null;
}

function MealPlanIcon() {
  return null;
}

function MessagesIcon() {
  return null;
}

function SettingsIcon() {
  return null;
}
