"use client";
import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  getUserInfo,
} from "../fetch";
import { LoadingSpinner } from '../_components/LoadingSpinner';
import { User } from "../../../@type";
import Menu from "../_components/Menu";
import Link from "next/link";

// Modalのスタイルを定義
const customStyles = {
  overlay: {
    zIndex: 100
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90%', // 最大幅を設定
    maxHeight: '90vh', // 最大高さを設定
    width: '550px',
    height: '300px'
  },
};

export default function Dashboard() {
  const router = useRouter();
  const [authUser] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>()
  const [sheetId, setSheetId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [partnerEmail, setPartnerEmail] = useState<string>('');
  const [sharedEmail, setSharedEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [formType, setFormType] = useState<'name' | 'partner' | 'spreadsheet'>('name')
  const LABELS = {
    'name': '名前',
    'partner': 'パートナーメールアドレス',
    'spreadsheet': 'スプレッドシート連携メールアドレス',
  }

  useEffect(() => {
    setIsLoading(true)
    if (!authUser) return;
    getUserInfo(authUser)
      .then(async (res) => {
        const data = await res.json();
        console.log(data)
        setUser(data);
        setName(data.name)
        setPartnerEmail(data.partner_email)
        if (data.role == "") router.push("/role");
        if (data.role == "partner") router.push("/partner");
        setIsLoading(false)
      })
      .catch((err) => {
        router.push("/login");
      });
    fetch(`/api/spreadsheets/`, {
      headers: {
        'Authorization': `Bearer ${authUser.accessToken}`
      }
    })
      .then(async res => {
        const data = await res.json();
        console.log(data)
        if (data.length != 0) {
          setSheetId(data[0].sheet_id)
          setSharedEmail(data[0].shared_email)
        }
        setIsLoading(false)
      })
      .catch(err => {
        router.push('/login')
      })
  }, [authUser]);

  const handleOpenNameModal = () => {
    setFormType('name')
    setName(user?.name ?? '')
    setPartnerEmail(user?.partner_email ?? '')
    setErrorMessage('')
    setIsModalOpen(true)
  }
  const handleOpenPartnerModal = () => {
    setFormType('partner')
    setPartnerEmail(user?.partner_email ?? '')
    setErrorMessage('')
    setIsModalOpen(true)
  }
  const handleOpenSpreadsheetModal = () => {
    setFormType('spreadsheet')
    setSharedEmail('')
    setErrorMessage('')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setErrorMessage('')
    setIsModalOpen(false)
  }

  const handleSubmit = () => {
    // validation
    if (formType == 'name' && name == '') {
      setErrorMessage('入力項目は必須です。')
      return
    }
    if (formType == 'partner' && partnerEmail == '') {
      setErrorMessage('入力項目は必須です。')
      return
    }
    if (formType == 'spreadsheet' && sharedEmail == '') {
      setErrorMessage('入力項目は必須です。')
      return
    }
    setIsLoading(true)
    // submit処理
    if (formType == 'name') {
      updateUser()
    }
    if (formType == 'partner') {
      updatePartnerEmail()
    }
    if (formType == 'spreadsheet') {
      createSpredSheet()
    }
  }


  const updateUser = async () => {
    const newUser = {
      uid: user?.uid,
      name: name,
      email: user?.email,
      role: user?.role,
    }
    fetch(`/api/users/${user?.uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser),

    })
      .then(async res => {
        if (res.status != 200) {
          setErrorMessage("ユーザー情報の更新に失敗しました。")
          setIsLoading(false)
          return
        }
        setUser({ ...user!, name: name })
        setIsLoading(false)
        setIsModalOpen(false)
      })
      .catch(err => {
        setErrorMessage("ユーザー情報の更新に失敗しました。")
        setIsLoading(false)
      })
  }

  const updatePartnerEmail = async () => {
    fetch(`/api/users/${user?.uid}/partner`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 'user': user, 'partner_email': partnerEmail }),
    })
      .then(async res => {
        console.log(res)
        if (res.status == 404) {
          setErrorMessage("一致するパートナーはおりません。")
          setIsLoading(false)
          return
        }
        if (res.status != 200) {
          setErrorMessage("パートナーメールの登録に失敗しました。")
          setIsLoading(false)
          return
        }
        setUser({ ...user!, partner_email: partnerEmail })
        setIsLoading(false)
        setIsModalOpen(false)
      })
      .catch(err => {
        setErrorMessage("パートナーメールの登録に失敗しました。")
        setIsLoading(false)
      })
  }

  const createSpredSheet = async () => {
    fetch('/api/spreadsheets/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${authUser?.accessToken}`,
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
        setIsLoading(false)
        setIsModalOpen(false)
      })
      .catch(err => {
        setErrorMessage("spreadsheetの生成に失敗しました。")
        setIsLoading(false)
      })
  }

  return (
    <div className="flex w-full">
      <div className="flex-shrink-0">
        <Menu user={user} />
      </div>
      <div className="p-10 w-full">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">{LABELS.name}</label>
          <div className="flex w-full">
            <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10 w-96">
              {user?.name}
            </p>
            <button
              className={(user?.name ? "bg-gray-500 hover:bg-gray-600" : 'bg-blue-500 hover:bg-blue-600') + " text-white font-bold py-2 px-4 rounded mr-2 w-24 mx-3"}
              onClick={handleOpenNameModal}
            >
              {user?.name ? '変更' : '追加'}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">{LABELS.partner}</label>
          <div className="flex w-full">
            <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10 w-96">
              {user?.partner_email}
            </p>
            <button
              className={(user?.partner_email ? "bg-gray-500 hover:bg-gray-600" : 'bg-blue-500 hover:bg-blue-600') + " text-white font-bold py-2 px-4 rounded mr-2 w-24 mx-3"}
              onClick={handleOpenPartnerModal}
            >
              {user?.partner_email ? '変更' : '追加'}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">{LABELS.spreadsheet}</label>
          <div className="flex w-full">
            <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10 w-96">
              {sharedEmail}
            </p>
            {!sheetId ?
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2 w-24 mx-3"
                onClick={handleOpenSpreadsheetModal}
              >
                {'追加'}
              </button> :
              <Link href={`https://docs.google.com/spreadsheets/d/${sheetId}`} rel="noopener noreferrer" target="_blank">
                <button type="button"
                  className="bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-48 mx-3"
                >
                  Spreadsheetを開く
                </button>
              </Link >
            }
          </div>
        </div>
      </div >
      <Modal
        isOpen={isModalOpen}
        contentLabel="Example Modal"
        onRequestClose={handleCloseModal}
        style={customStyles}
      >
        <div className='p-8'>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">{LABELS[formType]}</label>
            {formType == 'name' &&
              <input type='text' className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10 w-72' value={name} onChange={(e) => setName(e.target.value)} placeholder="しぇあくる" />
            }
            {formType == 'partner' &&
              <input type='email' className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10 w-96' value={partnerEmail} onChange={(e) => setPartnerEmail(e.target.value)} placeholder="partner@sharecle.com" />
            }
            {formType == 'spreadsheet' &&
              <input type='email' className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10 w-96' value={sharedEmail} onChange={(e) => setSharedEmail(e.target.value)} placeholder="company@sharecle.com" />
            }

          </div>
          {errorMessage &&
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-1 rounded relative my-3" role="alert">
              <span className="block sm:inline">{errorMessage}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-1" onClick={() => { setErrorMessage('') }}>
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
              </span>
            </div>
          }

          <div className="flex justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2 w-full"
              onClick={handleSubmit}
            >
              保存
            </button>

            <button
              onClick={handleCloseModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded w-full"
            >
              閉じる
            </button>
          </div>

        </div>
      </Modal>
      {isLoading && <LoadingSpinner />}
    </div >

  );
}
