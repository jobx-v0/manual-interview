"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Ruthi_full_logo from "@/assets/Ruthi_full_Logo.png";
import Image from "next/image";
import { notesSliceReset } from "@/lib/features/notes/notesSlice";
import { ruthiMainSliceReset } from "@/lib/features/ruthiMain/ruthiMainSlice";
import { roomChatSliceReset } from "@/lib/features/roomChat/roomChatSlice";
import { useDispatch } from "react-redux";

export default function ThankYouPage() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const dispatch = useDispatch();

  useEffect(() => {
    sessionStorage.clear();

    dispatch(notesSliceReset());
    dispatch(ruthiMainSliceReset());
    dispatch(roomChatSliceReset());

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className=" absolute w-full">
        <Confetti
          className="w-full"
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      </div>
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="max-w-4xl w-full bg-white/10 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-12 text-center"
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl sm:text-5xl font-bold mb-6 text-white"
            >
              Thank You for Completing Your Interview!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl mb-8 text-gray-200"
            >
              Your responses have been recorded and are under review. We
              appreciate your time and effort in sharing your valuable insights
              with us.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mb-8 text-gray-200"
            >
              Our team will review your interview responses and get back to you
              shortly. If you have any questions or need further assistance,
              please feel free to contact us at{" "}
              <a
                href="mailto:admin@ruthi.in"
                className="underline hover:text-blue-300 transition-colors"
              >
                admin@ruthi.in
              </a>
              .
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <Link href="#use-original-link">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Back to Home
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Want to prepare for future opportunities?
              </h2>
              <Link href="#resources">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white bg-transparent hover:bg-white/20 transition-colors"
                >
                  Explore our career resources
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </Card>
      </main>

      <footer className="w-full bg-white/10 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            {/* <img src={Ruthi_full_logo} alt="Rhuthi Company Logo" className="h-8" /> */}
            <Image src={Ruthi_full_logo} alt="Ruthi Company Logo" height={32} />
          </div>
          <div className="text-sm">© 2024 Ruthi. All rights reserved.</div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-blue-300 transition-colors">
              <span className="sr-only">Facebook</span>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="hover:text-blue-300 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/ruthi-ai/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
