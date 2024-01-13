import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Paper from '@mui/material/Paper';
import { Link, useLocation } from 'react-router-dom';

export default function AppFooter() {
  const { pathname } = useLocation();

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
        <BottomNavigation
          showLabels
          value={pathname}
        >
            <BottomNavigationAction
            component={Link}
            to="/verify"
            value="/verify"
            label="Verify"
            icon={<LocationOnIcon />} />
            <BottomNavigationAction
            component={Link}
            to="/analyse"
            value="/analyse"
            label="Analyse"
            icon={<RestoreIcon />} />
        </BottomNavigation>
    </Paper>
  );
}
