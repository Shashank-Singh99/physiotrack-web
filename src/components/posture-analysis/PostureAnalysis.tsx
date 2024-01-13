import { useContext, useEffect, useRef, useState } from "react";
import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocument from "../pdf-document/PdfDocument";
import { Layer, Stage, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { DimensionsContext } from "../../contexts/DimensionsContextProvider";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Box, Button, Fab, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { Document, Page } from "react-pdf";
import { ScreenshotContext } from "../../contexts/ScreenshotContextProvider";
import { ReportDataContext } from "../../contexts/ReportDataContextProvider";
import {
  handleTouchEnd,
  handleTouchMove,
  handleTouchStart,
} from "../../utils/canvasEvents";
import CustomLoader from "../CustomLoader";

// https://github.com/diegomura/react-pdf/issues/1113
// https://github.com/wojtekmaj/react-pdf?tab=readme-ov-file

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function PostureAnalysis() {
  const { screenshot } = useContext(ScreenshotContext);
  const { clientHeight, clientWidth } = useContext(DimensionsContext);
  const [image] = useImage(screenshot);
  const reportRef = useRef(null);
  const stageRef = useRef(null);

  const { setScreenshot } = useContext(ScreenshotContext);
  const { reportData } = useContext(ReportDataContext);

  const [isReportViewed, setIsReportViewed] = useState(false);
  const [mainImgSrc, setMainImgSrc] = useState<string>(null);

  useEffect(() => {
    if (reportRef.current === null) {
      return;
    }
    setMainImgSrc(reportRef.current.toDataURL());
  }, [reportRef]);

  function previewReport() {
    setMainImgSrc(reportRef.current.toDataURL());
    setIsReportViewed(true);

    setScreenshot(null);
  }

  return (
    <>
      {isReportViewed ? (
        isReportViewed && (
          <>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Typography sx={{ m: 2 }} variant="h3" component="h3">
          {'Report Preview'}
      </Typography>
      <Typography variant="h6" component="h6">
          {'Download to view the detailed report'}
      </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
            <BlobProvider
              document={
                <PdfDocument mainImgSrc={mainImgSrc} data={reportData} />
              }
            >
              {({ blob, url, loading }) => {
                return loading ? (
                  <CustomLoader />
                ) : (
                  <Document
                    file={url}
                    onLoadSuccess={() => {}}
                    renderMode="canvas"
                  >
                    <Page pageNumber={1} width={clientWidth} />
                  </Document>
                );
              }}
            </BlobProvider>
            <PDFDownloadLink
              document={
                <PdfDocument mainImgSrc={mainImgSrc} data={reportData} />
              }
              fileName="PhysioTrack Anterior Posture Evaluation.pdf"
            >
              {({ blob, url, loading, error }) =>
                loading ? (
                  <CustomLoader />
                ) : (
                  <Fab
                    color="primary"
                    aria-label="add"
                    sx={{ position: "absolute", bottom: 110, right: 16 }}
                  >
                    <DownloadIcon />
                  </Fab>
                )
              }
            </PDFDownloadLink>
          </Box>
          </>
        )
      ) : (
        <>
          <Stage
            width={clientWidth}
            height={clientHeight}
            ref={stageRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Layer>
              <KonvaImage
                ref={reportRef}
                image={image}
                width={clientWidth}
                height={clientHeight}
              />
            </Layer>
          </Stage>
          <Fab
            color="primary"
            aria-label="add"
            sx={{ position: "absolute", bottom: 110, right: 16 }}
            onClick={previewReport}
          >
            <DownloadIcon />
          </Fab>
        </>
      )}
    </>
  );
}

export default PostureAnalysis;
