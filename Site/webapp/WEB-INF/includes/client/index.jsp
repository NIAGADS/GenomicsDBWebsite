<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="imp" tagdir="/WEB-INF/tags/imp" %>
<%@ taglib prefix="json" uri="http://www.atg.com/taglibs/json" %>

<c:set var="model" value="${applicationScope.wdkModel.model}"/>
<c:set var="props" value="${model.properties}"/>
<c:set var="webAppUrl" value="${pageContext.request.contextPath}"/>
<c:set var="assetsUrl" value="${model.modelConfig.assetsUrl ne null ? model.modelConfig.assetsUrl : webAppUrl}" />
<c:set var="wdkServiceUrl" value="${webAppUrl}${initParam.wdkServiceEndpoint}"/>
<c:set var="gaId" value="${applicationScope.wdkModel.properties['GOOGLE_ANALYTICS_ID']}"/>

<c:set var="externalUrls">
  <json:object>
    <c:forEach items="${props}" var="prop">
      <c:if test="${fn:contains(prop.key, '_URL')}">
	     <json:property name="${prop.key}" value="${prop.value}"/>
      </c:if>
    </c:forEach>
  </json:object>
</c:set>

<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script>
      // used for webpack. remove this when this can be set at build time.
      window.__asset_path_remove_me_please__ = "${assetsUrl}/";

      // used by EbrcWebsiteCommon to initialize wdk
      window.__SITE_CONFIG__ = {
        rootElement: "#wdk-container",
        rootUrl: "${webAppUrl}${pageContext.request.servletPath}",
        endpoint: "${wdkServiceUrl}",
        displayName: "${model.displayName}",
        projectId: "${model.projectId}",
        buildNumber: "${model.buildNumber}",
        releaseDate: "${model.releaseDate}",
        webAppUrl: "${webAppUrl}",
	      externalUrls: ${externalUrls},
      };
    

      <%-- Initialize google analytics. A pageview event will be sent in the JavaScript code. --%>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', '${gaId}', 'auto');
    </script>
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>
    <imp:stylesheet rel="stylesheet" type="text/css" href="vendor.bundle.css"/>
    <imp:stylesheet rel="stylesheet" type="text/css" href="wdk-client.bundle.css"/>
    <imp:stylesheet rel="stylesheet" type="text/css" href="site-client.bundle.css"/>
    <imp:script charset="utf8" src="vendor.bundle.js" ></imp:script>
    <imp:script charset="utf8" src="wdk-client.bundle.js" ></imp:script>
    <imp:script charset="utf8" src="site-client.bundle.js" ></imp:script>
  </head>
  <body>
    <div class="main-stack">
      <div id="wdk-container">Loading...</div>
    </div>
  </body>
</html>
