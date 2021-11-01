import React from "react";
import { getSingleRecordAnswerSpec } from 'wdk-client/Utils/WdkModel';
import { emptyAction } from 'wdk-client/Core/WdkMiddleware';
import { makeDynamicWrapper } from "../components/record.js";

export const RecordHeading = makeDynamicWrapper('RecordHeading');
export const RecordMainSection = makeDynamicWrapper('RecordMainSection');
export const RecordNavigationSection = makeDynamicWrapper('RecordNavigationSection');

function downloadRecordTable(record:any, tableName: string) {
    //@ts-ignore
    return ({ wdkService }) => {
      let answerSpec = getSingleRecordAnswerSpec(record);
      let formatting = {
        format: 'tableTabular',
        formatConfig: {
          tables: [ tableName ],
          includeHeader: true,
          attachmentType: "text"
        }
      };
      wdkService.downloadAnswer({ answerSpec, formatting });
      return emptyAction;
    };
  }

