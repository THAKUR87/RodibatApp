package com.marketlive.app.b2c.common;

import org.apache.tiles.AttributeContext;
import org.apache.tiles.preparer.ViewPreparer;
import org.apache.tiles.request.Request;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.marketlive.biz.ITestManager;

@Component(CategoryNavViewPreparer.NAME)
public class CategoryNavViewPreparer implements ViewPreparer {

	/** The name of this component. */
	public static final String NAME = "categoryNavViewPreparer";
	
	@Autowired @Qualifier(ITestManager.NAME)
    protected ITestManager testManager;
	
	@Override
	public void execute(Request tilesContext, AttributeContext attributeContext) {
		System.out.println("### Inside execute(...) method of CategoryNavViewPreparer class.");
	}
}
