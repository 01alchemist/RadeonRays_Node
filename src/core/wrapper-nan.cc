#include <nan.h>
#include "Rpr/RadeonProRender.h"
// #include <RadeonRays/RadeonRays/include/math/matrix.h>
// #include <RadeonRays/RadeonRays/include/math/mathutils.h>
// #include <RprLoadStore/RprLoadStore.h>

#include <map>
#include <cassert>
#include <fstream>
#define _USE_MATH_DEFINES
#include <math.h>
#include <iostream>

namespace RadeonRaysNode {
    
    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::Object;
    using v8::String;
    using v8::Number;
    using v8::Value;
    using Nan::GetFunction;
    using Nan::New;
    using Nan::Set;

    NAN_METHOD(createContext) { 

      // Create RadeonProRender context
      rpr_int status = RPR_SUCCESS;
      rpr_context	context;
      // rpr_creation_flags flags = RPR_CREATION_FLAGS_ENABLE_GPU0;
      status = rprCreateContext(RPR_API_VERSION, nullptr, 0, RPR_CREATION_FLAGS_ENABLE_GPU0, NULL, NULL, &context);
      
      Local<Object> obj = New<Object>();
      obj->Set(
        New<String>("status").ToLocalChecked(),
        New<Number>(static_cast<int>(status))
      );
      if(status == RPR_SUCCESS) {
        obj->Set(
          New<String>("message").ToLocalChecked(),
          New<String>("RadeonProRender context created!").ToLocalChecked()
        );
        obj->Set(
          New<String>("context").ToLocalChecked(), 
          New<Number>(static_cast<double>((long) context))
        );
      } else {
        obj->Set(
          New<String>("message").ToLocalChecked(),
          New<String>("RadeonProRender context creation failed!").ToLocalChecked()
        );
      }

      info.GetReturnValue().Set(obj);   
    }

    NAN_MODULE_INIT(Initialize) {  
      NAN_EXPORT(target, createContext);
    }

    NODE_MODULE(module_name, Initialize)
}
