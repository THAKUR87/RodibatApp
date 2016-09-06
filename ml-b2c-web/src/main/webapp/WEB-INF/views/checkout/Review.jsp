<%--
    //(C) Copyright MarketLive. 2013. All rights reserved.
    //MarketLive is a trademark of MarketLive, Inc.
    //Warning: This computer program is protected by copyright law and international treaties.
    //Unauthorized reproduction or distribution of this program, or any portion of it, may result
    //in severe civil and criminal penalties, and will be prosecuted to the maximum extent
    //possible under the law.
--%>

Review Page Body Tile
</br>
${action}

<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>

<form:form id="reviewForm" action="./review" method="POST">
	<div><button type="submit">Submit Review</button></div>
</form:form>