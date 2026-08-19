"use client";

import React, { useState, Suspense } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "next/navigation";
import { saveClaimedHandle } from "@/lib/storage";

const GenerateContent = () => {
  const searchParams = useSearchParams();

  const [links, setLinks] = useState([
    {
      link: "",
      linktext: "",
    },
  ]);

  const [handle, sethandle] = useState(searchParams.get("handle") || "");
  const [pic, setpic] = useState("");
  const [desc, setdesc] = useState("");

  const handleChange = (index, link, linktext) => {
    setLinks((initialLinks) => {
      return initialLinks.map((item, i) => {
        if (i === index) {
          return {
            link,
            linktext,
          };
        } else {
          return item;
        }
      });
    });
  };

  const addLink = () => {
    setLinks(
      links.concat([
        {
          link: "",
          linktext: "",
        },
      ])
    );
  };

  const submitLinks = async () => {
    try {
      const raw = JSON.stringify({
        links: links,
        handle: handle,
        pic: pic,
        desc: desc,
      });

      console.log("Sending data:", raw);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: raw,
      };

      const r = await fetch("/api/generate", requestOptions);

      console.log("API Status:", r.status);

      const responseText = await r.text();

      console.log("API Response:", responseText);

      if (!responseText) {
        toast.error("API returned an empty response");
        return;
      }

      let result;

      try {
        result = JSON.parse(responseText);
      } catch (error) {
        console.error("JSON Parse Error:", error);
        toast.error("Server returned invalid response");
        return;
      }

      if (result.success) {
        toast.success(result.message);
        saveClaimedHandle(handle);

        setLinks([
          {
            link: "",
            linktext: "",
          },
        ]);

        setpic("");
        sethandle("");
        setdesc("");
      } else {
        toast.error(result.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="bg-[#E9C0E9] min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* LEFT SIDE */}
      <div className="col1 flex justify-center items-center flex-col text-gray-900 pt-24 sm:pt-28 lg:pt-32 pb-10 px-4 sm:px-6 md:px-8 w-full max-w-2xl mx-auto lg:max-w-none">
        <div className="flex flex-col gap-5 my-6 sm:my-8 w-full max-w-xl">

          <h1 className="font-bold text-3xl sm:text-4xl text-center sm:text-left">
            Create your Bittree
          </h1>

          {/* STEP 1 */}
          <div className="item flex flex-col">
            <h2 className="font-semibold text-xl sm:text-2xl">
              Step 1: Claim your Handle
            </h2>

            <div className="my-2">
              <input
                value={handle || ""}
                onChange={(e) => {
                  sethandle(e.target.value);
                }}
                className="px-4 py-2 my-1 focus:outline-pink-500 rounded-full w-full max-w-md bg-white text-black"
                type="text"
                placeholder="Choose a Handle"
              />
            </div>
          </div>

          {/* STEP 2 */}
          <div className="item flex flex-col">
            <h2 className="font-semibold text-xl sm:text-2xl mb-2">
              Step 2: Add Links
            </h2>

            {links &&
              links.map((item, index) => {
                return (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 my-1 w-full max-w-xl">

                    <input
                      value={item.linktext || ""}
                      onChange={(e) => {
                        handleChange(
                          index,
                          item.link,
                          e.target.value
                        );
                      }}
                      className="px-4 py-2 focus:outline-pink-500 rounded-full flex-1 min-w-0 bg-white text-black"
                      type="text"
                      placeholder="Enter link text"
                    />

                    <input
                      value={item.link || ""}
                      onChange={(e) => {
                        handleChange(
                          index,
                          e.target.value,
                          item.linktext
                        );
                      }}
                      className="px-4 py-2 focus:outline-pink-500 rounded-full flex-1 min-w-0 bg-white text-black"
                      type="text"
                      placeholder="Enter link"
                    />

                  </div>
                );
              })}

            <button
              onClick={addLink}
              className="px-5 py-2 my-2 bg-slate-900 text-white font-bold rounded-3xl w-fit hover:bg-slate-800 transition-colors"
            >
              + Add Link
            </button>
          </div>

          {/* STEP 3 */}
          <div className="item flex flex-col">
            <h2 className="font-semibold text-xl sm:text-2xl mb-2">
              Step 3: Add Picture and Description
            </h2>

            <div className="flex flex-col gap-2 max-w-md w-full">

              <input
                value={pic || ""}
                onChange={(e) => {
                  setpic(e.target.value);
                }}
                className="px-4 py-2 focus:outline-pink-500 rounded-full w-full bg-white text-black"
                type="text"
                placeholder="Enter link to your Picture"
              />

              <input
                value={desc || ""}
                onChange={(e) => {
                  setdesc(e.target.value);
                }}
                className="px-4 py-2 focus:outline-pink-500 rounded-full w-full bg-white text-black"
                type="text"
                placeholder="Enter description"
              />

              <button
                disabled={
                  pic === "" ||
                  handle === "" ||
                  links.length === 0 ||
                  links[0].linktext === ""
                }
                onClick={submitLinks}
                className="disabled:bg-slate-500 px-6 py-2.5 my-3 w-fit bg-slate-900 text-white font-bold rounded-3xl hover:bg-slate-800 transition-colors"
              >
                Create your BitTree
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="col2 w-full flex items-center justify-center p-4 lg:p-10 bg-[#E9C0E9] min-h-[300px] lg:min-h-screen">
        <img
          className="w-full max-w-md lg:max-w-xl h-auto object-contain max-h-[50vh] lg:max-h-[80vh]"
          src="/generate.png"
          alt="Generate your links"
        />

        <ToastContainer />
      </div>

    </div>
  );
};

const Generate = () => {
  return (
    <Suspense fallback={<div className="bg-[#E9C0E9] min-h-screen flex items-center justify-center text-gray-900 font-bold text-xl">Loading...</div>}>
      <GenerateContent />
    </Suspense>
  );
};

export default Generate;