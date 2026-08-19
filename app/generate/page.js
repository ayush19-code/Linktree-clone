"use client";

import React, { useState, Suspense } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "next/navigation";

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
    <div className="bg-[#E9C0E9] min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* LEFT SIDE */}
      <div className="col1 flex justify-center items-center flex-col text-gray-900 pt-28 pb-10">
        <div className="flex flex-col gap-5 my-8">

          <h1 className="font-bold text-4xl">
            Create your Bittree
          </h1>

          {/* STEP 1 */}
          <div className="item">
            <h2 className="font-semibold text-2xl">
              Step 1: Claim your Handle
            </h2>

            <div className="mx-4">
              <input
                value={handle || ""}
                onChange={(e) => {
                  sethandle(e.target.value);
                }}
                className="px-4 py-2 my-2 focus:outline-pink-500 rounded-full"
                type="text"
                placeholder="Choose a Handle"
              />
            </div>
          </div>

          {/* STEP 2 */}
          <div className="item">
            <h2 className="font-semibold text-2xl">
              Step 2: Add Links
            </h2>

            {links &&
              links.map((item, index) => {
                return (
                  <div key={index} className="mx-4">

                    <input
                      value={item.linktext || ""}
                      onChange={(e) => {
                        handleChange(
                          index,
                          item.link,
                          e.target.value
                        );
                      }}
                      className="px-4 py-2 mx-2 my-2 focus:outline-pink-500 rounded-full"
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
                      className="px-4 py-2 mx-2 my-2 focus:outline-pink-500 rounded-full"
                      type="text"
                      placeholder="Enter link"
                    />

                  </div>
                );
              })}

            <button
              onClick={addLink}
              className="p-5 py-2 mx-2 bg-slate-900 text-white font-bold rounded-3xl"
            >
              + Add Link
            </button>
          </div>

          {/* STEP 3 */}
          <div className="item">
            <h2 className="font-semibold text-2xl">
              Step 3: Add Picture and Description
            </h2>

            <div className="mx-4 flex flex-col">

              <input
                value={pic || ""}
                onChange={(e) => {
                  setpic(e.target.value);
                }}
                className="px-4 py-2 mx-2 my-2 focus:outline-pink-500 rounded-full"
                type="text"
                placeholder="Enter link to your Picture"
              />

              <input
                value={desc || ""}
                onChange={(e) => {
                  setdesc(e.target.value);
                }}
                className="px-4 py-2 mx-2 my-2 focus:outline-pink-500 rounded-full"
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
                className="disabled:bg-slate-500 p-5 py-2 mx-2 w-fit my-5 bg-slate-900 text-white font-bold rounded-3xl"
              >
                Create your BitTree
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="col2 w-full h-screen bg-[#E9C0E9]">
        <img
          className="h-full object-contain"
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