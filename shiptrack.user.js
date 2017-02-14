// ==UserScript==
// @name         Amazon Ship Track Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a link on the tracking number that redirects to the carrier's tracking website
// @author       shengbi@
// @match        https://www.amazon.com/gp/your-account/ship-track/*
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';

    var ele = $("div .ship-track-grid-subtext");
    if (!ele) return;
    var text = ele[0].innerHTML.trim();

    // Get carrier's name
    var carrierName = getCarrierName(text);
    console.log("carrier name: " + carrierName);
    // Get tracking number
    var trackingNumber = getTrackingNumber(text);
    console.log("tracking number: " + trackingNumber);
    
    // Get tracking website's URL
    var url = getTrackingWebsiteURL(carrierName, trackingNumber);
    if (url) {
        ele.wrap("<a target='_blank' href='" + url + "'></a>");
    }

    function getCarrierName(text) {
        var index1 = text.indexOf(":") + 1;
        var index2 = text.indexOf(",");
        var carrier = text.substring(index1, index2).trim();
        switch(carrier) {
            case "UPS Mail Innovations":
                return "USPS";
            default:
                return carrier;
        }
    }
    
    function getTrackingNumber(text) {
        var index1 = text.lastIndexOf(":") + 1;
        var tracking = text.substr(index1).trim();
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
