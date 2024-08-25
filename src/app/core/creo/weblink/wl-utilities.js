
  function pfcIsMozilla() {
    if (pfcIsWindows())
      return false;
    if (pfcIsChrome())
      return false;
  
    return true;
  }
  
  function pfcIsChrome() {
    var ua = navigator.userAgent.toString().toLowerCase();
    var val = ua.indexOf("chrome/"); // Chrome
    if (val > -1) {
      return true;
    }
    else
      return false;
  }
  
  function pfcIsWindows() {
    if (navigator.userAgent.toString().toLowerCase().indexOf("trident") != -1)
      return true;
    else
      return false;
  }


  export function isProEEmbeddedBrowser() {
    if (top.external && top.external.ptc)
      return true;
    else
      return false;
  }
  
  export function pfcCreate(className) {
    if (pfcIsWindows())
      return new ActiveXObject("pfc." + className);
    else if (pfcIsChrome())
      return pfcCefCreate(className);
    else if (pfcIsMozilla()) {
      netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
      ret = Components.classes["@ptc.com/pfc/" + className + ";1"].createInstance();
      return ret;
    }
  }