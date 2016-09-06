package com.marketlive.app.b2c;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller(HomeController.NAME)
public class HomeController {

	/** The name of this component. */
	public static final String NAME = "homeController";
	
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home() {
        return ".tile.home";
    }
}
