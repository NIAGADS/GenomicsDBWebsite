import * as React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

export const LoadingOverlay: React.SFC<{color: "inherit" | "primary" | "secondary"}> = ({color}) => {

  return (
    <>
      <Backdrop open={true}>
        <CircularProgress color={color ? color : "inherit"} />
      </Backdrop>
    </>
  );
}