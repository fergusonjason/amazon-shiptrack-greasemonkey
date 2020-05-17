// ==UserScript==
// @name         Amazon Ship Track Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a link on the tracking number that redirects to the carrier's tracking website
// @author       shengbi@
// @author			 Jason Ferguson
// @match        https://www.amazon.com/gp/your-account/ship-track/*
// @match        https://*.amazon.com/progress-tracker/package/*
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';

  	const ele = $("#carrierRelatedInfo-container");

  	// use elements to find the particular lines. Slightly more brute force than the original
    const shippingEle = ele.find("h1");
    const shippingLine = shippingEle.text();
    const trackingEle = ele.find("h4");
  	const trackingLine = trackingEle.text();
  
  	// Use regular expressions to finder the shipper and tracking ID. MUCH more brute force than the original
  	let shippingRegexp = /Shipped with ([A-Za-z0-9]+)/;
  	let shipper = shippingLine.match(shippingRegexp)[1];
  

    const trackingRegexp = /Tracking ID: ([0-9]+)/;
    let tracking = trackingLine.match(trackingRegexp)[1];

    const url = getTrackingWebsiteURL(shipper, tracking);
    if (url) {
      	// TODO: Only wrap the tracking number itself
        trackingEle.wrap("<a target='_blank' href='" + url + "'></a>");
    }

    function getCarrierName(text) {
        let index1 = text.indexOf(":") + 1;
        let index2 = text.indexOf(",");
        let carrier = text.substring(index1, index2).trim();
        switch(carrier) {
            case "UPS Mail Innovations":
                carrier = "USPS";
        }


        return carrier;
    }
    
    function getTrackingNumber(text) {
        let index1 = text.lastIndexOf(":") + 1;
        let tracking = text.substr(index1).trim();

        return tracking;
    }
    
    function getTrackingWebsiteURL(carrierName, trackingNumber) {
        switch(carrierName) {
            case "USPS":
                return "https://tools.usps.com/go/TrackConfirmAction?tLabels=" + trackingNumber;
            case "ONTRAC":
                return "https://www.ontrac.com/trackingres.asp?tracking_number=" + trackingNumber;
            case "UPS":
                return "https://wwwapps.ups.com/WebTracking/processRequest?tracknum=" + trackingNumber;
            case "FedEx":
                return "https://www.fedex.com/apps/fedextrack/?tracknumbers=" + trackingNumber;
            default:
                return "";
        }
    }
})();
