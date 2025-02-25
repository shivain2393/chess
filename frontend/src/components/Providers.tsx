"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

const Providers = ({ children } : { children: React.ReactNode }) => {

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  })

  if(!mounted){
    return (
      <>
        {children}
      </>
    )
  }

  return (
    <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
    >
        {children}
    </ThemeProvider>
  );
};

export default Providers;

