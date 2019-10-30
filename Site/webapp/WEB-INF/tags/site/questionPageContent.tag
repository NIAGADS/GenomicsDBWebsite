<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="imp" tagdir="/WEB-INF/tags/imp" %>
<%@ taglib prefix="html" uri="http://struts.apache.org/tags-html" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="recordName" value="${wdkQuestion.recordClass.displayNamePlural}"/>
<c:set var="q" value="${wdkQuestion}"/>


<c:set var="webProps" value="${wdkQuestion.propertyLists['websiteProperties']}" />
<c:set var="hideOperation" value="${false}" />
<c:set var="hideTitle" value="${false}" />
<c:set var="hideAttrDescr" value="${false}" />

<c:forEach var="prop" items="${webProps}">
  <c:choose>
    <c:when test="${prop eq 'hideOperation'}">
      <c:set var="hideOperation" value="${true}" />
    </c:when>
    <c:when test="${prop eq 'hideTitle'}">
      <c:set var="hideTitle" value="${true}" />
    </c:when>
    <c:when test="${prop eq 'hideAttrDescr'}">
      <c:set var="hideAttrDescr" value="${true}" />
    </c:when>
  </c:choose>
</c:forEach>

<%-- Determine width class --%>
<c:set var="width" value="default"/>
<c:choose>
  <c:when test="${fn:startsWith(q.questionSetName, 'Internal')}">
    <c:set var="width" value="wide"/>
  </c:when>
  <c:otherwise>
    <c:forEach items="${q.params}" var="parameter">
      <c:if test="${(
        parameter.type eq 'FilterParam' or
        parameter.type eq 'FilterParamNew'
      )}">
        <c:set var="width" value="wide"/>
      </c:if>
    </c:forEach>
  </c:otherwise>
</c:choose>


<%-- Wrap in div to control width --%>
<div class="question-content question-content__${width}-width">

  <!-- questionFeature adds icons and tutorials -->
  <!-- having questionFeature as part of the title means it cannot be used for banners; use the extraBanner tag for that -->
  <c:if test="${hideTitle == false}">
    <div class="question-title-container">
      <div class="question-description-link">
        <i class="fa fa-info-circle"></i>
        <a title="Read more about this search below" href="#query-description-section">Learn more about this search</a>
      </div>
      <h1 class="ui-helper-clearfix">${wdkQuestion.displayName}
        <imp:questionFeature question="${wdkQuestion}" refer="questionPage"/>
      </h1>
    </div>
  </c:if>

  <c:if test="fn:containsIgnoreCase(q.questionSetName,'Internal')}">
  <br><center style="position:relative;bottom:20px;font-size:120%;font-family:Verdana">
    <a href="#query-description-section">[Description]</a> |
    <a href="#attributions-section">[Data Sets]</a>
  </center>
  </c:if>

  <a name="query-search-form"></a>

  <div id="query-search-form">
    <html:form method="post" enctype='multipart/form-data' action="/processQuestion.do">

      <imp:questionForm />

      <c:if test="${hideOperation == false}">
          <div title="Click to run a search and generate the first step of a new strategy." class="filter-button">
            <html:submit property="questionSubmit"
                          value="Get Answer"
                          title="Click to run a search and generate the first step of a new strategy."  />
          </div>
          <imp:nameStep/>
      </c:if>

    </html:form>
  </div>

  <%-- displays question description, can be overridden by the custom question form --%>
  <c:if test="${hideAttrDescr == false}">
    <hr/>
    <!-- <div class="content-pane snippet" style="padding:1em 2em"> -->
      <div><imp:questionDescription /></div>
    <!-- </div> -->
  </c:if>

</div>
