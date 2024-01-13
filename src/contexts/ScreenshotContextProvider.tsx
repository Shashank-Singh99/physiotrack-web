import { createContext, useState } from "react";

type ScreenShotContextType = {
  screenshot: string;
  setScreenshot: React.Dispatch<React.SetStateAction<string>>;
};

export const ScreenshotContext = createContext<ScreenShotContextType>(null);

export const ScreenshotContextProvider = ({ children }) => {
  const [screenshot, setScreenshot] = useState<string>(null);

  return (
    <ScreenshotContext.Provider value={{ screenshot, setScreenshot }}>
      {children}
    </ScreenshotContext.Provider>
  );
};
