import { Button } from "@/components/ui/button";
import Link from "next/link";

const Play = () => {
  return (
    <div className="container mx-auto flex flex-col items-center gap-8 px-4 text-center">
      <h1 className="text-4xl font-semibold max-w-2xl leading-relaxed">
        Ready to <span className="text-primary">Play</span>{" "}? Start a Match or Create Your Own Game!
      </h1>
      <h2 className="text-lg max-w-2xl text-secondary px-4">
        Find a game by clicking the <span className="text-primary">Play</span>{" "}
        button or create and join a custom game with friends using the{" "}
        <span className="text-primary">Custom Game</span> button.
      </h2>
      <div className="flex gap-4">
        <Button className="text-lg py-6 px-8 font-semibold">Play</Button>
        <Button variant="outline" className="text-lg py-6 px-8 font-semibold">
          <Link href="/custom">Custom Game</Link>
        </Button>
      </div>
    </div>
  );
};
export default Play;
