"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Suspense } from "react"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider } from "../firebase";
import Link from "next/link";
import Loading from "./loading";

export default function Settings() {

    const router = useRouter();

    const [sheetId, setSheetId] = useState<string>("");
    const [sharedEmail, setSharedEmail] = useState<string>("");

    const [authUser] = useAuthState(auth);

    const getSpreadSheet = async () => {
        fetch(`/api/spreadsheets/`, {
            headers: {
                'Authorization': `Bearer ${authUser.accessToken}`
            }
        })
            .then(async res => {
                const data = await res.json();
                console.log(data)
                setSheetId(data[0].sheet_id)
                setSharedEmail(data[0].shared_email)
            })
            .catch(err => {
                // router.push('/login')
            })
    }
    useEffect(() => {
        if (!authUser) return
        getSpreadSheet()
    }, [authUser])


    const handleCreateSpreadSheet = async () => {
        if (sharedEmail === "")
            return alert("共有用のメールアドレスを設定してください。")
        fetch('/api/spreadsheets/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${authUser.accessToken}`,
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
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">共有用メールアドレス:</label>
                        <input type="email" id="email" name="share_email" required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={(e) => { setSharedEmail(e.target.value) }}
                            value={sharedEmail}
                            placeholder="company-mail@sharecle.com"
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
                            </Link >
                        </div >
                    }
                </div >
            </Suspense >
        </>
    );
}
