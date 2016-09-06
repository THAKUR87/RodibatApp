package com.marketlive.app.b2c.checkout;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller(ShippingMethodController.NAME)
@RequestMapping(value = "/shippingmethod")
public class ShippingMethodController {

	/** The name of this component. */
	public static final String NAME = "shippingMethodController";
	
	// Invoked on every request.
	@ModelAttribute("shippingMethodForm")
    public ShippingMethodForm createShippingMethodForm() {
        return new ShippingMethodForm();
    }
	
	@RequestMapping(method = RequestMethod.GET)
	public String view(Model model) {
		model.addAttribute("action", "shipping method view");
		
		System.out.println("###### ShippingMethodController.view(...)");
		
        return ".tile.checkout.shippingMethod";
    }
	
	@RequestMapping(method = RequestMethod.POST)
	public String submit(Model model) {
		model.addAttribute("action", "shipping method submit");
		
		System.out.println("###### ShippingMethodController.submit(...)");
		
        return "redirect:/payment";
    }
}
