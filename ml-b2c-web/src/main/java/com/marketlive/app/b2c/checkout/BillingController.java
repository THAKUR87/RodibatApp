package com.marketlive.app.b2c.checkout;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller(BillingController.NAME)
@RequestMapping(value = "/billing")
public class BillingController {

	/** The name of this component. */
	public static final String NAME = "billingController";
	
	// TIPS............
	// In JSP's under form element the action and method attributes can also be specified.
	// If unspecified, they default to the current URL and "POST", respectively (just like regular HTML forms).
	//
	// Simply adding '@Valid' tells Spring to validate the "Subscriber" object. 
	// Nice! Notice we also add a “BindingResult” argument. This is Spring’s object that holds the result of the validation and binding 
	// and contains errors that may have occurred. The BindingResult must come right after the model object that is validated or 
	// else Spring will fail to validate the object and throw an exception.
	
	// When Spring sees "@Valid", it tries to find the validator for the object being validated. 
	// Spring automatically picks up validation annotations if you have "annotation-driven" enabled. 
	// Spring then invokes the validator and puts any errors in the BindingResult and adds the BindingResult to the view model.
	
	// Invoked on every request.
	// When a method is annotated with @ModelAttribute, Spring runs it before each handler method and adds the return value to the model.
	@ModelAttribute("billingForm")
    public BillingForm createBillingForm() {
        return new BillingForm();
    }
	
	@RequestMapping(method = RequestMethod.GET)
	public String view(Model model) {
		model.addAttribute("action", "billing view");
		
		System.out.println("###### BillingController.view(...)");
		
        return ".tile.checkout.billing";
    }
	
	@RequestMapping(method = RequestMethod.POST)
	public String submit(Model model) {
		model.addAttribute("action", "billing submit");
		
		System.out.println("###### BillingController.submit(...)");
		
        return "redirect:/shippingmethod";
    }
}
