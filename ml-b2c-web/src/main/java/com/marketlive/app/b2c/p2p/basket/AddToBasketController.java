package com.marketlive.app.b2c.p2p.basket;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller(AddToBasketController.NAME)
@RequestMapping(value = "/addtobasket")
public class AddToBasketController {

	/** The name of this component. */
	public static final String NAME = "addToBasketController";
	
	@RequestMapping(method = RequestMethod.GET)
	public String view(Model model) {
		model.addAttribute("action", "add to basket view");
		
		System.out.println("###### AddToBasketController.view(...)");
		
		// TODO:
        return ".tile.checkout.billing";
    }
}
