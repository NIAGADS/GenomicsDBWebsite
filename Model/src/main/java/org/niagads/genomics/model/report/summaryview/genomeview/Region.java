package org.niagads.genomics.model.report.summaryview.genomeview;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

public class Region {

    private long _location[];
    private String _chromosome;
    private JSONArray _features;

    final private static String FIELD_START_POSITION = "location_start";
    final private static String FIELD_END_POSITION = "location_end";
    final private static String FIELD_LENGTH = "span_length";
    final private static String FIELD_PRIMARY_KEY = "record_primary_key";

    public Region(String chromosome) {
        _location = null;
        _chromosome = chromosome;
        _features = new JSONArray();
    }

    public String getChromosome() {
        return _chromosome;
    }

    public void addFeature(JSONObject feature) {
        _features.put(feature);
    }
    
    public int getNumFeatures() {
        return _features.length();
    }

    public String getName() {
        return _chromosome + ":" + String.valueOf(getStart()) + "-" + String.valueOf(getEnd());
    }

    public JSONArray getFeatures() {
        return _features;
    }

    public String getFeatureIdListStr() {   
        List<String> ids = new ArrayList<String>();

        _features.forEach(element -> {
            JSONObject feature = (JSONObject) element;
            ids.add((String) feature.get(FIELD_PRIMARY_KEY));
        });
        
        return String.join(",", ids);
    }

    public int getFeatureCount() {
        return _features.length();
    }

    private void setLocation() { 

        if (_features.length() <= 0) {
            _location =  new long[] { 0, 0 };
        }
        else {    
            long start = Long.MAX_VALUE, end = Long.MIN_VALUE;
            Iterator<Object> iterator = _features.iterator();
            while (iterator.hasNext()) {
                JSONObject feature = (JSONObject) iterator.next();
                Integer fStart = (Integer) feature.get(FIELD_START_POSITION);
                Integer fEnd = (Integer) feature.get(FIELD_END_POSITION);
                if (fStart < start)
                    start = fStart.longValue();
                if (fEnd > end)
                    end = fEnd.longValue();
            }
            _location = new long[] { start, end };
        }
    }

    public long getStart() {
        if (_location == null) {
            setLocation();
        }
        return _location[0];
    }

    public long getEnd() {
        if (_location == null) {
            setLocation();
        }
        return _location[1];
    }

    public long getLength() {
        return (_location[1] - _location[0] + 1); 
    }

    public long[] getLocation() {
        if (_location == null) {
            setLocation();
        }
        return _location;
    }
}