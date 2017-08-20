#include "nbind/nbind.h"
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
    
    struct Result {
        rpr_int status;
        rpr_context	context;
        Result(rpr_int _status, rpr_context	_context):status(_status),context(_context){}
    };
    Result createContext() { 

      // Create RadeonProRender context
      rpr_int status = RPR_SUCCESS;
      rpr_context	context;
      // rpr_creation_flags flags = RPR_CREATION_FLAGS_ENABLE_GPU0;
      status = rprCreateContext(RPR_API_VERSION, nullptr, 0, RPR_CREATION_FLAGS_ENABLE_GPU0, NULL, NULL, &context);
      
      if(status == RPR_SUCCESS) {
        return Result (status, context);
      } else {
        return Result (status, context);
      }
    }

    NBIND_GLOBAL() {
      function(createContext);
    };
}