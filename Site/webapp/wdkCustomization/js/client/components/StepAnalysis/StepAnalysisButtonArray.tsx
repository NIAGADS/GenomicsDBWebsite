import React, { ReactNode } from 'react';
import Button from 'react-bootstrap/Button';

interface StepAnalysisButtonArrayProps {
  configs: StepAnalysisButtonConfig[];
}

export const StepAnalysisButtonArray: React.SFC<StepAnalysisButtonArrayProps> = ({
  configs
}) => (
  <div style={{ textAlign: 'right', display: 'block', float: 'right', paddingTop: '35px'}}>
    {
      configs.map(config => <StepAnalysisButton {...config} />)
    }
  </div>
);

type StepAnalysisButtonConfig = StepAnalysisButtonProps & { key: string; };

interface StepAnalysisButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  customButton?: ReactNode;
  href?: string;
  iconClassName?: string;
  contents?: ReactNode;
}

const StepAnalysisButton: React.SFC<StepAnalysisButtonProps> = ({
  onClick,
  customButton,
  href,
  iconClassName,
  contents
}) => (
  <div style={{ display: 'inline-block', margin: '5px'}}>
    {
      customButton || (
          <Button variant="info" href={href} onClick={onClick}>
            <i className={`${iconClassName} text-white mr-2`}> </i>
            {contents}
          </Button>
      )
    }
  </div>
);