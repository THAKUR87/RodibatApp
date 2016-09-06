package org.rodibaat.modal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name ="USER_ACCOUNT")
public class UserAccount {
	
	@Id
	@GeneratedValue
	@Column(name = "ID", length = 11 )
	private int id;
	
	@Column(name = "FIRST_NAME")
	private String firstName;
	
	@Column(name = "LAST_NAME")
	private String lastName;
	
	@Column(name = "USER_PASSWORD")
	private String password;
	
	@Column(name = "EMAILID")
	private String emailId;
	
	@Column(name = "AGREE_TERMS")
	private boolean agreeTermsConditions;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
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
	
	public boolean isAgreeTermsConditions() {
		return agreeTermsConditions;
	}
	public void setAgreeTermsConditions(boolean agreeTermsConditions) {
		this.agreeTermsConditions = agreeTermsConditions;
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
