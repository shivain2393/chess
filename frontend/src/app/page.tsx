'use client';

import HighlightedText from "@/components/HighlightedText";
import { Button } from "@/components/ui/button";
import { ArrowRight, Scale } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

const Home = () => {

  const router = useRouter();

  return (
    <div className="container mx-auto flex flex-col items-center gap-8 px-4 text-center leading-loose">
      <h1 className="text-5xl font-semibold leading-relaxed">
        Welcome to <HighlightedText>Chessify!</HighlightedText>
      </h1>
      <p className="text-muted-foreground text-xl max-w-2xl text-center px-2">
        The ultimate destination to play <HighlightedText>chess</HighlightedText>—challenge <HighlightedText>players online</HighlightedText> or enjoy a match with <HighlightedText>friends</HighlightedText>!
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
