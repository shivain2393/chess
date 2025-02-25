const HighlightedText = ({ children }: { children: React.ReactNode}) => {
    return (
        <span className="text-primary font-semibold">
            {children}
        </span>
    )
}

export default HighlightedText