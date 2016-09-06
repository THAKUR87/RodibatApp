package com.marketlive.app.b2c.checkout;

public class BillingForm {

	/** First name property. */
    private String firstName;

    /** Middle name property. */
    private String middleName;

    /** Last name property. */
    private String lastName;
    
    /** Street1 property. */
    private String street1;
    
    /** Street2 property. */
    private String street2;
    
    /** Street3 property. */
    private String street3;
    
    /** PostOfficeBox property. */
    private boolean postOfficeBox = false;
    
    /** City property. */
    private String city;
    
    // State
    
    /** PostalCode property. */
    private String postalCode;
    
    // Country
    
    /** Phone1 property. */
    private String phone1;
    
    /** Phone2 property. */
    private String phone2;
    
    /** Email property. */
    private String email;

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getMiddleName() {
		return middleName;
	}

	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getStreet1() {
		return street1;
	}

	public void setStreet1(String street1) {
		this.street1 = street1;
	}

	public String getStreet2() {
		return street2;
	}

	public void setStreet2(String street2) {
		this.street2 = street2;
	}

	public String getStreet3() {
		return street3;
	}

	public void setStreet3(String street3) {
		this.street3 = street3;
	}

	public boolean isPostOfficeBox() {
		return postOfficeBox;
	}

	public void setPostOfficeBox(boolean postOfficeBox) {
		this.postOfficeBox = postOfficeBox;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getPostalCode() {
		return postalCode;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	public String getPhone1() {
		return phone1;
	}

	public void setPhone1(String phone1) {
		this.phone1 = phone1;
	}

	public String getPhone2() {
		return phone2;
	}

	public void setPhone2(String phone2) {
		this.phone2 = phone2;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}
