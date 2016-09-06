package org.rodibaat.common.validation;

import java.util.Locale;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.apache.commons.validator.GenericValidator;
import org.rodibaat.common.constants.Errors;
import org.rodibaat.form.UserAccountForm;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.apache.commons.beanutils.BeanUtils;

@Component
public class UserAccountValidator  implements ConstraintValidator<UserAccountValidation , UserAccountForm>{
	
	private String firstName;
	
	private String lastName;

	private String password;
	
	private String emailId;
	
	@Override
	public void initialize(UserAccountValidation userAccount) {
		this.firstName = userAccount.firstName();
		this.lastName = userAccount.lastName();
		this.emailId = userAccount.emailId();
		this.password = userAccount.password();
	}
	
	@PostConstruct
	public void init() {
		System.out.println("%%%%%%%%%%%%%%%%");
	}

	@Override
	public boolean isValid(UserAccountForm userValue, ConstraintValidatorContext constraintValidatorContext) {
		try {
        	boolean valid = true;
        	
        	// Validate first name.
        	boolean validFirstName = validateFirstName(userValue, constraintValidatorContext);
        	if (!validFirstName) {
        		valid = false;
        	}
        	
        	// Validate last name.
        	boolean validLastName = validateLastName(userValue, constraintValidatorContext);
        	if (!validLastName) {
        		valid = false;
        	}
        	
        	// Validate Password.
        	boolean validPassword = validatePassword(userValue, constraintValidatorContext);
        	if (!validPassword) {
        		valid = false;
        	}
        	
        	// Validate Email ID.
        	boolean emailId = validateEmailId(userValue, constraintValidatorContext);
        	if (!emailId) {
        		valid = false;
        	}
        	
        	return valid;
        } catch (Exception e) {
            return false;
        }
	}

	private boolean validateFirstName(UserAccountForm fieldValue,
			ConstraintValidatorContext constraintValidatorContext)  throws Exception {
		
		boolean valid = true;
		
		RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
		String fName = BeanUtils.getProperty(fieldValue, this.firstName);
    	if (fName != null) {
    		fName = fName.trim();
    	}
    	
		String firstNameLabel = getMessage(request, Errors.FIRST_NAME_REQUIRED_LABEL, null, null);
		
		int firstNameMinLength = 1;
    	int firstNameMaxLength = 20;
		
		if (GenericValidator.isBlankOrNull(fName)) {
            valid = false;
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(getMessage(request, Errors.FIRST_NAME_REQUIRED_LABEL, new Object[]{firstNameLabel},null))
                    .addNode(this.firstName)
                    .addConstraintViolation();
        } else if (fName.length() < firstNameMinLength) {
            valid = false;
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(getMessage(request, Errors.ERRORS_MINLENGTH, new Object[]{firstNameLabel, firstNameMinLength},null))
                    .addNode(this.firstName)
                    .addConstraintViolation();
        } else if (fName.length() > firstNameMaxLength) {
        	valid = false;
        	constraintValidatorContext.disableDefaultConstraintViolation();
        	constraintValidatorContext.buildConstraintViolationWithTemplate(getMessage(request, Errors.ERRORS_MAXLENGTH, new Object[]{firstNameLabel, firstNameMaxLength},null))
                    .addNode(this.firstName)
                    .addConstraintViolation();
        }
		
		return valid;
	}
	
	private boolean validateLastName(UserAccountForm fieldValue,
			ConstraintValidatorContext constraintValidatorContext)  throws Exception {
		boolean valid = true;
		
		RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
		
		String lName = BeanUtils.getProperty(fieldValue, this.lastName);
    	if (lName != null) {
    		lName = lName.trim();
    	}
    	
		String lastNameLabel = getMessage(request, Errors.LAST_NAME_REQUIRED_LABEL, null, null);
		
		int lastNameMinLength = 1;
    	int lastNameMaxLength = 20;
    	
		if (GenericValidator.isBlankOrNull(lName)) {
            valid = false;
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(getMessage(request, Errors.LAST_NAME_REQUIRED_LABEL, new Object[]{lastNameLabel}, null))
                    .addNode(this.lastName)
                    .addConstraintViolation();
        } else if (lName.length() < lastNameMinLength) {
            valid = false;
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(getMessage(request, Errors.ERRORS_MINLENGTH, new Object[]{lastNameLabel, lastNameMinLength}, null))
                    .addNode(this.lastName)
                    .addConstraintViolation();
        } else if (lName.length() > lastNameMaxLength) {
        	valid = false;
        	constraintValidatorContext.disableDefaultConstraintViolation();
        	constraintValidatorContext.buildConstraintViolationWithTemplate(getMessage(request, Errors.ERRORS_MAXLENGTH, new Object[]{lastNameLabel, lastNameMaxLength}, null))
                    .addNode(this.lastName)
                    .addConstraintViolation();
        }
		
		return valid;
	}
	
