package com.marketlive.app.b2c.checkout;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller(PaymentController.NAME)
@RequestMapping(value = "/payment")
public class PaymentController {

	/** The name of this component. */
	public static final String NAME = "paymentController";
	
	// Invoked on every request.
	@ModelAttribute("paymentForm")
    public PaymentForm createPaymentForm() {
        return new PaymentForm();
    }
	
	@RequestMapping(method = RequestMethod.GET)
	public String view(Model model) {
		model.addAttribute("action", "payment view");
		
		System.out.println("###### PaymentController.view(...)");
		
        return ".tile.checkout.payment";
    }
	
	@RequestMapping(method = RequestMethod.POST)
	public String submit(Model model) {
		model.addAttribute("action", "payment submit");
		
		System.out.println("###### PaymentController.submit(...)");
		
        return "redirect:/review";
    }
}
