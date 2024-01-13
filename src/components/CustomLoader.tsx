import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function CustomLoader() {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 50 }}>
      <Box sx={{ height: 40 }}>
          <CircularProgress />
      </Box>
      <Button sx={{ m: 2 }}>
        {'Please wait while we load the preview...'}
      </Button>
    </Box>
  );
}