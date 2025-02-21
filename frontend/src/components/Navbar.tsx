"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { motion } from "motion/react";

const Navbar = () => {
  return (
    <nav className="container flex items-center justify-between mx-auto py-6 px-4 border-b">
      <h1 className="font-semibold text-3xl">
        <Link href="/">Chessify</Link>
      </h1>
      <motion.div
        whileHover={{
          scale: 1.1,
        }}
      >
        <Button size="lg">
          <Link href="/play">Play</Link>
        </Button>
      </motion.div>
    </nav>
  );
};

export default Navbar;
