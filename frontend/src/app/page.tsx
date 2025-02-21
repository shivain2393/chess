'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Scale } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

const Home = () => {

  const router = useRouter();

  return (
    <div className="container mx-auto flex flex-col items-center gap-8 px-4 text-center leading-loose">
      <h1 className="text-5xl font-semibold leading-relaxed">
        Welcome to <span className="text-primary">Chessify!</span>
      </h1>
      <p className="text-secondary text-xl max-w-2xl text-center px-2">
        The ultimate destination to play <span className="text-primary">chess</span>—challenge <span className="text-primary">players online</span> or enjoy a match with <span className="text-primary">friends</span>!
      </p>
      <motion.div 
      variants={{
        initial: {
          scale: 1
        },
        hover: {
          scale: 1.1
        }
      }}
      initial='initial'
      whileHover='hover'
      onClick={() => {
        router.push('/play')
      }}
      >
        <Button className="text-lg py-6 px-8 font-semibold">
          Get Started
          <motion.span variants={{
            initial: {
              x: 0
            },
            hover: {
              x: 10
            }
          }}>
            <ArrowRight />
          </motion.span>
        </Button>
      </motion.div>
    </div>
  );
};

export default Home;
