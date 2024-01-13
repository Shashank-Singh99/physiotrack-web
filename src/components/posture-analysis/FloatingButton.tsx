import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';

export default function FloatingButton({ onClickHandle, color }) {
  return (
    <Box sx={{ height: 320, transform: "translateZ(0px)", flexGrow: 1 }}>
      <Fab
        color={color}
        aria-label="add"
        sx={{ position: "absolute", bottom: 10, right: 16 }}
        onClick={onClickHandle}
      >
        <CameraAltRoundedIcon />
      </Fab>
     </Box>
  );
}
