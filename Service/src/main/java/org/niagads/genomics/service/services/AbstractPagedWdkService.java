package org.niagads.genomics.service.services;

import org.apache.log4j.Logger;
import org.gusdb.wdk.service.service.AbstractWdkService;

import java.lang.Math;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public abstract class AbstractPagedWdkService extends AbstractWdkService {
    protected final Logger LOG = Logger.getLogger(this.getClass().getName());

    protected final static String PAGE_PARAM = "page";
    protected final static Integer PAGE_SIZE = 200; // number of recortdds
    protected int _numPages;
    protected int _currentPage;
    protected int _numFeatureLookups = -1;
    protected List<String> _featureLookupList;
    
    protected void setNumPages() {
        _numPages = (_numFeatureLookups > 0) ? (int) Math.ceil((double) _numFeatureLookups / PAGE_SIZE) : 1;
    }

    protected int getNumPages() {
        return _numPages;
    }

    protected int getCurrentPage() {
        return _currentPage; // zero-based index
    }

    protected int getCurrentPageDisplay() {
        return _currentPage + 1; // 1-based index
    }

    protected void setCurrentPage(int currentPage) {
        _currentPage = currentPage - 1; // index pages from zero
    }

    protected void setFeatureLookupList(String idList) {
        String[] strArray = idList.split(",");    
        _featureLookupList = Arrays.asList(strArray);
        _numFeatureLookups = _featureLookupList.size();        
    }

    protected Integer getNumFeatureLookups() {
        return _numFeatureLookups;
    }

    // slices featureLookupList and return comma separated string w/paged ids
    protected String getPagedFeatureStr() {
        int startIndex = 0 + (_currentPage * PAGE_SIZE);
        int endIndex = PAGE_SIZE + (_currentPage * PAGE_SIZE);
        if (endIndex > _numFeatureLookups) {
            endIndex = _numFeatureLookups;
        }
        List<String> subset = _featureLookupList.subList(startIndex, endIndex);  // from - inclusive, to -- exclusive
        LOG.debug("split: " + startIndex + " - " + endIndex );
        LOG.debug("subset: " + subset.toString());
        return subset.stream().collect(Collectors.joining(","));
    }

    protected Boolean initializePaging(String idList, int currentPage) {
        setFeatureLookupList(idList);
        setNumPages();
        setCurrentPage(currentPage);
        return validateCurrentPage();
    }

    private Boolean validateCurrentPage() {
        return getCurrentPageDisplay() <= _numPages;
    }



    
}
