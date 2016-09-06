angular.module('pointOfSaleApplication').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/basket/AddCouponCodeModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"addCouponCodeModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"closeAddCouponCodeModal()\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\">Add Coupon / Promotion</h4>\n" +
    "\t\t\t\t</div>\n" +
    "\t  \n" +
    "\t\t\t\t<form novalidate data-ng-submit=\"addCouponCode()\">\n" +
    "\t\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t\t<div data-ng-show=\"addCouponCodeDataModel.showAddCouponCodeError\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t{{ addCouponCodeDataModel.addCouponCodeErrorMessage }}\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-product-search-head\">Enter Coupon / Promotion</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-product-search-label-content\">\n" +
    "\t\t\t\t\t\t\t<input type=\"text\" name=\"couponCode\" id=\"couponCode\" class=\"form-control\" placeholder=\"Coupon Code\" data-ng-model=\"addCouponCodeDataModel.couponCode\" />\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\n" +
    "\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t<div><button type=\"submit\" name=\"addCouponButton\" id=\"addCouponButton\" class=\"ml-ppos-primary-button\">Add Coupon</button></div>\n" +
    "\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"closeAddCouponCodeModal()\" translate=\"btn.ppos.cancel\" translate=\"btn.ppos.cancel\"></button></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</form>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/Basket.html',
    "<div class=\"ml-ppos-basket-wrapper\" data-ng-controller=\"basketController\">\n" +
    "\t<div class=\"ml-ppos-basket-container\">\n" +
    "\t\t<div class=\"ml-ppos-basket-detail-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-basket-order-number\"><span translate=\"lbl.ppos.basketNumber\"></span> {{ basketDetailDataModel.data.id }}</div>\n" +
    "\t\t\t<!-- Basket row head -->\n" +
    "\t\t\t<div data-ng-controller=\"shippingAddressAndMethodModalController\">\n" +
    "\t\t\t\t<input type=\"hidden\" id=\"hiddenOpener\" data-ng-click=\"showShippingAddressAndMethodModal(); $event.stopPropagation();\">\n" +
    "\t\t\t\t<shipping-address-and-method-modal></shipping-address-and-method-modal>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-basket-head-item-row\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-head-info\" translate=\"hdr.ppos.productDetail\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-head-price\" translate=\"hdr.ppos.price\"></div>\n" +
    "\t\t\t\t<!--<div class=\"ml-ppos-basket-head-adjustment\" translate=\"hdr.ppos.adjustment\"></div>-->\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-head-quantity\" translate=\"hdr.ppos.qty\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-head-total\" translate=\"hdr.ppos.total\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-head-close-button\"></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Basket row head End -->\n" +
    "\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t\t<div data-ng-repeat=\"basketShipment in basketDetailDataModel.data.shipments\">\n" +
    "\t\t\t\t\t<div data-ng-repeat=\"basketItem in basketShipment.items\">\n" +
    "\t\t\t\t\t\t<!-- Basket item row start -->\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-items-row-container\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-items-row\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-item-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-item-thumb\"><img src=\"{{basketItem.product.image.thumb}}\" data-ng-click=\"viewProductDetail(basketItem.product.id)\" /></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-item-thumb-detail\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-click=\"viewProductDetail(basketItem.product.id)\">{{ basketItem.product.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.style\"></span> {{ basketItem.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"option in basketItem.options\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ option.optionType }}: {{ option.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<!-- Pickup or ship to section starts-->\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-shipment-container\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"basketItem.store.id != currentStore.id\"><!--  show div if item is not from current store -->\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-shipment-options\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" data-ng-click=\"setItemAsShipTo(basketDetailDataModel.data.id, basketItem)\" name=\"radioShipToPickup_{{basketItem.id}}\" id=\"radioShipToPickup_{{basketItem.id}}\" value=\"shipTo\" data-ng-checked=\"!basketItem.isPickupFromStore\" data-ng-disabled=\"!basketItem.isAvailableOnline\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div for=\"radioShipToPickup_{{basketItem.id}}\"><i></i>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"basketItem.isAvailableOnline\" translate=\"lbl.ppos.shipToAvailable\"/>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"!basketItem.isAvailableOnline\" translate=\"lbl.ppos.shipToNotAvailable\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" data-ng-click=\"setItemAsPickup(basketDetailDataModel.data.id, basketItem)\" name=\"radioShipToPickup_{{basketItem.id}}\" id=\"radioShipToPickup_{{basketItem.id}}\" value=\"pickupInStore\" data-ng-checked=\"basketItem.isPickupFromStore\" data-ng-disabled=\"!basketItem.isAvailableInStore\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div for=\"radioShipToPickup_{{basketItem.id}}\"><i></i>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"basketItem.isAvailableInStore && basketItem.isPickupFromStore\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-basket-shipment-pickup-store-info\" translate=\"msg.ppos.pickupItemInfo\" translate-values=\"{ storeCity: basketItem.store.city, storeCode: basketItem.store.code }\"/>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"basketItem.isAvailableInStore && !basketItem.isPickupFromStore\" translate=\"lbl.ppos.pickupAvailable\"/>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"!basketItem.isAvailableInStore\" translate=\"lbl.ppos.pickupNotAvailable\"/></div> <!-- Change link will be displaed in phase 2 -->\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"basketItem.store.id == currentStore.id\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<span translate=\"lbl.ppos.puchasedStore\"/> {{currentStore.name | translate }} ({{basketItem.store.code | translate }})\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<!-- Pickup or ship to section ends-->\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-switch on=\"basketItem.freeGift\" class=\"ml-ppos-basket-item-price\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-switch-when=\"true\">Free Gift</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-switch-default>{{ basketItem.regularPrice }}</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<!--<div class=\"ml-ppos-basket-item-adjustment\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-hide=\"basketItem.discounts.length\"><a href=\"\"><span class=\"ml-ppos-mini-white-icon ml-ppos-plus\"></span></a></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-show=\"basketItem.discounts.length\">-{{ basketItem.discountTotal }}</div>\n" +
    "\t\t\t\t\t\t\t\t</div>-->\n" +
    "\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-item-quantity\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-switch on=\"basketItem.freeGift\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-switch-when=\"true\" class=\"ml-ppos-quantity-spinner-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t{{ basketItem.qty }}\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<input type=\"hidden\" data-ng-value=\"basketItem.qty\" name=\"qty_{{ basketItem.id }}\" id=\"qty_{{ basketItem.id }}\" size=\"2\" maxlength=\"2\" />\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-switch-default class=\"ml-ppos-quantity-spinner-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<ml-numeric-spinner data-mapped-value=\"basketItem.qty\" data-max-length=\"2\"></ml-numeric-spinner>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-show=\"!basketItem.freeGift\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-button-update\"><a href=\"javascript:;\" data-ng-click=\"updateBasketItem(basketDetailDataModel.data.id, basketItem.id, basketItem.product.id,  basketItem.skuID, basketItem.qty, basketItem.store)\" translate=\"btn.ppos.update\"></a></div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-switch on=\"basketItem.freeGift\" class=\"ml-ppos-basket-item-total\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-switch-when=\"true\">Free Gift</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-switch-default>{{ basketItem.subTotal }}</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-show=\"!basketItem.freeGift\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-item-close-button\"><a href=\"\" data-ng-click=\"removeItemFromBasket(basketDetailDataModel.data.id, basketItem.id)\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></a></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-item-discount\" data-ng-repeat=\"basketItemDiscount in basketItem.discounts\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-item-discount-message\">\n" +
    "\t\t\t\t\t\t\t\t\t{{ basketItemDiscount.message }}<!--  <span>-{{ basketItemDiscount.amount }}</span> -->\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<!-- Basket item row End -->\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"ml-ppos-basket-nav-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-basket-header-customer\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-default-header-wrapper\">\n" +
    "\t\t\t\t\t<span>\n" +
    "\t\t\t\t\t\t<a href=\"javascript:;\" data-ng-click=\"customerProfileInformationModal('update');\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-default-header-message\">{{ customerInformation }}</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-default-header-icon\"><span class=\"ml-ppos-mini-white-icon ml-ppos-plus\"></span></div>\n" +
    "\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t<customer-profile-information-modal></customer-profile-information-modal>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-basket-sub-head\" translate=\"lbl.ppos.product\"></div>\n" +
    "\t\t\t<div class=\"ml-ppos-basket-product-search-row\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-product-scan\">\n" +
    "\t\t\t\t\t<ml-barcode-search data-display-as-modal=\"true\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-modal-title=\"Product Scan\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-service-url=\"/api/scan/skus/UPC_CODE\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-service-post-data=\"skuBarcodeSearchPostData\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-scan-success-callback=\"scanSuccessHandler()\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-cancel-btn-resource=\"btn.ppos.close\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-continue-btn-resource=\"btn.ppos.done\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-multi-add-msg-resource=\"msg.ppos.itemWithCodeAddedToBasket\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-multi-add-count-resource=\"msg.ppos.scanAnotherProduct\"\n" +
    "\t\t\t\t\t\t\t></ml-barcode-search>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-product-search\">\n" +
    "\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-basket-product-search-button\" data-toggle=\"modal\" data-target=\"#productSearchModal\"><span class=\"ml-ppos-grey-icon ml-ppos-search\"></span><span translate=\"btn.ppos.searchProduct\"></span></a>\n" +
    "\t\t\t\t\t\t<product-search-modal></product-search-modal>\n" +
    "\t\t\t\t\t\t<product-detail-modal></product-detail-modal>\n" +
    "\t\t\t\t\t\t<near-by-stores-modal></near-by-stores-modal>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<!-- Don't show apply coupon code section, summary section, place order and adjustment if there are no items in the basket. -->\n" +
    "\t\t\t<div data-ng-if=\"basketDetailDataModel.data.shipments.length\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-sub-head\" translate=\"lbl.ppos.couponPromotion\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-product-coupon-row\">\n" +
    "\t\t\t\t\t<!-- <div class=\"ml-ppos-basket-product-scan\">\n" +
    "\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-basket-product-scan-button\"><span class=\"ml-ppos-grey-icon ml-ppos-scan-barcode\"></span><span translate=\"btn.ppos.scanCouponBarcode\"></span></a>\n" +
    "\t\t\t\t\t</div> -->\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-basket-product-typein\">\n" +
    "\t\t\t\t\t\t<div data-ng-controller=\"addCouponCodeModalController\">\n" +
    "\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-basket-product-typein-button\" data-toggle=\"modal\" data-target=\"#addCouponCodeModal\"><span translate=\"btn.ppos.typeIn\"></span><span class=\"ml-ppos-grey-icon ml-ppos-typein\"></span></a>\n" +
    "\t\t\t\t\t\t\t<add-coupon-code-modal></add-coupon-code-modal>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-coupon-message\">\n" +
    "\t\t\t\t\t<div data-ng-repeat=\"sourceCode in basketDetailDataModel.data.sourceCodeInfoList\" class=\"ml-ppos-default-header-wrapper\" data-ng-if=\"!sourceCode.discountAmountZero\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-default-header-message\"><span translate=\"msg.ppos.appliedCouponCodeWithAmount\" translate-values=\"{ couponCode : sourceCode.code}\"></span>{{ sourceCode.discountAmount }}</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-default-header-icon\"><a href=\"\" data-ng-click=\"removeSourceCode(basketDetailDataModel.data.id, sourceCode.code)\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></a></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-summary-row\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-basket-sub-head\" translate=\"lbl.ppos.summaryOfCharges\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-scroll-container\">\t\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\" translate=\"lbl.ppos.merchandiseSubtotalAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\">{{ basketDetailDataModel.data.merchandiseTotal }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-content\" data-ng-repeat=\"basketDiscount in basketDetailDataModel.data.discounts\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\">{{ basketDiscount.message }}:</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\">-{{ basketDiscount.amount }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\" translate=\"lbl.ppos.subtotalAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\">{{ basketDetailDataModel.data.subTotal }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\" translate=\"lbl.ppos.taxAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\">{{ basketDetailDataModel.data.taxTotal }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\" translate=\"lbl.ppos.shippingAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\">{{ basketDetailDataModel.data.shippingTotal }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"basketShipment in basketDetailDataModel.data.shipments\">\n" +
    "\t\t\t\t\t\t\t<div  class=\"ml-ppos-basket-summary-content\" data-ng-repeat=\"basketShipmentDiscount in basketShipment.discounts\" data-ng-if=\"!basketShipment.pickupFromStore\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\" data-ng-if=\"!basketShipmentDiscount.discountAmountZero\">{{ basketShipmentDiscount.message }}:</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\" data-ng-if=\"!basketShipmentDiscount.discountAmountZero\">-{{ basketShipmentDiscount.amount }}</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<!-- \n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\" translate=\"lbl.ppos.adjustmentAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\"></div>\n" +
    "\t\t\t\t\t\t</div>-->\n" +
    "\t\t\t\t\t</div> \n" +
    "\t\t\t\t\t<div class=\"ml-ppos-basket-summary-total-content\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\" translate=\"lbl.ppos.totalAmount\"></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\">{{ basketDetailDataModel.data.total }}</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-button-row\" data-ng-controller=\"paymentController\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-basket-button-place-order\">\n" +
    "\t\t\t\t\t\t<span class=\"ml-ppos-btn-inner\">\n" +
    "\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-text\" translate=\"btn.ppos.placeOrder\"></span>\n" +
    "\t\t\t\t\t\t\t<span class=\"ml-ppos-btn ml-ppos-mini-grey-icon ml-ppos-arrow-right\"></span>\n" +
    "\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t<button type=\"submit\" class=\"ml-ppos-btn-hidden\" data-ng-click=\"showPaymentModal(basketDetailDataModel.data.id, basketDetailDataModel.data.total)\" id=\"btnOpenPymtModal\" translate=\"btn.ppos.placeOrder\"></button>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<payment-modal></payment-modal>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "                <!-- Receipt Start -->\n" +
    "                <div class=\"ml-ppos-dashboard-bag-widget-button-wrapper\">\n" +
    "                    <receipt-modal></receipt-modal>\n" +
    "                </div>\n" +
    "                <!-- Receipt End -->\n" +
    "\n" +
    "                <div class=\"ml-ppos-dashboard-order-confirm-widget-button-wrapper\">\n" +
    "                    <order-confirmation-modal></order-confirmation-modal>\n" +
    "                </div>\n" +
    "\n" +
    "                <!-- NOTE: PEBL-15818 Item Level adjustment is in phase 2 of PPOS -->\n" +
    "\t\t\t\t<!--<div class=\"ml-ppos-basket-button-row\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-basket-button-adjustment\"><a href=\"javascript:;\" translate=\"btn.ppos.adjustment\"></a></div>\n" +
    "\t\t\t\t</div>-->\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-basket-button-row\" data-ng-if=\"!basketDetailDataModel.isAutoSaveBag\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-button-save-bag\" data-ng-show=\"!basketDetailDataModel.data.csrID\"><a href=\"javascript:;\" data-ng-click=\"saveBag(basketDetailDataModel.data.id)\"><span translate>btn.ppos.saveBag</span> <i class=\"ml-ppos-mini-white-icon ml-ppos-circle-bag\"></i></a></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-button-save-bag\" data-ng-show=\"basketDetailDataModel.data.csrID\"><a href=\"javascript:;\"><span translate>btn.ppos.saved</span> <i class=\"ml-ppos-mini-white-icon ml-ppos-circle-bag\"></i></a></div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<!-- Save Bag Success Message -->\n" +
    "\t\t\t<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t\t\t\t<div class=\"modal\" id=\"saveBagSuccessModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t\t\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t\t\t\t<div class=\"modal-content\">\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-icon-success\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div translate>btn.ppos.shoppingBagSavedMessage</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t\t\t<div><button type=\"submit\" name=\"saveBagSuccessOkButton\" id=\"saveBagSuccessOkButton\" data-dismiss=\"modal\" class=\"ml-ppos-primary-button\" translate=\"btn.ppos.ok\"></button></div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/OrderConfirmationModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-customer-search-wrapper\">\n" +
    "    <div class=\"modal\" id=\"orderConfirmationModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "        <div class=\"modal-dialog\">\n" +
    "            <div class=\"modal-content\">\n" +
    "                <div class=\"modal-header\">\n" +
    "                    <button type=\"button\" class=\"close\" data-ng-click=\"close()\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "                    <h4 class=\"modal-title\"><span translate=\"lbl.ppos.orderNo\"></span>&nbsp;{{orderConfirmationDataModel.orderid}}</h4>\n" +
    "                </div>\n" +
    "\n" +
    "                <form name=\"receiptForm\" novalidate data-ng-submit=\"\">\n" +
    "                    <div class=\"modal-body\" class=\"form-control\">\n" +
    "\n" +
    "                        <div class=\"ml-ppos-customer-search-head ng-scope\" style=\"text-align:center;border-top:1px solid #8da5d1;padding-top:30px;padding-bottom:30px\">\n" +
    "                            <div data-ng-if=\"orderConfirmationDataModel.printSelected\"><span translate=\"lbl.ppos.receiptReadyOn\"></span>&nbsp;{{orderConfirmationDataModel.deviceName}}</div>\n" +
    "                               <p/>\n" +
    "                            <div data-ng-if=\"orderConfirmationDataModel.emailSelected\"><span translate=\"lbl.ppos.receiptHasBeenSentTo\"></span>&nbsp;{{orderConfirmationDataModel.email}}</div>\n" +
    "\n" +
    "                            <div data-ng-if=\"!orderConfirmationDataModel.printSelected && !orderConfirmationDataModel.emailSelected\"><span translate=\"lbl.ppos.orderConfirmationMessage\"></span></div>\n" +
    "\n" +
    "                           </div>\n" +
    "                        <div class=\"modal-footer ml-ppos-button-customer-search\" style=\"border-top:1px solid #8da5d1;\">\n" +
    "                        <button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"close()\" data-dismiss=\"modal\"><span translate=\"btn.ppos.done\"></span></button>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/PaymentCash.html',
    "<!-- PaymentCash.html | (c) 2015 MarketLive, Inc. | All Rights Reserved -->\n" +
    "\n" +
    "<div>\n" +
    "    <div class=\"ml-ppos-payment-cash-entry\">{{mlPaymentModel['cash'].amountDisplay}}</div>\n" +
    "    <div class=\"ml-ppos-cash-key-pad\">\n" +
    "        <div class=\"ml-ppos-cash-key-wrapper\" ng-repeat=\"button in mlPaymentModel.cash.buttons track by $index\" ng-click=\"selectCashKey(button.value)\">\n" +
    "            <div class=\"ml-ppos-cash-key\" ng-class=\"{ 'ml-ppos-cash-key-delete' : button.label == 'Delete' }\">{{button.label}}</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/PaymentCreditCardManual.html',
    "<!-- PaymentCreditCardManual.html | (c) 2015 MarketLive, Inc. | All Rights Reserved -->\n" +
    "\n" +
    "<div>\n" +
    "    <form name=\"paymentManualCreditCard\" ng-submit=\"submitForm()\" novalidate>\n" +
    "        <!-- Credit Card Number -->\n" +
    "        <div class=\"ml-ppos-payment-card-number ml-ppos-payment-form-field-delimiter\">\n" +
    "            <label for=\"creditCardNumber\"><span>*</span> <span translate=\"lbl.ppos.creditCardNumber\"></span></label>\n" +
    "            <input type=\"text\" class=\"form-control\" id=\"creditCardNumber\" name=\"creditCardNumber\"\n" +
    "                   data-ng-model=\"mlPaymentModel.creditCard.number\" size=\"16\" maxlength=\"16\" required>\n" +
    "            <input type=\"hidden\" id=\"creditCardType\" name=\"creditCardType\" ng-model=\"mlPaymentModel.creditCard.type\"\n" +
    "                   required>\n" +
    "            <!-- Validation Messages -->\n" +
    "            <div class=\"ml-ppos-payment-error\"\n" +
    "                 ng-show=\"paymentManualCreditCard.creditCardNumber.$error.required && formSubmitted\"\n" +
    "                 translate=\"msg.ppos.fieldRequiredError\"></div>\n" +
    "            <div class=\"ml-ppos-payment-error\"\n" +
    "                 ng-show=\"paymentManualCreditCard.creditCardNumber.$valid && paymentManualCreditCard.creditCardType.$error.required && formSubmitted\"\n" +
    "                 translate=\"msg.ppos.creditCardNotSupportedError\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Expiry Month and Year -->\n" +
    "        <div class=\"ml-ppos-payment-form-content ml-ppos-payment-form-field-delimiter\">\n" +
    "            <fieldset>\n" +
    "                <legend><span>*</span> <span translate=\"lbl.ppos.expirationDate\"></span></legend>\n" +
    "                <!-- Expiry Month -->\n" +
    "                <div class=\"ml-ppos-payment-card-month\">\n" +
    "                    <select class=\"form-control\"\n" +
    "                            id=creditCardExpiryMonth\n" +
    "                            name=\"creditCardExpiryMonth\"\n" +
    "                            ng-model=\"mlPaymentModel.creditCard.expiryMonth.selectedOption\"\n" +
    "                            ng-options=\"option.value as option.label for option in mlPaymentModel.creditCard.expiryMonth.options\"\n" +
    "                            required>\n" +
    "                        <option value=\"\" translate=\"sel.ppos.month\"></option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <!-- Expiry Year -->\n" +
    "                <div class=\"ml-ppos-payment-card-year\">\n" +
    "                    <select class=\"form-control\"\n" +
    "                            name=\"creditCardExpiryYear\"\n" +
    "                            ng-model=\"mlPaymentModel.creditCard.expiryYear.selectedOption\"\n" +
    "                            ng-options=\"option.value as option.label for option in mlPaymentModel.creditCard.expiryYear.options\"\n" +
    "                            required>\n" +
    "                        <option value=\"\" translate=\"sel.ppos.year\"></option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <!-- Validation Messages -->\n" +
    "                <div class=\"ml-ppos-payment-error\"\n" +
    "                     ng-show=\"(paymentManualCreditCard.creditCardExpiryMonth.$error.required || paymentManualCreditCard.creditCardExpiryYear.$error.required) && formSubmitted\"\n" +
    "                     translate=\"msg.ppos.fieldsRequiredError\"></div>\n" +
    "            </fieldset>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- CVV -->\n" +
    "        <div class=\"ml-ppos-payment-card-cvv ml-ppos-payment-form-field-delimiter\">\n" +
    "            <label for=\"creditCardCVV\"><span>*</span> <span translate=\"lbl.ppos.cardIdentification\"></span></label>\n" +
    "            <input type=\"text\" class=\"form-control\" id=\"creditCardCVV\" name=\"creditCardCVV\"\n" +
    "                   data-ng-model=\"mlPaymentModel.creditCard.cvv\" maxlength=\"4\" required>\n" +
    "            <!-- Validation Messages -->\n" +
    "            <div class=\"ml-ppos-payment-error\"\n" +
    "                 ng-show=\"paymentManualCreditCard.creditCardCVV.$error.required && formSubmitted\"\n" +
    "                 translate=\"msg.ppos.fieldRequiredError\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Zip/Postal Code -->\n" +
    "        <div class=\"ml-ppos-payment-card-zip ml-ppos-payment-form-field-delimiter\">\n" +
    "            <label for=\"creditCardPostalCode\"><span>*</span> <span translate=\"lbl.ppos.billingZipCode\"></span></label>\n" +
    "            <input type=\"text\" class=\"form-control\" id=\"creditCardPostalCode\" name=\"creditCardPostalCode\"\n" +
    "                   data-ng-model=\"mlPaymentModel.creditCard.postalCode\" maxlength=\"10\" required>\n" +
    "            <!-- Validation Messages -->\n" +
    "            <div class=\"ml-ppos-payment-error\"\n" +
    "                 ng-show=\"paymentManualCreditCard.creditCardPostalCode.$error.required && formSubmitted\"\n" +
    "                 translate=\"msg.ppos.fieldRequiredError\"></div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/PaymentCreditCardSwipe.html',
    "<!-- PaymentCreditCardSwipe.html | (c) 2015 MarketLive, Inc. | All Rights Reserved -->\n" +
    "\n" +
    "<div class=\"ml-ppos-payment-method-credit-scan-content\">\n" +
    "    <!-- Connecting to the Device -->\n" +
    "    <div data-ng-show=\"!sdkIsActive || !readerIsConnected\">\n" +
    "        <div class=\"ml-ppos-error-container\">\n" +
    "            <div class=\"ml-ppos-error-message\">\n" +
    "                <div translate=\"msg.ppos.connecting\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"ml-ppos-payment-method-credit-scan-icons\">\n" +
    "            <span class=\"ml-icon-lib ml-icon-circle-o-notch ml-icon-spin\"></span><span\n" +
    "                class=\"ml-icon-lib ml-icon-credit-card disabled\"></span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Device Already Connected -->\n" +
    "    <div class=\"ml-scan-section\" data-ng-show=\"sdkIsActive && readerIsConnected\">\n" +
    "        <!-- Ready to Scan -->\n" +
    "        <div class=\"ml-scan-section\" data-ng-show=\"!authInProgress && !authFailed\">\n" +
    "            <div class=\"ml-ppos-error-container\">\n" +
    "                <div class=\"ml-ppos-error-message\">\n" +
    "                    <div translate=\"msg.ppos.swipeCard\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"ml-ppos-payment-method-credit-scan-icons\">\n" +
    "                <span class=\"ml-icon-lib ml-icon-long-arrow-down\"></span><span\n" +
    "                    class=\"ml-icon-lib ml-icon-credit-card ml-ppos-credit-card-icon\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Card Auth in Progress -->\n" +
    "        <div class=\"ml-scan-section\" data-ng-show=\"authInProgress\">\n" +
    "            <div class=\"ml-ppos-error-container\">\n" +
    "                <div class=\"ml-ppos-error-message\">\n" +
    "                    <div translate=\"msg.ppos.authorizingCard\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"ml-ppos-payment-method-credit-scan-icons\">\n" +
    "                <span class=\"ml-icon-lib ml-icon-circle-o-notch ml-icon-spin\"></span><span\n" +
    "                    class=\"ml-icon-lib ml-icon-credit-card disabled\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Auth Failed -->\n" +
    "        <div class=\"ml-scan-section\" data-ng-show=\"!authInProgress && authFailed\">\n" +
    "            <div class=\"ml-ppos-error-container\">\n" +
    "                <div class=\"ml-icon-error\"></div>\n" +
    "                <div class=\"ml-ppos-error-message\">\n" +
    "                    <div translate=\"msg.ppos.processingCardError\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"ml-ppos-payment-method-credit-scan-icons\">\n" +
    "                <span class=\"ml-icon-lib ml-icon-long-arrow-down error\"></span><span\n" +
    "                    class=\"ml-icon-lib ml-icon-credit-card ml-ppos-credit-card-icon\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/PaymentModal.html',
    "<!-- PaymentModal.html | (c) 2015 MarketLive, Inc. | All Rights Reserved -->\n" +
    "\n" +
    "<div class=\"ml-ppos-modal-container\">\n" +
    "    <div class=\"modal\" id=\"paymentModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "        <div class=\"modal-dialog\">\n" +
    "            <div class=\"modal-content\" ng-class=\"{ 'ml-ppos-signature-content' : selection == 'SIGNATURE' }\">\n" +
    "                <!-- Modal Dialog Header -->\n" +
    "                <div class=\"modal-header\">\n" +
    "                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "                    <h4 class=\"modal-title ml-ppos-payment-modal-total\" ng-show=\"selection == 'SIGNATURE'\"><span>{{model.total}}</span></h4>\n" +
    "                    <h4 class=\"modal-title\"><span translate=\"hdr.ppos.basketNumber\"></span>: <span>{{model.id}}</span></h4>\n" +
    "                </div>\n" +
    "\n" +
    "                <!-- Modal Dialog Body -->\n" +
    "                <div class=\"modal-body\">\n" +
    "                    <div class=\"ml-ppos-payment-display\" ng-class=\"{ 'active' : showDefaultLayout() }\">\n" +
    "                        <div class=\"ml-ppos-payment-method\">\n" +
    "                            <!-- Payment Type Selection -->\n" +
    "                            <div class=\"ml-ppos-payment-selection\" ng-class=\"{ 'active' : selection == 'PAYMENT_SELECTION' }\">\n" +
    "                                <div class=\"ml-ppos-payment-method-label\"><span translate=\"msg.ppos.selectPaymentMethod\"></span></div>\n" +
    "                                <div class=\"ml-ppos-payment-method-item\" ng-repeat=\"type in model.paymentTypes track by $index\" ng-click=\"select(type.code)\">\n" +
    "                                    <div>{{type.displayName}}</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <!-- Credit Card Selection Options -->\n" +
    "                            <div class=\"ml-ppos-payment-method-credit\" ng-class=\"{ 'active' : selection == 'CARDPRESENT' }\">\n" +
    "                                <!-- Scan Option -->\n" +
    "                                <div class=\"ml-ppos-scan\" data-ng-click=\"select('CREDIT_CARD_SWIPE')\">\n" +
    "                                    <span class=\"ml-ppos-scan-button\">\n" +
    "                                        <span class=\"ml-ppos-grey-icon ml-ppos-scan-barcode\"></span>\n" +
    "                                        <span translate=\"btn.ppos.scanCreditCard\"></span>\n" +
    "                                    </span>\n" +
    "                                </div>\n" +
    "                                <!-- Manual Option -->\n" +
    "                                <!-- TODO: uncomment, to add the manual credit card entry. -->\n" +
    "                                <!--<div class=\"ml-ppos-typein\" data-ng-click=\"select('CREDIT_CARD_ENTRY')\">-->\n" +
    "                                    <!--<span class=\"ml-ppos-typein-button\">-->\n" +
    "                                        <!--<span class=\"ml-ppos-grey-icon ml-ppos-typein\"></span>-->\n" +
    "                                        <!--<span translate=\"btn.ppos.typeIn\"></span>-->\n" +
    "                                    <!--</span>-->\n" +
    "                                <!--</div>-->\n" +
    "                            </div>\n" +
    "                            <!-- Credit Card Manual Entry -->\n" +
    "                            <div class=\"ml-ppos-payment-method-credit-enter\" ng-class=\"{ 'active' : selection == 'CREDIT_CARD_ENTRY' }\">\n" +
    "                                <ml-payment-credit-card-manual data-ml-payment-model=\"model\" data-ml-parent-submit=\"addPayment()\" data-payment-service=\"paymentService\"></ml-payment-credit-card-manual>\n" +
    "                            </div>\n" +
    "                            <!-- Cash -->\n" +
    "                            <div class=\"ml-ppos-payment-method-cash\" ng-class=\"{ 'active' : selection == 'CASH' }\">\n" +
    "                                <ml-payment-cash data-ml-payment-model=\"model\" data-ml-parent-submit=\"addPayment()\" data-payment-service=\"paymentService\"></ml-payment-cash>\n" +
    "                            </div>\n" +
    "                            <!-- Gift Certificates -->\n" +
    "                            <div class=\"ml-ppos-payment-method-gift-certificate\" ng-class=\"{ 'active' : selection == 'GIFTCERT' }\">\n" +
    "                                <span translate=\"btn.ppos.enterGiftCertificate\"></span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <!-- Payment Summary -->\n" +
    "                        <div class=\"ml-ppos-payment-summary\">\n" +
    "                            <!-- Total -->\n" +
    "                            <div class=\"ml-ppos-summary-content\">\n" +
    "                                <div class=\"ml-ppos-summary-label\"><span translate=\"lbl.ppos.total\"></span>:</div>\n" +
    "                                <div class=\"ml-ppos-summary-value\">{{model.total}}</div>\n" +
    "                            </div>\n" +
    "                            <!-- Payment List -->\n" +
    "                            <div class=\"ml-ppos-scroll-container\">\n" +
    "                                <div class=\"\" ng-repeat=\"payment in model.data.payments track by $index\">\n" +
    "                                    <div class=\"ml-ppos-summary-content ml-ppos-summary-payments\">\n" +
    "                                        <div class=\"ml-ppos-summary-label\">{{payment.displayName}}:</div>\n" +
    "                                        <div class=\"ml-ppos-summary-value\">{{payment.displayAmount}}</div>\n" +
    "\n" +
    "                                        <div class=\"ml-ppos-basket-item-close-button\">\n" +
    "                                            <span data-ng-click=\"removePayment(payment.code)\" class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"ml-ppos-payment-summary-footer\">\n" +
    "                                <!-- Balance -->\n" +
    "                                <div class=\"ml-ppos-summary-content ml-ppos-summary-remaining-balance\" ng-class=\"{ 'active' : model.displayBalance }\">\n" +
    "                                    <div class=\"ml-ppos-summary-label\"><span translate=\"lbl.ppos.remainingBalance\"></span>:</div>\n" +
    "                                    <div class=\"ml-ppos-summary-value\">{{model.displayBalance}}</div>\n" +
    "                                </div>\n" +
    "                                <div class=\"ml-ppos-summary-content ml-ppos-summary-total-paid\" ng-class=\"{ 'active' : model.data.displayTotal }\">\n" +
    "                                    <div class=\"ml-ppos-summary-label\"><span translate=\"lbl.ppos.totalPaid\"></span>:</div>\n" +
    "                                    <div class=\"ml-ppos-summary-value\">{{model.data.displayTotal}}</div>\n" +
    "                                </div>\n" +
    "                                <div class=\"ml-ppos-summary-content ml-ppos-summary-change-amount\" ng-class=\"{ 'active' : model.data.change }\">\n" +
    "                                    <div class=\"ml-ppos-summary-label\"><span translate=\"lbl.ppos.changeAmount\"></span>:</div>\n" +
    "                                    <div class=\"ml-ppos-summary-value\">{{model.data.change}}</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <!-- Credit Card Swipe -->\n" +
    "                    <div class=\"ml-ppos-payment-method-credit-scan\" ng-class=\"{ 'active' : selection == 'CREDIT_CARD_SWIPE' }\">\n" +
    "                        <ml-payment-credit-card-swipe data-ml-payment-model=\"model\"\n" +
    "                                                      data-ml-parent-submit=\"addPayment()\"\n" +
    "                                                      data-ml-change-selection=\"select(selection)\"\n" +
    "                                                      data-payment-service=\"paymentService\"\n" +
    "                                                      data-ml-view-selection=\"selection\"></ml-payment-credit-card-swipe>\n" +
    "                    </div>\n" +
    "                    <!-- Signature -->\n" +
    "                    <div class=\"ml-ppos-signature-wrapper\" ng-show=\"selection == 'SIGNATURE'\">\n" +
    "                        <div class=\"ml-ppos-signature-header\" ng-show=\"selection == 'SIGNATURE'\"><span translate=\"lbl.ppos.creditCardSignatureHeader\"></span></div>\n" +
    "                        <canvas ng-signature-pad=\"model.signature\" width=\"570px\" height=\"200px\" class=\"ml-ppos-signature\"></canvas>\n" +
    "                        <div class=\"ml-ppos-signature-agreement\" ng-show=\"selection == 'SIGNATURE'\">\n" +
    "                            <span translate=\"lbl.ppos.creditCardSignatureAgreement\"></span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <!-- Modal Dialog Footer Buttons -->\n" +
    "                <div class=\"modal-footer\">\n" +
    "                    <!--<div ng-show=\"model.placeOrder\"><button type=\"submit\" name=\"\" id=\"markAsPaid\" class=\"ml-ppos-primary-button\" data-ng-click=\"basketCheckout()\" translate=\"btn.ppos.markAsPaid\"></button></div>-->\n" +
    "                    <div ng-show=\"!model.placeOrder && showDefaultLayout()\"><button type=\"submit\" name=\"\" id=\"\" class=\"ml-ppos-primary-button\" data-ng-click=\"apply()\" translate=\"btn.ppos.addPayment\"></button></div>\n" +
    "                    <div ng-show=\"selection == 'SIGNATURE'\"><button type=\"submit\" name=\"\" id=\"acceptSignature\" class=\"ml-ppos-primary-button\" data-ng-click=\"acceptSignature()\" translate=\"Accept Signature\"></button></div>\n" +
    "\n" +
    "                    <div ng-show=\"selection == 'PAYMENT_SELECTION'\"><button type=\"button\" class=\"ml-ppos-secondary-button\" data-dismiss=\"modal\" translate=\"btn.ppos.cancel\"></button></div>\n" +
    "                    <div ng-hide=\"selection == 'PAYMENT_SELECTION' || selection == 'SIGNATURE'\"><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancel()\"  translate=\"btn.ppos.cancel\"></button></div>\n" +
    "                    <div ng-show=\"selection == 'SIGNATURE'\"><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelSignature()\"  translate=\"btn.ppos.cancel\"></button></div>\n" +
    "                    <div ng-show=\"selection == 'SIGNATURE'\" class=\"ml-ppos-signature-clear-button\"><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"clearSignature()\"  translate=\"btn.ppos.clearSignature\"></button></div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/ReceiptModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-customer-search-wrapper\">\n" +
    "    <div class=\"modal\" id=\"receiptModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "        <div class=\"modal-dialog\">\n" +
    "            <div class=\"modal-content\">\n" +
    "                <div class=\"modal-header\">\n" +
    "                    <button type=\"button\" class=\"close\" data-ng-click=\"cancel()\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "                    <h4 class=\"modal-title\"> <span translate=\"lbl.ppos.receipt\"></span></h4>\n" +
    "                </div>\n" +
    "\n" +
    "                    <form name=\"receiptForm\" novalidate data-ng-submit=\"processReceipt()\">\n" +
    "                        <div class=\"modal-body\" class=\"form-control\">\n" +
    "\n" +
    "                          <div data-ng-show=\"receiptDataModel.paymentChange\" class=\"ml-ppos-payment-change-due\"><span translate=\"lbl.ppos.changeDue\"></span>&nbsp; {{receiptDataModel.paymentChange}}</div>\n" +
    "\n" +
    "                            <div data-ng-show=\"receiptDataModel.hasValidationErrors\" class=\"ml-ppos-error-container\">\n" +
    "                                <div class=\"ml-icon-error\"></div>\n" +
    "                                <div class=\"ml-ppos-error-message\">\n" +
    "                                    <div data-ng-repeat=\"validationError in receiptDataModel.validationErrors\">{{ validationError }}</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <span id=\"print\" ng-class=\"receiptDataModel.printSelected == true ?  'ml-ppos-mini-white-icon ml-ppos-radio ml-ppos-radio-selected' : 'ml-icon-lib ml-icon-unchecked' \" data-ng-model=\"receiptDataModel.printSelected\" data-ng-click=\"manageSelection('print')\"></span>\n" +
    "                            <span translate=\"lbl.ppos.print\"></span> {{receiptDataModel.deviceName}}\n" +
    "\n" +
    "                            <p/>\n" +
    "                            <span id=\"email\" ng-class=\"receiptDataModel.emailSelected == true ?  'ml-ppos-mini-white-icon ml-ppos-radio ml-ppos-radio-selected' : 'ml-icon-lib ml-icon-unchecked' \" ng-model=\"receiptDataModel.emailSelected\"  data-ng-click=\"manageSelection('email')\"></span>\n" +
    "                            <span translate=\"lbl.ppos.email\"></span> <div style=\"width:400px;display: inline-block\"><input id=\"receiptModalEmail\" type=\"email\" data-ng-model=\"email\" class=\"form-control\"></div>\n" +
    "\n" +
    "                            <div class=\"modal-footer ml-ppos-button-customer-search\">\n" +
    "\n" +
    "                            <div><button type=\"submit\" data-ng-disabled=\"!receiptDataModel.printSelected && ! receiptDataModel.emailSelected \" name=\"emailReceiptButton\" id=\"emailReceiptButton\" class=\"ml-ppos-primary-button\" ng-disabled=\"buttonClicked\"><span translate=\"lbl.ppos.receipt\"></span> </button></div>\n" +
    "                            <div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancel()\"><span translate=\"lbl.ppos.noReceipt\"></span> </button></div>\n" +
    "\n" +
    "                        </div>\n" +
    "                        </div>\n" +
    "                    </form>\n" +
    "           \n" +
    "               \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/ShippingAddressAndMethodModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-basket-new-shipping-wrapper\">\r" +
    "\n" +
    "\t<div class=\"modal\" id=\"shippingAddressAndMethodModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\r" +
    "\n" +
    "\t\t<div class=\"modal-dialog\">\r" +
    "\n" +
    "\t\t\t<div class=\"modal-content\">\r" +
    "\n" +
    "\t\t\t\t<form novalidate id=\"frmShipAddressMethodModal\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"modal-header\">\r" +
    "\n" +
    "\t\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"closeShippingAddressAndMethodModal()\" data-dismiss=\"modal\" aria-label=\"Close\" id=\"btnCloseModal\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\r" +
    "\n" +
    "\t\t\t\t\t\t<h4 class=\"modal-title\"><span translate=\"hdr.ppos.shipToAddress\"/></h4>\r" +
    "\n" +
    "\t\t\t\t\t\t<!-- Error Block Start -->\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"shipping.showMessage\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-icon-error\" id=\"divMsgIconContainer\"></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div>{{ shipping.operationMessage | translate }}</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<!-- Error Block End -->\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"modal-body ml-ppos-basket-new-shipping-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t<!-- Address Block -->\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-shipment-address-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.firstName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"text\" class=\"form-control\" data-ng-model=\"shipping.firstName\" name=\"txtFirstName\" id=\"txtFirstName\" maxlength=\"40\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.lastName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"text\" class=\"form-control\" data-ng-model=\"shipping.lastName\" name=\"txtLastName\" id=\"txtLastName\" required=\"\" maxlength=\"40\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.streetAddress\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"text\" class=\"form-control\" data-ng-model=\"shipping.streetAddress\" name=\"txtStreetAddress\" id=\"txtStreetAddress\" required=\"\" maxlength=\"50\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.optionalAddress\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"text\" class=\"form-control\" data-ng-model=\"shipping.optionalAddress\" name=\"txtOptionalAddress\" id=\"txtOptionalAddress\" maxlength=\"50\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.city\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"text\" class=\"form-control\" data-ng-model=\"shipping.city\" name=\"txtCity\" id=\"txtCity\" required=\"\" maxlength=\"50\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.state\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><select name=\"selState\" class=\"form-control\" id=\"selState\" data-ng-model=\"shipping.selectedState\" data-ng-change=\"populateShippingMethods('selState')\"> \r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<option ng-repeat=\"option in shipping.states\" value=\"{{option.id}}\" ng-selected=\"{{option.id == shipping.selectedState}}\">{{ option.description | translate }}</option>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</select></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.zipCode\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"text\" class=\"form-control\" data-ng-model=\"shipping.zipCode\" name=\"txtZipCode\" id=\"txtZipCode\" required=\"\" maxlength=\"10\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.country\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><select name=\"selCountry\" class=\"form-control\" id=\"selCountry\" data-ng-model=\"shipping.selectedCountry\" data-ng-change=\"populateShippingMethods('selCountry')\"> \r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<option ng-repeat=\"option in shipping.countries\" value=\"{{option.id}}\" ng-selected=\"{{option.id == shipping.selectedCountry}}\">{{ option.description | translate }}</option>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</select></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.phoneNumber\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"tel\" class=\"form-control\" data-ng-model=\"shipping.phoneNumber\" name=\"txtPhone\" id=\"txtPhone\" required=\"\" maxlength=\"20\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.emailAddress\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"email\" class=\"form-control\" data-ng-model=\"shipping.email\" name=\"txtEmail\" id=\"txtEmail\" required=\"\" maxlength=\"100\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<!-- Address Block -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t\t\t<!-- shipping method -->\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-shipment-container ml-ppos-toggle-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\" data-ng-show=\"shipping.shippingMethods.length > 0\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : option.id == shipping.selectedShippingMethod}\" data-ng-repeat=\"option in shipping.shippingMethods\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<input type=\"radio\" data-ng-model=\"shipping.selectedShippingMethod\"  name=\"radioShippingMethod\" id=\"radioShippingMethod\" value=\"{{option.id}}\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<i ng-show=\"option.id != shipping.selectedShippingMethod\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<i class=\"ml-ppos-mini-white-icon ml-ppos-unselect\"></i>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t</i>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<i ng-hide=\"option.id != shipping.selectedShippingMethod\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<i class=\"ml-ppos-mini-grey-icon ml-ppos-select\"></i>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t</i>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-basket-new-shipment-name\">{{ option.name | translate }} - {{ option.cost }}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t</div> <span>{{ option.description | translate }}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t\t\t<!--<div class=\"ml-ppos-basket-new-shipment-container ml-ppos-toggle-container\" data-ng-show=\"shipping.shippingMethods.length == 0\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<span translate=\"msg.ppos.noShippingMethod\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>-->\r" +
    "\n" +
    "\t\t\t\t\t\t<!-- shipping method -->\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div><button type=\"submit\" name=\"addShippingAddress\" id=\"addShippingAddress\" class=\"ml-ppos-primary-button\" translate=\"btn.ppos.paymentOptions\" data-ng-click=\"saveShippingAddressAndMethod(shipping)\"></button></div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelShippingAddressAndMethodModal()\" data-dismiss=\"modal\" translate=\"btn.ppos.cancel\" name=\"btnCancelShipToModal\" id=\"btnCancelShipToModal\"></button></div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</form>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<!-- Following script tag added for fixing PEBL-15999 -->\r" +
    "\n" +
    "<script>\r" +
    "\n" +
    "$('#addShippingAddress').on('touchend', function(e){\r" +
    "\n" +
    "    e.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t$('#addShippingAddress').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "$('#btnCancelShipToModal').on('touchend', function(e){\r" +
    "\n" +
    "\te.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t// following is the hack to hide soft keyboard\r" +
    "\n" +
    "\tdocument.activeElement.blur();\r" +
    "\n" +
    "\t$('input').blur();\r" +
    "\n" +
    "\t$('select').blur();\r" +
    "\n" +
    "\t$('#btnCancelShipToModal').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "</script>"
  );


  $templateCache.put('views/common/AppSpinner.html',
    "<!-- AppSpinner.html | (c) 2015 MarketLive, Inc. | All Rights Reserved -->\n" +
    "\n" +
    "<div class=\"ppos-app-spinner\" data-ng-show=\"displaySpinner\">\n" +
    "    <div class=\"ppos-app-spinner-bg\"></div>\n" +
    "    <div class=\"ppos-app-spinner-msg-wrapper\">\n" +
    "        <div class=\"ppos-app-spinner-msg-content\">\n" +
    "            <span data-ng-hide=\"timerLimitExceeded\"\n" +
    "                  class=\"ml-icon-lib ml-icon-circle-o-notch ml-icon-spin ppos-app-spinner-icon\"></span>\n" +
    "\n" +
    "            <div class=\"timer-limit-exceeded-wrapper\" data-ng-show=\"timerLimitExceeded\">\n" +
    "                <div class=\"ml-ppos-error-container\">\n" +
    "                    <div class=\"ml-icon-error\"></div>\n" +
    "                    <div class=\"ml-ppos-error-message\">\n" +
    "                        <div>{{requestTimedOut}}</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"timer-limit-exceeded-close\">\n" +
    "                        <button class=\"ml-ppos-primary-button\" data-ng-click=\"close()\">{{closeBtnTxt}}</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/common/Header.html',
    "<div class=\"ml-ppos-header-wrapper\">\n" +
    "\n" +
    "\t<div class=\"ml-ppos-header-logo\"><span class=\"ml-ppos-header-logo-img\" data-ng-click=\"openDashboardPage();\"></span></div>\n" +
    "\n" +
    "\t<div class=\"ml-ppos-header-nav\" data-ng-show=\"!applicationModel.isScreenLocked\"> \n" +
    "\t\t<div class=\"ml-ppos-header-nav-logout ml-ppos-a-href-close-overlay\">\n" +
    "\t\t\t<a href=\"javascript:;\" data-ng-show=\"applicationModel.isCSRLoggedIn\" data-ng-click=\"logout();hideOverlay();\" data-ng-controller=\"logoutController\"><span class=\"ml-ppos-mini-white-icon ml-ppos-logout-head\"></span></a>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"ml-ppos-header-nav-basket ml-ppos-a-href-close-overlay\">\n" +
    "\t\t\t<a href=\"javascript:;\" data-ng-show=\"applicationModel.isCSRLoggedIn\" data-ng-click=\"openBasketPage();hideOverlay();\"><span class=\"ml-ppos-mini-white-icon ml-ppos-basket-head\"></span></a>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"ml-ppos-header-nav-unlock ml-ppos-a-href-close-overlay\">\n" +
    "\t\t\t<a href=\"javascript:;\" data-ng-show=\"applicationModel.isCSRLoggedIn\" data-ng-click=\"lockScreen();hideOverlay();\"><span class=\"ml-ppos-mini-white-icon ml-ppos-unlock-head\"></span></a>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"ml-ppos-header-nav-user\">\n" +
    "\t\t\t<a href=\"javascript:;\" data-ng-show=\"applicationModel.isCSRLoggedIn\" data-ng-click=\"toggleOverlay();\" id=\"ml-ppos-header-nav-user-link\">{{ applicationModel.csrUserName }}<span class=\"ml-icon-lib ml-icon-arrow-down\"></span></a>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<!-- Account Drop Down -->\n" +
    "\t\t<div class=\"ml-ppos-account-drop-down-container\">\n" +
    "\t\t\t<div id=\"ml-ppos-account-overlay\" style=\"display:block\" ng-show=\"applicationModel.toggleValue\" data-ng-click=\"hideOverlay();\"></div>\n" +
    "\t\t\t<div id=\"ml-ppos-account-drop-down\" style=\"display:block\" ng-show=\"applicationModel.toggleValue\">\n" +
    "\t\t\t\t<ul>\n" +
    "\t\t\t\t\t<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\" data-ng-click=\"openCSRChangePasswordPage();toggleOverlay();\"><i class=\"ml-ppos-mini-white-icon ml-ppos-change-password\"></i> <span translate=\"lbl.ppos.changePassword\"/></a></li>\n" +
    "\t\t\t\t\t<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\" data-ng-click=\"openCSRChangePINPage();toggleOverlay();\"><i class=\"ml-ppos-mini-white-icon ml-ppos-unlock\"></i> <span translate=\"lbl.ppos.changePin\"/></a></li>\n" +
    "\t\t\t\t\t<!--<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\"><i class=\"ml-ppos-mini-white-icon ml-ppos-appointment\"></i> <span translate=\"lbl.ppos.appointment\"/></a></li>\n" +
    "\t\t\t\t\t<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\"><i class=\"ml-ppos-mini-white-icon ml-ppos-todo\"></i> <span translate=\"lbl.ppos.toDoList\"/></a></li>\n" +
    "\t\t\t\t\t<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\"><i class=\"ml-ppos-mini-white-icon ml-ppos-profile\"></i> <span translate=\"lbl.ppos.profile\"/></a></li>\n" +
    "\t\t\t\t\t<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\"><i class=\"ml-ppos-mini-white-icon ml-ppos-my-sale\"></i> <span translate=\"lbl.ppos.mySales\"/></a></li>\n" +
    "\t\t\t\t\t<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\"><i class=\"ml-ppos-mini-white-icon ml-ppos-dashboard\"></i> <span translate=\"lbl.ppos.dashboard\"/></a></li>-->\n" +
    "\t\t\t\t\t<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\" data-ng-click=\"openManagementPage();toggleOverlay();\"><i class=\"ml-ppos-mini-white-icon ml-ppos-settings\"></i> <span translate=\"lbl.ppos.settings\"/></a></li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Account Drop Down End -->\n" +
    "\t</div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<!-- No Shopping Bag Message -->\n" +
    "<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"noShoppingBagModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\n" +
    "\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t<div translate>btn.ppos.noShoppingBagMessage</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t<div><button type=\"submit\" name=\"noShoppingBagOkButton\" id=\"noShoppingBagOkButton\" data-dismiss=\"modal\" class=\"ml-ppos-primary-button\" translate=\"btn.ppos.ok\"></button></div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/common/NearByStoresModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-nearby-store-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"nearByStoresModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\n" +
    "\t\t\t\t<!-- Header -->\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"closeNearByStoresModal()\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\" translate=\"hdr.ppos.availabilityInNearbyStores\"></h4>\n" +
    "\t\t\t\t</div>\n" +
    "\t  \n" +
    "\t\t\t\t<!-- Body -->\n" +
    "\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-store-wrapper\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-store-product-info-container\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-store-product-image\"><img src=\"{{ nearByStoresDataModel.product.image.thumb }}\" /></div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-store-product-name\">{{ nearByStoresDataModel.product.name }}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-store-product-code\"># {{ nearByStoresDataModel.selectedSku.code }}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div data-ng-if=\"nearByStoresDataModel.selectedSku.options\">\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-repeat=\"option in nearByStoresDataModel.selectedSku.options\" class=\"ml-ppos-store-product-options\">\n" +
    "\t\t\t\t\t\t\t\t\t{{ option.optionType }}: {{ option.name }}\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-store-product-qty\"><span translate=\"msg.ppos.qty\"></span> {{ nearByStoresDataModel.requestedQuantity }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-store-info-container\">\n" +
    "\t\t\t\t\t\t\t<!-- Store Search -->\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-box\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-zip-head\" translate=\"lbl.ppos.cityStateZip\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-form\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<form name=\"nearByStoresForm\" novalidate data-ng-submit=\"searchNearByStores(true)\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-input\"><input type=\"text\" name=\"nearByStoresSearchKeyword\" id=\"nearByStoresSearchKeyword\" class=\"form-control\" data-ng-model=\"nearByStoresDataModel.nearByStoresSearchKeyword\" /></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-button\"><input type=\"submit\" name=\"findNearByStoresButton\" id=\"findNearByStoresButton\" class=\"ml-ppos-primary-button\" value=\"{{ 'btn.ppos.findStores' | translate }}\" data-ng-disabled=\"!nearByStoresDataModel.nearByStoresSearchKeyword\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</form>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-distance ml-ppos-toggle-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-distance-head\" translate=\"lbl.ppos.storesWithinRadius\"></div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : radius == nearByStoresDataModel.selectedRadius}\" data-ng-repeat=\"radius in nearByStoresDataModel.radiusArray\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" name=\"selectedStoreRadius\" id=\"selectedStoreRadius\" value=\"{{ radius }}\" data-ng-model=\"nearByStoresDataModel.selectedRadius\" data-ng-change=\"searchNearByStores(false)\" /> <span translate=\"lbl.ppos.storeRadius\" translate-values=\"{ storeRadius: radius }\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t<!-- Store Detail -->\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row ml-ppos-store-detail-row-head\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-store\" translate=\"hdr.ppos.store\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-hours\" translate=\"hdr.ppos.hours\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-distance\" translate=\"hdr.ppos.distance\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-availability\" translate=\"hdr.ppos.availability\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-add-btn\"></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-content-scroll ml-ppos-scroll-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-store\" translate=\"lbl.ppos.online\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-show=\"!nearByStoresDataModel.online.showStockAvailabilityMessage\"  class=\"ml-ppos-store-detail-row-stock\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-hours\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-distance\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-availability\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"nearByStoresDataModel.online.availableQty > 0\"><span translate=\"msg.ppos.inStock\"></span> <br> {{ nearByStoresDataModel.online.availableQty }}</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"nearByStoresDataModel.online.availableQty == 0\" translate=\"msg.ppos.unavailable\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-add-btn\"><a href=\"\" data-ng-click=\"addItemToBasketFromWebStore()\" data-ng-if=\"nearByStoresDataModel.online.availableQty > 0\"><span class=\"ml-ppos-mini-white-icon ml-ppos-plus\"></span></a></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-show=\"nearByStoresDataModel.online.showStockAvailabilityMessage\" class=\"ml-ppos-store-stock-error\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-container\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div translate=\"msg.ppos.stockAvailability.100\" translate-values=\"{ requestedQuantity : nearByStoresDataModel.requestedQuantity, availableQuantity : nearByStoresDataModel.online.availableQty }\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-stock-error-cancel-button\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<button type=\"button\" name=\"stockAvailabilityCancelButton\" id=\"stockAvailabilityCancelButton\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelStockAvailability()\" translate=\"btn.ppos.cancel\"></button>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<button type=\"button\" name=\"stockAvailabilityContinueButton\" id=\"stockAvailabilityContinueButton\" class=\"ml-ppos-primary-button\" data-ng-click=\"continueStockAvailability()\" translate=\"btn.ppos.stockAvailability.continue\"></button>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"nearByStoresDataModel.stores.length\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"store in nearByStoresDataModel.stores | filter : {pickupEnabled : true}\" class=\"ml-ppos-store-detail-row\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-store\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.street1 }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.street2 }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.street3 }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t{{ store.address.city }},\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t{{ store.address.state }}\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t{{ store.address.zipCode }}\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.phone }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-show=\"!store.showStockAvailabilityMessage\" class=\"ml-ppos-store-detail-row-stock\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-hours\" translate=\"{{ store.hours }}\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-distance\" translate=\"lbl.ppos.storeDistance\" translate-values=\"{ storeDistance: store.distance }\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-availability\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"store.availableQty > 0\"><span translate=\"msg.ppos.inStock\"></span> <br> {{ store.availableQty }}</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"store.availableQty == 0\" translate=\"msg.ppos.unavailable\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-add-btn\"><a href=\"\" data-ng-click=\"addItemToBasketFromPhysicalStore(store)\" data-ng-if=\"store.availableQty > 0\"><span class=\"ml-ppos-mini-white-icon ml-ppos-plus\"></span></a></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-show=\"store.showStockAvailabilityMessage\" class=\"ml-ppos-store-stock-error\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-container\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div translate=\"msg.ppos.stockAvailability.100\" translate-values=\"{ requestedQuantity : nearByStoresDataModel.requestedQuantity, availableQuantity : store.availableQty }\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-stock-error-cancel-button\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<button type=\"button\" name=\"stockAvailabilityCancelButton\" id=\"stockAvailabilityCancelButton\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelStockAvailability()\" translate=\"btn.ppos.cancel\"></button>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<button type=\"button\" name=\"stockAvailabilityContinueButton\" id=\"stockAvailabilityContinueButton\" class=\"ml-ppos-primary-button\" data-ng-click=\"continueStockAvailability(store)\" translate=\"btn.ppos.stockAvailability.continue\"></button>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"store in nearByStoresDataModel.stores | filter : {pickupEnabled : false}\" class=\"ml-ppos-store-detail-row\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-store\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.street1 }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.street2 }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.street3 }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t{{ store.address.city }},\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t{{ store.address.state }}\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t{{ store.address.zipCode }}\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.phone }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-hours\" translate=\"{{ store.hours }}\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-distance\" translate=\"lbl.ppos.storeDistance\" translate-values=\"{ storeDistance: store.distance }\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-availability\" translate=\"msg.ppos.notEligibleForStorePickup\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-add-btn\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"!nearByStoresDataModel.stores.length\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div translate=\"msg.ppos.noStoresFound\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<!-- Store Detail End -->\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\n" +
    "\t\t\t\t\t<!-- Footer -->\n" +
    "\t\t\t\t\t<!--<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t <div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelNearByStoresModal()\" data-dismiss=\"modal\" translate>btn.ppos.cancel</button></div> \n" +
    "\t\t\t\t\t</div>-->\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/common/NumericSpinner.html',
    "<div class=\"ml-numeric-spinner-wrapper\">\n" +
    "    <div class=\"input-group\">\n" +
    "        <span class=\"input-group-btn\">\n" +
    "            <button class=\"btn btn-default\" type=\"button\"\n" +
    "                    ng-click=\"decrementValue($event)\"\n" +
    "                    ng-disabled=\"isButtonDisabled('decrement')\">\n" +
    "                <span class=\"ml-icon-lib ml-icon-minus\"></span>\n" +
    "            </button>\n" +
    "        </span>\n" +
    "        <input type=\"text\" size=\"3\" maxlength=\"{{maxLength}}\" class=\"ml-ppos-quantity-spinner\"\n" +
    "               data-ng-model=\"mappedValue\"\n" +
    "               data-ng-blur=\"handleBlur()\">\n" +
    "        <span class=\"input-group-btn\">\n" +
    "            <button class=\"btn btn-default\" type=\"button\"\n" +
    "                    ng-click=\"incrementValue($event)\"\n" +
    "                    ng-disabled=\"isButtonDisabled('increment')\">\n" +
    "                <span class=\"ml-icon-lib ml-icon-plus\"></span>\n" +
    "            </button>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/common/ScanBarcode.html',
    "<!-- ScanBarcode.html | (c) 2015 MarketLive, Inc. | All Rights Reserved -->\n" +
    "\n" +
    "<div>\n" +
    "    <!-- Modal Display -->\n" +
    "    <div data-ng-show=\"displayAsModal === 'true'\">\n" +
    "        <a href=\"javascript:;\" class=\"ml-ppos-product-scan-button\" data-ng-click=\"showScanDialog()\"><span\n" +
    "                class=\"ml-ppos-grey-icon ml-ppos-scan-barcode\"></span><span translate=\"btn.ppos.scanProductBarcode\"></span></a>\n" +
    "\n" +
    "        <div class=\"ml-ppos-modal-container ml-ppos-scan-barcode-wrapper\">\n" +
    "            <div class=\"modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "                <div class=\"modal-dialog\">\n" +
    "                    <div class=\"modal-content\">\n" +
    "                        <div class=\"modal-header\">\n" +
    "                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\"\n" +
    "                                    aria-label=\"Close\"><span aria-hidden=\"true\"><span\n" +
    "                                    class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "                            <!-- Title -->\n" +
    "                            <h4 class=\"modal-title\">{{modalTitle}}</h4>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"modal-body\">\n" +
    "                            <ml-barcode-search-body></ml-barcode-search-body>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <!-- Footer Buttons -->\n" +
    "                        <div class=\"modal-footer ml-ppos-button-customer-search\">\n" +
    "                            <div>\n" +
    "                                <button class=\"ml-ppos-secondary-button\"\n" +
    "                                        data-ng-show=\"cancelBtnResource\"\n" +
    "                                        data-dismiss=\"modal\"\n" +
    "                                        translate=\"{{cancelBtnResource}}\">\n" +
    "                                </button>\n" +
    "                                <button class=\"ml-ppos-primary-button\"\n" +
    "                                        data-ng-show=\"continueBtnResource\"\n" +
    "                                        data-ng-click=\"continue()\"\n" +
    "                                        data-ng-class=\"{disabled: !canContinue}\"\n" +
    "                                        translate=\"{{continueBtnResource}}\">\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Inline Display -->\n" +
    "    <div class=\"ml-ppos-scan-barcode-wrapper\" data-ng-show=\"displayAsModal === 'false'\">\n" +
    "        <ml-barcode-search-body></ml-barcode-search-body>\n" +
    "    </div>\n" +
    " </div>"
  );


  $templateCache.put('views/common/ScanBarcodeBody.html',
    "<!-- ScanBarcodeBody.html | (c) 2015 MarketLive, Inc. | All Rights Reserved -->\n" +
    "\n" +
    "<div>\n" +
    "    <!-- Messages -->\n" +
    "    <div class=\"ml-ppos-error-container\">\n" +
    "        <div ng-show=\"searchError\" class=\"ml-icon-error\"></div>\n" +
    "        <div ng-show=\"!deviceConnected\" class=\"ml-ppos-error-message\">\n" +
    "            <div translate=\"msg.ppos.connecting\"></div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"deviceConnected && !searchInProgress && !searchError && !canContinue\"\n" +
    "             class=\"ml-ppos-error-message\">\n" +
    "            <div translate=\"msg.ppos.readyToScan\"></div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"deviceConnected && searchInProgress\" class=\"ml-ppos-error-message\">\n" +
    "            <div translate=\"msg.ppos.searchingForCode\"\n" +
    "                 translate-values=\"{ code: scannedValue }\"></div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"deviceConnected && !searchInProgress && searchError\"\n" +
    "             class=\"ml-ppos-error-message\">\n" +
    "            <div translate=\"msg.ppos.searchingForCodeFailed\"\n" +
    "                 translate-values=\"{ code: scannedValue }\"></div>\n" +
    "            <div translate=\"msg.ppos.tryAgain\"></div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"deviceConnected && !searchInProgress && canContinue && !searchError && multiAddMsgResource\"\n" +
    "             class=\"ml-ppos-error-message\">\n" +
    "            <div translate=\"{{multiAddMsgResource}}\"\n" +
    "                 translate-values=\"{ code: scannedValue }\"></div>\n" +
    "            <div data-ng-show=\"multiAddCountResource && itemFoundCount\" translate=\"{{multiAddCountResource}}\"\n" +
    "                 translate-values=\"{count: itemFoundCount}\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Icons -->\n" +
    "    <div class=\"ml-ppos-scan-barcode-icons-wrapper\">\n" +
    "        <div class=\"ml-ppos-scan-barcode-icons\"\n" +
    "             data-ng-class=\"{ready: deviceConnected && !searchInProgress}\">\n" +
    "            <span class=\"ml-icon-lib ml-icon-circle-o-notch ml-icon-spin\"></span><span\n" +
    "                class=\"ml-icon-lib ml-icon-barcode\"></span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/csr/CSRAdd.html',
    "<div class=\"ml-ppos-account-wrapper\">\r" +
    "\n" +
    "\t<div class=\"ml-ppos-add-csr-container\">\r" +
    "\n" +
    "\t<form novalidate>\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-add-csr-head-row\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-title\">\r" +
    "\n" +
    "\t\t\t\t<a href=\"\" ng-click=\"goToManagementScreen()\"><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-left\"></i> <span translate=\"lbl.ppos.management\"/></a>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-add-buttons\">\r" +
    "\n" +
    "\t\t\t\t<button type=\"button\" name=\"cancelButton\" class=\"ml-ppos-secondary-button\" id=\"cancelButton\" translate=\"btn.ppos.cancel\" ng-click=\"cancel()\"></button><button type=\"submit\" name=\"saveButton\" class=\"ml-ppos-primary-button\" id=\"saveButton\" translate=\"btn.ppos.save\" data-ng-click=\"addCSR(csr)\"></button>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<!-- Error Block Start -->\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"csr.showCsrOpFailureMessage\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-icon-error\" id=\"divMsgIconContainer\"></div>\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-error-message\">\r" +
    "\n" +
    "\t\t\t\t<div>{{ csr.csrOpFailureMessage | translate }}</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<!-- Error Block End -->\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-add-csr-form\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-image\"></div>\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-content\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span translate=\"lbl.ppos.employeeId\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><input type=\"text\" name=\"employeeId\" id=\"employeeId\" maxlength=\"40\" class=\"form-control\" data-ng-model=\"csr.employeeId\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.firstName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><input type=\"text\" name=\"firstName\" id=\"firstName\" maxlength=\"40\" class=\"form-control\" data-ng-model=\"csr.firstName\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.lastName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><input type=\"text\" name=\"lastName\" id=\"lastName\" maxlength=\"40\" class=\"form-control\" data-ng-model=\"csr.lastName\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.emailAddress\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><input type=\"email\" name=\"email\" id=\"email\" maxlength=\"100\" class=\"form-control\" data-ng-model=\"csr.email\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.password\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><input type=\"password\" name=\"password\" id=\"password\" maxlength=\"50\" class=\"form-control\" data-ng-model=\"csr.password\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.reEnterPassword\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-add-csr-input-password\"><input type=\"password\" name=\"confirmPassword\" id=\"confirmPassword\" maxlength=\"50\" class=\"form-control\" data-ng-model=\"csr.confirmPassword\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.unlockPosPIN\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-add-csr-input-pin\">\r" +
    "\n" +
    "\t\t\t\t\t\t<input class=\"form-control\" type=\"password\" maxlength=\"1\" ng-model=\"csr.pin1\" size=\"1\" name=\"pin1\" id=\"pin1\" data-ng-keyup=\"moveOnNext(csr.pin1,'pin1','pin2')\" ng-focus=\"clearContent('pin1')\" pattern=\"[0-9]*\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t<input class=\"form-control\" type=\"password\" maxlength=\"1\" ng-model=\"csr.pin2\" size=\"1\" name=\"pin2\" id=\"pin2\" data-ng-keyup=\"moveOnNext(csr.pin2,'pin2','pin3')\" ng-focus=\"clearContent('pin2')\" pattern=\"[0-9]*\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t<input class=\"form-control\" type=\"password\" maxlength=\"1\" ng-model=\"csr.pin3\" size=\"1\" name=\"pin3\" id=\"pin3\" data-ng-keyup=\"moveOnNext(csr.pin3,'pin3','pin4')\" ng-focus=\"clearContent('pin3')\" pattern=\"[0-9]*\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t<input class=\"form-control\" type=\"password\" maxlength=\"1\" ng-model=\"csr.pin4\" size=\"1\" name=\"pin4\" id=\"pin4\" data-ng-keyup=\"moveOnNext(csr.pin4,'pin4','pin5')\" ng-focus=\"clearContent('pin4')\" pattern=\"[0-9]*\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t<input class=\"form-control\" type=\"password\" maxlength=\"1\" ng-model=\"csr.pin5\" size=\"1\" name=\"pin5\" id=\"pin5\" data-ng-keyup=\"moveOnNext(csr.pin5,'pin5','pin6')\" ng-focus=\"clearContent('pin5')\" pattern=\"[0-9]*\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t<input class=\"form-control\" type=\"password\" maxlength=\"1\" ng-model=\"csr.pin6\" size=\"1\" name=\"pin6\" id=\"pin6\" data-ng-keyup=\"moveOnNext(csr.pin6,'pin6','roleType')\" ng-focus=\"clearContent('pin6')\" pattern=\"[0-9]*\"/>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row ml-ppos-add-input-pin-message\">\r" +
    "\n" +
    "\t\t\t\t\t<label></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><span translate=\"msg.ppos.unlockPosPin\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.roleType\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-toggle-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div data-ng-show=\"csr.roleType.length == 2\" class=\"ml-ppos-toggle btn-group btn-toggle\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : option.id == csr.selectedRole}\" data-ng-repeat=\"option in csr.roleType\" id=\"lblRoleRadio{{option.id}}\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<input type=\"radio\" data-ng-model=\"csr.selectedRole\"  name=\"roleTypeRadio\" id=\"roleTypeRadio\" value=\"{{option.id}}\" data-ng-change=\"populateCSRTypeDetails(csr.selectedRole)\"/> <span>{{ option.code | translate }}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div data-ng-show=\"csr.roleType.length != 2\" class=\"ml-ppos-edit-csr-role\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<select name=\"roleTypeSelect\" id=\"roleTypeSelect\" class=\"form-control-select\" data-ng-model=\"csr.selectedRole\" data-ng-change=\"populateCSRTypeDetails(csr.selectedRole)\"> \r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<option ng-repeat=\"option in csr.roleType\" value=\"{{option.id}}\">{{ option.code | translate }}</option>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</select>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row ml-ppos-toggle-container\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.activeStatus\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-toggle btn-group btn-toggle\" data-toggle=\"buttons\">\r" +
    "\n" +
    "\t\t\t\t\t\t<label id=\"lblActive\" class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : csr.activeStatus.toString() == 'true'}\" data-ng-click=\"setStatus(true)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<input type=\"radio\" name=\"activeStatus\" id=\"activeStatus\" value=\"true\" data-ng-model=\"csr.activeStatus\" /> <span translate=\"lbl.ppos.active\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t<label id=\"lblInactive\" class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : csr.activeStatus.toString() == 'false'}\" data-ng-click=\"setStatus(false)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<input type=\"radio\" name=\"activeStatus\" id=\"activeStatus\" value=\"false\" data-ng-model=\"csr.activeStatus\"/> <span translate=\"lbl.ppos.inactive\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t</form>\r" +
    "\n" +
    "\t\t\t<!-- Permission Block Start -->\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-permission-wrapper\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-permission-head\">\r" +
    "\n" +
    "\t\t\t\t\t<button class=\"btn\" type=\"button\" ng-click=\"showHidePermission();\"><i id=\"permissionDivElement\" class=\"ml-icon-lib ml-icon-plus\"></i> <span translate=\"hdr.ppos.permissions\"/></button> \r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"collapse\" id=\"collapseDiv\">\r" +
    "\n" +
    "\t\t\t\t\t<div id=\"permissionListDiv\"></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<!-- Permission Block End -->\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<!-- Following script tag added for fixing PEBL-16516 -->\r" +
    "\n" +
    "<script>\r" +
    "\n" +
    "$('#saveButton').on('touchend', function(e){\r" +
    "\n" +
    "    e.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t$('#saveButton').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "$('#cancelButton').on('touchend', function(e){\r" +
    "\n" +
    "\te.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t// following is the hack to hide soft keyboard\r" +
    "\n" +
    "\tdocument.activeElement.blur();\r" +
    "\n" +
    "\t$('input').blur();\r" +
    "\n" +
    "\t$('select').blur();\r" +
    "\n" +
    "\t$('#cancelButton').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "</script>"
  );


  $templateCache.put('views/csr/CSRChangePIN.html',
    "<div class=\"ml-ppos-account-wrapper\">\r" +
    "\n" +
    "\t<form novalidate data-ng-submit=\"changePIN(changePinModel)\">\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-account-change-pin-container\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-account-head-container\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-change-pin-title\"><span translate=\"hdr.ppos.changeAccessPin\"/></div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-button-container\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-button-save\"><button class=\"ml-ppos-primary-button\" type=\"submit\" name=\"save\" id=\"save\" translate=\"btn.ppos.save\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-button-cancel\"><button class=\"ml-ppos-secondary-button\" type=\"button\" name=\"cancel\" id=\"cancel\" ng-click=\"openDashboardPage()\" translate=\"btn.ppos.cancel\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\r" +
    "\n" +
    "\t\t\t<!-- Error Block -->\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"changePinModel.showMessage\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-icon-error\" id=\"divMsgIconContainer\"></div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-error-message\">\r" +
    "\n" +
    "\t\t\t\t\t<div>{{ changePinModel.message | translate }}</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-toggle-container ml-ppos-account-display-pin-wrapper\">\r" +
    "\n" +
    "\t\t\t\t<span class=\"ml-ppos-account-display-pin-title\" translate=\"lbl.ppos.displayAccessPin\" />\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\" data-toggle=\"buttons\">\r" +
    "\n" +
    "\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : changePinModel.inputType == 'text'}\" ng-click=\"showHidePin('text')\" ><span translate=\"sel.ppos.showAccessPin\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"radio\" name=\"showHidePin\" id=\"showPin\"/>\r" +
    "\n" +
    "\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : changePinModel.inputType == 'password'}\" ng-click=\"showHidePin('masked')\"><span translate=\"sel.ppos.hideAccessPin\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"radio\" name=\"showHidePin\" id=\"hidePin\" >\r" +
    "\n" +
    "\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-account-form-container\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-form-row ml-ppos-account-pin-icon\">\r" +
    "\n" +
    "\t\t\t\t\t<label></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><span translate=\"msg.ppos.unlockPosPin\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-form-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span><span translate=\"lbl.ppos.currentAccessPin\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input class=\"form-control\" type=\"{{changePinModel.inputType}}\" name=\"currentPin\" id=\"currentPin\" data-ng-model=\"changePinModel.currentPin\" maxlength=\"6\" pattern=\"[0-9]*\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-form-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span><span translate=\"lbl.ppos.newAccessPin\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input class=\"form-control\" type=\"{{changePinModel.inputType}}\" name=\"newPin\" id=\"newPin\" data-ng-model=\"changePinModel.newPin\" maxlength=\"6\" pattern=\"[0-9]*\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-form-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span><span translate=\"lbl.ppos.confirmAccessPin\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input class=\"form-control\" type=\"{{changePinModel.inputType}}\" name=\"confirmPin\" id=\"confirmPin\" data-ng-model=\"changePinModel.confirmPin\" maxlength=\"6\" pattern=\"[0-9]*\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</form>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/csr/CSRChangePassword.html',
    "<div class=\"ml-ppos-account-wrapper\">\n" +
    "\t<form novalidate data-ng-submit=\"changePassword(changePasswordModel)\">\n" +
    "\t\t<div class=\"ml-ppos-account-change-password-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-account-head-container\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-change-password-title\"><span translate=\"lbl.ppos.changePassword\"/></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-button-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-button-save\"><button class=\"ml-ppos-primary-button\" type=\"submit\" name=\"save\" id=\"save\" translate=\"btn.ppos.save\"/></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-button-cancel\"><button class=\"ml-ppos-secondary-button\" type=\"button\" name=\"cancel\" id=\"cancel\" ng-click=\"openDashboardPage()\" translate=\"btn.ppos.cancel\"/></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<!-- Error Block -->\n" +
    "\t\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"changePasswordModel.showChangePasswordFailureMessage\">\n" +
    "\t\t\t\t<div class=\"ml-icon-error\" id=\"divMsgIconContainer\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t<div>{{ changePasswordModel.changePasswordFailureMessage | translate }}</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-toggle-container ml-ppos-account-display-password-wrapper\">\n" +
    "\t\t\t\t<span class=\"ml-ppos-account-display-password-title\" translate=\"lbl.ppos.displayPassword\"/>\n" +
    "\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\" data-toggle=\"buttons\">\n" +
    "\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : changePasswordModel.inputType == 'text'}\" ng-click=\"showHidePassword('text')\"><span translate=\"sel.ppos.showPassword\"/>\n" +
    "\t\t\t\t\t\t<input type=\"radio\" name=\"showHidePassword\" id=\"showPassword\"/>\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : changePasswordModel.inputType == 'password'}\" ng-click=\"showHidePassword('masked')\"><span  translate=\"sel.ppos.hidePassowrd\"/> \n" +
    "\t\t\t\t\t\t<input type=\"radio\" name=\"showHidePassword\" id=\"hidePassword\" >\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-account-form-container\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-form-row\">\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.currentPassword\"/></label>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input class=\"form-control\" type=\"{{changePasswordModel.inputType}}\" name=\"password\" id=\"currentPassword\" data-ng-model=\"changePasswordModel.currentPassword\" maxlength=\"50\" autocapitalize=\"off\"/></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-form-row\">\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.newPassword\"/></label>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input class=\"form-control\" type=\"{{changePasswordModel.inputType}}\" name=\"newPassword\" id=\"newPassword\" data-ng-model=\"changePasswordModel.newPassword\" maxlength=\"50\" autocapitalize=\"off\"/></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-form-row\">\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.confirmPassword\"/></label>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input class=\"form-control\" type=\"{{changePasswordModel.inputType}}\" name=\"confirmPassword\" id=\"confirmPassword\" data-ng-model=\"changePasswordModel.confirmPassword\" maxlength=\"50\" autocapitalize=\"off\"/></div>\n" +
    "\t\t\t\t</div> \n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "</div>"
  );


  $templateCache.put('views/csr/CSRDeleteConfirmationModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-csr-list-confirm-wrapper\">\n" +
    "    <div class=\"modal\" id=\"csrDeleteConfirmationModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "        <div class=\"modal-dialog\">\n" +
    "            <div class=\"modal-content\">\n" +
    "                <div class=\"modal-header\">\n" +
    "                    <h4 class=\"modal-title\"><span translate=\"hdr.ppos.confirmDelete\"/></h4>\n" +
    "                </div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-confirm-message\"><span translate=\"msg.ppos.csrConfirmDeleteMsg\"/> <span>{{csrListDataModel.csrDeleteUser}}</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-confirm-button-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-csr-list-confirm-button-save\"><button class=\"ml-ppos-primary-button\" type=\"button\" name=\"ok\" id=\"ok\" ng-click=\"deleteCsrUser();\"  translate=\"btn.ppos.ok\"/></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-csr-list-confirm-button-cancel\"><button class=\"ml-ppos-secondary-button\" type=\"button\" name=\"cancel\" id=\"cancel\" ng-click=\"closeDelConfirmModal();\" translate=\"btn.ppos.cancel\"/></div>\n" +
    "\t\t\t\t</div>\t\t\t\t\t\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/csr/CSREdit.html',
    "<div class=\"ml-ppos-account-wrapper\">\r" +
    "\n" +
    "\t<div class=\"ml-ppos-add-csr-container\">\r" +
    "\n" +
    "\t<form novalidate>\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-add-csr-head-row\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-title\">\r" +
    "\n" +
    "\t\t\t\t<a href=\"\" ng-click=\"goToManagementScreen();\"><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-left\"></i> <span translate=\"lbl.ppos.management\"/></a>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-add-buttons\">\r" +
    "\n" +
    "\t\t\t\t<button type=\"button\" name=\"cancelButton\" class=\"ml-ppos-secondary-button\" id=\"cancelButton\" translate=\"btn.ppos.cancel\" ng-click=\"goToCsrListScreen();\"></button><button type=\"submit\" name=\"saveButton\" class=\"ml-ppos-primary-button\" id=\"saveButton\" translate=\"btn.ppos.save\" data-ng-click=\"updateCSR(csr)\"></button>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<!-- Error Block Start -->\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"csr.showCsrOpFailureMessage\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-icon-error\" id=\"divMsgIconContainer\"></div>\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-error-message\">\r" +
    "\n" +
    "\t\t\t\t<div>{{ csr.csrOpFailureMessage | translate }}</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<!-- Error Block End -->\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-add-csr-form\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-image\"></div>\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-content\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span translate=\"lbl.ppos.employeeId\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-edit-csr-disable\"><span name=\"employeeId\">{{csr.employeeId}}</span></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.firstName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><input type=\"text\" name=\"firstName\" id=\"firstName\" maxlength=\"40\" class=\"form-control\" data-ng-model=\"csr.firstName\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.lastName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><input type=\"text\" name=\"lastName\" id=\"lastName\" maxlength=\"40\" class=\"form-control\" data-ng-model=\"csr.lastName\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.userID\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-edit-csr-disable\"><span name=\"email\">{{csr.email}}</span></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row ml-ppos-add-input-pin-message\">\r" +
    "\n" +
    "\t\t\t\t\t<label></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><span translate=\"User email\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.roleType\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-toggle-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div data-ng-show=\"csr.roleType.length == 2\" class=\"ml-ppos-toggle btn-group btn-toggle\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : option.id == csr.selectedRole}\" data-ng-repeat=\"option in csr.roleType\" id=\"lblRoleRadio{{option.id}}\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<input type=\"radio\" data-ng-model=\"csr.selectedRole\"  name=\"roleTypeRadio\" id=\"roleTypeRadio\" value=\"{{option.id}}\" data-ng-change=\"populateCSRTypeDetails(csr.selectedRole)\"/> <span>{{ option.code | translate }}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div data-ng-show=\"csr.roleType.length != 2\" class=\"ml-ppos-edit-csr-role\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<select name=\"roleTypeSelect\" id=\"roleTypeSelect\" class=\"form-control-select\" data-ng-model=\"csr.selectedRole\" data-ng-change=\"populateCSRTypeDetails(csr.selectedRole)\"> \r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<option ng-repeat=\"option in csr.roleType\" ng-selected=\"{{option.id == csr.selectedRole}}\" value=\"{{option.id}}\">{{ option.code | translate }}</option>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</select>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row ml-ppos-toggle-container\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.activeStatus\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-toggle btn-group btn-toggle\" data-toggle=\"buttons\">\r" +
    "\n" +
    "\t\t\t\t\t\t<label id=\"lblActive\" class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : csr.activeStatus.toString() == 'true'}\" data-ng-click=\"setStatus(true)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<input type=\"radio\" name=\"activeStatus\" id=\"activeStatus\" value=\"true\" data-ng-model=\"csr.activeStatus\" /> <span translate=\"lbl.ppos.active\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t<label id=\"lblInactive\" class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : csr.activeStatus.toString() == 'false'}\" data-ng-click=\"setStatus(false)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<input type=\"radio\" name=\"activeStatus\" id=\"activeStatus\" value=\"false\" data-ng-model=\"csr.activeStatus\"/> <span translate=\"lbl.ppos.inactive\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t</form>\r" +
    "\n" +
    "\t\t\t<!-- Permission Block Start -->\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-permission-wrapper\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-permission-head\">\r" +
    "\n" +
    "\t\t\t\t\t<button class=\"btn\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapseDiv\" aria-expanded=\"false\" aria-controls=\"collapse\" ng-click=\"showHidePermission();\"><i id=\"permissionDivElement\" class=\"ml-icon-lib ml-icon-plus\"></i> <span translate=\"hdr.ppos.permissions\"/></button>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"collapse\" id=\"collapseDiv\">\r" +
    "\n" +
    "\t\t\t\t\t<div id=\"permissionListDiv\"></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<!-- Permission Block End -->\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<!-- Following script tag added for fixing PEBL-16516 -->\r" +
    "\n" +
    "<script>\r" +
    "\n" +
    "$('#saveButton').on('touchend', function(e){\r" +
    "\n" +
    "    e.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t$('#saveButton').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "$('#cancelButton').on('touchend', function(e){\r" +
    "\n" +
    "\te.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t// following is the hack to hide soft keyboard\r" +
    "\n" +
    "\tdocument.activeElement.blur();\r" +
    "\n" +
    "\t$('input').blur();\r" +
    "\n" +
    "\t$('select').blur();\r" +
    "\n" +
    "\t$('#cancelButton').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "</script>\r" +
    "\n"
  );


  $templateCache.put('views/csr/CSRList.html',
    "<div class=\"ml-ppos-account-wrapper\">\n" +
    "\t<div class=\"ml-ppos-csr-list-container\">\n" +
    "\t\n" +
    "\t\t<div class=\"ml-ppos-csr-list-head-row\">\n" +
    "\t\t\t<div class=\"ml-ppos-csr-list-title\">\n" +
    "\t\t\t\t<a href=\"\" ng-click=\"goToManagementScreen();\"><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-left\"></i> <span translate=\"lbl.ppos.management\"/></a>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-csr-list-toggle ml-ppos-toggle-container\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\" data-toggle=\"buttons\">\n" +
    "\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : csrListDataModel.csrListType == 'ALL'}\" data-ng-click=\"getAllCSRs();\"><span translate=\"lbl.ppos.viewAll\"/>\n" +
    "\t\t\t\t\t\t<input type=\"radio\" name=\"showCsrUser\" id=\"showAll\"/>\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : csrListDataModel.csrListType == 'ACTIVE'}\" data-ng-click=\"getActiveCSRs();\"><span translate=\"lbl.ppos.activeOnly\"/>\n" +
    "\t\t\t\t\t\t<input type=\"radio\" name=\"showCsrUser\" id=\"showActiveOnly\" >\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : csrListDataModel.csrListType == 'INACTIVE'}\" data-ng-click=\"getInActiveCSRs();\"><span translate=\"Inactive Only\"/>\n" +
    "\t\t\t\t\t\t<input type=\"radio\" name=\"showCsrUser\" id=\"showInActiveOnly\" >\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-csr-list-add-button\">\n" +
    "\t\t\t\t<a href=\"javascript:;\" name=\"csrAddNew\" id=\"csrAddNew\" ng-click=\"goToCsrAddScreen();\"><span class=\"ml-ppos-mini-white-icon ml-ppos-plus\"></a>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"ml-ppos-csr-list-item-wrapper\">\n" +
    "\t\t\t<div class=\"ml-ppos-csr-list-item-row ml-ppos-csr-list-item-row-head\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-status\"><span translate=\"lbl.ppos.status\"/></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-id\"><span translate=\"lbl.ppos.id\"/></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-first-name\"><span translate=\"lbl.ppos.firstName\"/></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-last-name\"><span translate=\"lbl.ppos.lastName\"/></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-user-name\"><span translate=\"lbl.ppos.userName\"/></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-delete\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-edit\"></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-csr-list-item-row ml-ppos-csr-list-item-row-head\" ng-show=\"!csrListDataModel.userData.length\">\n" +
    "\t\t\t\t<span translate=\"msg.ppos.noRecordFound\"/>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div ng-show=\"showUserRow('{{items.typePPOS}}');\" class=\"ml-ppos-csr-list-item-row\" ng-repeat=\"items in csrListDataModel.userData\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-status\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-csr-list-item-status-active\" data-ng-show=\"isActive('{{items.active}}', 'showActive');\">Active</div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-csr-list-item-status-inactive\" data-ng-show=\"isActive('{{items.active}}', 'showInactive');\">Inactive</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-id\">{{items.employeeID}}</div> \n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-first-name\">{{items.firstName}}</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-last-name\">{{items.lastName}}</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-user-name\">{{items.email}}</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-delete\" ><a href=\"\" ng-show=\"showDelete('{{items.active}}', '{{items.typePPOS}}');\" ng-click=\"deleteUser(items.id, items.email);\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></a></div>\n" +
    "\t\t\t\t<csr-delete-confirmation-modal></csr-delete-confirmation-modal>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-edit\"><a href=\"\" ng-show=\"showEdit('{{items.typePPOS}}');\" data-ng-click=\"goToCsrEditScreen(items.id);\"><span class=\"ml-ppos-mini-white-icon ml-ppos-todo\"></a></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('views/customer/CustomerProfileInformationModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-customer-profile-wrapper\">\r" +
    "\n" +
    "\t<div class=\"modal\" id=\"customerProfileInformation\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\r" +
    "\n" +
    "\t\t<div class=\"modal-dialog\">\r" +
    "\n" +
    "\t\t\t<div class=\"modal-content\">\r" +
    "\n" +
    "\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t<div id=\"customerProfileForm\" name= \"customerProfileForm\" ng-hide='customerFormDiv'>\r" +
    "\n" +
    "\t\t\t\t\t<form novalidate id=\"frmSaveUpdateCustomer\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"modal-header\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"closeProfileInformationModal()\" data-dismiss=\"modal\" aria-label=\"Close\" id=\"btnCloseCustomerProfileModal\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<h4 class=\"modal-title\"><span translate=\"hdr.ppos.customerProfileInformation\"/></h4>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-form-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<!-- Error Block Start -->\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"customerDO.showOpFailureMessage\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div>{{ customerDO.opFailureMessage | translate }}</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<!-- Error Block End -->\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.phoneNumber\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input type=\"tel\" name=\"phoneNumber\" id=\"phoneNumber\" maxlength=\"10\" class=\"form-control\" data-ng-model=\"customerDO.phoneNumber\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.firstName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input type=\"text\" name=\"firstName\" id=\"firstName\" maxlength=\"40\" class=\"form-control\" data-ng-model=\"customerDO.firstName\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.lastName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input type=\"text\" name=\"lastName\" id=\"lastName\" maxlength=\"40\" class=\"form-control\" data-ng-model=\"customerDO.lastName\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.email\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input type=\"email\" name=\"email\" id=\"email\" maxlength=\"100\" class=\"form-control\" data-ng-model=\"customerDO.email\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.password\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input type=\"password\" name=\"password\" id=\"password\" maxlength=\"100\" class=\"form-control\" data-ng-model=\"customerDO.password\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.confirmPassword\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input type=\"password\" name=\"confirmPassword\" id=\"confirmPassword\" maxlength=\"100\" class=\"form-control\" data-ng-model=\"customerDO.confirmPassword\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.securityQuestion\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><select name=\"hint\" class=\"form-control\" id=\"hint\" data-ng-model=\"customerDO.hint\"> \r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<option ng-repeat=\"option in customerDO.securityQuestions\" value=\"{{option.id}}\" ng-selected=\"{{option.id == customerDO.hint}}\">{{ option.question | translate }}</option>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</select></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.securityAnswer\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field ml-ppos-account-form-last-item\"><input type=\"text\" name=\"hintAnswer\" id=\"hintAnswer\" maxlength=\"100\" class=\"form-control\" data-ng-model=\"customerDO.hintAnswer\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-button-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><button type=\"submit\" name=\"btnSaveUpdateCustomer\" class=\"ml-ppos-primary-button\" id=\"btnSaveUpdateCustomer\" translate=\"btn.ppos.saveCustomer\" data-ng-click=\"saveOrUpdateCustomer(customerDO)\"></button></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><button type=\"button\" name=\"btnCancelSaveUpdateCustomer\" class=\"ml-ppos-secondary-button\" id=\"btnCancelSaveUpdateCustomer\" translate=\"btn.ppos.cancel\" data-ng-click=\"closeProfileInformationModal();\" data-dismiss=\"modal\"></button></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</form>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div data-ng-show=\"customerSearchDataModel.existingPhoneCustomerResult != null\" class=\"ml-ppos-customer-profile-details\" >\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"modal-body\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-details-message\" translate=\"msg.ppos.customerSearchResultByPhone\" translate-values=\"{ customerPhoneNumber : customerSearchDataModel.customerPhoneNumber }\"></div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"customer in customerSearchDataModel.existingPhoneCustomerResult.data\" class=\"ml-ppos-customer-profile-details-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"updateSelectedContact(customer.id, customer.primaryContact.id, customerDO)\">{{ customer.primaryContact.person.firstName }} {{ customer.primaryContact.person.lastName }} <span class=\"ml-ppos-customer-search-zip-code\">{{ customer.primaryContact.address.postalCode }}</span> <span> {{ customer.email }} </span><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-right\"></i></a>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"modal-footer ml-ppos-customer-profile-button-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-primary-button\" data-ng-click=\"saveCustomer(customerDO)\"><span translate=\"btn.ppos.saveCustomer\"/></button></div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"closeSearchModal();\"><span translate=\"btn.ppos.cancel\"/></button></div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div data-ng-show=\"customerSearchDataModel.existingEmailCustomerResult != null\" class=\"ml-ppos-customer-profile-details ml-ppos-customer-result-byemail\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"modal-body\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-details-message\" translate=\"msg.ppos.customerSearchResultByEmail\" translate-values=\"{ customerEmail : customerSearchDataModel.existingEmail }\"></div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"customer in customerSearchDataModel.existingEmailCustomerResult.data\" class=\"ml-ppos-customer-profile-details-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-result-byemail-info\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div>{{ customer.primaryContact.person.firstName }} {{ customer.primaryContact.person.lastName }}</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div>{{ customer.primaryContact.address.postalCode }}</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div>{{ customer.email }}</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"modal-footer ml-ppos-customer-profile-button-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-primary-button\" data-ng-click=\"updateSelectedContact(customer.id, customer.primaryContact.id, customerDO)\"><span translate=\"btn.ppos.saveCustomer\"/></button></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"closeSearchModal();\"><span translate=\"btn.ppos.cancel\"/></button></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<!-- Following script tag added for fixing PEBL-16484 -->\r" +
    "\n" +
    "<script>\r" +
    "\n" +
    "$('#btnSaveUpdateCustomer').on('touchend', function(e){\r" +
    "\n" +
    "    e.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t$('#btnSaveUpdateCustomer').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "$('#btnCancelSaveUpdateCustomer').on('touchend', function(e){\r" +
    "\n" +
    "\te.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t// following is the hack to hide soft keyboard\r" +
    "\n" +
    "\tdocument.activeElement.blur();\r" +
    "\n" +
    "\t$('input').blur();\r" +
    "\n" +
    "\t$('select').blur();\r" +
    "\n" +
    "\t$('#btnCancelSaveUpdateCustomer').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "</script>"
  );


  $templateCache.put('views/dashboard/Dashboard.html',
    "<div class=\"ml-ppos-main-wrapper\">\n" +
    "\t<div class=\"ml-ppos-dashboard-wrapper\">\n" +
    "\t\t<!-- Instore Pickup Start -->\n" +
    "\t\t<div class=\"ml-ppos-dashboard-instore-pickup-widget-wrapper\" data-ng-controller=\"inStorePickupOrderShipmentsController\">\n" +
    "\t\t\t<div class=\"ml-ppos-dashboard-instore-pickup-bar\"></div>\n" +
    "\t\t\t<div class=\"ml-ppos-dashboard-instore-pickup-container\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-instore-pickup-content\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-wrapper\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-icon-left\"><span class=\"ml-ppos-mini-white-icon ml-ppos-store\"></span></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-message\"><a data-ng-href=\"#/inStorePickupOrderShipments\" translate>hdr.ppos.inStorePickup</a></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-icon-right\"><a data-ng-href=\"#/inStorePickupOrderShipments\"><span class=\"ml-ppos-mini-white-icon ml-ppos-arrow-right\"></span></a></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div data-ng-include=\"'views/dashboard/InStorePickupOrderShipmentsWidget.html'\"></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Instore Pickup End -->\n" +
    "\t\t\n" +
    "\t\t<div class=\"ml-ppos-dashboard-middle-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-dashboard-search-widget-wrapper\">\n" +
    "\t\t\t\t<!-- Product Search Start -->\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-product-search-widget\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-product-search-widget-bar\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-product-search-widget-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-product-search-widget-content\">\n" +
    "\t\t\t\t\t\t\t<h2 translate>hdr.ppos.product</h2>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-product-search-button-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-scan\">\n" +
    "                                    <ml-barcode-search data-display-as-modal=\"true\"\n" +
    "                                                       data-modal-title=\"Product Scan\"\n" +
    "                                                       data-service-url=\"/api/scan/skus/UPC_CODE\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t   data-service-post-data=\"skuBarcodeSearchPostData\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t   data-scan-success-callback=\"scanSuccessHandler()\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t   data-create-basket=\"true\"\n" +
    "                                                       data-forward-url=\"/basket\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t   data-cancel-btn-resource=\"btn.ppos.close\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t   data-continue-btn-resource=\"btn.ppos.done\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t   data-multi-add-msg-resource=\"msg.ppos.itemWithCodeAddedToBasket\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t   data-multi-add-count-resource=\"msg.ppos.scanAnotherProduct\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t></ml-barcode-search>\n" +
    "                                </div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-search-button\" data-toggle=\"modal\" data-target=\"#productSearchModal\"><span class=\"ml-ppos-grey-icon ml-ppos-search\"></span><span translate=\"btn.ppos.searchProduct\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t\t<product-search-modal></product-search-modal>\n" +
    "\t\t\t\t\t\t\t\t\t<product-detail-modal></product-detail-modal>\n" +
    "\t\t\t\t\t\t\t\t\t<near-by-stores-modal></near-by-stores-modal>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<!-- <div class=\"ml-ppos-product-browse\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-browse-button\"><span class=\"ml-ppos-grey-icon ml-ppos-browse\"></span>Browse</a>\n" +
    "\t\t\t\t\t\t\t\t</div> -->\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<!-- Product Search End -->\n" +
    "\t\t\t\t<!-- Order Search Start -->\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-order-search-widget\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-order-search-widget-bar\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-order-search-widget-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-order-search-widget-content\">\n" +
    "\t\t\t\t\t\t\t<h2 translate>hdr.ppos.order</h2>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-product-search-button-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t<!-- <div class=\"ml-ppos-product-scan\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-scan-button\"><span class=\"ml-ppos-grey-icon ml-ppos-scan-barcode\"></span><span translate=\"btn.ppos.scanOrderReceipt\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t</div> -->\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-search-button\" data-toggle=\"modal\" data-target=\"#orderSearchModal\"><span class=\"ml-ppos-grey-icon ml-ppos-search\"></span><span translate=\"btn.ppos.searchOrder\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t\t<order-search-modal></order-search-modal>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-browse\" data-ng-controller=\"customerSearchModalController\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-browse-button\" data-ng-click=\"showCustomerSearchModal()\"><span class=\"ml-ppos-grey-icon ml-ppos-plus\"></span><span translate=\"btn.ppos.orderNew\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t\t<customer-search-modal></customer-search-modal>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<!-- Order Search End -->\n" +
    "\t\t\t\t<!-- Customer Search Start -->\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-customer-search-widget\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-customer-search-widget-bar\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-customer-search-widget-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-customer-search-widget-content\">\n" +
    "\t\t\t\t\t\t\t<h2 translate>hdr.ppos.customer</h2>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-product-search-button-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t<!-- <div class=\"ml-ppos-product-scan\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-scan-button\"><span class=\"ml-ppos-grey-icon ml-ppos-scan-barcode\"></span><span translate=\"btn.ppos.loyalty\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t</div> -->\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search\" data-ng-controller=\"customerSearchModalController\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-search-button\" data-ng-click=\"showCustomerSearchModal()\"><span class=\"ml-ppos-grey-icon ml-ppos-search\"></span><span translate=\"btn.ppos.searchCustomer\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t\t<!--<customer-search-modal></customer-search-modal>-->\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-browse\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-browse-button\" data-ng-click=\"customerProfileInformationModal('dashboard');\"><span class=\"ml-ppos-grey-icon ml-ppos-plus\"></span><span translate=\"btn.ppos.customerNew\"></a>\n" +
    "\t\t\t\t\t\t\t\t\t<customer-profile-information-modal></customer-profile-information-modal>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<!-- Customer Search End -->\n" +
    "\n" +
    "\t\t\t\t<!-- Email Signup Start -->\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-email-signup-widget\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-email-signup-widget-bar\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-email-signup-widget-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-email-signup-widget-content\">\n" +
    "\t\t\t\t\t\t\t<div data-ng-include=\"'views/dashboard/EmailSignupWidget.html'\" data-ng-controller=\"emailSignupController\"></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<!-- Email Signup End -->\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"ml-ppos-dashboard-right-container\">\n" +
    "\t\t\t<!-- Shopping Bag Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-dashboard-bag-widget-wrapper\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-bag-widget-bar\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-bag-widget-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-bag-widget-content\">\n" +
    "\t\t\t\t\t\t<!-- Shopping Bag Header Start -->\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-wrapper\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-icon-left\"><span class=\"ml-ppos-mini-white-icon ml-ppos-circle-bag\"></span></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-message\" translate>hdr.ppos.shoppingBag</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-icon-right\"><a href=\"javascript:;\" data-ng-click=\"openBasketPage();\" class=\"\"><span class=\"ml-ppos-mini-white-icon ml-ppos-arrow-right\"></span></a></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<!-- Shopping Bag Header End -->\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-bag-widget-button-wrapper\" data-ng-controller=\"customerSearchModalController\">\n" +
    "\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-dashboard-bag-new-order-button\" data-ng-click=\"showCustomerSearchModal()\">\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-inner\">\n" +
    "\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-text\" translate>btn.ppos.newOrder</span>\n" +
    "\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn ml-ppos-mini-grey-icon ml-ppos-plus\"></span>\n" +
    "\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t\t\t<!--<customer-search-modal></customer-search-modal>-->\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-saved-bag-widget-content\">\n" +
    "\t\t\t\t\t\t<div data-ng-include=\"'views/dashboard/SavedBasketsWidget.html'\" data-ng-controller=\"savedBasketsController\"></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Shopping Bag End -->\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/dashboard/EmailSignupWidget.html',
    "<!-- Email Signup Header Start -->\n" +
    "<div class=\"ml-ppos-dashboard-header-wrapper\">\n" +
    "\t<div class=\"ml-ppos-dashboard-header-icon-left\"><span class=\"ml-icon-lib ml-icon-email\"></span></div>\n" +
    "\t<div class=\"ml-ppos-dashboard-header-message\" translate>hdr.ppos.emailSignUp</div>\n" +
    "</div>\n" +
    "<!-- Email Signup Header End -->\n" +
    "\n" +
    "<!-- Email Signup Body Start -->\n" +
    "<form novalidate name=\"emailSignupForm\" data-ng-submit=\"emailSignup()\">\n" +
    "\t<div class=\"ml-ppos-dashboard-email-signup-form\">\n" +
    "\t\t<div class=\"ml-ppos-email-input\">\n" +
    "\t\t\t<span translate=\"lbl.ppos.email\" />\n" +
    "\t\t\t<input type=\"email\" name=\"emailId\" id=\"emailId\" data-ng-model=\"emailSignupDataModel.email\" class=\"ml-ppos-input-text\" />\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"ml-ppos-name-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-first-name-input\">\n" +
    "\t\t\t\t<span translate=\"lbl.ppos.firstName\" />\n" +
    "\t\t\t\t<input type=\"text\" name=\"firstName\" data-ng-model=\"emailSignupDataModel.firstName\" class=\"ml-ppos-input-text\" />\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-last-name-input\">\n" +
    "\t\t\t\t<span translate=\"lbl.ppos.lastName\" />\n" +
    "\t\t\t\t<input type=\"text\" name=\"lastName\" data-ng-model=\"emailSignupDataModel.lastName\" class=\"ml-ppos-input-text\" />\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"ml-ppos-signup-button\">\n" +
    "\t\t\t<span class=\"ml-ppos-btn-inner\">\n" +
    "\t\t\t\t<span class=\"ml-ppos-btn-text\" translate>btn.ppos.signUp</span>\n" +
    "\t\t\t\t<span class=\"ml-ppos-btn ml-ppos-mini-white-icon ml-ppos-arrow-right\"></span>\n" +
    "\t\t\t</span>\n" +
    "\t\t\t<button type=\"submit\" name=\"emailSignupButton\" id=\"emailSignupButton\" class=\"ml-ppos-btn-hidden\">Sign Up</button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</form>\n" +
    "<!-- Email Signup Body End -->\n" +
    "\n" +
    "<!-- Success Message -->\n" +
    "<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"emailSignupSuccessModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\n" +
    "\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-icon-success\"></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t<div translate>msg.ppos.emailSignUpSuccess</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t<div><button type=\"submit\" name=\"emailSignupSuccessOkButton\" id=\"emailSignupSuccessOkButton\" data-dismiss=\"modal\" class=\"ml-ppos-primary-button\" translate=\"btn.ppos.ok\"></button></div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- Error Message -->\n" +
    "<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"emailSignupErrorModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\n" +
    "\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t<div data-ng-show=\"emailSignupDataModel.hasValidationErrors\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t<div data-ng-repeat=\"validationError in emailSignupDataModel.validationErrors\">{{ validationError }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t<div><button type=\"submit\" name=\"emailSignupErrorOkButton\" id=\"emailSignupErrorOkButton\" data-dismiss=\"modal\" class=\"ml-ppos-primary-button\" translate=\"btn.ppos.ok\"></button></div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/dashboard/InStorePickupOrderShipmentsWidget.html',
    "<div class=\"ml-ppos-dashboard-instore-pickup-content-wrapper\">\n" +
    "\t<div class=\"ml-ppos-dashboard-instore-pickup-item-row\">\n" +
    "\t\t<div class=\"ml-ppos-dashboard-instore-pickup-content-row\">\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-new-order\"><a data-ng-href=\"#/pickupNewOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-new\"></i>{{ 'hdr.ppos.inStorePickup.newPickup' | translate }} <span class=\"ml-ppos-instore-pickup-count\">{{ inStorePickupOrderShipmentsDataModel.Ordered.length }}</span></a></div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"ml-ppos-scroll-container\" data-ng-if=\"inStorePickupOrderShipmentsDataModel.Ordered.length\">\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-new-order-items ml-ppos-instore-pickup-new-order-head\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-order\" translate>hdr.ppos.inStorePickup.orderNumber</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-date\" translate>hdr.ppos.inStorePickup.orderDate</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-customer\" translate>hdr.ppos.inStorePickup.customer</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-new-order-items\" data-ng-repeat=\"pickupNewOrderShipment in inStorePickupOrderShipmentsDataModel.Ordered\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-order\">#{{ pickupNewOrderShipment.order.code }}</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-date\">{{pickupNewOrderShipment.order.orderDate | date : 'medium'}}</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-customer\">{{ pickupNewOrderShipment.order.billToInfo.firstName }} {{ pickupNewOrderShipment.order.billToInfo.lastName }}</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"ml-ppos-dashboard-instore-pickup-content-row\">\n" +
    "\t\t<div><a data-ng-href=\"#/pickupInProcessOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-process\"></i>{{ 'hdr.ppos.inStorePickup.inProcess' | translate }} <span class=\"ml-ppos-instore-pickup-count\">{{ inStorePickupOrderShipmentsDataModel.PickupInProcess.length }}</span></a></div>\n" +
    "\t</div>\n" +
    "\t<div class=\"ml-ppos-dashboard-instore-pickup-content-row\">\n" +
    "\t\t<div><a data-ng-href=\"#/pickupReadyOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-ready\"></i>{{ 'hdr.ppos.inStorePickup.pickUpReady' | translate }} <span class=\"ml-ppos-instore-pickup-count\">{{ inStorePickupOrderShipmentsDataModel.PickupReady.length }}</span></a></div>\n" +
    "\t</div>\n" +
    "\t<div class=\"ml-ppos-dashboard-instore-pickup-content-row\">\n" +
    "\t\t<div><a data-ng-href=\"#/pickupDoneOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-done\"></i>{{ 'hdr.ppos.inStorePickup.done' | translate }} <span class=\"ml-ppos-instore-pickup-count\">{{ inStorePickupOrderShipmentsDataModel.Shipped.length }}</span></a></div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/dashboard/SavedBasketsWidget.html',
    "<!-- Saved Baskets Header Start -->\n" +
    "<div class=\"ml-ppos-dashboard-header-wrapper\">\n" +
    "\t<div class=\"ml-ppos-dashboard-header-icon-left\"><span class=\"ml-ppos-mini-white-icon ml-ppos-circle-bag\"></span></div>\n" +
    "\t<div class=\"ml-ppos-dashboard-header-message\" translate>hdr.ppos.saved</div>\n" +
    "</div>\n" +
    "<!-- Saved Baskets Header End -->\n" +
    "\n" +
    "<!-- Saved Baskets Body Start -->\n" +
    "<div class=\"ml-ppos-dashboard-saved-bag-widget-items-container\">\n" +
    "\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t<div data-ng-repeat=\"savedBasket in savedBasketsDataModel.baskets\" class=\"ml-ppos-dashboard-saved-bag-widget-items\">\n" +
    "\t\t\t<div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-saved-bag-widget-items-detail\">\n" +
    "\t\t\t\t\t<a data-ng-click=\"openSavedBasket(savedBasket.customer.id, savedBasket.id)\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-saved-bag-widget-customer-name\">\n" +
    "\t\t\t\t\t\t\t<span data-ng-if=\"savedBasket.customer.guest\">\n" +
    "\t\t\t\t\t\t\t\t<span data-ng-if=\"savedBasket.customer.primaryContact.phone1\">\n" +
    "\t\t\t\t\t\t\t\t\t{{ savedBasket.customer.primaryContact.phone1 }}\n" +
    "\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t\t<span data-ng-if=\"!savedBasket.customer.primaryContact.phone1\" translate>hdr.ppos.guest</span>\n" +
    "\t\t\t\t\t\t\t</span> \n" +
    "\t\t\t\t\t\t\t<span data-ng-if=\"!savedBasket.customer.guest\">{{ savedBasket.customer.primaryContact.person.firstName }} {{ savedBasket.customer.primaryContact.person.lastName }}</span> \n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t{{savedBasket.dateModified | date : 'medium'}}\n" +
    "\t\t\t\t\t\t<div><span translate>lbl.ppos.totalAmount</span> {{ savedBasket.total }}</div>\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-saved-bag-widget-items-button\">\t\t\t\n" +
    "\t\t\t\t\t<a data-ng-click=\"deleteSavedBasket(savedBasket.id)\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<!-- Saved Baskets Body End -->"
  );


  $templateCache.put('views/home/Home.html',
    "<div class=\"ml-ppos-change-store-wrapper\">\n" +
    "\t<div class=\"ml-ppos-change-store-container\">\n" +
    "\t\t<span>{{ homePageDataModel.storeName }}</span> <span>({{ homePageDataModel.storeCode }})</span>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div data-ng-include=\"'views/login/LoginWidget.html'\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/instorepickup/InStorePickupCustomerVerificationModal.html',
    "<div class=\"ml-ppos-order-detail-instore-pickup-button\" data-ng-if=\"processInStorePickup\">\n" +
    "\t<a href=\"javascript:;\" data-ng-click=\"showInStorePickupCustomerVerificationModal()\" class=\"ml-ppos-primary-button\">{{ 'btn.ppos.inStorePickup' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-store\"></span></a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"ml-ppos-modal-container ml-ppos-instore-customer-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"inStorePickupCustomerVerificationModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"closeInStorePickupCustomerVerificationModal()\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\" translate=\"hdr.ppos.inStorePickupCustomerVerification\" translate-values=\"{ orderNumber : orderNumber }\"></h4>\n" +
    "\t\t\t\t</div>\n" +
    "\t  \n" +
    "\t\t\t\t<div data-ng-show=\"showStep1\">\n" +
    "\t\t\t\t\t<form novalidate data-ng-submit=\"processStep1()\">\n" +
    "\t\t\t\t\t\t<div class=\"modal-body ml-ppos-order-detail-customer-options\">\n" +
    "\t\t\t\t\t\t\t<div data-ng-show=\"paymentTypeCreditCard && cardVerificationRequired\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-customer-head\" translate>lbl.ppos.lastFourDigitsCreditCard</div>\n" +
    "\t\t\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" name=\"creditCardVerified\" id=\"creditCardVerified\" data-ng-model=\"creditCardVerified\" />\n" +
    "\t\t\t\t\t\t\t\t\t<div for=\"creditCardVerified\"><i></i><span>{{ creditCardType }} {{ creditCardLastFourDigits }}</span></div>\n" +
    "\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-customer-sub-head\" translate>lbl.ppos.customerIdentification</div>\n" +
    "\t\t\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" name=\"customerVerified\" id=\"customerVerified\" data-ng-model=\"customerVerified\" />\n" +
    "\t\t\t\t\t\t\t\t\t<div for=\"customerVerified\"><i></i><span>{{ pickupContactFirstName }} {{ pickupContactLastName }}</span></div>\n" +
    "\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t\t<div><button type=\"submit\" class=\"ml-ppos-primary-button\" translate>btn.ppos.process</button></div>\n" +
    "\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelStep1()\" translate=\"btn.ppos.cancel\"></button></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</form>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div data-ng-show=\"showStep2\">\n" +
    "\t\t\t\t\t<form novalidate data-ng-submit=\"processStep2(orderId, pickupShipment.id)\">\n" +
    "\t\t\t\t\t\t<div class=\"modal-body ml-ppos-order-detail-customer-options\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-signature-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-customer-head\"><span translate=\"lbl.ppos.creditCardSignatureHeader\"></span></div>\n" +
    "\t\t\t\t\t\t\t\t<canvas ng-signature-pad=\"signature\" ng-signature-pad-pen-color=\"rgb(255,255,255)\" width=\"420\" height=\"200\" class=\"ml-ppos-signature\"></canvas>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-customer-sub-head\" translate=\"lbl.ppos.inStorePickupSignatureAgreement\"></div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t\t<div><button type=\"submit\" class=\"ml-ppos-primary-button\" translate>btn.ppos.acceptSignature</button></div>\n" +
    "\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelStep2()\" translate=\"btn.ppos.cancel\"></button></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-clear-button\"><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"clearSignature()\" translate=\"btn.ppos.clearSignature\"></button></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</form>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div data-ng-show=\"showStep3\">\n" +
    "\t\t\t\t\t<form novalidate data-ng-submit=\"processStep3()\">\n" +
    "\t\t\t\t\t\t<div class=\"modal-body ml-ppos-order-detail-customer-options\">\n" +
    "\t\t\t\t\t\t\t<div data-ng-show=\"hasValidationErrors\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"validationError in validationErrors\">{{ validationError }}</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-customer-info\">\n" +
    "\t\t\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" name=\"receiptTypePrinter\" id=\"receiptTypePrinter\" data-ng-model=\"receiptTypePrinter\" ng-disabled=\"!printerAvailable\" />\n" +
    "\t\t\t\t\t\t\t\t\t<div><i for=\"receiptTypePrinter\"></i><span for=\"receiptTypePrinter\" translate=\"lbl.ppos.print\"></span><span class=\"ml-ppos-order-detail-device-name\">{{ deviceName }}</span></div>\n" +
    "\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-customer-info\">\n" +
    "\t\t\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" name=\"receiptTypeEmail\" id=\"receiptTypeEmail\" data-ng-model=\"receiptTypeEmail\" />\n" +
    "\t\t\t\t\t\t\t\t\t<div><i for=\"receiptTypeEmail\"></i><span for=\"receiptTypeEmail\" translate=\"lbl.ppos.email\"></span></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-customer-email\"><input type=\"email\" name=\"pickupCustomerEmail\" id=\"pickupCustomerEmail\" data-ng-model=\"pickupCustomerEmail\" class=\"form-control\" /></div>\n" +
    "\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t\t<div><button type=\"submit\" class=\"ml-ppos-primary-button\"><span translate=\"lbl.ppos.receipt\"></span></button></div>\n" +
    "\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"noReceipt()\"><span translate=\"lbl.ppos.noReceipt\"></span></button></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</form>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<!-- -->\n" +
    "<div class=\"ml-ppos-modal-container ml-ppos-instore-customer-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"inStorePickupConfirmationModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"closeInStorePickupConfirmationModal()\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\" translate=\"hdr.ppos.inStorePickupCustomerVerification\" translate-values=\"{ orderNumber : orderNumber }\"></h4>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div>\n" +
    "\t\t\t\t\t<form novalidate data-ng-submit=\"inStorePickupConfirmationDone()\">\n" +
    "\t\t\t\t\t\t<div class=\"modal-body ml-ppos-order-detail-customer-options\">\n" +
    "\t\t\t\t\t\t\t<div data-ng-show=\"receiptTypePrinter\"><span translate=\"lbl.ppos.receiptReadyOn\"></span>&nbsp;{{ deviceName }}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div data-ng-show=\"receiptTypeEmail\"><span translate=\"lbl.ppos.receiptHasBeenSentTo\"></span>&nbsp;{{ pickupCustomerEmail }}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div data-ng-show=\"!receiptTypePrinter && !receiptTypeEmail\"><span translate=\"msg.ppos.inStorePickupComplete\"></span></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t\t<div><button type=\"submit\" class=\"ml-ppos-primary-button\"><span translate=\"btn.ppos.done\"></span></button></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</form>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/instorepickup/InStorePickupHeader.html',
    "<div class=\"ml-ppos-instore-pickup-header-container\">\n" +
    "\t<div class=\"ml-ppos-instore-pickup-header-new\">\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-order-new-bar\" data-ng-class=\"{'ml-ppos-instore-pickup-inactive' : !inStorePickupHeaderDataModel.pickupNewOrderShipmentsState}\"></div>\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t<a data-ng-href=\"#/inStorePickupOrderShipments\" data-ng-if=\"inStorePickupHeaderDataModel.pickupNewOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-new\"></i>{{ 'hdr.ppos.inStorePickup.newPickup' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.Ordered.length }}</span></a>\n" +
    "\t\t\t<a data-ng-href=\"#/pickupNewOrderShipments\" data-ng-if=\"!inStorePickupHeaderDataModel.pickupNewOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-new\"></i>{{ 'hdr.ppos.inStorePickup.newPickup' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.Ordered.length }}</span></a>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"ml-ppos-instore-pickup-header-process\">\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-order-process-bar\" data-ng-class=\"{'ml-ppos-instore-pickup-inactive' : !inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState}\"></div>\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t<a data-ng-href=\"#/inStorePickupOrderShipments\" data-ng-if=\"inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-process\"></i>{{ 'hdr.ppos.inStorePickup.inProcess' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.PickupInProcess.length }}</span></a>\n" +
    "\t\t\t<a data-ng-href=\"#/pickupInProcessOrderShipments\" data-ng-if=\"!inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-process\"></i>{{ 'hdr.ppos.inStorePickup.inProcess' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.PickupInProcess.length }}</span></a>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"ml-ppos-instore-pickup-header-ready\">\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-order-ready-bar\" data-ng-class=\"{'ml-ppos-instore-pickup-inactive' : !inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState}\"></div>\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t<a data-ng-href=\"#/inStorePickupOrderShipments\" data-ng-if=\"inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-ready\"></i>{{ 'hdr.ppos.inStorePickup.pickUpReady' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.PickupReady.length }}</span></a>\n" +
    "\t\t\t<a data-ng-href=\"#/pickupReadyOrderShipments\" data-ng-if=\"!inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-ready\"></i>{{ 'hdr.ppos.inStorePickup.pickUpReady' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.PickupReady.length }}</span></a>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"ml-ppos-instore-pickup-header-done\">\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-order-done-bar\" data-ng-class=\"{'ml-ppos-instore-pickup-inactive' : !inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState}\"></div>\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t<a data-ng-href=\"#/inStorePickupOrderShipments\" data-ng-if=\"inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-done\"></i>{{ 'hdr.ppos.inStorePickup.done' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.Shipped.length }}</span></a>\n" +
    "\t\t\t<a data-ng-href=\"#/pickupDoneOrderShipments\" data-ng-if=\"!inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-done\"></i>{{ 'hdr.ppos.inStorePickup.done' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.Shipped.length }}</span></a>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/instorepickup/InStorePickupOrderShipments.html',
    "<div class=\"ml-ppos-main-wrapper\">\n" +
    "\t<div class=\"ml-ppos-instore-pickup-order-wrapper\">\n" +
    "\n" +
    "\t\t<!-- Pickup Headers Start -->\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-header-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-header-new\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-new-bar\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t\t\t<a data-ng-href=\"#/pickupNewOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-new\"></i>{{ 'hdr.ppos.inStorePickup.newPickup' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.Ordered.length }}</span></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-header-process\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-process-bar\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t\t\t<a data-ng-href=\"#/pickupInProcessOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-process\"></i>{{ 'hdr.ppos.inStorePickup.inProcess' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.PickupInProcess.length }}</span></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-header-ready\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-ready-bar\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t\t\t<a data-ng-href=\"#/pickupReadyOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-ready\"></i>{{ 'hdr.ppos.inStorePickup.pickUpReady' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.PickupReady.length }}</span></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-header-done\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-done-bar\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t\t\t<a data-ng-href=\"#/pickupDoneOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-done\"></i>{{ 'hdr.ppos.inStorePickup.done' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.Shipped.length }}</span></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Pickup Headers End -->\n" +
    "\t\t\n" +
    "\t\t<!-- Pickup Row Start -->\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-row-container\">\n" +
    "\t\t\t<!-- Pickup New Orders Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-order-new ml-ppos-scroll-container\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-new-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-content\">\n" +
    "\t\t\t\t\t\t<!-- Loop Start -->\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"pickupNewOrderShipment in inStorePickupOrderShipmentsDataModel.Ordered\" class=\"ml-ppos-instore-pickup-toggle\">\n" +
    "\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t<button type=\"button\" class=\"togglebtn\" ng-click=\"toggleIcon({{ pickupNewOrderShipment.id }});\"><span class=\"ml-ppos-instore-pickup-order-number\">#{{ pickupNewOrderShipment.order.code }}</span> <span>{{ pickupNewOrderShipment.order.billToInfo.firstName }} {{ pickupNewOrderShipment.order.billToInfo.lastName }}</span> <i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\" id=\"arrow_{{ pickupNewOrderShipment.id }}\"></i></button>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupNewOrderShipment.id }}\" class=\"collapse ml-ppos-instore-pickup-order-content-data\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupNewOrderShipment.items\" class=\"ml-ppos-instore-pickup-thumb-content\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb\"><img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" /></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-code\">{{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-date\">{{ 'lbl.ppos.inStorePickup.orderedDate' | translate }} {{pickupNewOrderShipment.order.orderDate | date : 'medium'}}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-button-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"viewOrderDetail(pickupNewOrderShipment.order.id)\" translate>btn.ppos.inStorePickup.viewDetail</button></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-button-move\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-inner\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-text\" translate>btn.ppos.inStorePickup.move</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn ml-ppos-mini-grey-icon ml-ppos-arrow-right\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t<button type=\"button\" data-ng-click=\"moveToPickupInProcessState(pickupNewOrderShipment.order.id, pickupNewOrderShipment.id)\" class=\"ml-ppos-btn-hidden\"></button>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<!-- Loop End -->\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Pickup New Orders End -->\n" +
    "\n" +
    "\t\t\t<!-- Pickup In Process Orders Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-order-process\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-process-container ml-ppos-scroll-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-content\">\n" +
    "\t\t\t\t\t\t<!-- Loop Start -->\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"pickupInProcessOrderShipment in inStorePickupOrderShipmentsDataModel.PickupInProcess\" class=\"ml-ppos-instore-pickup-toggle\">\n" +
    "\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t<button type=\"button\" class=\"togglebtn\" ng-click=\"toggleIcon({{ pickupInProcessOrderShipment.id }});\"><span class=\"ml-ppos-instore-pickup-order-number\">#{{ pickupInProcessOrderShipment.order.code }}</span> <span>{{ pickupInProcessOrderShipment.order.billToInfo.firstName }} {{ pickupInProcessOrderShipment.order.billToInfo.lastName }}</span> <i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\" id=\"arrow_{{ pickupInProcessOrderShipment.id }}\"></i></button>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupInProcessOrderShipment.id }}\" class=\"collapse ml-ppos-instore-pickup-order-content-data\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupInProcessOrderShipment.items\" class=\"ml-ppos-instore-pickup-thumb-content\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb\"><img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" /></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-code\">{{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-date\">{{ 'lbl.ppos.inStorePickup.orderedDate' | translate }} {{pickupInProcessOrderShipment.order.orderDate | date : 'medium'}}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-button-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"viewOrderDetail(pickupInProcessOrderShipment.order.id)\" translate>btn.ppos.inStorePickup.viewDetail</button></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-button-move\" data-ng-show=\"pickupInProcessOrderShipment.canMoveToPickupReady\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-inner\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-text\" translate>btn.ppos.inStorePickup.move</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn ml-ppos-mini-grey-icon ml-ppos-arrow-right\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t<button type=\"button\" data-ng-click=\"moveToPickupReadyState(pickupInProcessOrderShipment.order.id, pickupInProcessOrderShipment.id)\" class=\"ml-ppos-btn-hidden\" translate>btn.ppos.inStorePickup.move</button>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-csr-list\">\n" +
    "\t\t\t\t\t\t\t\t<!-- Assigned CSR -->\n" +
    "\t\t\t\t\t\t\t\t<button type=\"button\" class=\"togglebtn\" data-toggle=\"collapse\" data-target=\"#activeCSRList_{{ pickupInProcessOrderShipment.id }}\">{{ pickupInProcessOrderShipment.CSR.firstName }} {{ pickupInProcessOrderShipment.CSR.lastName }}</button>\n" +
    "\t\t\t\t\t\t\t\t<!-- CSR list to choose from -->\n" +
    "\t\t\t\t\t\t\t\t<div id=\"activeCSRList_{{ pickupInProcessOrderShipment.id }}\" class=\"collapse ml-ppos-instore-pickup-order-content-data\">\n" +
    "\t\t\t\t\t\t\t\t\t<ul>\n" +
    "\t\t\t\t\t\t\t\t\t\t<li data-ng-repeat=\"activeCSR in activeCSRs\" ng-if=\"activeCSR.id != pickupInProcessOrderShipment.CSR.id\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span></span><a href=\"javascript:;\" data-ng-click=\"associateCSRtoShipment(activeCSR.id, pickupInProcessOrderShipment.order.id, pickupInProcessOrderShipment.id)\">{{ activeCSR.firstName }} {{ activeCSR.lastName }}</a>\n" +
    "\t\t\t\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<!-- Loop End -->\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Pickup In Process Orders End -->\n" +
    "\n" +
    "\t\t\t<!-- Pickup Ready Orders Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-order-ready\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-ready-container ml-ppos-scroll-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-content\">\n" +
    "\t\t\t\t\t\t<!-- Loop Start -->\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"pickupReadyOrderShipment in inStorePickupOrderShipmentsDataModel.PickupReady\" class=\"ml-ppos-instore-pickup-toggle\">\n" +
    "\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t<button type=\"button\" class=\"togglebtn\" ng-click=\"toggleIcon({{ pickupReadyOrderShipment.id }});\"><span class=\"ml-ppos-instore-pickup-order-number\">#{{ pickupReadyOrderShipment.order.code }}</span> <span>{{ pickupReadyOrderShipment.order.billToInfo.firstName }} {{ pickupReadyOrderShipment.order.billToInfo.lastName }}</span> <i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\" id=\"arrow_{{ pickupReadyOrderShipment.id }}\"></i></button>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupReadyOrderShipment.id }}\" class=\"collapse ml-ppos-instore-pickup-order-content-data\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupReadyOrderShipment.items\" class=\"ml-ppos-instore-pickup-thumb-content\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb\"><img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" /></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-code\">{{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-date\">{{ 'lbl.ppos.inStorePickup.orderedDate' | translate }} {{pickupReadyOrderShipment.order.orderDate | date : 'medium'}}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-button-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"viewOrderDetail(pickupReadyOrderShipment.order.id)\" translate>btn.ppos.inStorePickup.viewDetail</button></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<!-- Note Start -->\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-notes\" data-ng-if=\"pickupReadyOrderShipment.note.length\">\n" +
    "\t\t\t\t\t\t\t\t<button type=\"button\" class=\"togglebtn\" data-toggle=\"collapse\" data-target=\"#show_note_{{ pickupReadyOrderShipment.id }}\" translate>btn.ppos.inStorePickup.showNote</button>\n" +
    "\t\t\t\t\t\t\t\t<div id=\"show_note_{{ pickupReadyOrderShipment.id }}\" class=\"collapse ml-ppos-instore-pickup-order-content-data\">\n" +
    "\t\t\t\t\t\t\t\t\t<textarea rows=\"5\" cols=\"25\" placeholder=\"{{ 'msg.ppos.inStorePickup.writeANote' | translate }}\" data-ng-model=\"pickupReadyOrderShipment.note[0].note\" readonly></textarea>\n" +
    "\t\t\t\t\t\t\t\t\t<!-- Edit Note - Phase 2 -->\n" +
    "\t\t\t\t\t\t\t\t\t<!-- <button type=\"button\" data-ng-click=\"editShipmentNoteForPickup(pickupReadyOrderShipment.order.id, pickupReadyOrderShipment.id, pickupReadyOrderShipment.order.customer.id, pickupReadyOrderShipment.note[0].id, pickupReadyOrderShipment.note[0].note)\" class=\"ml-ppos-primary-button ml-ppos-instore-pickup-save-button\">Save Note</button> -->\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-notes\" data-ng-if=\"!pickupReadyOrderShipment.note.length\">\n" +
    "\t\t\t\t\t\t\t\t<button type=\"button\" class=\"togglebtn\" data-toggle=\"collapse\" data-target=\"#add_note_{{ pickupReadyOrderShipment.id }}\" translate>btn.ppos.inStorePickup.addNote</button>\n" +
    "\t\t\t\t\t\t\t\t<div id=\"add_note_{{ pickupReadyOrderShipment.id }}\" class=\"collapse ml-ppos-instore-pickup-order-content-data\">\n" +
    "\t\t\t\t\t\t\t\t\t<textarea rows=\"5\" cols=\"25\" placeholder=\"{{ 'msg.ppos.inStorePickup.writeANote' | translate }}\" data-ng-model=\"pickupReadyOrderShipment.noteTextToAdd\" maxlength=\"{{ noteMaxLength }}\"></textarea>\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"pickupReadyOrderShipment.noteTextToAdd.length === noteMaxLength\" translate=\"msg.ppos.inStorePickup.maxNoteCharacters\" translate-values=\"{ noteMaxLength : noteMaxLength }\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"pickupReadyOrderShipment.noteTextToAdd\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<button type=\"button\" data-ng-click=\"addShipmentNoteForPickup(pickupReadyOrderShipment.order.id, pickupReadyOrderShipment.id, pickupReadyOrderShipment.order.customer.id, pickupReadyOrderShipment.noteTextToAdd)\" class=\"ml-ppos-primary-button ml-ppos-instore-pickup-save-button\" translate>btn.ppos.inStorePickup.saveNote</button>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<!-- Note End -->\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<!-- Loop End -->\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Pickup Ready Orders End -->\n" +
    "\n" +
    "\t\t\t<!-- Pickup Done Orders Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-order-done\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-done-container ml-ppos-scroll-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-content\">\n" +
    "\t\t\t\t\t\t<!-- Loop Start -->\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"pickupDoneOrderShipment in inStorePickupOrderShipmentsDataModel.Shipped\" class=\"ml-ppos-instore-pickup-toggle\">\n" +
    "\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t<button type=\"button\" class=\"togglebtn\" ng-click=\"toggleIcon({{ pickupDoneOrderShipment.id }});\"><span class=\"ml-ppos-instore-pickup-order-number\">#{{ pickupDoneOrderShipment.order.code }}</span> <span>{{ pickupDoneOrderShipment.order.billToInfo.firstName }} {{ pickupDoneOrderShipment.order.billToInfo.lastName }}</span> <i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\" id=\"arrow_{{ pickupDoneOrderShipment.id }}\"></i></button>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupDoneOrderShipment.id }}\" class=\"collapse ml-ppos-instore-pickup-order-content-data\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupDoneOrderShipment.items\" class=\"ml-ppos-instore-pickup-thumb-content\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb\"><img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" /></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-code\">{{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-date\">{{ 'lbl.ppos.inStorePickup.orderedDate' | translate }} {{pickupDoneOrderShipment.order.orderDate | date : 'medium'}}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-button-container\"><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"viewOrderDetail(pickupDoneOrderShipment.order.id)\" translate>btn.ppos.inStorePickup.viewDetail</button></div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<!-- Loop End -->\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Pickup Done Orders End -->\n" +
    "\n" +
    "\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/instorepickup/PickupDoneOrderShipments.html',
    "<div class=\"ml-ppos-main-wrapper\">\n" +
    "\t<div class=\"ml-ppos-instore-pickup-order-wrapper\">\n" +
    "\n" +
    "\t\t<!-- Pickup Headers Start -->\n" +
    "\t\t<div data-ng-include=\"'views/instorepickup/InStorePickupHeader.html'\"></div>\n" +
    "\t\t<!-- Pickup Headers End -->\n" +
    "\t\t\n" +
    "\t\t<!-- Content Start -->\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-content-container\">\n" +
    "\t\t\t<!-- Sorting Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-sort-container\" data-ng-if=\"inStorePickupOrderShipmentsDataModel.Shipped.length\">\n" +
    "\t\t\t\t<ul class=\"nav nav-tabs\">\n" +
    "\t\t\t\t\t<li role=\"presentation\" class=\"dropdown\">\n" +
    "\t\t\t\t\t\t<a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"javascript:;\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "\t\t\t\t\t\t\t{{ 'lbl.ppos.inStorePickup.sortBy' | translate }} <span class=\"ml-icon-lib ml-icon-arrow-down\"></span>\n" +
    "\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t\t<ul class=\"dropdown-menu\">\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderNumber')\">{{ 'lbl.ppos.inStorePickup.sortByOrderNumber' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderNumber'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderDate')\">{{ 'lbl.ppos.inStorePickup.sortByOrderDate' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderDate'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('customerLastName')\">{{ 'lbl.ppos.inStorePickup.sortByCustomerName' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'customerLastName'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('csrLastName')\">{{ 'lbl.ppos.inStorePickup.sortBySalesAssociateName' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'csrLastName'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Sorting End -->\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t\t<div class=\"panel-group ml-ppos-instore-pickup-order-detail-row\" id=\"accordion\">\n" +
    "\t\t\t\t\t<div class=\"panel panel-default\" data-ng-repeat=\"pickupDoneOrderShipment in inStorePickupOrderShipmentsDataModel.Shipped\">\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div class=\"panel-heading\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-title\">\n" +
    "\t\t\t\t\t\t\t\t<a data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#orderShipmentDetail_{{ pickupDoneOrderShipment.id }}\">#{{ pickupDoneOrderShipment.order.code }} <span>{{pickupDoneOrderShipment.order.orderDate | date : 'medium'}}</span><span class=\"ml-ppos-instore-pickup-customer-name\">{{ pickupDoneOrderShipment.order.billToInfo.firstName }} {{ pickupDoneOrderShipment.order.billToInfo.lastName }}</span><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\"></i></a>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupDoneOrderShipment.id }}\" class=\"panel-collapse collapse\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-body\">\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupDoneOrderShipment.items\" class=\"ml-ppos-instore-pickup-order-detail\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-img\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" />\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ item.product.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.style\"/> {{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"msg.ppos.qty\"/> {{ item.qty }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-options\"></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-footer\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-button\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"viewOrderDetail(pickupDoneOrderShipment.order.id)\" class=\"ml-ppos-primary-button\"><span translate>btn.ppos.inStorePickup.viewDetail</span><i class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-right\"></i></a>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Content End -->\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/instorepickup/PickupInProcessOrderShipments.html',
    "<div class=\"ml-ppos-main-wrapper\">\n" +
    "\t<div class=\"ml-ppos-instore-pickup-order-wrapper\">\n" +
    "\n" +
    "\t\t<!-- Pickup Headers Start -->\n" +
    "\t\t<div data-ng-include=\"'views/instorepickup/InStorePickupHeader.html'\"></div>\n" +
    "\t\t<!-- Pickup Headers End -->\n" +
    "\t\t\n" +
    "\t\t<!-- Content Start -->\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-content-container\">\n" +
    "\t\t\t<!-- Sorting Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-sort-container\" data-ng-if=\"inStorePickupOrderShipmentsDataModel.PickupInProcess.length\">\n" +
    "\t\t\t\t<ul class=\"nav nav-tabs\">\n" +
    "\t\t\t\t\t<li role=\"presentation\" class=\"dropdown\">\n" +
    "\t\t\t\t\t\t<a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"javascript:;\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "\t\t\t\t\t\t\t{{ 'lbl.ppos.inStorePickup.sortBy' | translate }} <span class=\"ml-icon-lib ml-icon-arrow-down\"></span>\n" +
    "\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t\t<ul class=\"dropdown-menu\">\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderNumber')\">{{ 'lbl.ppos.inStorePickup.sortByOrderNumber' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderNumber'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderDate')\">{{ 'lbl.ppos.inStorePickup.sortByOrderDate' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderDate'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('customerLastName')\">{{ 'lbl.ppos.inStorePickup.sortByCustomerName' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'customerLastName'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('csrLastName')\">{{ 'lbl.ppos.inStorePickup.sortBySalesAssociateName' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'csrLastName'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Sorting End -->\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t\t<div class=\"panel-group ml-ppos-instore-pickup-order-detail-row\" id=\"accordion\">\n" +
    "\t\t\t\t\t<div class=\"panel panel-default\" data-ng-repeat=\"pickupInProcessOrderShipment in inStorePickupOrderShipmentsDataModel.PickupInProcess\">\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div class=\"panel-heading\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-title\">\n" +
    "\t\t\t\t\t\t\t\t<a data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#orderShipmentDetail_{{ pickupInProcessOrderShipment.id }}\">#{{ pickupInProcessOrderShipment.order.code }} <span>{{pickupInProcessOrderShipment.order.orderDate | date : 'medium'}}</span><span class=\"ml-ppos-instore-pickup-customer-name\">{{ pickupInProcessOrderShipment.order.billToInfo.firstName }} {{ pickupInProcessOrderShipment.order.billToInfo.lastName }}</span><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\"></i></a>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupInProcessOrderShipment.id }}\" class=\"panel-collapse collapse\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-body\">\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupInProcessOrderShipment.items\" class=\"ml-ppos-instore-pickup-order-detail\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-img\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" />\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ item.product.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.style\"/> {{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"msg.ppos.qty\"/> {{ item.qty }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-options\"></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-footer\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-button\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"viewOrderDetail(pickupInProcessOrderShipment.order.id)\" class=\"ml-ppos-primary-button\"><span translate>btn.ppos.inStorePickup.viewDetail</span><i class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-right\"></i></a>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t<div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Content End -->\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/instorepickup/PickupNewOrderShipments.html',
    "<div class=\"ml-ppos-main-wrapper\">\n" +
    "\t<div class=\"ml-ppos-instore-pickup-order-wrapper\">\n" +
    "\n" +
    "\t\t<!-- Pickup Headers Start -->\n" +
    "\t\t<div data-ng-include=\"'views/instorepickup/InStorePickupHeader.html'\"></div>\n" +
    "\t\t<!-- Pickup Headers End -->\n" +
    "\n" +
    "\t\t<!-- Content Start -->\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-content-container\">\n" +
    "\t\t\t<!-- Sorting Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-sort-container\" data-ng-if=\"inStorePickupOrderShipmentsDataModel.Ordered.length\">\n" +
    "\t\t\t\t<ul class=\"nav nav-tabs\">\n" +
    "\t\t\t\t\t<li role=\"presentation\" class=\"dropdown\" id=\"lstSortByMenu\">\n" +
    "\t\t\t\t\t\t<a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"javascript:;\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "\t\t\t\t\t\t\t{{ 'lbl.ppos.inStorePickup.sortBy' | translate }} <span class=\"ml-icon-lib ml-icon-arrow-down\"></span>\n" +
    "\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t\t<ul class=\"dropdown-menu\">\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderNumber')\">{{ 'lbl.ppos.inStorePickup.sortByOrderNumber' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderNumber'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('itemSKUNumber')\">{{ 'lbl.ppos.inStorePickup.sortByItemSKUNumber' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'itemSKUNumber'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderDate')\">{{ 'lbl.ppos.inStorePickup.sortByOrderDate' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderDate'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('customerLastName')\">{{ 'lbl.ppos.inStorePickup.sortByCustomerName' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'customerLastName'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Sorting End -->\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-scroll-container\" data-ng-if=\"currentSortParam !== 'itemSKUNumber'\">\n" +
    "\t\t\t\t<div class=\"panel-group ml-ppos-instore-pickup-order-detail-row\" id=\"accordion\">\n" +
    "\t\t\t\t\t<div class=\"panel panel-default\" data-ng-repeat=\"pickupNewOrderShipment in inStorePickupOrderShipmentsDataModel.Ordered\">\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div class=\"panel-heading\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-title\">\n" +
    "\t\t\t\t\t\t\t\t<a data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#orderShipmentDetail_{{ pickupNewOrderShipment.id }}\">#{{ pickupNewOrderShipment.order.code }} <span>{{pickupNewOrderShipment.order.orderDate | date : 'medium'}}</span><span class=\"ml-ppos-instore-pickup-customer-name\">{{ pickupNewOrderShipment.order.billToInfo.firstName }} {{ pickupNewOrderShipment.order.billToInfo.lastName }}</span><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\"></i></a>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupNewOrderShipment.id }}\" class=\"panel-collapse collapse\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-body\">\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupNewOrderShipment.items\" class=\"ml-ppos-instore-pickup-order-detail\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-img\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" />\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ item.product.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.style\"/> {{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"msg.ppos.qty\"/> {{ item.qty }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-options\"></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-footer\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-button\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"viewOrderDetail(pickupNewOrderShipment.order.id)\" class=\"ml-ppos-primary-button\"><span translate>btn.ppos.inStorePickup.viewDetail</span><i class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-right\"></i></a>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div data-ng-if=\"currentSortParam === 'itemSKUNumber'\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-sort-wrapper\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-sort-head\">\n" +
    "\t\t\t\t\t\t<div translate>hdr.ppos.inStorePickup.productName</div>\n" +
    "\t\t\t\t\t\t<div translate>hdr.ppos.qty</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"skuDetails in groupBySkuDataModel\" class=\"ml-ppos-instore-pickup-sort-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-sort-thumb\"><img src=\"{{ skuDetails.thumb }}\" /></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-sort-name\">\n" +
    "\t\t\t\t\t\t\t\t<div>{{ skuDetails.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-sku\"><span translate=\"lbl.ppos.style\"/> {{ skuDetails.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-sort-qty\">{{ skuDetails.qty }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<!-- Content Start End -->\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/instorepickup/PickupReadyOrderShipments.html',
    "<div class=\"ml-ppos-main-wrapper\">\n" +
    "\t<div class=\"ml-ppos-instore-pickup-order-wrapper\">\n" +
    "\n" +
    "\t\t<!-- Pickup Headers Start -->\n" +
    "\t\t<div data-ng-include=\"'views/instorepickup/InStorePickupHeader.html'\"></div>\n" +
    "\t\t<!-- Pickup Headers End -->\n" +
    "\t\t\n" +
    "\t\t<!-- Content Start -->\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-content-container\">\n" +
    "\t\t\t<!-- Sorting Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-sort-container\" data-ng-if=\"inStorePickupOrderShipmentsDataModel.PickupReady.length\">\n" +
    "\t\t\t\t<ul class=\"nav nav-tabs\">\n" +
    "\t\t\t\t\t<li role=\"presentation\" class=\"dropdown\">\n" +
    "\t\t\t\t\t\t<a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"javascript:;\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "\t\t\t\t\t\t\t{{ 'lbl.ppos.inStorePickup.sortBy' | translate }} <span class=\"ml-icon-lib ml-icon-arrow-down\"></span>\n" +
    "\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t\t<ul class=\"dropdown-menu\">\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderNumber')\">{{ 'lbl.ppos.inStorePickup.sortByOrderNumber' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderNumber'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderDate')\">{{ 'lbl.ppos.inStorePickup.sortByOrderDate' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderDate'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('customerLastName')\">{{ 'lbl.ppos.inStorePickup.sortByCustomerName' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'customerLastName'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('csrLastName')\">{{ 'lbl.ppos.inStorePickup.sortBySalesAssociateName' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'csrLastName'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Sorting End -->\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t\t<div class=\"panel-group ml-ppos-instore-pickup-order-detail-row\" id=\"accordion\">\n" +
    "\t\t\t\t\t<div class=\"panel panel-default\" data-ng-repeat=\"pickupReadyOrderShipment in inStorePickupOrderShipmentsDataModel.PickupReady\">\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div class=\"panel-heading\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-title\">\n" +
    "\t\t\t\t\t\t\t\t<a data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#orderShipmentDetail_{{ pickupReadyOrderShipment.id }}\">#{{ pickupReadyOrderShipment.order.code }} <span>{{pickupReadyOrderShipment.order.orderDate | date : 'medium'}}</span><span class=\"ml-ppos-instore-pickup-customer-name\">{{ pickupReadyOrderShipment.order.billToInfo.firstName }} {{ pickupReadyOrderShipment.order.billToInfo.lastName }}</span><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\"></i></a>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupReadyOrderShipment.id }}\" class=\"panel-collapse collapse\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-body\">\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupReadyOrderShipment.items\" class=\"ml-ppos-instore-pickup-order-detail\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-img\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" />\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ item.product.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.style\"/> {{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"msg.ppos.qty\"/> {{ item.qty }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-options\"></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-footer\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-button\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"viewOrderDetail(pickupReadyOrderShipment.order.id)\" class=\"ml-ppos-primary-button\"><span translate>btn.ppos.inStorePickup.viewDetail</span><i class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-right\"></i></a>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Content End -->\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/login/LoginWidget.html',
    "<div class=\"ml-ppos-login-wrapper ml-ppos-login-main-column\" data-ng-controller=\"loginController\">\n" +
    "\t<div class=\"ml-ppos-login-main-container\">\n" +
    "\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"showLoginFailureMessage\">\n" +
    "\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t<div>{{ loginFailureMessage | translate }}</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t\n" +
    "\t\t<div class=\"ml-ppos-login-container\">\n" +
    "\t\t\t<form novalidate data-ng-submit=\"login(userCredentials)\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label\" translate=\"lbl.ppos.login.username\"></div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label-content\">\n" +
    "\t\t\t\t\t<input type=\"text\" name=\"loginId\" id=\"loginId\" class=\"form-control\" data-ng-model=\"userCredentials.loginId\" placeholder=\"{{ 'msg.ppos.login.enterUsername' | translate }}\" autocorrect=\"off\" autocapitalize=\"off\" />\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label\" translate=\"lbl.ppos.login.password\"></div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label-content\">\n" +
    "\t\t\t\t\t<input type=\"password\" name=\"password\" id=\"password\" class=\"form-control ml-ppos-login-label-password\" data-ng-model=\"userCredentials.password\" placeholder=\"{{ 'msg.ppos.login.enterPassword' | translate }}\" />\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-button-container\">\n" +
    "\t\t\t\t\t<button type=\"submit\" name=\"loginButton\" class=\"ml-ppos-login-button\" id=\"loginButton\" translate>btn.ppos.login.loginButton</button>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</form>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/login/UnlockScreen.html',
    "<div class=\"ml-ppos-unlock-wrapper ml-ppos-unlock-main-column\" data-ng-controller=\"unlockScreenController\">\n" +
    "\t<div class=\"ml-ppos-unlock-main-container\">\n" +
    "\t\t<div class=\"ml-ppos-unlock-user-logout\">\n" +
    "\t\t\t<a data-ng-click=\"logout()\" data-ng-controller=\"logoutController\" translate=\"msg.ppos.logoutOtherUser\" translate-values=\"{ loggedInCSRName : unlockScreenDataModel.loggedInCSR.firstName }\"></a>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div data-ng-show=\"unlockScreenDataModel.showPinDoesNotMatchErrorMessage\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t<div class=\"ml-ppos-error-message\" translate>msg.ppos.enterCorrectAccessPin</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"ml-ppos-unlock-container\">\n" +
    "\t\t\t<div translate=\"msg.ppos.greetingUser\" translate-values=\"{ loggedInCSRName : unlockScreenDataModel.loggedInCSR.firstName }\"></div>\n" +
    "\n" +
    "\t\t\t<div translate>msg.ppos.unlockScreenTypeAccessPin</div>\n" +
    "\n" +
    "\t\t\t<div><input type=\"password\" disabled name=\"pinEntered\" id=\"pinEntered\" data-ng-model=\"unlockScreenDataModel.pinEntered\" class=\"form-control\" /></div>\n" +
    "\n" +
    "\t\t\t<div ng-repeat=\"pinButton in unlockScreenDataModel.pinButtons track by $index\" ng-click=\"selectPin(pinButton.value)\" class=\"ml-ppos-unlock-keys-container\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-unlock-keys\">{{ pinButton.label }}</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/management/Management.html',
    "<div class=\"ml-ppos-account-wrapper\">\n" +
    "\t<div class=\"ml-ppos-management-container\">\n" +
    "\t\t<!-- Employee Management Start -->\n" +
    "\t\t<div class=\"ml-ppos-management-row\" data-ng-if=\"managementDataModel.isUserCanSearchEmp || managementDataModel.isUserCanAddEmp || managementDataModel.isUserCanListEmp\">\n" +
    "\t\t\t<div class=\"ml-ppos-management-title\">\n" +
    "\t\t\t\t<i class=\"ml-ppos-mini-white-icon ml-ppos-employee\"></i>  <span translate=\"hdr.ppos.employeeManagement\"/>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-management-content\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanSearchEmp\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-search\"></span> <span translate=\"btn.ppos.search\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanAddEmp\" ng-click=\"goToCsrAddScreen();\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-plus\"></span> <span translate=\"btn.ppos.new\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanListEmp\" ng-click=\"goToCsrListScreen();\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-browse\"></span> <span translate=\"btn.ppos.view\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Employee Management End -->\n" +
    "\t\t<!-- Settings Start -->\n" +
    "\t\t<div class=\"ml-ppos-management-row\" data-ng-if=\"managementDataModel.isUserCanDoPosSettings || managementDataModel.isUserCanDoPaymentSettings\">\n" +
    "\t\t\t<div class=\"ml-ppos-management-title\">\n" +
    "\t\t\t\t<i class=\"ml-ppos-mini-white-icon ml-ppos-settings\"></i> <span translate=\"lbl.ppos.settings\"/>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-management-content\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanDoPosSettings\" ng-click=\"goToPposSettingsScreen();\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-setting-pos\"></span><span translate=\"btn.ppos.pos\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanDoPaymentSettings\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-payment\"></span> <span translate=\"btn.ppos.payment\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Settings End -->\n" +
    "\t\t<!-- Reports Start -->\n" +
    "\t\t<div class=\"ml-ppos-management-row\" data-ng-if=\"managementDataModel.isUserCanViewSaleSettlement || managementDataModel.isUserCanViewOrderReturn || managementDataModel.isUserCanViewOrderTransaction || managementDataModel.isUserCanViewShipmentStatus || managementDataModel.isUserCanViewEmpActivity\">\n" +
    "\t\t\t<div class=\"ml-ppos-management-title\">\n" +
    "\t\t\t\t<i class=\"ml-ppos-mini-white-icon ml-ppos-report\"></i> <span translate=\"hdr.ppos.reports\"/>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-management-content ml-ppos-management-content-reports\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanViewSaleSettlement\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-sales\" ></span> <span translate=\"btn.ppos.saleSettlement\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanViewOrderReturn\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-return\"></span> <span translate=\"btn.ppos.orderReturn\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanViewOrderTransaction\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-transaction\"></span> <span translate=\"btn.ppos.orderTransaction\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanViewShipmentStatus\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-browse\"></span> <span translate=\"btn.ppos.shipmentStatus\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanViewEmpActivity\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-activity\"></span> <span translate=\"btn.ppos.employeeActivity\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Reports End -->\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/order/OrderDetail.html',
    "<div class=\"ml-ppos-order-detail-instore-pickup-wrapper\">\n" +
    "\t<div class=\"ml-ppos-order-detail-instore-pickup-container\">\n" +
    "\t\t<div class=\"ml-ppos-order-pickup-detail-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-order-pickup-order-number\"><span><span translate=\"lbl.ppos.orderDetail.orderNumber\"/>:</span> {{ orderDetailDataModel.code }}</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t<!-- Loop -->\n" +
    "\t\t\t<div class=\"panel-group ml-ppos-order-pickup-detail-row\" id=\"accordion\">\n" +
    "\t\t\t\t<div class=\"panel panel-default\" data-ng-repeat=\"orderShipment in orderShipmentDataModel\">\n" +
    "\t\t\t\t\t<div class=\"panel-heading\">\n" +
    "\t\t\t\t\t\t<div class=\"panel-title\">\n" +
    "\t\t\t\t\t\t\t<a data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#orderShipmentDetail_{{ orderShipment.id }}\"> <span translate=\"lbl.ppos.shipmentCount\" translate-values=\"{ shipmentCount: $index + 1, totalShipment: orderShipmentDataModel.length }\"/><span class=\"ml-ppos-instore-pickup-customer-name\">{{orderShipment.status}} </span> <i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\"></i></a>\n" +
    "\t\t\t\t\t\t</div> \n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div id=\"orderShipmentDetail_{{ orderShipment.id }}\" class=\"panel-collapse collapse\">\n" +
    "\t\t\t\t\t\t<div class=\"panel-body\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-shipment-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-subhead\"><span translate=\"lbl.ppos.orderDetail.shipmentContains\"/></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-subtotal\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-subhead\"><span translate=\"lbl.ppos.shipmentSubTotal\" translate-values=\"{ shipmentCount: $index + 1 }\"/></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-subhead\"><span translate=\"lbl.ppos.orderDetail.shippingInformation\"/></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div data-ng-repeat=\"item in orderShipment.items\" class=\"ml-ppos-order-pickup-shipment-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-image\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" />\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ item.product.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.style\"/> {{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"option in item.options\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"option.optionType\">{{ option.optionType }}: {{ option.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"msg.ppos.qty\"/> {{ item.qty }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.orderDetail.priceEach\"/> {{ item.regularPrice }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"itemDiscount in item.discounts\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.orderDetail.discount\"/> {{ itemDiscount.amount }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"hdr.ppos.price\"/> {{ item.sellPrice }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div>{{ itemDiscount.message }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-subtotal\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"$index === 0\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content\"><span translate=\"lbl.ppos.merchandiseSubtotalAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value\">{{ orderShipment.merchandiseTotal }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"shipmentDiscount in orderShipment.discounts\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content\"><span translate=\"lbl.ppos.shippingAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value\">{{ orderShipment.discountedShippingTotal }} {{ shipmentDiscount.message }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"orderShipment.discounts.length === 0\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content\"><span translate=\"lbl.ppos.shippingAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value\">{{ orderShipment.discountedShippingTotal }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content\"><span translate=\"lbl.ppos.taxAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value\">{{ orderShipment.taxTotal }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content ml-ppos-order-subtotal-content-border\"><span translate=\"lbl.ppos.totalAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value ml-ppos-order-subtotal-content-border\">{{ orderShipment.total }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"$index === 0\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-customer\">{{ orderShipment.shipmentInfo.person.firstName }} {{ orderShipment.shipmentInfo.person.middleName }} {{ orderShipment.shipmentInfo.person.lastName }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ orderShipment.shipmentInfo.address.street1 }} {{ orderShipment.shipmentInfo.address.street2 }} {{ orderShipment.shipmentInfo.address.street3 }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ orderShipment.shipmentInfo.address.city }}, {{ orderShipment.shipmentInfo.address.state }} {{ orderShipment.shipmentInfo.address.postalCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ orderShipment.shipmentInfo.address.country }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ orderShipment.shipmentInfo.phone }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<br/>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ orderShipment.shippingMethod.name }} - {{ orderShipment.shippingMethod.description }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\t\n" +
    "\t\t\t<!-- Loop End -->\n" +
    "\t\t\t<!-- Loop -->\n" +
    "\t\t\t\t<div class=\"panel panel-default\" data-ng-repeat=\"orderPickup in orderPickupDataModel\" id=\"PickupOptions\">\n" +
    "\t\t\t\t\t<div class=\"panel-heading\">\n" +
    "\t\t\t\t\t\t<div class=\"panel-title\">\n" +
    "\t\t\t\t\t\t\t<a data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#orderPickupDetail_{{ orderPickup.id }}\"><span translate=\"lbl.ppos.pickupCount\" translate-values=\"{ pickupCount: $index + 1, totalPickup: orderPickupDataModel.length }\"/><span>- {{orderPickup.store.name}} ({{orderPickup.store.code}})</span> <span class=\"ml-ppos-instore-pickup-customer-name\">{{orderPickup.status}}</span><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\"></i></a>\n" +
    "\t\t\t\t\t\t</div> \n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div id=\"orderPickupDetail_{{ orderPickup.id }}\" class=\"panel-collapse collapse\">\n" +
    "\t\t\t\t\t\t<div class=\"panel-body\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-shipment-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-subhead\"><span translate=\"lbl.ppos.orderDetail.pickupItems\"/></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-subtotal\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-subhead\"><span translate=\"lbl.ppos.pickupSubTotal\" translate-values=\"{ pickupCount: $index + 1 }\"/></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"orderPickup.items[0].storeID != thisStore.id\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-subhead\"><span translate=\"lbl.ppos.orderDetail.pickupInfo\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div data-ng-repeat=\"item in orderPickup.items\" class=\"ml-ppos-order-pickup-shipment-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-image\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" />\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div>{{ item.product.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.style\"/> {{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"option in item.options\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"option.optionType\">{{ option.optionType }}: {{ option.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"msg.ppos.qty\"/> {{ item.qty }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.orderDetail.priceEach\"/> {{ item.regularPrice }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"itemDiscount in item.discounts\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.orderDetail.discount\"/> {{ itemDiscount.amount }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"hdr.ppos.price\"/> {{ item.sellPrice }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ itemDiscount.message }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-subtotal\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"$index === 0\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content\"><span translate=\"lbl.ppos.merchandiseSubtotalAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value\">{{ orderPickup.merchandiseTotal }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content\"><span translate=\"lbl.ppos.taxAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value\">{{ orderPickup.taxTotal }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content ml-ppos-order-subtotal-content-border\"><span translate=\"lbl.ppos.totalAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value ml-ppos-order-subtotal-content-border\">{{ orderPickup.total }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"item.storeID != thisStore.id\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"$index === 0\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-customer\">{{ orderPickup.shipmentInfo.person.firstName }} {{ orderPickup.shipmentInfo.person.middleName }} {{ orderPickup.shipmentInfo.person.lastName }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div>{{ orderPickup.shipmentInfo.phone }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Loop End -->\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"ml-ppos-order-pickup-nav-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-order-pickup-header-customer\">{{ orderDetailDataModel.customer.primaryContact.person.firstName }} {{ orderDetailDataModel.customer.primaryContact.person.lastName }}</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-row\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-order-pickup-sub-head\"><span translate=\"lbl.ppos.summaryOfCharges\"/></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\" translate=\"lbl.ppos.merchandiseSubtotalAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">{{ orderDetailDataModel.merchTotal }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\" translate=\"lbl.ppos.taxAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">{{ orderDetailDataModel.taxTotal }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\" translate=\"lbl.ppos.shippingAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">{{ orderDetailDataModel.shippingTotal }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"orderDiscount in orderDetailDataModel.discounts\" class=\"ml-ppos-order-pickup-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\">{{ orderDiscount.message }}</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">-{{ orderDiscount.amount }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-total-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\" translate=\"lbl.ppos.totalAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">{{ orderDetailDataModel.total }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-row\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-order-pickup-sub-head\"><span translate=\"lbl.ppos.orderDetail.paymentMethods\"/></div>\n" +
    "\t\t\t\t\t<div data-ng-repeat=\"orderPayment in orderDetailDataModel.payments\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-content\" data-ng-if=\"orderPayment.paymentType === 'CARD PRESENT' || orderPayment.paymentType === 'CREDIT CARD'\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\">{{ orderPayment.cardType }} {{ orderPayment.maskedNumber }}</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">{{ orderPayment.amount }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-content\" data-ng-if=\"orderPayment.paymentType === 'GIFT CERTIFICATE'\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\">{{ orderPayment.paymentType }} <span translate=\"lbl.ppos.forLabel\"></span></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">{{ orderPayment.amount }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-content\" data-ng-if=\"orderPayment.paymentType === 'CASH'\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\">{{ orderPayment.paymentType }}</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">{{ orderPayment.amount }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "<<<<<<< .working\n" +
    "                        <div class=\"ml-ppos-order-pickup-summary-content\" data-ng-if=\"orderPayment.paymentType === 'PAYPAL'\">\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-label\">{{ orderPayment.paymentType }}</div>\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-value\">{{ orderPayment.amount }}</div>\n" +
    "                        </div>\n" +
    "                        <div class=\"ml-ppos-order-pickup-summary-content\" data-ng-if=\"orderPayment.paymentType === 'AMAZON'\">\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-label\">{{ orderPayment.paymentType }}</div>\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-value\">{{ orderPayment.amount }}</div>\n" +
    "                        </div>\n" +
    "=======\n" +
    "                        <div class=\"ml-ppos-order-pickup-summary-content\" data-ng-if=\"orderPayment.paymentType === 'PAYPAL'\">\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-label\">{{ orderPayment.paymentType }} <span translate=\"lbl.ppos.forLabel\"></span></div>\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-value\">{{ orderPayment.amount }}</div>\n" +
    "                        </div>\n" +
    "                        <div class=\"ml-ppos-order-pickup-summary-content\" data-ng-if=\"orderPayment.paymentType === 'AMAZON'\">\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-label\">{{ orderPayment.paymentType }} <span translate=\"lbl.ppos.forLabel\"></span></div>\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-value\">{{ orderPayment.amount }}</div>\n" +
    "                        </div>\n" +
    ">>>>>>> .merge-right.r166239\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div data-ng-if=\"orderDetailDataModel.sourceCodeInfoList\" data-ng-repeat=\"sourceCodeInfo in orderDetailDataModel.sourceCodeInfoList\"  class=\"ml-ppos-order-pickup-summary-content\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\"><span translate=\"msg.ppos.appliedCouponCodeWithAmount\" translate-values=\"{ couponCode : sourceCodeInfo.code}\"></span></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\" data-ng-if=\"!sourceCodeInfo.discountAmountZero\">{{ sourceCodeInfo.discountAmount }}</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-order-detail-instore-pickup-button-container\">\n" +
    "\t\t\t\t\t<in-store-pickup-customer-verification-modal data-order-detail-data-model=\"orderDetailDataModel\"></in-store-pickup-customer-verification-modal>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/product/ProductDetail.html',
    "<div class=\"ml-product-detail-wrapper\">\n" +
    "    <div class=\"ml-product-detail-container\">\n" +
    "        <!-- Main Content -->\n" +
    "        <div class=\"ml-product-detail-main-content\">\n" +
    "            <!-- Image -->\n" +
    "            <div class=\"ml-product-detail-image-wrapper\">\n" +
    "                <div class=\"ml-product-detail-image\"><img src=\"{{model.product.image.detail}}\"></div>\n" +
    "                <!-- Suggested Items -->\n" +
    "                <div class=\"ml-product-detail-suggestions\" data-ng-if=\"model.crossSells.length\">\n" +
    "\t\t\t\t\t<div translate=\"msg.ppos.suggestedProducts\"></div>\n" +
    "                    <div class=\"ml-ppos-grid-view-items\">\n" +
    "                        <div data-ng-repeat=\"crossSellItem in model.crossSells track by $index\" class=\"ml-ppos-grid-view-item\">\n" +
    "                            <div data-ng-if=\"$index < 6\">\n" +
    "                                <a data-ng-href=\"#/productDetail?productId={{ crossSellItem.id }}&fromProductSearch=false\">\n" +
    "                                    <div class=\"ml-ppos-item-image\"><img ng-src=\"{{crossSellItem.image.thumb}}\" width=\"80\" height=\"80\"/></div>\n" +
    "                                    <div class=\"ml-ppos-item-info\">\n" +
    "                                        <div class=\"ml-ppos-item-product-name\" data-ng-if=\"model.showName\">{{ crossSellItem.name }}</div>\n" +
    "                                        <div class=\"ml-ppos-item-price\">\n" +
    "                                            <div>{{ crossSellItem.prices.displayPrice.price }}</div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </a>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\t\t\t\t<!-- Suggested Items End -->\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Details -->\n" +
    "            <div class=\"ml-product-detail-data-wrapper\">\n" +
    "                <div class=\"ml-product-detail-backto-search\" data-ng-if=\"model.fromProductSearch === 'true'\">\n" +
    "    \t\t\t\t<a data-ng-click=\"backToProductSearchResult()\"><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-left\"></i> <span translate>btn.ppos.backToSearchResult</span></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t\t<!-- Name, Description, Code, etc... -->\n" +
    "\t\t\t\t\t<div class=\"ml-product-detail-data-section\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-item-product-name\" data-ng-if=\"model.showName\">{{model.product.name}}</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-item-short-desc\" data-ng-if=\"model.showShortDescription\">{{model.product.description.shortDescription}}</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-item-long-desc\" data-ng-if=\"model.showLongDescription\">{{model.product.description.longDescription}}</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-item-product-code\"><span translate=\"lbl.ppos.style\"></span> {{model.product.code}}</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-product-detail-price-product\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-item-price-was\">{{model.product.prices.displayPrice.priceWas}}</div>\n" +
    "\t\t\t\t\t\t\t<div>{{model.product.prices.displayPrice.price}}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-product-detail-data-section\">\n" +
    "\t\t\t\t\t\t<!-- Options -->\n" +
    "\t\t\t\t\t\t<div class=\"ml-product-detail-options-wrapper\"\n" +
    "\t\t\t\t\t\t\t data-ml-product-options\n" +
    "\t\t\t\t\t\t\t data-options=\"model.product.optionsWithAssociatedSkuIDs\"></div>\n" +
    "\t\t\t\t\t\t<!-- Qty -->\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-quantity-spinner-wrapper\">\n" +
    "\t\t\t\t\t\t\t<label class=\"ml-ppos-quantity-spinner-label\"><div translate=\"msg.ppos.qty\"></div></label>\n" +
    "\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t<ml-numeric-spinner data-mapped-value=\"model.addToBasketItem.qty\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\tdata-max-length=\"2\"></ml-numeric-spinner>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-product-detail-price-wrapper\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-product-detail-price-sku\">{{model.priceSkuMsg}}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-product-detail-stock-wrapper\">\n" +
    "\t\t\t\t\t\t\t<div data-ng-if=\"model.stockAvailable === true\">\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-label\" translate=\"msg.ppos.inStock\"></span>\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-qty\">{{model.stockQty}}</span>\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-available\" translate=\"msg.ppos.available\"></span>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div data-ng-if=\"model.stockUnavailable === true\">\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-unavailable\" translate=\"msg.ppos.unavailable\"></span>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-product-detail-button-wrapper\" data-ng-if=\"model.initialized\">\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-if=\"!getSelectedSku()\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\" translate>msg.ppos.selectValidOption</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-product-detail-button-wrapper\" data-ng-if=\"model.initialized\">\n" +
    "\t\t\t\t\t\t<!-- Nearby Store Button -->\n" +
    "\t\t\t\t\t\t<div class=\"ml-product-detail-store-button\" data-ng-class=\"{'disabled' : model.disableStoresButton}\"><input type=\"button\" name=\"nearByStoresButton\" id=\"nearByStoresButton\" value=\"{{'btn.ppos.stores' | translate}}\" data-ng-click=\"showNearByStoresModal(model.product.id, getSelectedSku(), model.addToBasketItem.qty)\" class=\"ml-ppos-secondary-button\"> <near-by-stores-modal></near-by-stores-modal></div>\n" +
    "\t\t\t\t\t\t<!-- Add to Cart Button -->\n" +
    "\t\t\t\t\t\t<div class=\"ml-product-detail-cart-button\" data-ng-class=\"{'disabled' : model.disableAddToCartButton}\"><input type=\"button\" name=\"addToCartButton\" id=\"addToCartButton\" class=\"ml-ppos-primary-button\" value=\"{{'btn.ppos.addToBasket' | translate}}\" ng-click=\"addItemToBasket()\"></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/product/ProductDetailModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"productDetailModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"closeProductDetailModal()\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\">{{ model.product.name }}</h4>\n" +
    "\t\t\t\t</div>\n" +
    "                <form novalidate data-ng-submit=\"closeProductDetailModal(); addItemToBasketAndReloadBasket();\">\n" +
    "\t\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-product-search-label-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search-row\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search-thumb\"><img data-ng-src=\"{{model.addToBasketItem.thumb}}\" width=\"150\" height=\"150\" /></div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search-info\">\n" +
    "\n" +
    "                                    <!-- Short Description -->\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search-short-desc\" data-ng-if=\"model.showShortDescription\">{{ model.product.description.shortDescription }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t\t<!-- Long Description -->\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"model.showLongDescription\">{{ model.product.description.longDescription }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t\t<!-- Code -->\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search-code\"><span translate=\"lbl.ppos.style\"></span> {{ model.product.code }}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<!-- Product Level Price -->\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-product-detail-price-product\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-item-price-was\">{{model.product.prices.displayPrice.priceWas}}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{model.product.prices.displayPrice.price}}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<!-- Options -->\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-product-detail-options-wrapper\"\n" +
    "\t\t\t\t\t\t\t\t\t\tdata-ml-product-options\n" +
    "\t\t\t\t\t\t\t\t\t\tdata-options=\"model.product.optionsWithAssociatedSkuIDs\"></div>\n" +
    "                    \n" +
    "\t\t\t\t\t\t\t\t\t<!-- Qty -->\n" +
    "\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<label class=\"ml-ppos-quantity-spinner-label\"><div translate=\"msg.ppos.qty\"></div></label>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-quantity-spinner-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<ml-numeric-spinner data-mapped-value=\"model.addToBasketItem.qty\" data-max-length=\"2\"></ml-numeric-spinner>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<!-- Sku Level Price -->\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-product-detail-price-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-product-detail-price-sku\">{{model.priceSkuMsg}}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<!-- Stock Availability -->\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-product-detail-stock-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"model.stockAvailable === true\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-label\" translate=\"msg.ppos.inStock\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-qty\">{{model.stockQty}}</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-available\" translate=\"msg.ppos.available\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"model.stockUnavailable === true\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-unavailable\" translate=\"msg.ppos.unavailable\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"model.initialized\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"!getSelectedSku()\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\" translate>msg.ppos.selectValidOption</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\n" +
    "\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-set ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t<div data-ng-if=\"model.initialized\">\n" +
    "\t\t\t\t\t\t\t<!-- Add to Cart Button -->\n" +
    "\t\t\t\t\t\t\t<div data-ng-class=\"{'disabled' : model.disableAddToCartButton}\">\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-inner\">\n" +
    "\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-text\" translate=\"btn.ppos.addToBasket\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn ml-ppos-mini-grey-icon ml-ppos-plus\"></span>\n" +
    "\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t\t<button type=\"submit\" name=\"addToCartButton\" id=\"addToCartButton\" class=\"ml-ppos-btn-hidden\" translate=\"btn.ppos.addToBasket\"></button>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<!-- Nearby Store Button -->\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-product-detail-store-button\" data-ng-class=\"{'disabled' : model.disableStoresButton}\"><input type=\"button\" name=\"nearByStoresButton\" id=\"nearByStoresButton\" value=\"{{'btn.ppos.stores' | translate}}\" data-ng-click=\"showNearByStoresModal(model.product.id, getSelectedSku(), model.addToBasketItem.qty)\" class=\"ml-ppos-secondary-button\"></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t<button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelProductDetailModal()\" data-dismiss=\"modal\" translate=\"btn.ppos.cancel\"></button>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</form>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/product/ProductOptions.html',
    "<div class=\"ml-product-option-container\">\n" +
    "    <div class=\"ml-product-option-type-wrapper\" ng-repeat=\"type in options track by $index\">\n" +
    "        <div class=\"ml-product-option-type\">{{type.optionType}}</div>\n" +
    "        <div class=\"ml-product-option-wrapper\">\n" +
    "            <div class=\"ml-product-option\"\n" +
    "                 ng-class=\"{'selected': type.selectedOption == option,'disabled': !isOptionSelectable(type, option)}\"\n" +
    "                 ng-repeat=\"option in type.options track by $index\">\n" +
    "                <div class=\"ml-product-option-text\" ng-click=\"selectOption(type, option)\" ng-hide=\"option.image\">\n" +
    "                    {{option.name}}\n" +
    "                </div>\n" +
    "                <div class=\"ml-product-option-image\" ng-click=\"selectOption(type, option)\" ng-show=\"option.image\"><img\n" +
    "                        ng-src=\"{{option.image}}\"/></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/provisioning/Provisioning.html',
    "<div class=\"ml-ppos-login-wrapper ml-ppos-login-main-column\">\n" +
    "\t<div class=\"ml-ppos-login-main-container\">\t\n" +
    "\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"showProvisioningFailureMessage\">\n" +
    "\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t<div>{{ provisioningFailureMessage | translate }}</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"ml-ppos-login-head\" translate=\"msg.ppos.provisioning.header\"></div>\n" +
    "\n" +
    "\t\t<div class=\"ml-ppos-login-container\">\n" +
    "\t\t\t<form novalidate data-ng-submit=\"provisionApplication(provisioningDetails)\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label\" translate=\"lbl.ppos.provisioning.serverUrl\"></div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label-content\">\n" +
    "\t\t\t\t\t<input type=\"text\" name=\"urlBase\" id=\"urlBase\" class=\"form-control\" data-ng-model=\"provisioningDetails.urlBase\" placeholder=\"{{ 'msg.ppos.provisioning.enterServerUrl' | translate }}\" autocorrect=\"off\" autocapitalize=\"off\" />\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label\" translate=\"lbl.ppos.provisioning.storeCode\"></div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label-content\">\n" +
    "\t\t\t\t\t<input type=\"text\" name=\"storeCode\" id=\"storeCode\" class=\"form-control\" data-ng-model=\"provisioningDetails.storeCode\" placeholder=\"{{ 'msg.ppos.provisioning.enterStoreCode' | translate }}\" autocorrect=\"off\" autocapitalize=\"off\" />\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-button-container\">\n" +
    "\t\t\t\t\t<button type=\"submit\" name=\"provisioningSubmitButton\" id=\"provisioningSubmitButton\" class=\"ml-ppos-login-button\" translate>btn.ppos.provisioning.submit</button>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</form>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/search/CustomerSearchModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-customer-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"customerSearchModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"close()\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\" translate>hdr.ppos.newOrder</h4>\n" +
    "\t\t\t\t</div>\n" +
    "\t  \n" +
    "\t\t\t\t<div data-ng-show=\"customerSearchDataModel.customerSearchResult == null\">\n" +
    "\t\t\t\t\t<form name=\"customerSearchForm\" novalidate data-ng-submit=\"searchCustomer()\">\n" +
    "\t\t\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t\t\t<div data-ng-show=\"showPhoneNumberRequiredMessage\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t\t<div translate>msg.ppos.phoneNumberRequired</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div data-ng-show=\"showInValidPhoneNumberMessage\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t\t<div translate>msg.ppos.invalidPhoneNumberEntered</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-search-head\" translate>lbl.ppos.customerPhoneNumber</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-search-label-content\">\n" +
    "\t\t\t\t\t\t\t\t<input type=\"tel\" name=\"customerPhoneNumber\" id=\"customerPhoneNumber\" class=\"form-control\" placeholder=\"{{ 'msg.ppos.phoneNumberSearchPlaceholder' | translate }}\" data-ng-model=\"customerSearchDataModel.customerPhoneNumber\" show-focus=\"customerSearchDataModel.customerSearchResult == null\"/>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-customer-search\">\n" +
    "\t\t\t\t\t\t\t<div><button type=\"submit\" name=\"customerSearchButton\" id=\"customerSearchButton\" class=\"ml-ppos-primary-button\" translate>btn.ppos.searchCustomerButon</button></div>\n" +
    "\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancel()\" data-dismiss=\"modal\" translate=\"btn.ppos.cancel\"></button></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-button-customer-skip-button\"><a href=\"javascript:;\" data-ng-click=\"skipCustomerSearchAndStartNewOrder(null)\" class=\"ml-ppos-secondary-button-understated\" translate>btn.ppos.skip</a></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</form>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div data-ng-show=\"customerSearchDataModel.customerSearchResult != null\">\n" +
    "\t\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-customer-search-result-message\" translate=\"msg.ppos.customerSearchResult\" translate-values=\"{ customerCount : customerSearchDataModel.customerSearchResult.data.length, customerPhoneNumber : customerSearchDataModel.customerPhoneNumber }\"></div>\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"customer in customerSearchDataModel.customerSearchResult.data\" class=\"ml-ppos-customer-search-result-row\">\n" +
    "\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"startNewOrder(customer.id)\">{{ customer.primaryContact.person.firstName }} {{ customer.primaryContact.person.lastName }} <span class=\"ml-ppos-customer-search-zip-code\">{{ customer.primaryContact.address.postalCode }}</span> <span class=\"ml-ppos-mini-white-icon ml-ppos-arrow-right\"></span></a>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-customer-search-result\">\n" +
    "\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button-understated\" data-ng-click=\"skipCustomerSearchAndStartNewOrder(null)\" translate>btn.ppos.skip</button></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-button-customer-search-place-order\">\n" +
    "\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-inner\">\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-text\" translate>btn.ppos.searchAgain</span>\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn ml-ppos-mini-white-icon ml-ppos-arrow-left\"></span>\n" +
    "\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t<button type=\"button\" class=\"ml-ppos-btn-hidden\" data-ng-click=\"searchAgain()\" translate>btn.ppos.searchAgai</button>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/search/OrderSearchModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"orderSearchModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\"  data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\" translate=\"hdr.ppos.searchOrder\"></h4>\n" +
    "\t\t\t\t</div>\n" +
    "\t  \n" +
    "\t\t\t\t<form novalidate data-ng-submit=\"searchOrderByCode()\">\n" +
    "\t\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t\t<div data-ng-show=\"orderSearchDataModel.showOrderSearchError\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t{{ orderSearchDataModel.orderSearchErrorMessage }}\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-product-search-head\" translate=\"lbl.ppos.enterOrderNumber\"></div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-product-search-label-content\">\n" +
    "\t\t\t\t\t\t\t<input type=\"text\" name=\"orderCode\" id=\"orderCode\" class=\"form-control\" data-ng-model=\"orderSearchDataModel.orderCode\" />\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\n" +
    "\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t<div><button type=\"submit\" name=\"orderSearchButton\" id=\"orderSearchButton\" class=\"ml-ppos-primary-button\" translate=\"btn.ppos.searchOrder\"></button></div>\n" +
    "\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-dismiss=\"modal\" translate=\"btn.ppos.cancel\"></button></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</form>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/search/ProductSearchModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"productSearchModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\" translate=\"hdr.ppos.addManually\"></h4>\n" +
    "\t\t\t\t</div>\n" +
    "\t  \n" +
    "\t\t\t\t<form novalidate data-ng-submit=\"searchProduct()\">\n" +
    "\t\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t\t<div data-ng-show=\"productSearchDataModel.showProductSearchError\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t{{ productSearchDataModel.productSearchErrorMessage }}\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-product-search-head\" translate=\"lbl.ppos.enterProductNameOrSkuNumber\"></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-product-search-label-content\">\n" +
    "\t\t\t\t\t\t\t<input type=\"text\" name=\"productSearchKeyword\" id=\"productSearchKeyword\" class=\"form-control\" placeholder=\"{{ 'msg.ppos.keywordOrItem' | translate }}\" data-ng-model=\"productSearchDataModel.productSearchKeyword\" />\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\n" +
    "\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t<div><button type=\"submit\" name=\"productSearchButton\" id=\"productSearchButton\" class=\"ml-ppos-primary-button\" translate=\"btn.ppos.searchProduct\"></button></div>\n" +
    "\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-dismiss=\"modal\" translate=\"btn.ppos.cancel\"></button></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</form>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/search/ProductSearchResult.html',
    "<div data-ng-controller=\"productSearchResultController\" class=\"ml-ppos-product-search-result-wrapper\">\n" +
    "\t<div class=\"ml-ppos-search-container\">\n" +
    "\t\t<div class=\"ml-ppos-facet-nav-container\">\n" +
    "\t\t<div data-ng-if=\"productSearchResultDataModel.showSorting\">\n" +
    "\t\t\t<div class=\"ml-ppos-facet-refine-head\" translate=\"hdr.ppos.refineYourSearch\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-facet-sortbg\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-default-header-wrapper\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-default-header-message\" translate=\"lbl.ppos.sortBy\"></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-default-header-icon\"><a href=\"\" data-toggle=\"collapse\" data-target=\"#Sorting\"><span class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\"></span></a></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-facet-selected\">\n" +
    "\t\t\t\t\t\t<span data-ng-repeat=\"sortOption in productSearchResultDataModel.sortOptions\" data-ng-if=\"sortOption.sortOptionConfig === productSearchResultDataModel.currentSortOptionConfig\" \n" +
    "\t\t\t\t\t\ttranslate=\"sel.ppos.{{ productSearchResultDataModel.currentSortOptionConfig }}\">\n" +
    "\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div id=\"Sorting\" class=\"collapse\">\n" +
    "\t\t\t\t\t\t<a data-toggle=\"collapse\" data-target=\"#Sorting\" href=\"\" data-ng-repeat=\"sortOption in productSearchResultDataModel.sortOptions\" data-ng-click=\"searchProduct(productSearchResultDataModel.productSearchKeyword, 0, 1, sortOption.sortOptionOrder, sortOption.sortOptionParam)\" translate=\"sel.ppos.{{ sortOption.sortOptionConfig }}\"></a>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t\n" +
    "\t\t<div class=\"ml-ppos-search-detail-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-search-head-row\">\n" +
    "\t\t\t\t<!-- Title and search field. -->\n" +
    "\t\t\t\t<div class=\"ml-ppos-search-title-wrapper\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-search-title\" translate=\"lbl.ppos.searchTerm\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-search-keyword\">\n" +
    "\t\t\t\t\t\t<form novalidate data-ng-submit=\"searchProduct(productSearchKeyword, 0, 1)\">\n" +
    "\t\t\t\t\t\t\t<input type=\"text\" name=\"productSearchKeyword\" id=\"productSearchKeyword\" class=\"form-control\" placeholder=\"{{ 'msg.ppos.keywordOrItem' | translate }}\" data-ng-model=\"productSearchKeyword\" />\n" +
    "\t\t\t\t\t\t</form>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<!-- Pagination -->\n" +
    "\t\t\t\t<div class=\"ml-ppos-search-pagination\" data-ng-show=\"productSearchResultDataModel.pagingModel.showPagination\">\n" +
    "\t\t\t\t\t<ul class=\"ml-ppos-pagination\">\n" +
    "\t\t\t\t\t\t<!-- Previous Page Group Link Disabled -->\n" +
    "\t\t\t\t\t\t<li data-ng-show=\"!productSearchResultDataModel.pagingModel.previousPageGroup.hasPreviousPageGroup\" class=\"ml-ppos-paging-default ml-ppos-paging-disabled\">\n" +
    "\t\t\t\t\t\t\t<span class=\"ml-ppos-paging-previous ml-icon-lib ml-icon-previous\"></span>\n" +
    "\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t<!-- Previous Page Group Link Clickable -->\n" +
    "\t\t\t\t\t\t<li data-ng-show=\"productSearchResultDataModel.pagingModel.previousPageGroup.hasPreviousPageGroup\" class=\"ml-ppos-paging-default\">\n" +
    "\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"searchProduct(productSearchResultDataModel.productSearchKeyword, productSearchResultDataModel.pagingModel.previousPageGroup.previousPageGroupPageNumberOffSet, productSearchResultDataModel.pagingModel.previousPageGroup.previousPageGroupPageNumber, productSearchResultDataModel.currentSortOrder, productSearchResultDataModel.currentSortParam)\" class=\"ml-ppos-paging-previous ml-icon-lib ml-icon-previous\"> </a>\n" +
    "\t\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t\t<!-- Pages for current Page Group -->\n" +
    "\t\t\t\t\t\t<li data-ng-repeat=\"page in productSearchResultDataModel.pagingModel.pages\" class=\"ml-ppos-paging-default\">\n" +
    "\t\t\t\t\t\t\t<!-- Current Page should not be clickable. -->\n" +
    "\t\t\t\t\t\t\t<a href=\"\" data-ng-if=\"productSearchResultDataModel.pagingModel.currentPage == page.pageNumber\" class=\"active\">{{ page.pageNumber }}</a>\n" +
    "\t\t\t\t\t\t\t<!-- All other pages should be clickable. -->\n" +
    "\t\t\t\t\t\t\t<a href=\"\" data-ng-if=\"productSearchResultDataModel.pagingModel.currentPage != page.pageNumber\" data-ng-click=\"searchProduct(productSearchResultDataModel.productSearchKeyword, page.offSet, page.pageNumber, productSearchResultDataModel.currentSortOrder, productSearchResultDataModel.currentSortParam)\">{{ page.pageNumber }}</a>\n" +
    "\t\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t\t<!-- Next Page Group Link Disabled -->\n" +
    "\t\t\t\t\t\t<li data-ng-show=\"!productSearchResultDataModel.pagingModel.nextPageGroup.hasNextPageGroup\" class=\"ml-ppos-paging-default ml-ppos-paging-disabled\">\n" +
    "\t\t\t\t\t\t\t<span class=\"ml-ppos-paging-next ml-icon-lib ml-icon-next\"></span>\n" +
    "\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t<!-- Next Page Group Link Clickable -->\n" +
    "\t\t\t\t\t\t<li data-ng-show=\"productSearchResultDataModel.pagingModel.nextPageGroup.hasNextPageGroup\" class=\"ml-ppos-paging-default\">\n" +
    "\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"searchProduct(productSearchResultDataModel.productSearchKeyword, productSearchResultDataModel.pagingModel.nextPageGroup.nextPageGroupPageNumberOffSet, productSearchResultDataModel.pagingModel.nextPageGroup.nextPageGroupPageNumber, productSearchResultDataModel.currentSortOrder, productSearchResultDataModel.currentSortParam)\" class=\"ml-ppos-paging-next ml-icon-lib ml-icon-next\"> </a>\n" +
    "\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t</ul>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t<!-- Error Messages. -->\n" +
    "\t\t\t<div>\n" +
    "\t\t\t\t<div data-ng-show=\"productSearchResultDataModel.showKeywordRequiredErrorMessage\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t<div translate=\"msg.ppos.shortSearchTerm\" translate-values=\"{ minLength : 3 }\"></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div data-ng-show=\"productSearchResultDataModel.showProductNotFoundErrorMessage\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t<div translate=\"msg.ppos.searchNoResults\" translate-values=\"{ searchTerm : productSearchResultDataModel.searchTerm }\"></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<!-- Success Messages. -->\n" +
    "\t\t\t<div data-ng-if=\"!productSearchResultDataModel.showKeywordRequiredErrorMessage && !productSearchResultDataModel.showProductNotFoundErrorMessage\">\n" +
    "\t\t\t\t<div data-ng-if=\"!productSearchResultDataModel.searchResult.alternateTermsQueryEncoded\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-search-result-message\" translate=\"msg.ppos.searchResults\" translate-values=\"{ productCount: productSearchResultDataModel.searchResult.searchResultSize, searchKeyword: productSearchResultDataModel.productSearchKeyword }\">\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div data-ng-if=\"productSearchResultDataModel.searchResult.alternateTermsQueryEncoded\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t<div translate=\"msg.ppos.noMatchesFound\" translate-values=\"{ searchKeyword: productSearchResultDataModel.productSearchKeyword }\">\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div data-ng-if=\"productSearchResultDataModel.searchResult.alternateTermsQueryEncoded.length == 1\">\n" +
    "\t\t\t\t\t\t\t\t<span translate=\"msg.ppos.didYouMean\"></span>\n" +
    "\t\t\t\t\t\t\t\t<span data-ng-repeat=\"alternateTerm in productSearchResultDataModel.searchResult.alternateTermsQueryEncoded\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"searchProduct(alternateTerm, 0, 1)\" translate=\"msg.ppos.alternateTerm\" translate-values=\"{ alternateTerm: alternateTerm }\"></a>?\n" +
    "\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div data-ng-if=\"productSearchResultDataModel.searchResult.alternateTermsQueryEncoded.length > 1\">\n" +
    "\t\t\t\t\t\t\t\t<span translate=\"msg.ppos.didYouMean\"></span>\n" +
    "\t\t\t\t\t\t\t\t<span data-ng-repeat=\"alternateTerm in productSearchResultDataModel.searchResult.alternateTermsQuery\">\n" +
    "\t\t\t\t\t\t\t\t\t<span data-ng-if=\"$first\"><a href=\"\" data-ng-click=\"searchProduct(alternateTerm, 0, 1)\" translate=\"msg.ppos.alternateTerm\" translate-values=\"{ alternateTerm: alternateTerm }\"></a></span>\n" +
    "\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t\t<span data-ng-if=\"$middle\">, <a href=\"\" data-ng-click=\"searchProduct(alternateTerm, 0, 1)\" translate=\"msg.ppos.alternateTerm\" translate-values=\"{ alternateTerm: alternateTerm }\"></a></span>\n" +
    "\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t\t<span data-ng-if=\"$last\">or <a href=\"\" data-ng-click=\"searchProduct(alternateTerm, 0, 1)\" translate=\"msg.ppos.alternateTerm\" translate-values=\"{ alternateTerm: alternateTerm }\"></a>?</span>\n" +
    "\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div translate=\"msg.ppos.alternateMatchCount\" translate-values=\"{ productCount: productSearchResultDataModel.searchResult.searchResultSize }\">\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<!-- Product Thumbnails. -->\n" +
    "\t\t\t<div class=\"ml-ppos-grid-view-items\">\t\n" +
    "\t\t\t\t<div data-ng-repeat=\"product in productSearchResultDataModel.searchResult.productInfo\" class=\"ml-ppos-grid-view-item\">\n" +
    "\t\t\t\t\t<a data-ng-href=\"#/productDetail?productId={{ product.id }}&fromProductSearch=true\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-item-image\"><img ng-src=\"{{ product.imageResolved }}\" /></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-item-info\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-item-product-name\" data-ng-if=\"productSearchConfigModel.showName\">{{ product.name }}</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-item-short-desc\" data-ng-if=\"productSearchConfigModel.showShortDescription\">{{ product.description.shortDescription }}</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-item-product-code\" data-ng-if=\"productSearchConfigModel.showCode\">{{ product.code }}</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-item-price\" data-ng-if=\"productSearchConfigModel.showPrices\">\n" +
    "\t\t\t\t\t\t\t\t<div>{{ product.priceInfo.priceMsg }}</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-item-price-was\">{{ product.priceInfo.priceWasMsg }}</div>\n" +
    "\t\t\t\t\t\t\t\t<div>{{ product.priceInfo.priceNowMsg }}</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/settings/POSSettings.html',
    "<div class=\"ml-ppos-account-wrapper\">\r" +
    "\n" +
    "\t<div class=\"ml-ppos-management-container\">\r" +
    "\n" +
    "\t\t<!-- Management Title Start -->\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-management-row\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-management-title\">\r" +
    "\n" +
    "\t\t\t\t<a href=\"\" ng-click=\"goToManagementScreen()\"><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-left\"></i><span translate=\"lbl.ppos.management\"/></a>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<!-- Management Title End -->\r" +
    "\n" +
    "\t\t<!-- Settings Start -->\r" +
    "\n" +
    "\t\t<form novalidate>\r" +
    "\n" +
    "\t\t\t<!-- Error Block Start -->\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"posSettingsModel.showMessage\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-icon-error\" id=\"divMsgIconContainer\"></div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-error-message\">\r" +
    "\n" +
    "\t\t\t\t\t<div>{{ posSettingsModel.message | translate }}</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t<!-- Error Block End -->\r" +
    "\n" +
    "\t\t\t<!-- PEBL-16140 : Commented for phase 1, uncomment in Phase 2 - STARTS -->\r" +
    "\n" +
    "\t\t\t<!--\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-settings-row\">\r" +
    "\n" +
    "\t\t\t\t<div><span translate=\"hdr.ppos.posScreenSettings\"/></div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-settings-row ml-ppos-settings-row-indent\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-settings-label\">\r" +
    "\n" +
    "\t\t\t\t\t<div><span translate=\"hdr.ppos.autoLockScreen\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t<div><span translate=\"hdr.ppos.autoLockScreenInactivity\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-settings-value ml-ppos-toggle-container\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\">\r" +
    "\n" +
    "\t\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : timeout == posSettingsModel.userSetTimeout}\" data-ng-repeat=\"timeout in posSettingsModel.timeoutArray\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<input type=\"radio\" name=\"selectedTimeout\" id=\"selectedTimeout\" value=\"{{ timeout }}\" data-ng-model=\"posSettingsModel.userSetTimeout\" data-ng-change=\"saveChanges(posSettingsModel);\"/> <span translate=\"lbl.ppos.timeoutMinutes\" translate-values=\"{ timeout: timeout }\"></span>\r" +
    "\n" +
    "\t\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t-->\r" +
    "\n" +
    "\t\t\t<!-- PEBL-16140 : Commented for phase 1, uncomment in Phase 2 - ENDS -->\r" +
    "\n" +
    "\t\t\t<!-- Stores -->\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-settings-row\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-settings-store-location\">\r" +
    "\n" +
    "\t\t\t\t\t<div><span translate=\"lbl.ppos.storeLocation\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t<div>{{ posSettingsModel.storeLocation | translate }}</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<!-- Stores -->\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-settings-row ml-ppos-settings-row-indent\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-settings-label\">\r" +
    "\n" +
    "\t\t\t\t\t<div><span translate=\"lbl.ppos.nearbyStores\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t<div><span translate=\"lbl.ppos.nearbyStoresDistance\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-settings-value ml-ppos-toggle-container\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\">\r" +
    "\n" +
    "\t\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : radius == posSettingsModel.userSetRadius}\" data-ng-repeat=\"radius in posSettingsModel.radiusArray\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<input type=\"radio\" name=\"selectedRadius\" id=\"selectedRadius\" value=\"{{ radius }}\" data-ng-model=\"posSettingsModel.userSetRadius\" data-ng-change=\"saveChanges(posSettingsModel);\"/> <span translate=\"lbl.ppos.storeRadius\" translate-values=\"{ storeRadius: radius }\"></span>\r" +
    "\n" +
    "\t\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t</form>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );

}]);
