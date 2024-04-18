import React from "react";
import ReactDOM from "react-dom";
import styles from "./modal.module.css";
import { ModalPartnerProps } from "../types";

export default function ModalPartner({
  isOpen,
  onClose,
  event,
}: ModalPartnerProps) {
  if (!isOpen) return null;

  // 日時の文字列を表示用にフォーマットする関数
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  return ReactDOM.createPortal(
    <div
      className="modal fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        style={{ maxWidth: "400px" }}
        className="modal-content bg-white p-8 rounded-md shadow-lg w-full z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">イベントの詳細</h2>
        <div className="mb-4">
          <p className="font-medium">イベントのタイトル:</p>
          <div className="border rounded px-3 py-2 mb-4 w-full">
            {event.title}
          </div>
        </div>
        <div className="mb-4">
          <p className="font-medium">開始日時:</p>
          <div className="border rounded px-3 py-2 mb-4 w-full">
            {formatDate(event.start)}
          </div>
        </div>
        <div className="mb-4">
          <p className="font-medium">終了日時:</p>
          <div className="border rounded px-3 py-2 mb-4 w-full">
            {formatDate(event.end)}
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
