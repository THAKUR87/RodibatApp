package com.marketlive.app.b2c.checkout;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller(ReviewController.NAME)
@RequestMapping(value = "/review")
public class ReviewController {

	/** The name of this component. */
	public static final String NAME = "reviewController";
	
	@RequestMapping(method = RequestMethod.GET)
	public String view(Model model) {
		model.addAttribute("action", "review view");
		
		System.out.println("###### ReviewController.view(...)");
		
        return ".tile.checkout.review";
    }
	
	@RequestMapping(method = RequestMethod.POST)
	public String submit(Model model) {
		model.addAttribute("action", "review submit");
		
		System.out.println("###### ReviewController.submit(...)");
		
        return "redirect:/thankyou";
    }
}
