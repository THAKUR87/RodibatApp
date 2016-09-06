package org.rodibaat.form;

import org.rodibaat.common.validation.UserAccountValidation;

@UserAccountValidation(emailId = "emailId",	firstName = "firstName",
						lastName = "lastName", password = "password")

public class UserAccountForm {
	
	public static final String NAME = "userAccountForm";
	
	private String firstName;
	
	private String lastName;
	
	private String password;
	
	private String emailId;
	
	private boolean loginResult;
	
	private boolean agreeTermsConditions;

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
	public boolean isAgreeTermsConditions() {
		return agreeTermsConditions;
	}
	public void setAgreeTermsConditions(boolean agreeTermsConditions) {
		this.agreeTermsConditions = agreeTermsConditions;
	}
	public boolean getLoginResult() {
		return loginResult;
	}
	public void setLoginResult(boolean loginResult) {
		this.loginResult = loginResult;
	}
}
