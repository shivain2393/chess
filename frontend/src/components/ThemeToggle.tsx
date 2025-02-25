'use client';

import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

const ThemeToggler = () => {

    const { theme, setTheme } = useTheme();

    const handleTheme = () => {
        if(theme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    }
    
    return (
        <Button onClick={handleTheme} size='icon' variant='ghost'>
            {theme === 'dark' ? 
             <Sun /> :
             <Moon />}
        </Button>
    )
}

export default ThemeToggler;