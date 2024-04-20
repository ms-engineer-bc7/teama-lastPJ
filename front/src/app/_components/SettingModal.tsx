"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./banner.module.css";



export default function MessageBannar({ id }: { id: string }) {
    return (
        <>
            <div id="modal" className="hidden target:block">
                <div className="block w-full h-full bg-black/70 absolute top-0 left-0">
                    <a href="#" className="block w-full h-full cursor-default"></a>
                    <div className="w-3/4 mx-auto mt-20 relative -top-full">
                        <p>Modal</p>
                    </div>
                </div>
            </div>
        </>
    )
}