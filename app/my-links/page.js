"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getClaimedHandles, removeClaimedHandle } from "@/lib/storage";

export default function MyLinksPage() {
  const router = useRouter();
  const [handles, setHandles] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadedHandles = getClaimedHandles();
    setHandles(loadedHandles);
    setIsLoaded(true);
  }, []);

  const handleCopyLink = (handle) => {
    const host =
      process.env.NEXT_PUBLIC_HOST ||
      (typeof window !== "undefined" ? window.location.origin : "");
    const url = `${host}/${handle}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        toast.error("Failed to copy link");
      });
  };

  const handleRemove = (handleToRemove) => {
    const confirmRemove = window.confirm(
      `Are you sure you want to remove @${handleToRemove} from your claimed links?`
    );

    if (confirmRemove) {
      removeClaimedHandle(handleToRemove);
      setHandles((prev) => prev.filter((h) => h !== handleToRemove));
      toast.info(`Removed @${handleToRemove} from your claimed links`);
    }
  };

  if (!isLoaded) {
    return (
      <div className="bg-[#E9C0E9] min-h-screen flex items-center justify-center text-gray-900 font-bold text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#E9C0E9] min-h-screen pt-28 sm:pt-36 lg:pt-40 pb-16 px-4 sm:px-6 flex justify-center">
      <div className="w-full max-w-3xl flex flex-col items-center">
        <h1 className="font-bold text-3xl sm:text-4xl text-gray-900 mb-8 text-center">
          My Claimed Links
        </h1>

        {handles.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-md w-full max-w-md">
            <p className="text-gray-700 text-lg font-medium">
              You haven't claimed any BitTree links yet.
            </p>
            <Link href="/generate">
              <button className="mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-full transition-colors">
                Claim a BitTree
              </button>
            </Link>
          </div>
        ) : (
          <div className="w-full space-y-4">
            {handles.map((handle) => (
              <div
                key={handle}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="font-bold text-xl text-gray-900 truncate">
                    @{handle}
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => router.push("/" + handle)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] sm:text-xs md:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors"
                  >
                    View BitTree
                  </button>

                  <button
                    onClick={() => handleCopyLink(handle)}
                    className="bg-pink-300 hover:bg-pink-400 text-gray-900 font-semibold text-[11px] sm:text-xs md:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors"
                  >
                    Copy Link
                  </button>

                  <button
                    onClick={() => handleRemove(handle)}
                    className="bg-gray-200 hover:bg-red-100 hover:text-red-600 text-gray-700 font-semibold text-[11px] sm:text-xs md:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
