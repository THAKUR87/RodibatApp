package com.marketlive.app.b2c.checkout;

public class CheckoutForm {

	private BillingForm billingForm = new BillingForm();
	
	private ShippingMethodForm shippingMethodForm = new ShippingMethodForm();
	
	private PaymentForm paymentForm = new PaymentForm();

	public BillingForm getBillingForm() {
		return billingForm;
	}

	public void setBillingForm(BillingForm billingForm) {
		this.billingForm = billingForm;
	}

	public ShippingMethodForm getShippingMethodForm() {
		return shippingMethodForm;
	}

	public void setShippingMethodForm(ShippingMethodForm shippingMethodForm) {
		this.shippingMethodForm = shippingMethodForm;
	}

	public PaymentForm getPaymentForm() {
		return paymentForm;
	}

	public void setPaymentForm(PaymentForm paymentForm) {
		this.paymentForm = paymentForm;
	}
}
