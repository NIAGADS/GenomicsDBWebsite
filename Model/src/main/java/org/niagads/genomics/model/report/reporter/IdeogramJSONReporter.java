package org.niagads.genomics.model.report.reporter;

import java.io.IOException;
import java.io.OutputStream;

import org.gusdb.fgputil.json.JsonWriter;
import org.gusdb.wdk.model.WdkModelException;

import org.gusdb.wdk.model.answer.AnswerValue;

import org.json.JSONObject;

import org.gusdb.wdk.model.report.AbstractReporter;
import org.gusdb.wdk.model.report.Reporter;
import org.gusdb.wdk.model.report.ReporterConfigException;

/**
 * @author EGA
 */

public class IdeogramJSONReporter extends AbstractReporter {
    public IdeogramJSONReporter(AnswerValue answerValue) {
        super(answerValue);
    }

    @Override
    public Reporter configure(JSONObject config) throws ReporterConfigException, WdkModelException {
      return this;
    }

    @Override
    public String getDownloadFileName() {
        return _baseAnswer.getAnswerSpec().getQuestion().getName() + "_ideogram.json";
    }

    @Override
    protected void write(OutputStream out) throws WdkModelException {

        // create output writer and initialize record stream
        try (JsonWriter writer = new JsonWriter(out)) {
            int numRecordsReturned = _baseAnswer.getResultSizeFactory().getResultSize();
            writer.key("message").value("Hello world!");
            // end records array, write meta property, and close object
            writer.endArray().key("num_records").value(numRecordsReturned);
        }
        catch (WdkModelException e) {
            throw new WdkModelException("Error getting result size", e);
        }
        catch (IOException e) {
            throw new WdkModelException("Unable to write reporter result to output stream", e);
        }

    }
}