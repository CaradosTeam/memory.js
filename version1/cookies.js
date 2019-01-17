/* Cookies Extensions */
var Cookie = function(name, value,expireData="", path="", domain="") {
    this.name = name;
    this.value = value;
    this.expire = expireData;
    this.path = path;
    this.domain = domain;
    
    this.set = function(newValue,path="", expires="never", domain="") {
        
        if(domain==="") domain = location.hostname;
        
        if(expires==="never") expires = "Fri, 31 Dec 9999 23:59:59 GMT";

        let dayName = this.getDayNameFromString(expires)[0] || "Mon";
        let day = expires.split(" ")[1];
        let month = this.monthFromNamespace(expires) || "01";
        let year = expires.split(" ")[3];
        
        let hour = expires.split(" ")[4].split(":")[0];
        let min = expires.split(" ")[4].split(":")[1];
        let sec = expires.split(" ")[4].split(":")[2];
        
        let date = dayName+year+month+day+hour+min+sec;
        
        var newCookieHeader = 'val:'+value+','+((expires) ? 'e:'+date+',' : "")+((domain) ? 'd:'+domain+',' : "")+('p:'+((path) ? path : '/'));
        
        
        document.cookie = (this.name+"="+newCookieHeader+";")+((domain!="") ? "domain="+domain+";" : "")+("expires="+expires+";")+((path!="/" || path!="") ? "path="+path+";" : "/");
        //this.value = newValue;
    }
    this.setValue = function(newValue) {
        
        var newCookieHeader = 'val:'+newValue+','+((this.expire) ? 'e:'+this.expire+',' : "")+((this.domain) ? 'd:'+this.domain+',' : "")+('p:'+((this.path) ? this.path : '/'));
        
        console.log(document.cookie = (this.name+"="+newCookieHeader+";")+((this.domain!="") ? "domain="+this.domain+";" : "")+("expires="+this.expire+";")+((this.path!="/" || this.path!="") ? "path="+this.path+";" : "/"));
    }
    this.delete = function() {
        document.cookie = this.name+"=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
    this.sendToLocalStorage = function() {
        window.localStorage.setItem(this.name, this.value);
    }
    this.sendToSessionStorage = function() {
        window.sessionStorage.setItem(this.name, this.value);
    }
}
   
var Cookies = {
    set: function(name, value,path="", expires="never", domain="")  { //expires per days
       //Prepare Informations
      // var cookieHeader = '{value:"'+value+'", '+((expires) ? 'expires:"'+expires+'",' : "")+('domain:"'+domain+'",')+'"}'; //JSOn
        if(domain==="") domain = location.hostname;
        
        if(expires==="never") expires = "Fri, 31 Dec 9999 23:59:59 GMT";
        //Thu, 19 Jan 2038 04:14:07 UTC
        let dayName = this.getDayNameFromString(expires)[0] || "Mon";
        let day = expires.split(" ")[1];
        let month = this.monthFromNamespace(expires) || "01";
        let year = expires.split(" ")[3];
        
        let hour = expires.split(" ")[4].split(":")[0];
        let min = expires.split(" ")[4].split(":")[1];
        let sec = expires.split(" ")[4].split(":")[2];
        
        let date = dayName+year+month+day+hour+min+sec;
        
        //"2038-01-19 04:14:07"
        var cookieHeader = 'val:'+value+','+((expires) ? 'e:'+date+',' : "")+((domain) ? 'd:'+domain+',' : "")+('p:'+((path) ? path : '/'));
        
        console.log(cookieHeader);
        
       document.cookie = name+"="+cookieHeader+";"+((expires) ? 'expires='+expires+';' : "")+((domain) ? 'domain='+domain+';' : "")+('path='+((path) ? path : '/')); 
       //let newcookie = new Cookie(name, value, expires, path, domain);
    },
    list: function() {
      if(document.cookie!="") {
    let cookies = document.cookie.split(";"); 
    
    let enumerate = {};
    let cookie = "";
    
    for(var i = 0;i<cookies.length;i++) {
        cookie = cookies[i].trim();
        cookie = cookie.split("="); 
        //Cookies.parseHeader(cookie[1]);
        
        if(cookie[1].indexOf("val")!=-1) {
            let cookieHeader = {};
            let cookieSplt = cookie[1].split(",");
            let cookieOnce = [];
            
            for(let i = 0;i<cookieSplt.length;i++) {
                cookieOnce = cookieSplt[i].split(":");
                cookieHeader[cookieOnce[0]] = cookieOnce[1];
            }
            
            enumerate[i] = new Cookie(cookie[0], cookieHeader['val'], cookieHeader['e'], cookieHeader['p'], cookieHeader['d']);
            
        } else enumerate[i] = new Cookie(cookie[0], cookie[1]);
        
    }
    
    return enumerate;
      } else return null;
    },
    deleteAll: function() {
        
        let cookieList = this.list();
        for(var cookie in cookieList) {
            if(cookieList[cookie].name) {
                document.cookie = cookieList[cookie].name+"=;"+((cookieList[cookie].path!=="") ? "path="+cookieList[cookie].path+";" : "")+"expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        }
        
        
    },
    get: function(cookieName) {
        
        let cookieList = this.list();
        for(var cookie in cookieList) {
            if(cookieList[cookie].name==cookieName) {
                return cookieList[cookie];
            }
        }
        return undefined;
        
    },
    isEnabled: function() {
        return navigator.cookieEnabled;
    }(),
    setCookiesStatus: function(logical, page) {
        
        var ajaxRequest = new XMLHttpRequest();
        ajaxRequest.onreadystatechange = function() {
            if(this.readyState==4&&this.status==200) {
                //this.responseText;
            }
        }
        ajaxRequest.open("POST", "script/responses/cookies.php", true);
        ajaxRequest.send("enabled="+logical);
        
    },
    monthFromNamespace: function(expire) {
            
            let monthsNames = {
                'Jan':"01",
                'Feb':"02",
                'Mar':"03",
                'Apr':"04",
                'May':"05",
                'Jun':"06",
                'Jul':"07",
                'Aug':"08",
                'Sep':"09",
                'Oct':"10",
                'Nov':"11",
                'Dec':"12"
            }
            
            //let month = false;
            
            for(var monthName in monthsNames) {
               if(expire.search(monthName)+1) {
                   return monthsNames[monthName];
               }
            }
        
            return false;
         
        },
        getDayNameFromString: function(string) {
            
            let daysName = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
            
            string = string.toLowerCase();
            
            for(let i = 0;i<daysName.length;i++) {
               if(string.search(daysName[i])+1) {
                   return [daysName[i], string.search(daysName[i])];
               }
            }
            return false;
            
        }
    
}

/* Delete if load.js not in use if(typeof Modules!="undefined") Modules.list.push("cookies.js"); */
