import { Loader2 } from "lucide-react";

const Loading = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex text-xl font-semibold">
            {children}
            <Loader2 className="size 6 ml-2 animate-spin"/>
        </div>
    )
}

export default Loading;