<!DOCTYPE html>

<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ page isELIgnored="false" %>
<html>
<head>
  <!-- Standard Meta -->
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  

  <!-- Site Properties -->
  <title>Rodibat - Technologies</title>
  <link rel="stylesheet" type="text/css" href="/mavenWebApp/resources/semantic/dist/components/semantic.min.css">
  <link rel="stylesheet" type="text/css" href="/mavenWebApp/resources/semantic/dist/components/icon.css">
  <style type="text/css">

	.getStarted a {
	  color: #fff !important;
	  text-decoration: none;
	}
	.getStarted a:hover {
	  color: #fff !important;
	  text-decoration: none;
	}
    .hidden.menu {
      display: none;
    }

    .masthead.segment {
      min-height: 700px;
      padding: 1em 0em;
    }
    .masthead .logo.item img {
      margin-right: 1em;
    }
    .masthead .ui.menu .ui.button {
      margin-left: 0.5em;
    }
    .masthead h1.ui.header {
      margin-top: 3em;
      margin-bottom: 0em;
      font-size: 4em;
      font-weight: normal;
    }
    .masthead h2 {
      font-size: 1.7em;
      font-weight: normal;
    }

    .ui.vertical.stripe {
      padding: 8em 0em;
    }
    .ui.vertical.stripe h3 {
      font-size: 2em;
    }
    .ui.vertical.stripe .button + h3,
    .ui.vertical.stripe p + h3 {
      margin-top: 3em;
    }
    .ui.vertical.stripe .floated.image {
      clear: both;
    }
    .ui.vertical.stripe p {
      font-size: 1.33em;
    }
    .ui.vertical.stripe .horizontal.divider {
      margin: 3em 0em;
    }

    .quote.stripe.segment {
      padding: 0em;
    }
    .quote.stripe.segment .grid .column {
      padding-top: 5em;
      padding-bottom: 5em;
    }

    .footer.segment {
      padding: 5em 0em;
    }

    .secondary.pointing.menu .toc.item {
      display: none;
    }

    @media only screen and (max-width: 700px) {
      .ui.fixed.menu {
        display: none !important;
      }
      .secondary.pointing.menu .item,
      .secondary.pointing.menu .menu {
        display: none;
      }
      .secondary.pointing.menu .toc.item {
        display: block;
      }
      .masthead.segment {
        min-height: 350px;
      }
      .masthead h1.ui.header {
        font-size: 2em;
        margin-top: 1.5em;
      }
      .masthead h2 {
        margin-top: 0.5em;
        font-size: 1.5em;
      }
    }


  </style>

  <script src="/mavenWebApp/resources/assets/library/jquery-1.11.3.min.js"></script>
  <script src="/mavenWebApp/resources/semantic/dist/components/visibility.js"></script>
  <script src="/mavenWebApp/resources/semantic/dist/components/sidebar.js"></script>
  <script src="/mavenWebApp/resources/semantic/dist/components/transition.js"></script>
  <script>
  $(document)
    .ready(function() {

      // fix menu when passed
      $('.masthead')
        .visibility({
          once: false,
          onBottomPassed: function() {
            $('.fixed.menu').transition('fade in');
          },
          onBottomPassedReverse: function() {
            $('.fixed.menu').transition('fade out');
          }
        })
      ;

      // create sidebar and attach to menu open
      $('.ui.sidebar')
        .sidebar('attach events', '.toc.item')
      ;

    })
  ;
  </script>
</head>
<body>

<!-- Following Menu -->
<div class="ui large top fixed hidden menu">
  <div class="ui container">
    <a class="active item" href="#">Home</a>
    <a class="item" href="#work">Work</a>
    <a class="item" href="#company">Company</a>
    <a class="item " href="career/careerhome">Careers</a>
    <div class="right menu">
     	<c:choose>
	     	<c:when test="${userAccountForm.loginResult}">
	     		<div class="item">
		        	<b>Welcome ${userAccountForm.firstName} ${userAccountForm.lastName}!</b>
		      	</div>
	     		<div class="item"> 
		        	<a class="ui button" href="account/logoutAccount">Log out</a>
		      	</div>
	     	</c:when>
	     	<c:otherwise>
	     	 	<div class="item">
		        	<a class="ui button" href="account/loginAccount">Log in</a>
		      	</div>
		      	<div class="item">
		        	<a class="ui primary button" href="account/createAccount">Sign Up</a>
		      	</div>
	     	</c:otherwise>
    	</c:choose>
    </div>
  </div>
</div>

