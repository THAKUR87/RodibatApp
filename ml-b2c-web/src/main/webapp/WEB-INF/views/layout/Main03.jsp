<%--
    //(C) Copyright MarketLive. 2013. All rights reserved.
    //MarketLive is a trademark of MarketLive, Inc.
    //Warning: This computer program is protected by copyright law and international treaties.
    //Unauthorized reproduction or distribution of this program, or any portion of it, may result
    //in severe civil and criminal penalties, and will be prosecuted to the maximum extent
    //possible under the law.
--%>

<%@ include file="/WEB-INF/views/common/TagLibs.jsp" %>

<!DOCTYPE html>
<html lang="en-US">

<head>
</head>

<body>
	<div style="border:1px solid black"><tiles:insertAttribute name="header" /></div>
	</br>
	<div style="border:1px solid black"><tiles:insertAttribute name="categoryNav" /></div>
	</br>
	<div style="border:1px solid black"><tiles:insertAttribute name="body" /></div>
	</br>
	<div style="border:1px solid black"><tiles:insertAttribute name="footer" /></div>
</body>
</html>
