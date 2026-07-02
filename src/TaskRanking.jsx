import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

function TaskRanking({ rank, setRank }){

return (
    <Box sx={{ '& > legend': { mt: 2 } }}>
      <Rating
        name="simple-controlled"
        value={rank}
        onChange={(event, newValue) => {
          setRank(newValue);
        }}
         />

    </Box>
  );
}

export default TaskRanking;