import React from "react";
import { Dialog } from "wdk-client/Components";
import CorrelationPlot from "./../Correlation/Correlation";

interface CorrelationModal {
  open: boolean;
  onClose: () => void;
  variants: string[];
}

const CorrelationModal: React.FC<CorrelationModal> = ({
  onClose,
  open,
  variants
}) => {
  return (
    open && (
      <Dialog className='correlation-modal' open={true} title="LD Correlation" onClose={onClose}>
        <CorrelationPlot variants={variants} />
      </Dialog>
    )
  );
};

export default CorrelationModal;
