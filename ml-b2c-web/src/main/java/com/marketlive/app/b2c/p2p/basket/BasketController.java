package com.marketlive.app.b2c.p2p.basket;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller(BasketController.NAME)
@RequestMapping(value = "/basket")
public class BasketController {

	/** The name of this component. */
	public static final String NAME = "basketController";
	
	@RequestMapping(method = RequestMethod.GET)
	public String view(Model model) {
		model.addAttribute("action", "basket view");
		
		System.out.println("###### BasketController.view(...)");
		
		// TODO:
        return ".tile.checkout.billing";
    }
	
	@RequestMapping(method = RequestMethod.POST)
	public String update(Model model) {
		model.addAttribute("action", "basket update");
		
		System.out.println("###### BillingController.submit(...)");
		
		// TODO:
        return "redirect:/shippingmethod";
    }
	
	@RequestMapping(method = RequestMethod.POST)
	public String checkout(Model model) {
		model.addAttribute("action", "basket checkout");
		
		System.out.println("###### BillingController.submit(...)");
		
		// TODO:
        return "redirect:/shippingmethod";
    }
}
