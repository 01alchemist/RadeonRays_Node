#include <node.h>
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

    void createContext(const v8::FunctionCallbackInfo<v8::Value>& args) { 

      // Create RadeonProRender context
      rpr_int status = RPR_SUCCESS;
      rpr_context	context;
      // rpr_creation_flags flags = RPR_CREATION_FLAGS_ENABLE_GPU0;
      status = rprCreateContext(RPR_API_VERSION, nullptr, 0, RPR_CREATION_FLAGS_ENABLE_GPU0, NULL, NULL, &context);
      
      v8::Isolate* isolate = args.GetIsolate();
      Local<Object> obj = Object::New(isolate);
      obj->Set(
        String::NewFromUtf8(isolate, "status"), 
        Number::New(isolate, static_cast<int>(status))
      );
      if(status == RPR_SUCCESS) {
        obj->Set(
          String::NewFromUtf8(isolate, "message"), 
          String::NewFromUtf8(isolate, "RadeonProRender context created!")
        );
        obj->Set(
          String::NewFromUtf8(isolate, "context"), 
          // uintptr_t context_ptr = static_cast<uintptr_t>(&context);
          const int context_ptr = 0;
          Number::New(isolate, context_ptr)
        );
      } else {
        obj->Set(
          String::NewFromUtf8(isolate, "message"), 
          String::NewFromUtf8(isolate, "RadeonProRender context creation failed!")
        );
      }

      args.GetReturnValue().Set(obj);      
    }

    void Initialize(v8::Local<v8::Object> exports) {  
      NODE_SET_METHOD(exports, "createContext", createContext);
    }

    NODE_MODULE(module_name, Initialize)  
}