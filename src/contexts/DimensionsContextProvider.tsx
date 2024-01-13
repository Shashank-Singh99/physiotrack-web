import { createContext, useState } from "react";

export type DimensionsContextType = {
  clientWidth: number;
  clientHeight: number;
  setClientWidth: React.Dispatch<React.SetStateAction<number>>;
  setClientHeight: React.Dispatch<React.SetStateAction<number>>;
};

export const DimensionsContext = createContext<DimensionsContextType>(null);

export const DimensionsContextProvider = ({ children }) => {
  const [clientHeight, setClientHeight] = useState<number>(undefined);
  const [clientWidth, setClientWidth] = useState<number>(undefined);

  return (
    <DimensionsContext.Provider
      value={{ clientHeight, clientWidth, setClientWidth, setClientHeight }}
    >
      {children}
    </DimensionsContext.Provider>
  );
};
