import React from "react";
import { Dialog } from "wdk-client/Components";
import { Link } from "wdk-client/Components";

interface IdeogramDetailModal {
  open: boolean;
  onClose: () => void;
  variants: string[];
  name: string;
}

const IdeogramDetailModal: React.FC<IdeogramDetailModal> = ({
  onClose,
  open,
  name,
  variants
}) => {
  return (
    open && (
      <Dialog
        className="ideogram-detail-modal"
        open={true}
        title={`Variant Details for ${name}`}
        onClose={onClose}
      >
        <div>
          <ul>
            {variants.map(v => (
              <li key={v}>
                <Link to={`/record/variant/${v}`}>{v}</Link>
              </li>
            ))}
          </ul>
        </div>
      </Dialog>
    )
  );
};

export default IdeogramDetailModal;
