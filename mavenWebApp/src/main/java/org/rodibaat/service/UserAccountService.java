package org.rodibaat.service;

public interface UserAccountService {
	
	public boolean createAccount(String firstName,String lastName, String password,
			String emailId,boolean agreeTerms);
	
	public boolean loginAccount(String emailId, String password);

	public boolean findAccount(String emailId);
	
}
