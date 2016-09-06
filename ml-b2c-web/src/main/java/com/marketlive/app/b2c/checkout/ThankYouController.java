package com.marketlive.app.b2c.checkout;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller(ThankYouController.NAME)
@RequestMapping(value = "/thankyou")
public class ThankYouController {

	/** The name of this component. */
	public static final String NAME = "thankYouController";
	
	@RequestMapping(method = RequestMethod.GET)
	public String view(Model model) {
		model.addAttribute("action", "thank you view");
		
		System.out.println("###### ThankYouController.view(...)");
		
        return ".tile.checkout.thankYou";
    }
}
