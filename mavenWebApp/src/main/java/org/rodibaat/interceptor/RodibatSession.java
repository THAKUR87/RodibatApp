package org.rodibaat.interceptor;

import org.springframework.stereotype.Repository;

@Repository
public class RodibatSession {
	
	public static final String NAME = "RodibatSession";
	
	private String firstName;
	
	private String lastName;
	
	public boolean isLoggedIn;
	
	public boolean logout;
	
	private String password;
	
	private String emailId;
	
	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public boolean isLoggedIn() {
		return isLoggedIn;
	}
	
	public void setLoggedIn(boolean isLoggedIn) {
		this.isLoggedIn = isLoggedIn;
	}
	
	public boolean isLogout() {
		return logout;
	}
	
	public void setLogout(boolean logout) {
		this.logout = logout;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}
	
}
