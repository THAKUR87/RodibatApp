<%--
    //(C) Copyright MarketLive. 2013. All rights reserved.
    //MarketLive is a trademark of MarketLive, Inc.
    //Warning: This computer program is protected by copyright law and international treaties.
    //Unauthorized reproduction or distribution of this program, or any portion of it, may result
    //in severe civil and criminal penalties, and will be prosecuted to the maximum extent
    //possible under the law.
--%>

Billing Page Body Tile
</br>
${action}

<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>

<form:form id="billingForm" action="./billing" modelAttribute="billingForm" method="POST">
	<div>First Name <form:input path="firstName" value="" /></div>
	<div>Middle Name <form:input path="middleName" value="" /></div>
	<div>Last Name <form:input path="lastName" value="" /></div>
	<div>Street 1 <form:input path="street1" value="" /></div>
	<div>Street 2 <form:input path="street2" value="" /></div>
	<div>Street 3 <form:input path="street3" value="" /></div>
	<div>Post Office Box <form:checkbox path="postOfficeBox" />
	<div>City <form:input path="city" value="" /></div>
	<div>State</div>
	<div>Postal Code <form:input path="postalCode" value="" /></div>
	<div>Country</div>
	<div>Phone 1 <form:input path="phone1" value="" /></div>
	<div>Phone 2 <form:input path="phone2" value="" /></div>
	<div>Email <form:input path="email" value="" /></div>
	<div><button type="submit">Submit Billing</button></div>
</form:form>