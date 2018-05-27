#include "../../amd/RadeonProRender-Baikal-linux/Rpr/RadeonProRender.h"

#include <map>
#include <cassert>
#include <fstream>
#define _USE_MATH_DEFINES
#include <math.h>
#include <iostream>
using namespace std;

rpr_int createContext() { 

    // Create RadeonProRender context
    rpr_int status = RPR_SUCCESS;
    rpr_context	context;
    status = RadeonRays::rprCreateContext(RPR_API_VERSION, nullptr, 0, RPR_CREATION_FLAGS_ENABLE_GPU0, NULL, NULL, &context);

    return status;   
}

int main () {
    cout << createContext();
    return 0;
}
