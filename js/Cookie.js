/*
 * Copyright 2006 OST-SYSTEMS. All rights reserved.
 */

function Cookie(key) {
  this.key = key;
  
  this.store = function(value) {
    var now = new Date();
    now.setYear(now.getFullYear() + 1);
    value = escape(value);
    document.cookie = key + "=" + value.length + " " + value 
                      + "; expires=" + now.toGMTString();          
  }
  
  this.get = function() {
    var value = document.cookie;
    var keyStart = value.indexOf(key + "=");
    var lengthStart = value.indexOf("=", keyStart);
    var start = value.indexOf(" ", lengthStart);    
    if (keyStart>=0 && lengthStart >= 0 && start >= 0) {
      var length = parseInt(value.substring(lengthStart + 1, start));
      return unescape(value.substring(start + 1, start + 1 + length));
    }
    return null;
  }
  
  this.remove = function() {
    var now = new Date();
    now.setYear(now.getFullYear() - 1);
    document.cookie = key + "= " + "; expires=" + now.toGMTString();              
  }
}  