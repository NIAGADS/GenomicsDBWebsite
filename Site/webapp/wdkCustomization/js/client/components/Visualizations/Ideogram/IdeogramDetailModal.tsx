import React from "react";
import { Dialog } from "wdk-client/Components";
import { Link } from "wdk-client/Components";
import LinkagePlot from "../Linkage/Linkage";

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
          {variants.length < 5 ? (
            <ul>
              {variants.map(v => (
                <li key={v}>
                  <Link to={`/record/variant/${v}`}>{v}</Link>
                </li>
              ))}
            </ul>
          ) : variants.length < 21 ? (
            <LinkagePlot variants={variants} />
          ) : (
            <div>
              The number of results is too large to display here. Please click
              this&nbsp;
              <Link
                to={`/visualizations/linkage?name=${name}&variants=${variants.join(
                  ","
                )}`}
              >
                link
              </Link>
              &nbsp; to view the chart on a new page.
            </div>
          )}
        </div>
      </Dialog>
    )
  );
};

export default IdeogramDetailModal;
