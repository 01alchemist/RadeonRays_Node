#include <nan.h>
using namespace Nan;

const char * ToCString(v8::Local<v8::Value> v8_value) {
    v8::String::Utf8Value nan_string(v8_value);
    return *nan_string ? *nan_string : "<string conversion failed>";
}

float const * ToCFloats(v8::Local<v8::Value> v8_value) {
    TypedArrayContents<float> data(v8_value);
    return *data;
}

v8::Local<v8::Object> rpr_to_js_render_statistics(rpr_render_statistics data){
    v8::Local<v8::Object> result = New<v8::Object>();
    result->Set(
        New<v8::String>("gpumem_usage").ToLocalChecked(),
        New<v8::Number>(static_cast<double>(data.gpumem_usage))
    );
    result->Set(
        New<v8::String>("gpumem_total").ToLocalChecked(),
        New<v8::Number>(static_cast<double>(data.gpumem_total))
    );
    result->Set(
        New<v8::String>("gpumem_max_allocation").ToLocalChecked(),
        New<v8::Number>(static_cast<double>(data.gpumem_max_allocation))
    );
    return result;
}