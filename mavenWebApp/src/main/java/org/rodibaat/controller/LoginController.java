package org.rodibaat.controller;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.rodibaat.form.UserAccountForm;
import org.rodibaat.interceptor.RodibatSession;
import org.rodibaat.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

@RestController
@SessionAttributes("userAccountForm")
@RequestMapping("/account")
public class LoginController {
	
	public static final String NAME = "LoginController";
	public static String USER_ACCOUNT = "useraccount";
	public static String LOGIN_PAGE = "loginpage";
	public static String REDIRECT_URL = "redirect:/";
	public static String HOME_PAGE = "home";
	public static String USER_ACCOUNT_REGISTERED = "useraccountregistered";
	public static String CAREER_HOME = "career/careerhome";
	
	@Autowired
	private UserAccountService userAccountService;
	
	@Autowired
	private RodibatSession rodibatSession;

	@PostConstruct
	public void init() {
		System.out.println("##########################");
	}
	
    @ModelAttribute(UserAccountForm.NAME)
    public UserAccountForm createUserAccountForm() {
        return new UserAccountForm();
    }
	
	@RequestMapping(value="/createAccount", method = RequestMethod.GET)
	public ModelAndView CreateAccount(@ModelAttribute UserAccountForm userAccountForm) {
		ModelAndView model = new ModelAndView();
		model.setViewName(USER_ACCOUNT);

		return model;
	}
	
	@RequestMapping(value="/loginAccount", method = RequestMethod.GET)
	public ModelAndView loginAccount(@ModelAttribute UserAccountForm userAccountForm) {
		ModelAndView model = new ModelAndView();
		model.setViewName(LOGIN_PAGE);

		return model;
	}
	
	@RequestMapping(value="/careerhome", method = RequestMethod.GET)
	public ModelAndView userAccount(@ModelAttribute UserAccountForm userAccountForm) {
		ModelAndView model = new ModelAndView();
		model.setViewName(REDIRECT_URL+CAREER_HOME);
		return model;
	}
	
	@RequestMapping(value="/logoutAccount", method = RequestMethod.GET)
	public ModelAndView logoutAccount(@ModelAttribute UserAccountForm userAccountForm) {
		ModelAndView model = new ModelAndView();
		rodibatSession.setLoggedIn(false);
		rodibatSession.setLogout(true);
		model.setViewName(REDIRECT_URL);

		return model;
	}
	
	@RequestMapping(value="/submit", method = RequestMethod.POST)
	public ModelAndView SubmitNewAccount(@Valid @ModelAttribute(UserAccountForm.NAME) UserAccountForm userAccountForm, BindingResult bindingResult, ModelAndView model) throws Exception{
		System.out.println("***submit*****");

		if (bindingResult.hasErrors()) {
			model.setViewName(USER_ACCOUNT);
			return model;
		}
		
		boolean result = false;
		String firstName = userAccountForm.getFirstName();
		String lastName = userAccountForm.getLastName();
		String password = userAccountForm.getPassword();
		String emailId = userAccountForm.getEmailId();
		boolean agreeTerms = userAccountForm.isAgreeTermsConditions();
		if (true == agreeTerms) {
			
			boolean accountAlreadyExit =  userAccountService.findAccount(emailId);
			if (!accountAlreadyExit){
				result = userAccountService.createAccount(firstName,lastName,password,emailId,agreeTerms);
			} else {
				ObjectError error = new ObjectError("emailId","An account already exists for this emailId.");
				bindingResult.addError(error);
				model.setViewName(USER_ACCOUNT);
				return  model;
			}
			
		}

		if (result == false) {
			model.setViewName(USER_ACCOUNT);
			return  model;
		}
		model.setViewName(USER_ACCOUNT_REGISTERED);
		return model;
	}
	
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public ModelAndView hello(HttpServletRequest request, UserAccountForm userAccountForm, ModelAndView model) throws Exception{
		
		String emailId = userAccountForm.getEmailId();
		String password = userAccountForm.getPassword();
		boolean result = userAccountService.loginAccount(emailId,password);
		userAccountForm.setLoginResult(result);
		if (result == false) {
			request.setAttribute("Message", "The entered EmailID or Password is incorrect.");
			model.setViewName(LOGIN_PAGE);
			return  model;
		} else {
			rodibatSession.setLoggedIn(result);
			rodibatSession.setLogout(false);
			rodibatSession.setEmailId(emailId);
			rodibatSession.setPassword(password);
		}
		
		model.setViewName(REDIRECT_URL);
		return model;
	}
}
