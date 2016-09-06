package org.rodibaat.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class RodibatInterceptor implements HandlerInterceptor {

	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		System.out.println("******Interceptor*********");
		RodibatSession rodibatSession = (RodibatSession) request.getSession().getAttribute(RodibatSession.NAME);
		if (null == rodibatSession) {
			rodibatSession = new RodibatSession();
			request.getSession().setAttribute(RodibatSession.NAME, rodibatSession);
		}
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		RodibatSession rodibatSession = (RodibatSession) request.getSession().getAttribute(RodibatSession.NAME);
		if (null != rodibatSession && true == rodibatSession.isLogout()) {
			request.getSession().removeAttribute(RodibatSession.NAME);
		}
		
	}

	@Override
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// TODO Auto-generated method stub
		
	}

}
