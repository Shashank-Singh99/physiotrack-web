import { Outlet, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DimensionsContext } from "../contexts/DimensionsContextProvider";
import AppFooter from "./AppFooter";
import { ScreenshotContext } from "../contexts/ScreenshotContextProvider";

// http://127.0.0.1:5173/verify?imgUrl=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fphysiotrack-28fa2.appspot.com%2Fo%2Fimages%252Fpose.jpg%3Falt%3Dmedia%26token%3D89f5db15-d0e0-4322-8485-23487b9a6fac&width=392.72727272727275&height=791.6363636363636

function HomeRebrand() {
  const [queryParameters] = useSearchParams();

  const { setScreenshot } = useContext(ScreenshotContext);
  const { setClientWidth, setClientHeight } = useContext(DimensionsContext);

  const [ width, setWidth ] = useState(null);
  const [ height, setHeight ] = useState(null);


  useEffect(() => {
    const w = +queryParameters.get("width");
    const h = +queryParameters.get("height");
    const imgUrl = queryParameters.get("imgUrl");
    setScreenshot(imgUrl);
    setHeight(h);
    setWidth(w)
    setClientWidth(w);
    setClientHeight(h);
    console.log(w);
    console.log(h);
  }, []);

  return (
    <>
      <div
        style={{
          height: height,
          width: width,
          overflow: "hidden",
          backgroundColor: "#1212121c",
        }}
        id="parent"
      >
        <Outlet />
        <AppFooter />
      </div>
    </>
  );
}

export default HomeRebrand;
