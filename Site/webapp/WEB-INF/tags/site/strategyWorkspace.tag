<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="imp" tagdir="/WEB-INF/tags/imp" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ attribute name="includeDYK"
              required="true"
%>
<c:set var="baseUrl" value="${pageContext.request.contextPath}"/>
<c:set var="wdkUser" value="${sessionScope.wdkUser}"/>
<c:set var="allCount" value="${wdkUser.strategyCount}"/>
<c:set var="openCount" value="${fn:length(wdkUser.activeStrategies)}"/>
<c:set var="publicCount" value="${wdkUser.publicCount}"/>
<c:set var="basketCounts" value="${wdkUser.basketCounts}"/>

<div id="stage-stack"> </div>

<div id="contentwrapper"
    data-controller="wdk.strategy.controller.init"
    data-all-count="${allCount}"
    data-open-count="${openCount}"
    data-public-count="${publicCount}" >

   <div id="contentcolumn2">
      <div class="innertube">

<c:if test="${includeDYK}">
  <imp:dyk/>
</c:if>

<%------------MY STRATEGIES MENU (TABs)----------%>
<ul id="strategy_tabs">
<%-- wdk.addStepPopup.showPanel() is in addStepPopup.js --%>

   <li><span id="stratTitle" class="h4left">My Strategies:</span></li>

   <li><a id="tab_strategy_new" title="Start a new strategy. (Your opened strategies will remain untouched)"
      href="app/query-grid">New</a></li>

   <li><a id="tab_strategy_results" title="View and interact with your opened strategies. To close a strategy, click the [X] in its upper right corner"
	    onclick="this.blur()" href="javascript:wdk.addStepPopup.showPanel('strategy_results')">Opened <font class="subscriptCount">(${openCount})</font></a></li>

   <li><a id="tab_search_history" title="View and browse all your strategies"
	    onclick="this.blur()" href="javascript:wdk.addStepPopup.showPanel('search_history')">All <font class="subscriptCount">(${allCount})</font></a></li>

   <c:set var="basketTitle" value="View your basket. Use the basket to operate on the items in it. For example, add them as a step in a strategy"/>
   <c:if test="${fn:length(basketCounts) > 0}">
      <c:choose>
	       <c:when test="${wdkUser.guest}">
            <li><a style="padding-left:5px;" id="tab_basket" title="${basketTitle}" onclick="this.blur()" href="javascript:wdk.user.login('use baskets');"><imp:image class="basket" src="wdk/images/basket_gray.png" width="15" height="15"/>&nbsp;Basket</a></li>
	       </c:when>
	       <c:otherwise>
            <li><a style="padding-left:5px;" id="tab_basket" title="${basketTitle}" onclick="this.blur()" href="javascript:wdk.addStepPopup.showPanel('basket')"><imp:image class="basket" src="wdk/images/basket_gray.png" width="15" height="15"/>&nbsp;Basket</a></li>
	       </c:otherwise>
      </c:choose>
   </c:if>

   <li>
     <a id="tab_public_strat" title="View sample strategies and those made public by others"
        onclick="this.blur()" href="javascript:wdk.addStepPopup.showPanel('public_strat')">
       Public Strategies <font class="subscriptCount">(${publicCount})</font>
     </a>
   </li>

   <li><a id="tab_help" title="Help in using strategies"
	    href="javascript:wdk.addStepPopup.showPanel('help')">Help</a></li>

</ul>

<%--------------- REST OF PAGE ---------------%>

<c:set var="newStrategy" value="${requestScope.newStrategy}" />
<c:set var="newStrat"><c:if test="${newStrategy ne null and newStrategy eq true}">newStrategy="true"</c:if></c:set>

<!-- QUERY GRID -->
<div id="strategy_new" class="workspace_panel">
</div>

<!-- OPENED tab -->
<div id="strategy_results" class="workspace_panel"> 
  <div id="strategy_messages"> </div>
  <c:set var="showStratPanel" value="${wdkModel.model.uiConfig.showStratPanelByDefault}"/>
  <c:set var="currentImgName" value="${showStratPanel ? 'minus' : 'plus'}"/>
  <c:set var="currentToggleCmd" value="${showStratPanel ? 'Hide' : 'Show'}"/>
  <c:set var="currentDisplayCss" value="${showStratPanel ? 'block' : 'none'}"/>
  <button type="button" id="strategies-panel-toggle" class="wdk-Link" style="display:${currentDisplayCss};" data-default="${showStratPanel}" style="display:flex;align-items:center;color:black;padding-top:10px !important;font-size:110%;font-family:arial;font-weight:bold" data-action="toggle-strat-panel">
    <img src="${baseUrl}/wdk/images/${currentImgName}.gif"/>
    <span>
      <span class="toggle-command">${currentToggleCmd}</span> search strategy panel
    </span>
  </button> 
  <div id="strategies-panel" class="resizable-wrapper" style="display:${currentDisplayCss}">
    <div class="scrollable-wrapper edit-step-pane">
      <div id="Strategies" ${newStrat}>
      </div>
    </div>
  </div>

  <br/>
<!--
  <div style="font-size:120%" title="Step in yellow above. You may select a different step by clicking on its result number (inside the step)." class="h4left">&nbsp;My Step Result:</div>
-->
  <div class="Workspace">&nbsp;<span class="smaller-font"><i>(if this section is empty after the page is fully loaded, please open the strategy panel and click on a step to view its results in this section.)</i></span>
  </div>

</div>

<!-- ALL tab -->
<div id="search_history" class="workspace_panel">
</div>

<!-- BASKET -->
<div id="basket" class="workspace_panel">
</div>

<!-- PUBLIC tab -->
<div id="public_strat" class="workspace_panel">
</div>

<!-- HELP -->
<div id="help">
</div>

      </div>
   </div>
</div>
