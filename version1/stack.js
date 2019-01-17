/* Basic Stack HTMLElementData */
var Stack = (function() {
    var lastId = 0, memory = {};
    
   /* Debug   setInterval(function() {console.log(memory)}, 9400); */
    
    return {
        set: function(element, cname="", val="") {
            if(typeof element.dataPointers[cname]=="undefined") {
                let id = lastId++;
                element.dataPointers[cname] = id;
                memory[id] = val;
            } else memory[element.dataPointers[cname]] = val;   
        },
        setOnce: function(element, cname, val) {
             if(typeof element.dataPointers[cname]=="undefined") {
                let id = lastId++;
                element.dataPointers[cname] = id;
                memory[id] = val;
            }
        },
        get: function(element, cname) {
            if(typeof element.dataPointers[cname]!="undefined" && typeof memory[element.dataPointers[cname]]!="undefined") {
               return memory[element.dataPointers[cname]];
            } else return undefined;
        },
        check: function(element, cname) {
            if(typeof element.dataPointers[cname]!="undefined" && typeof memory[element.dataPointers[cname]]!="undefined") {
               return true;
            } else return false;
        },
        free: function(element, cname="") {
            if(cname==="") {
            for(var key in element.dataPointers) {
              delete memory[element.dataPointers[key]];  
            }
              delete element.dataPointers;
            } else {
              delete memory[element.dataPointers[cname]];
              delete element.dataPointers[cname];
            }
        },
        freeAll: function() {
            Element.prototype.dataPointers = undefined;
            memory = {};
        },
        toAttribute: function(element, cname) {
            element.setAttribute("data-"+cname, memory[element.dataPointers[cname]]);
            //delete element.data(cname).toProperty;
        },
        memory: memory
    }
    
    
}());

//Data of element locally
Element.prototype.data = function(name="") {
    let el = this;
    if(typeof el.dataPointers!="object") el.dataPointers = {};
    
    if(name=="") {
        return {
        HTMLElementData: el.dataPointers,
        set: function(cname, val) { return Stack.set(el, cname, val); },
        setOnce: function(cname, val) { return Stack.setOnce(el, cname, val); },
        free: function() { Stack.free(el); }
        }
    } else {
        if(Stack.check(el, name)) {
             return {
            HTMLElementData: this.dataPointers[name],
            value: Stack.get(el, name),
            set: function(val) { return Stack.set(el, name, val); },
            free: function() { Stack.free(el, name); },
            toAttribute: function() { Stack.toAttribute(el, name); }
            }
            
        } else return null;
    }
}
