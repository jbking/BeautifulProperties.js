describe("BeautifulProperties", function() {
  describe(".defineDefaultValueProperty", function() {
    it("define property",function(){
      var object = Object.create(null);
      var expectedValue = 1;
      expect(object['key']).toBeUndefined();
      BeautifulProperties.defineDefaultValueProperty(object,'key',function(){
        return expectedValue;
      });
      expect(object['key']).toEqual(expectedValue);
    });
    it("defaultValueGenerator to have been called only after first property access",function(){
      var spy = jasmine.createSpy();
      var object = Object.create(null);
      BeautifulProperties.defineDefaultValueProperty(object,'key',function (){
        spy();
        return 1;
      });

      expect(spy).not.toHaveBeenCalled();
      object['key'];
      expect(spy).toHaveBeenCalled();
    });
    it("defaultValueGenerator's context is saved",function(){
      var spy = jasmine.createSpy();
      var object = Object.create(null);
      BeautifulProperties.defineDefaultValueProperty(object,'key',function (){
        expect(this).toBe(object);
        spy();
        return 1;
      });
      object['key'];
      expect(spy).toHaveBeenCalled();
    })
  });
  describe(".defineHookableProperty", function() {
    var beforeGet,afterGet,beforeSet,afterSet;
    beforeEach(function(){
      beforeGet = jasmine.createSpy('beforeGet');
      afterGet = jasmine.createSpy('afterGet');
      beforeSet = jasmine.createSpy('beforeSet');
      afterSet = jasmine.createSpy('afterSet');
    });
    it("define property",function(){
      var object = Object.create(null);
      expect('key' in object).toBe(false);
      BeautifulProperties.defineHookableProperty(object,'key',{});
      expect('key' in object).toBe(true);
    });
    describe("hooks have been or don't to have been called",function(){
      var object;
      beforeEach(function(){
        object = Object.create(null);
        BeautifulProperties.defineHookableProperty(object,'key',{
          beforeGet : beforeGet,
          afterGet : afterGet,
          beforeSet : beforeSet,
          afterSet : afterSet
        });
      });
      describe("get",function(){
        beforeEach(function(){
          object['key'];
        });
        it("beforeGet was called",function(){
          expect(beforeGet).toHaveBeenCalled();
        });
        it("afterGet was called",function(){
          expect(afterGet).toHaveBeenCalled();
        });
        it("beforeSet was not called",function(){
          expect(beforeSet).not.toHaveBeenCalled();
        });
        it("afterSet was not called",function(){
          expect(afterSet).not.toHaveBeenCalled();
        });
      });
      describe("set",function(){
        beforeEach(function(){
          object['key'] = 1;
        });
        it("beforeGet was not called",function(){
          expect(beforeGet).not.toHaveBeenCalled();
        });
        it("afterGet was not called",function(){
          expect(afterGet).not.toHaveBeenCalled();
        });
        it("beforeSet was called",function(){
          expect(beforeSet).toHaveBeenCalled();
        });
        it("afterSet was called",function(){
          expect(afterSet).toHaveBeenCalled();
        });
      });
      describe("getRaw",function(){
        beforeEach(function(){
          BeautifulProperties.getRaw(self,'key');
        });
        it("beforeGet was called",function(){
          expect(beforeGet).not.toHaveBeenCalled();
        });
        it("afterGet was called",function(){
          expect(afterGet).not.toHaveBeenCalled();
        });
        it("beforeSet was not called",function(){
          expect(beforeSet).not.toHaveBeenCalled();
        });
        it("afterSet was not called",function(){
          expect(afterSet).not.toHaveBeenCalled();
        });
      });
      describe("setRaw",function(){
        beforeEach(function(){
          BeautifulProperties.setRaw(self,'key',1);
        });
        it("beforeGet was called",function(){
          expect(beforeGet).not.toHaveBeenCalled();
        });
        it("afterGet was called",function(){
          expect(afterGet).not.toHaveBeenCalled();
        });
        it("beforeSet was not called",function(){
          expect(beforeSet).not.toHaveBeenCalled();
        });
        it("afterSet was not called",function(){
          expect(afterSet).not.toHaveBeenCalled();
        });
        it("value could getRaw",function(){
          expect(BeautifulProperties.getRaw(self,'key')).toBe(1);
        })
      });
    });
    describe("afterGet could replace get value",function(){
      var object,originalValue,replacedValue;
      beforeEach(function(){
        object = Object.create(null);
        var hooks = Object.create(null);
        hooks.beforeGet = beforeGet;
        hooks.afterGet = function (val){
          afterGet(val);
          return replacedValue;
        };
        originalValue = 1;
        replacedValue = 2;
        BeautifulProperties.defineHookableProperty(object,'key',hooks);
        BeautifulProperties.setRaw(object,'key',originalValue);
      });
      describe("hooks",function(){
        beforeEach(function(){
          object['key'];
        });
        it("beforeGet to have been called with no arguments",function(){
          expect(beforeGet).toHaveBeenCalledWith();
        });
        it("afterGet to have been called with originalValue",function(){
          expect(afterGet).toHaveBeenCalledWith(originalValue);
        });
      });
      it("value should be replaced",function(){
        expect(object['key']).toBe(replacedValue);
      });
    });
    describe("beforeSet could replace set value",function(){
      var object,originalValue,replacedValue,previousValue;
      beforeEach(function(){
        object = Object.create(null);
        var hooks = Object.create(null);
        hooks.beforeSet = function (val,previousVal){
          beforeSet(val,previousVal);
          return replacedValue;
        };
        hooks.afterSet = afterSet;
        previousValue = 0;
        originalValue = 1;
        replacedValue = 2;
        BeautifulProperties.defineHookableProperty(object,'key',hooks);
        BeautifulProperties.setRaw(object,'key',previousValue);
      });
      describe("hooks",function(){
        beforeEach(function(){
          object['key'] = originalValue;
        });
        it("beforeSet to have been called with no originalValue,previousValue",function(){
          expect(beforeSet).toHaveBeenCalledWith(originalValue,previousValue);
        });
        it("afterSet to have been called with replacedValue,previousValue",function(){
          expect(afterSet).toHaveBeenCalledWith(replacedValue,previousValue);
        });
      });
    });
  });
});