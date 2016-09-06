package org.rodibaat.service;

import org.rodibaat.dao.UserAccountDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAccountServiceImpl implements UserAccountService {
	
	@Autowired
	private UserAccountDAO userAccountDAO;
	
	@Override
	public boolean createAccount(String firstName,String lastName, String password,
			String emailId,boolean agreeTerms) {

		System.out.println("In Service class...Check Login");
        return userAccountDAO.createAccount(firstName, lastName, password, emailId, agreeTerms);
	}

	@Override
	public boolean loginAccount(String emailId, String password) {
		
		return userAccountDAO.loginAccount( emailId, password);
	}

	@Override
	public boolean findAccount(String emailId) {
		return userAccountDAO.findAccount( emailId);
	}
	
}
