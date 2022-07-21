import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import VolumeUp from '@material-ui/icons/VolumeUp';

const useStyles = makeStyles({
  root: {
    width: 250,
  },
  input: {
    width: 42,
  },
});

interface SliderProps {
    handleChange: any;
    valueLabelFormat: any;
    min: number;
    max: number;
    step: number;
    currentValue: number | number [];
    marks?: any;
    label: any;
    scale?: any;
}
export const InputSlider: React.FC<SliderProps> = ({ handleChange, valueLabelFormat, label, min, max, step, currentValue, marks}) => {
  const classes = useStyles();
  const [value, setValue] = useState<number | string | Array<number | string>>(currentValue);

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    setValue(newValue);
    handleChange(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
    handleChange(event.target.value);
  };

  const handleBlur = () => {
    if (value < min) {
      setValue(min);
    } else if (value > max) {
      setValue(max);
    }
  };

  return (
    <div className={classes.root}>
      <Typography id="input-slider" gutterBottom>
        {label}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="pvalue-filter-slider"
            valueLabelDisplay="on"
            valueLabelFormat={valueLabelFormat}
          />
        </Grid>
        <Grid item>
          <Input
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: step,
              min: min,
              max: max,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}

          />
        </Grid>
      </Grid>
    </div>
  );
}
