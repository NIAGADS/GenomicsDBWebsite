import React from "react";
import { Dialog } from "wdk-client/Components";
import LinkagePlot from "../Linkage/Linkage";

interface LinkageModal {
  open: boolean;
  onClose: () => void;
  variants: string[];
}

const LinkageModal: React.FC<LinkageModal> = ({ onClose, open, variants }) => {
  return (
    open && (
      <Dialog
        className="correlation-modal"
        open={true}
        title="LD Correlation"
        onClose={onClose}
      >
        <LinkagePlot variants={variants} />
      </Dialog>
    )
  );
};

export default LinkageModal;
