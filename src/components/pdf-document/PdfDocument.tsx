import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Svg,
  Line,
} from "@react-pdf/renderer";
import { PdfTable } from "./PdfTable";
import { ReportData } from "../../types/types";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  line: {
    marginTop: 10,
    marginBottom: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  image: {
    width: 300,
    height: 50,
  },
  mainImage: {
    marginTop: 10,
    width: 500,
    height: 300,
  },
  snipImage: {
    marginTop: 10,
    width: 200,
    height: 100,
  },
});

type Props = {
  mainImgSrc: string;
  data: ReportData[];
};

const HeaderText = ({ ...props }) => {
  return (
    <Text>
      <Text style={{ fontFamily: "Helvetica-Bold" }}>{props.label}</Text>
      {props.value}
    </Text>
  );
};

const Header = () => {
  return (
    <>
      <Image style={styles.image} src="logo-without-bg.png" />
      <View>
        <Svg height="10" width="500">
          <Line
            x1="0"
            y1="5"
            x2="500"
            y2="5"
            strokeWidth={2}
            stroke="rgb(211, 211, 211)"
          />
        </Svg>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View>
            <HeaderText label="Patient Name: " value="John Smith" />
            <HeaderText label="Patient Age: " value="53 years" />
            <HeaderText
              label="Patient Address: "
              value="123, Bangalore, India"
            />
          </View>
          <View style={{ marginLeft: 30 }}>
            <HeaderText label="Treatment Package: " value="Posture Assesment" />
            <HeaderText label="Package Tier: " value="Gold" />
            <HeaderText label="Assesment Type: " value="Anterior Posture" />
          </View>
        </View>

        <Svg height="10" width="500">
          <Line
            x1="0"
            y1="5"
            x2="500"
            y2="5"
            strokeWidth={2}
            stroke="rgb(211, 211, 211)"
          />
        </Svg>
      </View>
    </>
  );
};

const ImageWithLabel = ({ imgSrc, label }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        width: "50%"
      }}
    >
      <Image src={imgSrc} style={styles.snipImage}></Image>
      <Text style={{ fontFamily: "Helvetica-Bold" }}>{label}</Text>
    </View>
  );
};

const PdfDocument = ({ ...props }: Props) => (
  <Document title="PhysioTrack Anterior Posture Evaluation">
    <Page size="A4" style={styles.page}>
      <Header />

      <View>
        <Text style={{ fontFamily: "Helvetica" }}>
          {" "}
          We have detected probability of misalignments in your anterior
          posture. Please consider taking deeper posture assesments and further
          consultation with your specialist.
        </Text>
      </View>

      <View style={{ display: "flex", flexDirection: "row" }}>
        <Image src={props.mainImgSrc} style={styles.mainImage}></Image>
        <PdfTable items={props.data} />
      </View>
    </Page>

    <Page size="A4" style={styles.page}>
      <Header />

      <View>
        {props.data.map((element, index) => {
          return (
            <ImageWithLabel
              key={index}
              imgSrc={element.snipImgSrc}
              label={element.inference + " : " + element.angle.toFixed(2) + " deg"}
            />
          );
        })}
      </View>
    </Page>

    <Page size="A4" style={styles.page}>
      <Header />

      <View>
        {props.data.map((element, index) => {
          return (
            <ImageWithLabel
              key={index}
              imgSrc={element.snipImgSrc}
              label={element.inference + " : " + element.angle + " deg"}
            />
          );
        })}
      </View>
    </Page>
  </Document>
);

export default PdfDocument;