<!-- Sidebar Menu -->
<div class="ui vertical inverted sidebar menu">
  <a class="active item" href="#">Home</a>
  <a class="item" href="#work">Work</a>
  <a class="item" href="#company">Company</a>
  <a class="item" href="career/careerhome">Careers</a>
  <c:choose>
	     	<c:when test="${userAccountForm.loginResult}">
	     		<div class="item">
		        	<b>Welcome ${userAccountForm.firstName} ${userAccountForm.lastName}!</b>
		      	</div>
	     		<div class="item"> 
		        	<a class="ui button" href="account/logoutAccount">Log out</a>
		      	</div>
	     	</c:when>
	     	<c:otherwise>
	     	 	<div class="item">
		        	<a class="ui button" href="account/loginAccount">Log in</a>
		      	</div>
		      	<div class="item">
		        	<a class="ui primary button" href="account/createAccount">Sign Up</a>
		      	</div>
	     	</c:otherwise>
    	</c:choose>
</div>


<!-- Page Contents -->
<div class="pusher">
  <div class="ui inverted vertical masthead center aligned segment">

    <div class="ui container">
      <div class="ui large secondary inverted pointing menu">
        <a class="toc item">
          <i class="sidebar icon"></i>
        </a>
        <a class="active item" href="#">Home</a>
        <a class="item" href="#work">Work</a>
        <a class="item" href="#company">Company</a>
        <a class="item" href="career/careerhome">Careers</a>
        <div class="right item">
	        <c:choose>
		     	<c:when test="${userAccountForm.loginResult}">
		     		<div class="item">
			        	<b>Welcome ${userAccountForm.firstName} ${userAccountForm.lastName}!</b>
			      	</div>
		     		<div class="item"> 
			        	<a class="ui button" href="account/logoutAccount">Log out</a>
			      	</div>
		     	</c:when>
		     	<c:otherwise>
		     	 	<div class="item">
			        	<a class="ui button" href="account/loginAccount">Log in</a>
			      	</div>
			      	<div class="item">
			        	<a class="ui primary button" href="account/createAccount">Sign Up</a>
			      	</div>
		     	</c:otherwise>
	     	</c:choose>
        </div>
      </div>
    </div>

    <div class="ui text container">
      <h1 class="ui inverted header">
        Rodibat Technologies
      </h1>
      <h2>We provide best possible solutions for all your problems.</h2>
      <div class="ui huge primary button"><span class="getStarted"><a href="#work">Get Started</a></span><i class="right arrow icon"></i></div>
    </div>

  </div>

  <div id="work"  class="ui vertical stripe segment">
    <div class="ui middle aligned stackable grid container">
      <div class="row">
        <div class="eight wide column">
          <h3 class="ui header">We Help Companies and Companions</h3>
          <p>We can give your company superpowers to do things that they never thought possible. Let us delight your customers and empower your needs...through pure data analytics.</p>
          <h3 class="ui header">We Make Bananas That Can Dance</h3>
          <p>Yes that's right, you thought it was the stuff of dreams, but even bananas can be bioengineered.</p>
        </div>
        <div class="six wide right floated column">
          <img src="/mavenWebApp/resources/assets/images/wireframe/white-image.png" class="ui large bordered rounded image">
        </div>
      </div>
      <div class="row">
        <div class="center aligned column">
          <a class="ui huge button" href="career/careerhome">Check Them Out</a>
        </div>
      </div>
    </div>
  </div>


  <div id="company" class="ui vertical stripe quote segment">
    <div class="ui equal width stackable internally celled grid">
      <div class="center aligned row">
        <div class="column">
          <h3>"What a Company"</h3>
          <p>That is what they all say about us</p>
        </div>
        <div class="column">
          <h3>"The way to get started is to quit talking and begin doing."</h3>
          <p>
            <img src="/mavenWebApp/resources/assets/images/avatar/pawan.jpg" class="ui avatar image"> <b>Pawan</b> Chief Executive Officer at Rodibat Technologies
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="ui vertical stripe segment">
    <div class="ui text container">
      <h3 class="ui header">Breaking The Grid, Grabs Your Attention</h3>
      <p>Instead of focusing on content creation and hard work, we have learned how to master the art of doing nothing by providing massive amounts of whitespace and generic content that can seem massive, monolithic and worth your attention.</p>
      <a class="ui large button" href="career/careerhome">Read More</a>
      <h4 class="ui horizontal header divider">
        <a href="#">Case Studies</a>
      </h4>
      <h3 class="ui header">Did We Tell You About Our Bananas?</h3>
      <p>Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but its really true. It took years of gene splicing and combinatory DNA research, but our bananas can really dance.</p>
      <a class="ui large button" href="career/careerhome">I'm Still Quite Interested</a>
    </div>
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
