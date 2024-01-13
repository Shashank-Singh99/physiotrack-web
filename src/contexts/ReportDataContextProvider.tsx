import { createContext, useState } from "react";
import { ReportData } from "../types/types";

export const ReportDataContext = createContext<ReportDataContextType>(null);

export type ReportDataContextType = {
  reportData: ReportData[];
  setReportData: React.Dispatch<React.SetStateAction<ReportData[]>>;
};

export const ReportDataContextProvider = ({ children }) => {
  const [reportData, setReportData] = useState<ReportData[]>(null);

  return (
    <ReportDataContext.Provider value={{ reportData, setReportData }}>
      {children}
    </ReportDataContext.Provider>
  );
};