	private boolean validatePassword(UserAccountForm fieldValue,
			ConstraintValidatorContext constraintValidatorContext) throws Exception {
		boolean valid = true;
		
		RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
		
		String password = BeanUtils.getProperty(fieldValue, this.password);
    	if (password != null) {
    		password = password.trim();
    	}
    	
		String passwordLabel = getMessage(request, Errors.PASSWORD_REQUIRED_LABEL, null, null);
		
		int passwordMinLength = 7;
    	int passwordMaxLength = 20;
    	
		if (GenericValidator.isBlankOrNull(password)) {
            valid = false;
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(getMessage(request, Errors.PASSWORD_REQUIRED_LABEL, new Object[]{passwordLabel}, null))
                    .addNode(this.password)
                    .addConstraintViolation();
        } else if (password.length() < passwordMinLength) {
            valid = false;
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(getMessage(request, Errors.ERRORS_MINLENGTH, new Object[]{passwordLabel, passwordMinLength}, null))
                    .addNode(this.password)
                    .addConstraintViolation();
        } else if (password.length() > passwordMaxLength) {
        	valid = false;
        	constraintValidatorContext.disableDefaultConstraintViolation();
        	constraintValidatorContext.buildConstraintViolationWithTemplate(getMessage(request, Errors.ERRORS_MAXLENGTH, new Object[]{passwordLabel, passwordMaxLength}, null))
                    .addNode(this.password)
                    .addConstraintViolation();
        }
		
		return valid;
	}
	
	private boolean validateEmailId(UserAccountForm fieldValue,
			ConstraintValidatorContext constraintValidatorContext) throws Exception {
		boolean valid = true;
		
		RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
		
		String emailId = BeanUtils.getProperty(fieldValue, this.emailId);
    	if (emailId != null) {
    		emailId = emailId.trim();
    	}
    	
		String emailIdLabel = getMessage(request, Errors.EMAILID_REQUIRED_LABEL, null, null);
		
		int emailIDMinLength = 7;
    	int emailIDMaxLength = 20;
    	
		if (GenericValidator.isBlankOrNull(emailId)) {
            valid = false;
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(getMessage(request, Errors.EMAILID_REQUIRED_LABEL, new Object[]{emailIdLabel}, null))
                    .addNode(this.emailId)
                    .addConstraintViolation();
        } else if (emailId.length() < emailIDMinLength) {
            valid = false;
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(getMessage(request, Errors.ERRORS_MINLENGTH, new Object[]{emailIdLabel, emailIDMinLength}, null))
                    .addNode(this.emailId)
                    .addConstraintViolation();
        } else if (emailId.length() > emailIDMaxLength) {
        	valid = false;
        	constraintValidatorContext.disableDefaultConstraintViolation();
        	constraintValidatorContext.buildConstraintViolationWithTemplate(getMessage(request, Errors.ERRORS_MAXLENGTH, new Object[]{emailIdLabel, emailIDMaxLength}, null))
                    .addNode(this.emailId)
                    .addConstraintViolation();
        }
		
		return valid;
	}



	private String getMessage(HttpServletRequest request,
			String key, Object[] values, Locale locale) {
		String message = null;
		
		if (message == null) {
            // Try to resolve message via Spring
            MessageSource messageSource = getMessageSource(request);
            if (messageSource != null) {
                if (values != null && values.length > 0) {
                    message = messageSource.getMessage(key, values, locale);
                } else {
                    message = messageSource.getMessage(key, null, locale);
                }
            }
        }
        return message;
	}

	private MessageSource getMessageSource(HttpServletRequest request) {
		final WebApplicationContext wac = WebApplicationContextUtils.getRequiredWebApplicationContext(request.getSession().getServletContext());
		return (wac.containsBean("messageSource")) ? (MessageSource) wac.getBean("messageSource") : null;
	}

}
