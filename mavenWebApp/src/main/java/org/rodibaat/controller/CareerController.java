package org.rodibaat.controller;

import org.rodibaat.form.UserAccountForm;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;


@RestController
@RequestMapping("/career")
public class CareerController {
	public static final String NAME = "CareerController";
	public static String CAREER_HOME = "careerhome";
	public static String USER_ACCOUNT = "account/createAccount";
	public static String LOGIN_ACCOUNT = "account/loginAccount";
	public static String REDIRECT_URL = "redirect:/";
	
	@RequestMapping(value="/careerhome", method = RequestMethod.GET)
	public ModelAndView CreateAccount(@ModelAttribute UserAccountForm userAccountForm) {
		ModelAndView model = new ModelAndView();
		model.setViewName(CAREER_HOME);

		return model;
	}
	
	@RequestMapping(value="/createAccount", method = RequestMethod.GET)
	public ModelAndView userAccount(@ModelAttribute UserAccountForm userAccountForm) {
		ModelAndView model = new ModelAndView();
		model.setViewName(REDIRECT_URL+USER_ACCOUNT);
		return model;
	}
	
	@RequestMapping(value="/loginAccount", method = RequestMethod.GET)
	public ModelAndView loginAccount(@ModelAttribute UserAccountForm userAccountForm) {
		ModelAndView model = new ModelAndView();
		model.setViewName(REDIRECT_URL+LOGIN_ACCOUNT);
		return model;
	}

}
