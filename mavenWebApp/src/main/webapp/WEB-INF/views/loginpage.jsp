<!DOCTYPE html>

<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ page isELIgnored="false" %>
<html>
<head>

 <!-- Site Properties -->
  <title>Rodibat - Technologies</title>

 <link rel="stylesheet" type="text/css" href="/mavenWebApp/resources/semantic/dist/components/site.css">

 <link rel="stylesheet" type="text/css" href="/mavenWebApp/resources/semantic/dist/components/semantic.min.css">

  <style type="text/css">
	#userAccountForm input{
	 color:#000;
    }
    
    .main-form-container {
	    width: 50%;
	    margin: 8% auto !important;
	}
    
  </style>

  <script src="/mavenWebApp/resources/assets/library/jquery-1.11.3.min.js"></script>
  <script src="/mavenWebApp/resources/semantic/dist/components/visibility.js"></script>
  <script src="/mavenWebApp/resources/semantic/dist/components/sidebar.js"></script>
  <script src="/mavenWebApp/resources/semantic/dist/components/transition.js"></script>
  <script>
 
  </script>
</head>
<body>



<!-- Page Contents -->
  <div class="ui inverted vertical masthead center aligned segment">

    <div class="ui container">
      <div class="ui large secondary inverted pointing menu">
        <a class="active item" href="/mavenWebApp">Home</a>
        <a class="item" href="/mavenWebApp">Work</a>
        <a class="item" href="/mavenWebApp">Company</a>
        <a class="item" href="careerhome">Careers</a>
        <div class="right item">
          <a class="ui inverted button">Log in</a>
          <a class="ui inverted button" href="createAccount">Sign Up</a>
        </div>
      </div>
    </div>

    <div class=" text container main-form-container">
    	
	    <form:form id="userAccountForm" class="ui form" action="/mavenWebApp/account/login" modelAttribute="userAccountForm" method="post">
	    
		<c:if test="${requestScope.Message != null}">
				<label>${requestScope.Message}</label><br/><br/>
		</c:if>
		  <div class="field">
		    <label>Email Id</label>
		    <input type="email" id="emailId" maxlength="20" name="emailId" placeholder="Email ID" required>
		    <form:errors path="emailId"  /><br/><br/>
		  </div>
		  <div class="field">
		    <label>Password</label>
		    <input type="password" id="password" maxlength="20" name="password" placeholder="Password" required/>
		    <form:errors path="password"  /><br/><br/>
		  </div>
		  <button class="ui button" type="submit">Submit</button>
		</form:form>
    
    </div>

  <div class="ui inverted vertical footer segment">
    <div class="ui container">
      <div class="ui stackable inverted divided equal height stackable grid">
        <div class="three wide column">
          <h4 class="ui inverted header">About</h4>
          <div class="ui inverted link list">
            <a href="#" class="item">Sitemap</a>
            <a href="#" class="item">Contact Us</a>
            <a href="#" class="item">Religious Ceremonies</a>
            <a href="#" class="item">Gazebo Plans</a>
          </div>
        </div>
        <div class="three wide column">
          <h4 class="ui inverted header">Services</h4>
          <div class="ui inverted link list">
            <a href="#" class="item">Banana Pre-Order</a>
            <a href="#" class="item">DNA FAQ</a>
            <a href="#" class="item">How To Access</a>
            <a href="#" class="item">Favorite X-Men</a>
          </div>
        </div>
        <div class="seven wide column">
           <h4 class="ui inverted header">Creater and Designer</h4>
          <p>PAWAN PARIHAR Copyright © 2016</p>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>