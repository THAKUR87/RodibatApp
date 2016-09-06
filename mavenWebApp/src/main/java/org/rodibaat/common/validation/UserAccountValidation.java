package org.rodibaat.common.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import java.lang.annotation.ElementType;
import java.lang.annotation.RetentionPolicy;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ElementType.TYPE, ElementType.ANNOTATION_TYPE , ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UserAccountValidator.class)
@Documented
public @interface UserAccountValidation {
	
	String ERR_COMMON_IS_REQUIRED = "{err.common.isRequired}";
	
	String message() default ERR_COMMON_IS_REQUIRED;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
    
    String firstName();
	
	String lastName();

	String password();
	
	String emailId();
}
