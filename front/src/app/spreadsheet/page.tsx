"use client";
import React, { useState, useEffect } from "react";
import { Suspense } from "react"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider } from "../firebase";
import Link from "next/link";
import Loading from "./loading";

export default function Settings() {

    const [sheetId, setSheetId] = useState<string>("");
    const [user] = useAuthState(auth);
    const [sharedEmail, setSharedEmail] = useState<string>("");

    const getSheetId = async () => {
        // TODO user=user.id
        fetch("/api/spreadsheets/?user=1")
            .then(async res => {
                console.log(res)
                const data = await res.json();
                setSheetId(data[0].sheet_id)
                setSharedEmail(data[0].shared_email)

            })
            .catch(err => console.log(err))

    }
    useEffect(() => {
        getSheetId()
    }, [])

    const handleCreateSpreadSheet = async () => {
        if (sharedEmail === "")
            return alert("共有用のメールアドレスを設定してください。")
        fetch("/api/spreadsheets/?user=1", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "shared_email": sharedEmail
            }),


        })
            .then(async res => {
                console.log(res)
                const data = await res.json();
                setSheetId(data.sheet_id)
                setSharedEmail(data.shared_email)
            })
            .catch(err => {
                alert("spreadsheetの生成に失敗しました。")
                console.log(err)
            })
    }

    return (
        <>
            <Suspense fallback={<Loading />}>
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="">カレンダー共有設定</h2>
                    <input type="hidden" name="my_email" value={user?.email} />
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">共有用メールアドレス:</label>
                        <input type="email" id="email" name="share_email" required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={(e) => { setSharedEmail(e.target.value) }}
                            value={sharedEmail}
                        />
                    </div>
                    {!sheetId ?
                        <div className="mb-4">
                            <button type="button"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => handleCreateSpreadSheet()}
                            >
                                Spreadsheet生成
                            </button>
                        </div>
                        :
                        <div>
                            <Link href={`https://docs.google.com/spreadsheets/d/${sheetId}`} rel="noopener noreferrer" target="_blank">
                                <button type="button"
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Spreadsheetを開く
                                </button>
                            </Link>
                        </div>
                    }
                </div>
            </Suspense>
        </>
    );
}
