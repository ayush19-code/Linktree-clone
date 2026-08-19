"use client"
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter()
  const [text, setText] = useState("")

  
  const createTree = () => { 
    
    router.push(`/generate?handle=${text}`)
  }
  return (
    <main className="overflow-x-hidden">
      <section className="bg-[#254f1a] min-h-screen grid grid-cols-1 lg:grid-cols-2 pt-32 sm:pt-36 lg:pt-40 pb-12 items-center px-4 sm:px-8 md:px-12 lg:px-20 max-w-full">
        <div className="flex justify-center flex-col gap-3 max-w-2xl mx-auto lg:mx-0 w-full">
          <p className="text-yellow-300 font-bold text-4xl sm:text-5xl lg:text-7xl leading-tight">Everything you </p>
          <p className="text-yellow-300 font-bold text-4xl sm:text-5xl lg:text-7xl leading-tight">are. In one,</p>
          <p className="text-yellow-300 font-bold text-4xl sm:text-5xl lg:text-7xl leading-tight">simple link in bio.</p>
          <p className="text-yellow-300 text-base sm:text-lg lg:text-xl my-4 max-w-xl">Join 50M+ people using Linktree for their link in bio. One link to help you share everything you create, curate and sell from your Instagram, TikTok, Twitter, YouTube and other social media profiles.</p>
          <div className="input flex flex-col sm:flex-row gap-2 w-full max-w-md">
            <input value={text} onChange={(e)=> setText(e.target.value)} className="px-3 sm:px-4 py-2 sm:py-3 focus:outline-green-800 rounded-md bg-white text-black flex-1 min-w-0" type="text" placeholder="Enter your Handle" />
            <button onClick={()=> createTree()} className="bg-pink-300 rounded-full px-4 py-3 sm:py-4 font-semibold whitespace-nowrap hover:bg-pink-400 transition-colors">Claim your Bittree</button>
          </div>
        </div>
        <div className="flex items-center justify-center flex-col mt-8 lg:mt-0 w-full">
          <img src="/home.png" alt="homepage image" className="max-w-full h-auto object-contain max-h-[60vh] lg:max-h-[80vh]" />
        </div>
      </section>
    </main>
  );
}