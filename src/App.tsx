import createTheme from "@mui/material/styles/createTheme";
import { ThemeProvider } from "@mui/material/styles";
import { DimensionsContextProvider } from "./contexts/DimensionsContextProvider";
import { ScreenshotContextProvider } from "./contexts/ScreenshotContextProvider";
import { ReportDataContextProvider } from "./contexts/ReportDataContextProvider";
import Home from "./components/Home";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <DimensionsContextProvider>
        <ScreenshotContextProvider>
          <ReportDataContextProvider>
            <Home />
          </ReportDataContextProvider>
        </ScreenshotContextProvider>
      </DimensionsContextProvider>
    </ThemeProvider>
  );
}

export default App;
