import { Loader2 } from "lucide-react";

const Loading = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex text-3xl font-medium items-center">
            {children}
            <Loader2 className="size-18 ml-4 animate-spin"/>
        </div>
    )
}

export default Loading;