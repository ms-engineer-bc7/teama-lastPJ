import React, { useState, useEffect } from "react";
import { FormEvent } from "react";
import ReactDOM from "react-dom";
import { postFetchData, putFetchData } from "../fetch";
import styles from "./modal.module.css";
// import "../styles/global.css";

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  submitEvent,
  deleteEvent,
  updateEvent,
  event,
}: any) {
  const [modalEventTitle, setModalEventTitle] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  const wrapSetStartDatetime = (a: string) => {
    setStartDateTime(a);
    console.log(startDateTime);
  };

  useEffect(() => {
    if (isOpen && event) {
      setModalEventTitle(event.title);
      setStartDateTime(formatDate(event.start));
      setEndDateTime(formatDate(event.end));

      console.log("モーダルオープン時:開始日", event.start);
      console.log("モーダルオープン時:終了日", event.end);
      console.log("モーダルオープン時:ID", event.id);
      // 背景をスクロールできないようにする
      document.body.style.overflow = "hidden";
    } else {
      // モーダルが閉じられるときに背景のスクロール制限を解除する
      document.body.style.overflow = "auto";
    }
  }, [isOpen, event]);

  const handleModalClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // モーダルの背景がクリックされたときに閉じる
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const handleConfirm = () => {
    // 新しいイベントオブジェクトを作成して渡す
    const newEvent = {
      title: modalEventTitle,
      start: startDateTime,
      end: endDateTime,
    };
    onConfirm(newEvent);
  };

  const handleClose = () => {
    onClose();
  };

  // post の処理
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const handleData = await postFetchData(
      modalEventTitle,
      startDateTime,
      endDateTime,
      1
    );
    console.log("データ", handleData);
  };

  function formatDate(originalDateTime: string) {
    const convertedDateTime = originalDateTime.substring(0, 16); // "YYYY-MM-DDTHH:mm" の形式に切り取る
    console.log("日付修正関数のログ", convertedDateTime);
    return convertedDateTime;
  }

  return ReactDOM.createPortal(
    <div className="modal" onClick={handleModalClick}>
      <div className="modal-content">
        <h2 className="text-lg font-bold mb-4">イベントを追加</h2>
        <label htmlFor="event-title" className="mb-2">
          イベントのタイトル:
        </label>
        <input
          id="event-title"
          type="text"
          value={modalEventTitle}
          onChange={(e) => setModalEventTitle(e.target.value)}
          className="border rounded px-3 py-2 mb-4 w-full"
          maxLength={50}
        />
        <label htmlFor="start-date" className="mb-2">
          開始日時:
        </label>
        <input
          id="start-date"
          type="datetime-local"
          value={startDateTime}
          onChange={(e) => wrapSetStartDatetime(e.target.value)}
          className="border rounded px-3 py-2 mb-4 w-full"
        />
        <label htmlFor="end-date" className="mb-2">
          終了日時:
        </label>
        <input
          id="end-date"
          type="datetime-local"
          value={endDateTime}
          onChange={(e) => setEndDateTime(e.target.value)}
          className="border rounded px-3 py-2 mb-4 w-full"
        />

        <div className="flex justify-end">
          <button
            onClick={async () => {
              await submitEvent(modalEventTitle, startDateTime, endDateTime);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
          >
            保存
          </button>

          <button
            onClick={async () => {
              if (event.id) {
                await updateEvent(
                  event.id,
                  modalEventTitle,
                  startDateTime,
                  endDateTime
                );
                onClose();
              }
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
          >
            変更
          </button>

          <button
            onClick={() => {
              console.log("モーダルから渡されるイベントID:", event.id);
              deleteEvent(event.id.toString());
            }}
            // onClick={async () => {
            //   await deleteEvent(event.id); // 削除処理関数を実行
            // }}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2"
          >
            削除
          </button>

          <button
            onClick={handleClose}
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
