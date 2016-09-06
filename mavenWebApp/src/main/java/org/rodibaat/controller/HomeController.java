package org.rodibaat.controller;

import javax.annotation.PostConstruct;

import org.rodibaat.form.UserAccountForm;
import org.rodibaat.interceptor.RodibatSession;
import org.rodibaat.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping("/")
public class HomeController {
	
	public static final String NAME = "HomeController";
	public static String HOME_PAGE = "home";
	
	@Autowired
	RodibatSession rodibatSession;
	
	@Autowired
	private UserAccountService userAccountService;
	
	@PostConstruct
	public void init() {
		System.out.println("@@@@@@@@");
	}
	
	@ModelAttribute("userAccountForm")
	    public UserAccountForm createUserAccountForm() {
	        return new UserAccountForm();
	}
	
	@RequestMapping(method = {RequestMethod.GET, RequestMethod.POST})
	public ModelAndView home(@ModelAttribute UserAccountForm userAccountForm) throws Exception{
		ModelAndView model = new ModelAndView();
		boolean result = rodibatSession.isLoggedIn();
		
		if (result == true ) {
			String emailId = rodibatSession.getEmailId();
			boolean accountExit = userAccountService.findAccount(emailId);
			if (accountExit) {
				userAccountForm.setFirstName(rodibatSession.getFirstName());
				userAccountForm.setLastName(rodibatSession.getLastName());
				userAccountForm.setEmailId(rodibatSession.getEmailId());
				userAccountForm.setLoginResult(rodibatSession.isLoggedIn());
			}
		}
		
		model.setViewName(HOME_PAGE);

		return model;
	   }
}
