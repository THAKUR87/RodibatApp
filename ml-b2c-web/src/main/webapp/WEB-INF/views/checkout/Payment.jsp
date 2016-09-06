<%--
    //(C) Copyright MarketLive. 2013. All rights reserved.
    //MarketLive is a trademark of MarketLive, Inc.
    //Warning: This computer program is protected by copyright law and international treaties.
    //Unauthorized reproduction or distribution of this program, or any portion of it, may result
    //in severe civil and criminal penalties, and will be prosecuted to the maximum extent
    //possible under the law.
--%>

Payment Page Body Tile
</br>
${action}

<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>

<form:form id="paymentForm" action="./payment" modelAttribute="paymentForm" method="POST">
	<div><button type="submit">Submit Payment</button></div>
</form:form>