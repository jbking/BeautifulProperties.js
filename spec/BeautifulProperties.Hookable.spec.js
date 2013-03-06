describe("BeautifulProperties.Hookable", function() {
  describe(".define", function() {
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
      BeautifulProperties.Hookable.define(object,'key',{});
      expect('key' in object).toBe(true);
    });
    describe("hooks have been or don't to have been called",function(){
      var object;
      beforeEach(function(){
        object = Object.create(null);
        BeautifulProperties.Hookable.define(object,'key',{
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
          BeautifulProperties.getRaw(object,'key');
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
          BeautifulProperties.setRaw(object,'key',1);
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
          expect(BeautifulProperties.getRaw(object,'key')).toBe(1);
        })
      });
    });
    describe("afterGet could replace get value",function(){
      var object,originalValue,replacedValue,hooks;
      beforeEach(function(){
        object = Object.create(null);
        hooks = Object.create(null);
        hooks.beforeGet = beforeGet;
        originalValue = 1;
        hooks.afterGet = function (val){
          afterGet(val);
          return replacedValue;
        };
      });
      describe("hooks",function(){
        beforeEach(function(){
          replacedValue = 2;
          BeautifulProperties.Hookable.define(object,'key',hooks);
          BeautifulProperties.setRaw(object,'key',originalValue);
          object['key'];
        });
        it("beforeGet to have been called with no arguments",function(){
          expect(beforeGet).toHaveBeenCalledWith();
        });
        it("afterGet to have been called with originalValue",function(){
          expect(afterGet).toHaveBeenCalledWith(originalValue);
        });
      });
      describe("afterGet's return value isn't undefined",function(){
        beforeEach(function(){
          replacedValue = 2;
          BeautifulProperties.Hookable.define(object,'key',hooks);
          BeautifulProperties.setRaw(object,'key',originalValue);
        });
        it("value should be replaced",function(){
          expect(object['key']).toBe(replacedValue);
        });
      });
      describe("afterGet's return value is undefined",function(){
        beforeEach(function(){
          replacedValue = undefined;
          BeautifulProperties.Hookable.define(object,'key',hooks);
          BeautifulProperties.setRaw(object,'key',originalValue);
        });
        it("value should not be replaced",function(){
          expect(object['key']).toBe(originalValue);
        });
      });
      describe("afterGet's return value is Hookable.Undefined",function(){
        beforeEach(function(){
          replacedValue = BeautifulProperties.Hookable.Undefined;
          hooks.afterGet = function (val){
            afterGet(val);
            return replacedValue;
          };
          BeautifulProperties.Hookable.define(object,'key',hooks);
          BeautifulProperties.setRaw(object,'key',originalValue);
        });
        it("value should not be replaced to undefined",function(){
          expect(object['key']).not.toBeDefined();
        });
      });
    });
    describe("beforeSet could replace set value",function(){
      var object,originalValue,replacedValue,previousValue,hooks;
      beforeEach(function(){
        object = Object.create(null);
        hooks = Object.create(null);
        hooks.beforeSet = function (val,previousVal){
          beforeSet(val,previousVal);
          return replacedValue;
        };
        hooks.afterSet = afterSet;
        previousValue = 0;
        originalValue = 1;
      });
      describe("hooks",function(){
        beforeEach(function(){
          replacedValue = 2;
          BeautifulProperties.Hookable.define(object,'key',hooks);
          BeautifulProperties.setRaw(object,'key',previousValue);
          object['key'] = originalValue;
        });
        it("beforeSet to have been called with no originalValue,previousValue",function(){
          expect(beforeSet).toHaveBeenCalledWith(originalValue,previousValue);
        });
        it("afterSet to have been called with replacedValue,previousValue",function(){
          expect(afterSet).toHaveBeenCalledWith(replacedValue,previousValue);
        });
      });
      describe("return value isn't undefined",function(){
        beforeEach(function(){
          replacedValue = 2;
          BeautifulProperties.Hookable.define(object,'key',hooks);
          BeautifulProperties.setRaw(object,'key',previousValue);
          object['key'] = originalValue;
        });
        it("value should be replaced",function(){
          expect(BeautifulProperties.getRaw(object,'key')).toBe(replacedValue);
        });
      });
      describe("return value is undefined",function(){
        beforeEach(function(){
          replacedValue = undefined;
          BeautifulProperties.Hookable.define(object,'key',hooks);
          BeautifulProperties.setRaw(object,'key',previousValue);
          object['key'] = originalValue;
        });
        it("value should not be replaced",function(){
          expect(BeautifulProperties.getRaw(object,'key')).toBe(originalValue);
        });
      });
      describe("return value is Hookable.Undefined",function(){
        beforeEach(function(){
          replacedValue = BeautifulProperties.Hookable.Undefined;
          BeautifulProperties.Hookable.define(object,'key',hooks);
          BeautifulProperties.setRaw(object,'key',previousValue);
          object['key'] = originalValue;
        });
        it("value should not be replaced to undefined",function(){
          expect(BeautifulProperties.getRaw(object,'key')).not.toBeDefined();
        });
      });
    });
    describe("descriptor",function(){
      describe("value",function(){
        var object,hooks;
        beforeEach(function(){
          object = Object.create(null);
          hooks = Object.create(null);
        });
        it("could set initial value.",function(){
          BeautifulProperties.Hookable.define(object,'key',hooks,{
            value:1
          });
          expect(object['key']).toBe(1);
        });
        it("could set initial value.",function(){
          BeautifulProperties.Hookable.define(object,'key',hooks,{
            value:0
          });
          expect(object['key']).toBe(0);
        });
      });
      describe("writable=false (readonly)",function(){
        var object,hooks;
        beforeEach(function(){
          object = Object.create(null);
          hooks = Object.create(null);
        });

        describe("value",function(){
          beforeEach(function(){
            BeautifulProperties.Hookable.define(object,'key',hooks,{
              value:1,
              writable:false
            });
          });
          it("could set initial value.",function(){
            expect(object['key']).toBe(1);
          });
          it("could not overwrite value.",function(){
            object['key'] = 2;
            expect(object['key']).toBe(1);
          });
        });
        describe("init",function(){
          var descriptor;
          beforeEach(function(){

            BeautifulProperties.Hookable.define(object,'key',hooks,{
              init:function(){
                return 1;
              },
              writable:false
            });
          });
          it("could set initial value.",function(){
            expect(object['key']).toBe(1);
          });
          it("could not overwrite value.",function(){
            object['key'] = 2;
            expect(object['key']).toBe(1);
          });
        });
      });
      describe("get",function(){
        var object,hooks,refresh;
        beforeEach(function(){
          object = Object.create(null);
          hooks = Object.create(null);
          refresh = jasmine.createSpy('refresh');
        });
        describe("",function(){
          beforeEach(function(){
            BeautifulProperties.Hookable.define(object,'key',hooks,{
              get:function(){
                return 1;
              }
            });
          });
          it("object could get value.",function(){
            expect(object['key']).toBe(1);
          });
          it("sub object could get value.",function(){
            var subObject = Object.create(object);
            expect(subObject['key']).toBe(1);
          });
        });
        describe("refresh hook should be called",function(){
          beforeEach(function(){
            hooks.refresh = refresh;
            BeautifulProperties.Hookable.define(object,'key',hooks,{
              get:function(){
                return 1;
              }
            });
          });
          it(" when refreshProperty is called.",function(){
            BeautifulProperties.Hookable.Get.refreshProperty(object,'key');
            expect(refresh).toHaveBeenCalledWith(1,undefined);
          });
          it(" when property is accessed.",function(){
            object['key'];
            expect(refresh).toHaveBeenCalledWith(1,undefined);
          });
        });
        it("Get.getSilently skip refresh hook.",function(){
          hooks.refresh = refresh;
          BeautifulProperties.Hookable.define(object,'key',hooks,{
            get:function(){
              return 1;
            }
          });
          expect(BeautifulProperties.Hookable.Get.getSilently(object,'key')).toBe(1);
          expect(refresh).not.toHaveBeenCalledWith(1,undefined);
        });
      });
      describe("set",function(){
        var object,hooks,set,refresh;
        beforeEach(function(){
          object = Object.create(null);
          hooks = Object.create(null);
          set = jasmine.createSpy('set');
          refresh = jasmine.createSpy('refresh');
        });
        describe("write only",function(){
          beforeEach(function(){
            hooks.refresh = refresh;
            BeautifulProperties.Hookable.define(object,'key',hooks,{
              set:set
            });
          });
          it(" when property is accessed.",function(){
            object['key'] = 1;
            expect(set).toHaveBeenCalledWith(1);
          });
          it("refresh hook shouldn't be called when property is accessed.",function(){
            object['key'] = 1;
            expect(refresh).not.toHaveBeenCalledWith(1);
          });
        });
        describe("rw",function(){
          beforeEach(function(){
            hooks.refresh = refresh;
            var value;
            BeautifulProperties.Hookable.define(object,'key',hooks,{
              set:function(val){
                value = val;
              },get:function(){
                return value;
              }
            });
          });
          it("refresh hook should be called when property is accessed.",function(){
            object['key'] = 1;
            expect(refresh).toHaveBeenCalledWith(1,undefined);
          });
        });
      });
    });
  });
});