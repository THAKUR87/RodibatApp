package com.marketlive.app.b2c.p2p;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.marketlive.biz.ITestManager;

@Controller(ProductController.NAME)
@RequestMapping(value = "/product")
public class ProductController {

	/** The name of this component. */
	public static final String NAME = "productController";
	
	@Autowired @Qualifier(ITestManager.NAME)
    protected ITestManager testManager;
	
	@RequestMapping(value = "/{productName}", method = RequestMethod.GET)
	public String viewProductByNameOrSEO(@PathVariable String productName, Model model) {
        model.addAttribute("testProduct", "Hey this is a test product! NameOrSEO : " + productName);
        
        return ".tile.p2p.detail.productDetail";
    }
	
	@RequestMapping(value = "/id/{productId}", method = RequestMethod.GET)
	public String viewProductById(@PathVariable String productId, Model model) {
        model.addAttribute("testProduct", "Hey this is a test product! Id : " + productId);
        
        return ".tile.p2p.detail.productDetail";
    }
	
	@RequestMapping(value = "/code/{productCode}", method = RequestMethod.GET)
	public String viewProductByCode(@PathVariable String productCode, Model model) {
        model.addAttribute("testProduct", "Hey this is a test product! Code : " + productCode);
        
        return ".tile.p2p.detail.productDetail";
    }
}
