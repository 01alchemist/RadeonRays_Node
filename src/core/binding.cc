#include <nan.h>
#include "Rpr/RadeonProRender.h"
#include "RadeonRays/RadeonRays/include/math/matrix.h"
#include "RadeonRays/RadeonRays/include/math/mathutils.h"
// #include "RprLoadStore/RprLoadStore.h"

#include "js-helper.cc"
#include <math.h>

namespace RadeonRaysNode {
    
    // #define NODE_MODULE_VERSION 54
    using namespace Nan;
    using namespace RadeonRays;

    NAN_METHOD(RegisterPlugin)
    {
        rpr_char const * path = ToCString(info[0]);
        
        rpr_int status = rprRegisterPlugin(path);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );

        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CreateContext)
    {
        rpr_int api_version = RPR_API_VERSION;
        rpr_int * pluginIDs = nullptr;
        size_t pluginCount = 0;
        rpr_creation_flags creation_flags = info[0]->Uint32Value();
        rpr_context_properties const * props = NULL;
        rpr_char const * cache_path = NULL;
        rpr_context out_context;

        rpr_int status = rprCreateContext(api_version, pluginIDs, pluginCount, creation_flags, props, cache_path, &out_context);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("context").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long) out_context))
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("RadeonProRender context creation failed!").ToLocalChecked()
            );
        }

        info.GetReturnValue().Set(result);
    }

    
    NAN_METHOD(ContextSetActivePlugin)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_int pluginID = info[1]->Int32Value();

        rpr_int status = rprContextSetActivePlugin(context, pluginID);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }
    
    NAN_METHOD(ContextGetInfo)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_context_info context_info = RPR_CONTEXT_RENDER_STATISTICS;
        rpr_render_statistics data;
        size_t size = sizeof(rpr_render_statistics);
        size_t * size_ret = NULL;
        
        rpr_int status = rprContextGetInfo(context, context_info, size, &data, size_ret);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("data").ToLocalChecked(),
                rpr_to_js_render_statistics(data)
            );
        } else {
            result->Set(
                New<v8::String>("status").ToLocalChecked(),
                New<v8::String>("ContextGetInfo failed!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }
    
    NAN_METHOD(ContextGetParameterInfo)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        int param_idx = info[1]->Int32Value();
        rpr_parameter_info parameter_info = info[2]->Uint32Value();
        size_t size = info[3]->Uint32Value();
        void * data = (void*) (long) info[4]->Uint32Value();
        size_t * size_ret = NULL;

        rpr_int status = rprContextGetParameterInfo(context, param_idx, parameter_info, size, &data, size_ret);
        
        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("data").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long) data))
            );
        } else {
            result->Set(
                New<v8::String>("status").ToLocalChecked(),
                New<v8::String>("ContextGetParameterInfo failed!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextGetAOV)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_aov aov = info[1]->Int32Value();
        rpr_framebuffer out_fb; 

        rpr_int status = rprContextGetAOV(context, aov, &out_fb);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("framebuffer").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long) out_fb))
            );
        } else {
            result->Set(
                New<v8::String>("status").ToLocalChecked(),
                New<v8::String>("ContextGetAOV failed!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextSetAOV)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_aov aov = info[1]->Uint32Value();
        rpr_framebuffer frame_buffer = (void*) (long) info[2]->NumberValue();
        
        rpr_int status = rprContextSetAOV(context, aov, frame_buffer);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        result->Set(
            New<v8::String>("aov").ToLocalChecked(),
            New<v8::Number>(aov)
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("ContextSetAOV done!").ToLocalChecked()
            );
        }else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextSetAOV!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextSetScene)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_scene scene = (void*) (long) info[1]->NumberValue();

        rpr_int status = rprContextSetScene(context, scene);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("ContextSetScene done!").ToLocalChecked()
            );
        }else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextSetScene!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextGetScene)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_scene out_scene;

        rpr_int status = rprContextGetScene(context, &out_scene);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("scene").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long) out_scene))
            );
        } else {
            result->Set(
                New<v8::String>("status").ToLocalChecked(),
                New<v8::String>("ContextGetScene failed!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextSetParameter1u)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_char const * name = ToCString(info[1]);
        rpr_uint x = info[2]->Uint32Value();

        rpr_int status = rprContextSetParameter1u(context, name, x);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        result->Set(
            New<v8::String>("param").ToLocalChecked(),
            New<v8::String>(name).ToLocalChecked()
        );
        result->Set(
            New<v8::String>("value").ToLocalChecked(),
            New<v8::Number>(x)
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("ContextSetParameter1u done!").ToLocalChecked()
            );
        }else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextSetParameter1u!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextSetParameter1f)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_char const * name = ToCString(info[1]);
        rpr_float x = (float) info[2]->NumberValue();

        rpr_int status = rprContextSetParameter1f(context, name, x);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextSetParameter3f)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_char const * name = ToCString(info[1]);
        rpr_float x = (float) info[2]->NumberValue();
        rpr_float y = (float) info[3]->NumberValue();
        rpr_float z = (float) info[4]->NumberValue();

        rpr_int status = rprContextSetParameter3f(context, name, x, y, z);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextSetParameter4f)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_char const * name = ToCString(info[1]);
        rpr_float x = (float) info[2]->NumberValue();
        rpr_float y = (float) info[3]->NumberValue();
        rpr_float z = (float) info[4]->NumberValue();
        rpr_float w = (float) info[5]->NumberValue();

        rpr_int status = rprContextSetParameter4f(context, name, x, y, z, w);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextSetParameterString)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_char const * name = ToCString(info[1]);
        rpr_char const * value = ToCString(info[2]);

        rpr_int status = rprContextSetParameterString(context, name, value);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("status").ToLocalChecked(),
                New<v8::String>("ContextSetParameterString done!").ToLocalChecked()
            );
        }else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextSetParameterString!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextRender)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();

        rpr_int status = rprContextRender(context);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("ContextRender done!").ToLocalChecked()
            );
        }else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextRender!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextRenderTile)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_uint xmin = info[1]->Uint32Value();
        rpr_uint xmax = info[2]->Uint32Value();
        rpr_uint ymin = info[3]->Uint32Value();
        rpr_uint ymax = info[4]->Uint32Value();

        rpr_int status = rprContextRenderTile(context, xmin, xmax, ymin, ymax);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("ContextRenderTile done!").ToLocalChecked()
            );
        }else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextRenderTile!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextClearMemory)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();

        rpr_int status = rprContextClearMemory(context);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("ContextRenderTile done!").ToLocalChecked()
            );
        }else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextRenderTile!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateImage)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_uint num_components = info[1]->Uint32Value();
        rpr_component_type type = info[2]->Uint32Value();
        rpr_image_format const format = {num_components, type};
        
        rpr_uint image_width = info[3]->Uint32Value();
        rpr_uint image_height = info[4]->Uint32Value();
        rpr_uint image_depth = info[5]->Uint32Value();
        rpr_uint image_row_pitch = info[6]->Uint32Value();
        rpr_uint image_slice_pitch = info[7]->Uint32Value();
        rpr_image_desc image_desc = {
            image_width, image_height, image_depth, image_row_pitch, image_slice_pitch
        };
        void const * data = (void *) NM_54_buf(info[8]);
        rpr_image out_image;
        rpr_int status = rprContextCreateImage(context, format, &image_desc, data, &out_image);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("image").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long) out_image))
            );
        }else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextRenderTile!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateImageFromFile)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_char const * path = ToCString(info[1]);
        rpr_image out_image;

        rpr_int status = rprContextCreateImageFromFile(context, path, &out_image);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long) out_image))
            );
        }else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextRenderTile!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }
    
    NAN_METHOD(ContextCreateScene)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_scene out_scene;
        rpr_int status = rprContextCreateScene(context, &out_scene);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        
        if(status == RPR_SUCCESS){
            result->Set(
            New<v8::String>("scene").ToLocalChecked(),
            New<v8::Number>(static_cast<double>((long) out_scene))
        );
        }else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextRenderTile!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }
    
    NAN_METHOD(ContextCreateInstance)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_shape shape = (void*) (long) info[1]->NumberValue();
        rpr_shape out_instance;

        rpr_int status = rprContextCreateInstance(context, shape, &out_instance);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("instance").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long) out_instance))
            );
        }else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextRenderTile!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }
    
    NAN_METHOD(ContextCreateMesh)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        float* vertices =  (float*) NM_54_buf(info[1]);
        size_t num_vertices = info[2]->Uint32Value();
        rpr_int vertex_stride = info[3]->Int32Value();

        float* normals =  (float*) NM_54_buf(info[4]);
        size_t num_normals = info[5]->Uint32Value();
        rpr_int normal_stride = info[6]->Int32Value();

        float* texcoords = (float*) NM_54_buf(info[7]);
        size_t num_texcoords = info[8]->Uint32Value();
        rpr_int texcoord_stride = info[9]->Int32Value();

        int* vertex_indices =  (int*) NM_54_buf(info[10]);
        rpr_int vidx_stride = info[11]->Int32Value();

        int* normal_indices =  (int*) NM_54_buf(info[12]);
        rpr_int nidx_stride = info[13]->Int32Value();

        int* texcoord_indices =  (int*) NM_54_buf(info[14]);
        rpr_int tidx_stride = info[15]->Int32Value();

        int* num_face_vertices =  (int*) NM_54_buf(info[16]);
        rpr_int num_faces = info[17]->Int32Value();

        rpr_shape out_mesh;

        rpr_int status = rprContextCreateMesh(context, vertices, num_vertices, vertex_stride, normals, num_normals, normal_stride, texcoords, num_texcoords, texcoord_stride, vertex_indices, vidx_stride, normal_indices, nidx_stride, texcoord_indices, tidx_stride, num_face_vertices, num_faces, &out_mesh);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("mesh").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long) out_mesh))
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error creating mesh!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }
/* It is unclear layout of texcoords and its related data
    NAN_METHOD(ContextCreateMeshEx)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_float const * vertices = (float*) NM_54_buf(info[1]);
        size_t num_vertices = info[2]->Uint32Value();
        rpr_int vertex_stride = info[3]->Int32Value();

        rpr_float const * normals = (float*) NM_54_buf(info[4]);
        size_t num_normals = info[5]->Uint32Value();
        rpr_int normal_stride = info[6]->Int32Value();

        rpr_int const * perVertexFlag = (int*) NM_54_buf(info[7]);
        size_t num_perVertexFlags = info[8]->Uint32Value();
        rpr_int perVertexFlag_stride = info[9]->Int32Value();
        rpr_int numberOfTexCoordLayers = info[10]->Int32Value();
        rpr_float const * texcoords = (float*) NM_54_buf(info[11]);
        size_t num_texcoords = info[12]->Uint32Value();
        rpr_int texcoord_stride = info[13]->Int32Value();
        rpr_int const * vertex_indices = (int*) NM_54_buf(info[14]);
        rpr_int vidx_stride = info[15]->Int32Value();
        rpr_int const * normal_indices = (int*) NM_54_buf(info[16]);
        rpr_int nidx_stride = info[17]->Int32Value();
        rpr_int const * texcoord_indices = (int*) NM_54_buf(info[18]);
        rpr_int tidx_stride = info[19]->Int32Value();
        rpr_int const * num_face_vertices = (int*) NM_54_buf(info[20]);
        size_t num_faces = info[21]->Uint32Value();
        rpr_shape out_mesh;

        rpr_int status = rprContextCreateMeshEx(context, vertices, num_vertices, vertex_stride, normals, num_normals, normal_stride, perVertexFlag, num_perVertexFlags, perVertexFlag_stride, numberOfTexCoordLayers, &texcoords, &num_texcoords, &texcoord_stride, vertex_indices, vidx_stride, normal_indices, nidx_stride, &texcoord_indices, &tidx_stride, num_face_vertices, num_faces, out_mesh);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    } 
*/
    NAN_METHOD(ContextCreateCamera)
    {
        rpr_context context = (void *) (long) info[0]->NumberValue();
        rpr_camera out_camera;

        rpr_int status = rprContextCreateCamera(context, &out_camera);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("camera").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long) out_camera))
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error while creating camera").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateFrameBuffer)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_uint num_components = info[1]->Uint32Value();
        rpr_uint type = info[2]->Uint32Value();
        rpr_framebuffer_format format = { num_components, type };
        rpr_uint fb_width = info[3]->Uint32Value();
        rpr_uint fb_height = info[4]->Uint32Value();
        rpr_framebuffer_desc fb_desc = { fb_width, fb_height };
        rpr_framebuffer out_fb;
        rpr_int status = rprContextCreateFrameBuffer(context, format, &fb_desc, &out_fb);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("frame_buffer").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long) out_fb))
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error while creating frame buffer").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraGetInfo)
    {
        rpr_camera camera = (void *) (long) info[0]->NumberValue();
        rpr_camera_info camera_info = info[1]->Uint32Value();
        size_t size = info[2]->Uint32Value();
        void * data = (void*) NM_54_buf(info[3]);
        size_t size_ret;

        rpr_int status = rprCameraGetInfo(camera, camera_info, size, data, &size_ret);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("size").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long)size_ret))
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error CameraGetInfo").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetFocalLength)
    {
        rpr_camera camera = (void *) (long) info[0]->NumberValue();
        rpr_float flength = static_cast<float>(info[1]->NumberValue());

        rpr_int status = rprCameraSetFocalLength(camera, flength);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("CameraSetFocalLength done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error CameraSetFocalLength").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetFocusDistance)
    {
        rpr_camera camera = (void *) (long) info[0]->NumberValue();
        rpr_float fdist = static_cast<float>(info[1]->NumberValue());

        rpr_int status = rprCameraSetFocusDistance(camera, fdist);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("CameraSetFocusDistance done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error CameraSetFocusDistance").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetTransform)
    {
        rpr_camera camera = (void *) (long) info[0]->NumberValue();
        rpr_bool transpose = info[1]->BooleanValue();
        rpr_float * transform = (float *) NM_54_buf(info[2]);

        rpr_int status = rprCameraSetTransform(camera, transpose, transform);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("CameraSetTransform done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error CameraSetTransform").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetSensorSize)
    {
        rpr_camera camera = (void *) (long) info[0]->NumberValue();
        rpr_float width = info[1]->NumberValue();
        rpr_float height = info[1]->NumberValue();

        rpr_int status = rprCameraSetSensorSize(camera, width, height);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("CameraSetSensorSize done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error CameraSetSensorSize").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraLookAt)
    {
        rpr_camera camera = (void *) (long) info[0]->NumberValue();
        rpr_float posx = static_cast<float>(info[1]->NumberValue());
        rpr_float posy = static_cast<float>(info[2]->NumberValue());
        rpr_float posz = static_cast<float>(info[3]->NumberValue());
        rpr_float atx = static_cast<float>(info[4]->NumberValue());
        rpr_float aty = static_cast<float>(info[5]->NumberValue());
        rpr_float atz = static_cast<float>(info[6]->NumberValue());
        rpr_float upx = static_cast<float>(info[7]->NumberValue());
        rpr_float upy = static_cast<float>(info[8]->NumberValue());
        rpr_float upz = static_cast<float>(info[9]->NumberValue());

        rpr_int status = rprCameraLookAt(camera, posx, posy, posz, atx, aty, atz, upx, upy, upz);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );

        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("CameraLookAt done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error CameraLookAt!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetFStop)
    {
        rpr_camera camera = (void *) (long) info[0]->NumberValue();
        rpr_float fstop = static_cast<float>(info[1]->NumberValue());

        rpr_int status = rprCameraSetFStop(camera, fstop);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("CameraSetFStop done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error CameraSetFStop!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetApertureBlades)
    {
        rpr_camera camera = (void *) (long) info[0]->NumberValue();
        rpr_uint num_blades = info[1]->Uint32Value();

        rpr_int status = rprCameraSetApertureBlades(camera, num_blades);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("CameraSetApertureBlades done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error CameraSetApertureBlades!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetExposure)
    {
        rpr_camera camera = (void *) (long) info[0]->NumberValue();
        rpr_float exposure = info[1]->NumberValue();

        rpr_int status = rprCameraSetExposure(camera, exposure);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("CameraSetExposure done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error CameraSetExposure!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetMode)
    {
        rpr_camera camera = (void *) (long) info[0]->NumberValue();
        rpr_camera_mode mode = info[1]->Uint32Value();

        rpr_int status = rprCameraSetMode(camera, mode);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("CameraSetMode done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error CameraSetMode!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetOrthoWidth)
    {
        rpr_camera camera = (void *) (long) info[0]->NumberValue();
        rpr_float width = info[1]->NumberValue();

        rpr_int status = rprCameraSetOrthoWidth(camera, width);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("CameraSetOrthoWidth done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error CameraSetOrthoWidth!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetFocalTilt)
    {
        rpr_camera camera = (void *) (long) info[0]->NumberValue();
        rpr_float tilt = info[1]->NumberValue();

        rpr_int status = rprCameraSetFocalTilt(camera, tilt);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("CameraSetFocalTilt done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error CameraSetFocalTilt!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetIPD)
    {
        rpr_camera camera = (void *) (long) info[0]->NumberValue();
        rpr_float ipd = info[1]->NumberValue();

        rpr_int status = rprCameraSetIPD(camera, ipd);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("CameraSetIPD done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error CameraSetIPD!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetLensShift)
    {
        rpr_camera camera = (void *) (long) info[0]->NumberValue();
        rpr_float shiftx = info[1]->NumberValue();
        rpr_float shifty = info[2]->NumberValue();

        rpr_int status = rprCameraSetLensShift(camera, shiftx, shifty);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("CameraSetLensShift done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error CameraSetLensShift!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetOrthoHeight)
    {
        rpr_camera camera = (void *) (long) info[0]->NumberValue();
        rpr_float height = info[1]->NumberValue();

        rpr_int status = rprCameraSetOrthoHeight(camera, height);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("CameraSetOrthoHeight done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error CameraSetOrthoHeight!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ImageGetInfo)
    {
        rpr_image image = (void *) (long) info[0]->NumberValue();
        rpr_image_info image_info = info[1]->Uint32Value();
        size_t size = info[2]->Uint32Value();
        void * data = (void *) NM_54_buf(info[3]);
        size_t size_ret;

        rpr_int status = rprImageGetInfo(image, image_info, size, data, &size_ret);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("size").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long)size_ret))
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ImageGetInfo!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ImageSetWrap)
    {
        rpr_image image = (void *) (long) info[0]->NumberValue();
        rpr_image_wrap_type type = info[1]->Uint32Value();

        rpr_int status = rprImageSetWrap(image, type);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("ImageSetWrap done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ImageSetWrap!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }
    
    NAN_METHOD(ShapeSetTransform)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_bool transpose = info[1]->BooleanValue();

        rpr_float const * transform = (float const *) NM_54_buf(info[2]);

        rpr_int status = rprShapeSetTransform(shape, transpose, transform);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Transformation set to shape").ToLocalChecked()
            );  
        } else {
            result->Set(
                New<v8::String>("status").ToLocalChecked(),
                New<v8::String>("Error setting transformation to shape").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }
    
    NAN_METHOD(ShapeSetSubdivisionFactor)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_uint factor = info[1]->Uint32Value();
        rpr_int status = rprShapeSetSubdivisionFactor(shape, factor);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetSubdivisionCreaseWeight)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_float factor = (float) info[1]->NumberValue();

        rpr_int status = rprShapeSetSubdivisionCreaseWeight(shape, factor);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetSubdivisionBoundaryInterop)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_subdiv_boundary_interfop_type type = info[1]->Uint32Value();

        rpr_int status = rprShapeSetSubdivisionBoundaryInterop(shape, type);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetDisplacementScale)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_float minscale = (float) info[1]->NumberValue();
        rpr_float maxscale = (float) info[2]->NumberValue();

        rpr_int status = rprShapeSetDisplacementScale(shape, minscale, maxscale);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetObjectGroupID)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_uint objectGroupID = info[1]->Uint32Value();

        rpr_int status = rprShapeSetObjectGroupID(shape, objectGroupID);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetDisplacementImage)
    {
        // rpr_shape shape = (void *) (long) info[0]->NumberValue();
        // rpr_image image = (void *) (long) info[1]->NumberValue();

        // rpr_int status = rprShapeSetDisplacementImage(shape, image);

        // v8::Local<v8::Object> result = New<v8::Object>();
        // result->Set(
        //     New<v8::String>("status").ToLocalChecked(),
        //     New<v8::Number>(static_cast<int>(status))
        // );
        // info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetMaterial)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_material_node node = (void *) (long) info[1]->NumberValue();

        rpr_int status = rprShapeSetMaterial(shape, node);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Material set to shape").ToLocalChecked()
            );
        } else{
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error material set to shape").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetMaterialOverride)
    {
        // rpr_shape shape = (void *) (long) info[0]->NumberValue();
        // rpr_material_node node = (void *) (long) info[1]->NumberValue();
        
        // rpr_int status = rprShapeSetMaterialOverride(shape, node);

        // v8::Local<v8::Object> result = New<v8::Object>();
        // result->Set(
        //     New<v8::String>("status").ToLocalChecked(),
        //     New<v8::Number>(static_cast<int>(status))
        // );
        // info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetVolumeMaterial)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_material_node node = (void *) (long) info[1]->NumberValue();

        rpr_int status = rprShapeSetVolumeMaterial(shape, node);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetLinearMotion)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_float x = (float) info[1]->NumberValue();
        rpr_float y = (float) info[2]->NumberValue();
        rpr_float z = (float) info[3]->NumberValue();
        
        rpr_int status = rprShapeSetLinearMotion(shape, x, y, z);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetAngularMotion)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_float x = (float) info[1]->NumberValue();
        rpr_float y = (float) info[2]->NumberValue();
        rpr_float z = (float) info[3]->NumberValue();
        rpr_float w = (float) info[4]->NumberValue();

        rpr_int status = rprShapeSetAngularMotion(shape, x, y, z, w);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetVisibility)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_bool visible = info[1]->BooleanValue();

        rpr_int status = rprShapeSetVisibility(shape, visible);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetVisibilityPrimaryOnly)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_bool visible = info[1]->BooleanValue();

        rpr_int status = rprShapeSetVisibilityPrimaryOnly(shape, visible);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetVisibilityInSpecular)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_bool visible = info[1]->BooleanValue();

        rpr_int status = rprShapeSetVisibilityInSpecular(shape, visible);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetShadowCatcher)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_bool shadowCatcher = info[1]->BooleanValue();

        rpr_int status = rprShapeSetShadowCatcher(shape, shadowCatcher);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetShadow)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_bool casts_shadow = info[1]->BooleanValue();
        
        rpr_int status = rprShapeSetShadow(shape, casts_shadow);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(LightSetTransform)
    {
        rpr_light light = (void *) (long) info[0]->NumberValue();
        rpr_bool transpose = info[1]->BooleanValue();
        rpr_float const * transform =  (float*) NM_54_buf(info[2]);

        rpr_int status = rprLightSetTransform(light, transpose, transform);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("LightSetTransform done").ToLocalChecked()
            );  
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error LightSetTransform").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeGetInfo)
    {
        rpr_shape mesh = (void *) (long) info[0]->NumberValue();
        rpr_shape_info shape_info = info[1]->Uint32Value();
        size_t size = info[2]->Uint32Value();
        void * data = (void *) NM_54_buf(info[3]);
        size_t size_ret;

        rpr_int status = rprShapeGetInfo(mesh, shape_info, size, data, &size_ret);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("MeshGetInfo done").ToLocalChecked()
            );  
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error MeshGetInfo").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MeshGetInfo)
    {
        rpr_shape mesh = (void *) (long) info[0]->NumberValue();
        rpr_mesh_info mesh_info = info[1]->Uint32Value();
        size_t size = info[2]->Uint32Value();
        void * data = NM_54_buf(info[3]);
        size_t size_ret;

        rpr_int status = rprMeshGetInfo(mesh, mesh_info, size, data, &size_ret);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("MeshGetInfo done").ToLocalChecked()
            );  
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error MeshGetInfo").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MeshPolygonGetInfo)
    {
        rpr_shape mesh = (void *) (long) info[0]->NumberValue();
        size_t polygon_index = info[1]->Uint32Value();
        rpr_mesh_polygon_info polygon_info = info[2]->Uint32Value();
        size_t size = info[3]->Uint32Value();
        void * data = (void *) NM_54_buf(info[4]);
        size_t size_ret;

        rpr_int status = rprMeshPolygonGetInfo(mesh, polygon_index, polygon_info, size, data, &size_ret);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("MeshPolygonGetInfo done").ToLocalChecked()
            );  
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error MeshPolygonGetInfo").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(InstanceGetBaseShape)
    {
        rpr_shape shape = (void *) (long) info[0]->NumberValue();
        rpr_shape out_shape;

        rpr_int status = rprInstanceGetBaseShape(shape, &out_shape);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("InstanceGetBaseShape done").ToLocalChecked()
            );  
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error InstanceGetBaseShape").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreatePointLight)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_light out_light;

        rpr_int status = rprContextCreatePointLight(context, &out_light);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("light").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long) out_light))
            );  
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextCreatePointLight").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(PointLightSetRadiantPower3f)
    {
        rpr_light light = (void *) (long) info[0]->NumberValue();
        rpr_float r = static_cast<float>(info[1]->NumberValue());
        rpr_float g = static_cast<float>(info[2]->NumberValue());
        rpr_float b = static_cast<float>(info[3]->NumberValue());

        rpr_int status = rprPointLightSetRadiantPower3f(light, r, g, b);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("PointLightSetRadiantPower3f done").ToLocalChecked()
            );  
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error PointLightSetRadiantPower3f").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }
  
    NAN_METHOD(ContextCreateSpotLight)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_light out_light;
        rpr_int status = rprContextCreateSpotLight(context, &out_light);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("light").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long) out_light))
            );  
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextCreateSpotLight").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SpotLightSetRadiantPower3f)
    {
        rpr_light light = (void *) (long) info[0]->NumberValue();
        rpr_float r = static_cast<float>(info[1]->NumberValue());
        rpr_float g = static_cast<float>(info[2]->NumberValue());
        rpr_float b = static_cast<float>(info[3]->NumberValue());

        rpr_int status = rprSpotLightSetRadiantPower3f(light, r, g, b);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("SpotLightSetRadiantPower3f done").ToLocalChecked()
            );  
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error SpotLightSetRadiantPower3f").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SpotLightSetConeShape)
    {
        rpr_light light = (void *) (long) info[0]->NumberValue();
        rpr_float iangle = static_cast<float>(info[1]->NumberValue());
        rpr_float oangle = static_cast<float>(info[2]->NumberValue());

        rpr_int status = rprSpotLightSetConeShape(light, iangle, oangle);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("SpotLightSetConeShape done").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error SpotLightSetConeShape").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateDirectionalLight)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_light out_light;

        rpr_int status = rprContextCreateDirectionalLight(context, &out_light);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("light").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long) out_light))
            );  
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextCreateDirectionalLight").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(DirectionalLightSetRadiantPower3f)
    {
        rpr_light light = (void *) (long) info[0]->NumberValue();
        rpr_float r = static_cast<float>(info[1]->NumberValue());
        rpr_float g = static_cast<float>(info[2]->NumberValue());
        rpr_float b = static_cast<float>(info[3]->NumberValue());

        rpr_int status = rprDirectionalLightSetRadiantPower3f(light, r, g, b);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("DirectionalLightSetRadiantPower3f done").ToLocalChecked()
            );  
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error DirectionalLightSetRadiantPower3f").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(DirectionalLightSetShadowSoftness)
    {
        rpr_light light = (void *) (long) info[0]->NumberValue();
        rpr_float coeff =  info[1]->NumberValue();

        rpr_int status = rprDirectionalLightSetShadowSoftness(light, coeff);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateEnvironmentLight)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_light out_light;

        rpr_int status = rprContextCreateEnvironmentLight(context, &out_light);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("light").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long)out_light))
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextCreateEnvironmentLight").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(EnvironmentLightSetImage)
    {
        rpr_light env_light = (void *) (long) info[0]->NumberValue();
        rpr_image image = (void *) (long) info[1]->NumberValue();

        rpr_int status = rprEnvironmentLightSetImage(env_light, image);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("EnvironmentLightSetIntensityScale done").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error EnvironmentLightSetIntensityScale").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(EnvironmentLightSetIntensityScale)
    {
        rpr_light env_light = (void *) (long) info[0]->NumberValue();
        rpr_float intensity_scale = info[1]->NumberValue();

        rpr_int status = rprEnvironmentLightSetIntensityScale(env_light, intensity_scale);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("EnvironmentLightSetIntensityScale done").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error EnvironmentLightSetIntensityScale").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(EnvironmentLightAttachPortal)
    {
        // rpr_light env_light = (void *) (long) info[0]->NumberValue();
        // rpr_shape portal = (void*) (long) info[1]->NumberValue();

        // rpr_int status = rprEnvironmentLightAttachPortal(env_light, portal);

        // v8::Local<v8::Object> result = New<v8::Object>();
        // result->Set(
        //     New<v8::String>("status").ToLocalChecked(),
        //     New<v8::Number>(static_cast<int>(status))
        // );
        // if(status == RPR_SUCCESS) {
        //     result->Set(
        //         New<v8::String>("message").ToLocalChecked(),
        //         New<v8::String>("EnvironmentLightAttachPortal done").ToLocalChecked()
        //     );
        // } else {
        //     result->Set(
        //         New<v8::String>("message").ToLocalChecked(),
        //         New<v8::String>("Error EnvironmentLightAttachPortal").ToLocalChecked()
        //     );
        // }
        // info.GetReturnValue().Set(result);
    }

    NAN_METHOD(EnvironmentLightDetachPortal)
    {
        // rpr_light env_light = (void *) (long) info[0]->NumberValue();
        // rpr_shape portal = (void*) (long) info[1]->NumberValue();

        // rpr_int status = rprEnvironmentLightDetachPortal(env_light, portal);

        // v8::Local<v8::Object> result = New<v8::Object>();
        // result->Set(
        //     New<v8::String>("status").ToLocalChecked(),
        //     New<v8::Number>(static_cast<int>(status))
        // );
        // if(status == RPR_SUCCESS) {
        //     result->Set(
        //         New<v8::String>("message").ToLocalChecked(),
        //         New<v8::String>("EnvironmentLightDetachPortal done").ToLocalChecked()
        //     );
        // } else {
        //     result->Set(
        //         New<v8::String>("message").ToLocalChecked(),
        //         New<v8::String>("Error EnvironmentLightDetachPortal").ToLocalChecked()
        //     );
        // }
        // info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateSkyLight)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_light out_light;

        rpr_int status = rprContextCreateSkyLight(context, &out_light);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("light").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long)out_light))
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextCreateSkyLight").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SkyLightSetTurbidity)
    {
        rpr_light skylight = (void*) (long) info[0]->NumberValue();
        rpr_float turbidity = info[1]->NumberValue();

        rpr_int status = rprSkyLightSetTurbidity(skylight, turbidity);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("SkyLightSetTurbidity done").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error SkyLightSetTurbidity").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SkyLightSetAlbedo)
    {
        rpr_light skylight = (void*) (long) info[0]->NumberValue();
        rpr_float albedo = info[1]->NumberValue();

        rpr_int status = rprSkyLightSetAlbedo(skylight, albedo);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("SkyLightSetAlbedo done").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error SkyLightSetAlbedo").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SkyLightSetScale)
    {
        rpr_light skylight = (void*) (long) info[0]->NumberValue();
        rpr_float scale = info[1]->NumberValue();

        rpr_int status = rprSkyLightSetScale(skylight, scale);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("SkyLightSetScale done").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error SkyLightSetScale").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SkyLightAttachPortal)
    {
        // rpr_light skylight = (void*) (long) info[0]->NumberValue();
        // rpr_shape portal = (void*) (long) info[1]->NumberValue();

        // rpr_int status = rprSkyLightAttachPortal(skylight, portal);

        // v8::Local<v8::Object> result = New<v8::Object>();
        // result->Set(
        //     New<v8::String>("status").ToLocalChecked(),
        //     New<v8::Number>(static_cast<int>(status))
        // );
        // if(status == RPR_SUCCESS) {
        //     result->Set(
        //         New<v8::String>("message").ToLocalChecked(),
        //         New<v8::String>("SkyLightAttachPortal done").ToLocalChecked()
        //     );
        // } else {
        //     result->Set(
        //         New<v8::String>("message").ToLocalChecked(),
        //         New<v8::String>("Error SkyLightAttachPortal").ToLocalChecked()
        //     );
        // }
        // info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SkyLightDetachPortal)
    {
        // rpr_light skylight = (void*) (long) info[0]->NumberValue();
        // rpr_shape portal = (void*) (long) info[1]->NumberValue();

        // rpr_int status = rprSkyLightDetachPortal(skylight, portal);

        // v8::Local<v8::Object> result = New<v8::Object>();
        // result->Set(
        //     New<v8::String>("status").ToLocalChecked(),
        //     New<v8::Number>(static_cast<int>(status))
        // );
        // if(status == RPR_SUCCESS) {
        //     result->Set(
        //         New<v8::String>("message").ToLocalChecked(),
        //         New<v8::String>("SkyLightDetachPortal done").ToLocalChecked()
        //     );
        // } else {
        //     result->Set(
        //         New<v8::String>("message").ToLocalChecked(),
        //         New<v8::String>("Error SkyLightDetachPortal").ToLocalChecked()
        //     );
        // }
        // info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateIESLight)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_light out_light;

        rpr_int status = rprContextCreateIESLight(context, &out_light);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("light").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long)out_light))
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error ContextCreateIESLight").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(IESLightSetRadiantPower3f)
    {
        rpr_light light = (void *) (long) info[0]->NumberValue();
        rpr_float r = static_cast<float>(info[1]->NumberValue());
        rpr_float g = static_cast<float>(info[2]->NumberValue());
        rpr_float b = static_cast<float>(info[3]->NumberValue());

        rpr_int status = rprIESLightSetRadiantPower3f(light, r, g, b);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("IESLightSetRadiantPower3f done").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error IESLightSetRadiantPower3f").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(IESLightSetImageFromFile)
    {
        rpr_light env_light = (void *) (long) info[0]->NumberValue();
        rpr_char const * imagePath = ToCString(info[1]);
        rpr_int nx = info[2]->Int32Value();
        rpr_int ny = info[3]->Int32Value();

        rpr_int status = rprIESLightSetImageFromFile(env_light, imagePath, nx, ny);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("IESLightSetImageFromFile done").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error IESLightSetImageFromFile").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(IESLightSetImageFromIESdata)
    {
        rpr_light env_light = (void *) (long) info[0]->NumberValue();
        rpr_char const * iesData = ToCString(info[1]);
        rpr_int nx = info[2]->Int32Value();
        rpr_int ny = info[3]->Int32Value();

        rpr_int status = rprIESLightSetImageFromIESdata(env_light, iesData, nx, ny);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("IESLightSetImageFromIESdata done").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error IESLightSetImageFromIESdata").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(LightGetInfo)
    {
        rpr_light light = (void *) (long) info[0]->NumberValue();
        rpr_light_info light_info = info[1]->Uint32Value();
        size_t size = info[2]->Uint32Value();
        void * data = (void *) NM_54_buf(info[3]);
        size_t size_ret;

        rpr_int status = rprLightGetInfo(light, light_info, size, data, &size_ret);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("size").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long)size_ret))
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error LightGetInfo").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneClear)
    {
        rpr_scene scene = (void *) (long) info[0]->NumberValue();

        rpr_int status = rprSceneClear(scene);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("SceneClear done").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error SceneClear").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }
    
    NAN_METHOD(SceneAttachShape)
    {
        rpr_scene scene = (void *) (long) info[0]->NumberValue();
        rpr_shape shape = (void *) (long) info[1]->NumberValue();

        rpr_int status = rprSceneAttachShape(scene, shape);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Shape attached to scene").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error attaching shape").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }
    
    NAN_METHOD(SceneDetachShape)
    {
        rpr_scene scene = (void *) (long) info[0]->NumberValue();
        rpr_shape shape = (void *) (long) info[1]->NumberValue();

        rpr_int status = rprSceneDetachShape(scene, shape);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Shape detached from scene").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error while detaching shape from scene").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneAttachLight)
    {
        rpr_scene scene = (void *) (long) info[0]->NumberValue();
        rpr_light light = (void *) (long) info[1]->NumberValue();

        rpr_int status = rprSceneAttachLight(scene, light);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Light attached to scene").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error while attaching to scene").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneDetachLight)
    {
        rpr_scene scene = (void *) (long) info[0]->NumberValue();
        rpr_light light = (void *) (long) info[1]->NumberValue();

        rpr_int status = rprSceneDetachLight(scene, light);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Light detached from scene").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error while detaching light from scene").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }


    NAN_METHOD(SceneGetInfo)
    {
        rpr_scene scene = (void *) (long) info[0]->NumberValue();
        rpr_scene_info scene_info = info[1]->Uint32Value();
        size_t size = info[2]->Uint32Value();
        void * data = NM_54_buf(info[3]);
        size_t size_ret;

        rpr_int status = rprSceneGetInfo(scene, scene_info, size, data, &size_ret);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneGetEnvironmentOverride)
    {
        rpr_scene scene = (void *) (long) info[0]->NumberValue();
        rpr_environment_override overrride = info[1]->Uint32Value();
        rpr_light out_light;

        rpr_int status = rprSceneGetEnvironmentOverride(scene, overrride, &out_light);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneSetEnvironmentOverride)
    {
        rpr_scene scene = (void *) (long) info[0]->NumberValue();
        rpr_environment_override overrride = info[1]->Uint32Value();
        rpr_light light = (void *) (long) info[2]->NumberValue();

        rpr_int status = rprSceneSetEnvironmentOverride(scene, overrride, light);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneSetBackgroundImage)
    {
        rpr_scene scene = (void *) (long) info[0]->NumberValue();
        rpr_image image = (void *) (long) info[1]->NumberValue();

        rpr_int status = rprSceneSetBackgroundImage(scene, image);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneGetBackgroundImage)
    {
        rpr_scene scene = (void *) (long) info[0]->NumberValue();
        rpr_image out_image;

        rpr_int status = rprSceneGetBackgroundImage(scene, &out_image);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("image").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long)out_image))
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error SceneGetBackgroundImage").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneSetCamera)
    {
        rpr_scene scene = (void *) (long) info[0]->NumberValue();
        rpr_camera camera = (void *) (long) info[1]->NumberValue();
        
        rpr_int status = rprSceneSetCamera(scene, camera);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("SceneSetCamera done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error SceneSetCamera").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    // NAN_METHOD(CompileScene)
    // {
    //     rpr_context context = (void *) (long) info[0]->NumberValue();
        
    //     rpr_int status = CompileScene(context);

    //     v8::Local<v8::Object> result = New<v8::Object>();
    //     result->Set(
    //         New<v8::String>("status").ToLocalChecked(),
    //         New<v8::Number>(static_cast<int>(status))
    //     );
    //     if(status == RPR_SUCCESS) {
    //         result->Set(
    //             New<v8::String>("message").ToLocalChecked(),
    //             New<v8::String>("CompileScene done!").ToLocalChecked()
    //         );
    //     } else {
    //         result->Set(
    //             New<v8::String>("message").ToLocalChecked(),
    //             New<v8::String>("Error CompileScene").ToLocalChecked()
    //         );
    //     }
    //     info.GetReturnValue().Set(result);
    // }

    NAN_METHOD(SceneGetCamera)
    {
        rpr_scene scene = (void *) (long) info[0]->NumberValue();
        rpr_camera out_camera;

        rpr_int status = rprSceneGetCamera(scene, &out_camera);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("camera").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long)out_camera))
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error SceneGetCamera").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(FrameBufferGetInfo)
    {
        rpr_framebuffer framebuffer = (void *) (long) info[0]->NumberValue();

        unsigned char*imageBuffer =  (unsigned char*) NM_54_buf(info[1]);
        unsigned int size = info[2]->Uint32Value();

        size_t size_ret;

        rpr_int status = rprFrameBufferGetInfo(framebuffer, RPR_FRAMEBUFFER_DATA, size, imageBuffer, &size_ret);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("length").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long)size_ret))
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error FrameBufferGetInfo").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(FrameBufferClear)
    {
        rpr_framebuffer frame_buffer = (void *) (long) info[0]->NumberValue();

        rpr_int status = rprFrameBufferClear(frame_buffer);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("FrameBufferClear done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error FrameBufferClear").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(FrameBufferSaveToFile)
    {
        rpr_framebuffer frame_buffer = (void *) (long) info[0]->NumberValue();
        rpr_char const * file_path = ToCString(info[1]);

        rpr_int status = rprFrameBufferSaveToFile(frame_buffer, file_path);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("FrameBufferSaveToFile done!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("Error FrameBufferSaveToFile").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextResolveFrameBuffer)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_framebuffer src_frame_buffer = (void*) (long) info[1]->NumberValue();
        rpr_framebuffer dst_frame_buffer = (void*) (long) info[2]->NumberValue();
        rpr_bool normalizeOnly = info[3]->BooleanValue();

        rpr_int status = rprContextResolveFrameBuffer(context, src_frame_buffer, dst_frame_buffer, normalizeOnly);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }
    
    NAN_METHOD(ContextCreateMaterialSystem)
    {
        rpr_context in_context = (void *) (long) info[0]->NumberValue();
        rpr_material_system_type type = info[0]->Uint32Value();
        rpr_material_system out_matsys = NULL;

        rpr_int status = rprContextCreateMaterialSystem(in_context, type, &out_matsys);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        result->Set(
            New<v8::String>("material_system").ToLocalChecked(),
            New<v8::Number>(static_cast<double>((long) out_matsys))
        );
        info.GetReturnValue().Set(result);
    }
    
    NAN_METHOD(MaterialSystemCreateNode)
    {
        rpr_material_system in_matsys = (void *) (long) info[0]->NumberValue();
        rpr_material_node_type in_type = info[1]->Uint32Value();
        rpr_material_node out_node;

        rpr_int status = rprMaterialSystemCreateNode(in_matsys, in_type, &out_node);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS){
            result->Set(
                New<v8::String>("node").ToLocalChecked(),
                New<v8::Number>(static_cast<double>((long) out_node))
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("MaterialSystemCreateNode failed!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MaterialNodeSetInputN)
    {
        rpr_material_node in_node = (void *) (long) info[0]->NumberValue();
        rpr_char const * in_input = ToCString(info[1]);
        rpr_material_node in_input_node = (void *) (long) info[2]->NumberValue();

        rpr_int status = rprMaterialNodeSetInputN(in_node, in_input, in_input_node);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        result->Set(
            New<v8::String>("message").ToLocalChecked(),
            New<v8::String>("MaterialNodeSetInputN done!").ToLocalChecked()
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MaterialNodeSetInputF)
    {
        rpr_material_node in_node = (void *) (long) info[0]->NumberValue();
        const char * debug_str = ToCString(info[1]);
        const char * in_input = ToCString(info[1]);
        rpr_float in_value_x = (float) info[2]->NumberValue();
        rpr_float in_value_y = (float) info[3]->NumberValue();
        rpr_float in_value_z = (float) info[4]->NumberValue();
        rpr_float in_value_w = (float) info[5]->NumberValue();

        rpr_int status = rprMaterialNodeSetInputF(in_node, in_input, in_value_x, in_value_y, in_value_z, in_value_w);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status != RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("MaterialNodeSetInputF failed!").ToLocalChecked()
            );
            result->Set(
                New<v8::String>("debug_str").ToLocalChecked(),
                New<v8::String>(debug_str).ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("MaterialNodeSetInputF done!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MaterialNodeSetInputU)
    {
        rpr_material_node in_node = (void *) (long) info[0]->NumberValue();
        rpr_char const * in_input = ToCString(info[1]);
        rpr_uint in_value = info[2]->Uint32Value();

        rpr_int status = rprMaterialNodeSetInputU(in_node, in_input, in_value);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MaterialNodeSetInputImageData)
    {
        rpr_material_node in_node = (void *) (long) info[0]->NumberValue();
        rpr_char const * in_input = ToCString(info[1]);
        rpr_image image = (void *) (long) info[2]->NumberValue();
        
        rpr_int status = rprMaterialNodeSetInputImageData(in_node, in_input, image);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MaterialNodeGetInfo)
    {
        rpr_material_node in_node = (void *) (long) info[0]->NumberValue();
        rpr_material_node_info in_info = info[1]->Uint32Value();
        size_t in_size = info[2]->Uint32Value();
        void * in_data = NM_54_buf(info[3]);
        size_t out_size;

        rpr_int status = rprMaterialNodeGetInfo(in_node, in_info, in_size, in_data, &out_size);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MaterialNodeGetInputInfo)
    {
        rpr_material_node in_node = (void *) (long) info[0]->NumberValue();
        rpr_int in_input_idx = info[1]->Int32Value();
        rpr_material_node_input_info in_info = info[2]->Uint32Value();
        size_t in_size = info[3]->Uint32Value();
        void * in_data = NM_54_buf(info[4]);
        size_t out_size;

        rpr_int status = rprMaterialNodeGetInputInfo(in_node, in_input_idx, in_info, in_size, in_data, &out_size);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ObjectDelete)
    {
        void * obj = (void *) (long) info[0]->NumberValue();

        rpr_int status = rprObjectDelete(obj);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        if(status != RPR_SUCCESS){
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("ObjectDelete failed!").ToLocalChecked()
            );
        } else {
            result->Set(
                New<v8::String>("message").ToLocalChecked(),
                New<v8::String>("ObjectDelete done!").ToLocalChecked()
            );
        }
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ObjectSetName)
    {
        void * node = (void *) (long) info[0]->NumberValue();
        rpr_char const * name = ToCString(info[1]);

        rpr_int status = rprObjectSetName(node, name);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreatePostEffect)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_post_effect_type type = info[1]->Uint32Value();
        rpr_post_effect out_effect;

        rpr_int status = rprContextCreatePostEffect(context, type, &out_effect);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextAttachPostEffect)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_post_effect effect = (void *) (long) info[1]->NumberValue();

        rpr_int status = rprContextAttachPostEffect(context, effect);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextDetachPostEffect)
    {
        rpr_context context = (void*) (long) info[0]->NumberValue();
        rpr_post_effect effect = (void *) (long) info[1]->NumberValue();

        rpr_int status = rprContextDetachPostEffect(context, effect);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(PostEffectSetParameter1u)
    {
        rpr_post_effect effect = (void *) (long) info[0]->NumberValue();
        rpr_char const * name = ToCString(info[1]);
        rpr_uint x = info[2]->Uint32Value();

        rpr_int status = rprPostEffectSetParameter1u(effect, name, x);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(PostEffectSetParameter1f)
    {
        rpr_post_effect effect = (void *) (long) info[0]->NumberValue();
        rpr_char const * name = ToCString(info[1]);
        rpr_float x = info[2]->NumberValue();

        rpr_int status = rprPostEffectSetParameter1f(effect, name, x);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(PostEffectSetParameter3f)
    {
        rpr_post_effect effect = (void *) (long) info[0]->NumberValue();
        rpr_char const * name = ToCString(info[1]);
        rpr_float x = info[2]->NumberValue();
        rpr_float y = info[3]->NumberValue();
        rpr_float z = info[4]->NumberValue();

        rpr_int status = rprPostEffectSetParameter3f(effect, name, x, y, z);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(PostEffectSetParameter4f)
    {
        rpr_post_effect effect = (void *) (long) info[0]->NumberValue();
        rpr_char const * name = ToCString(info[1]); 
        rpr_float x = info[2]->NumberValue();
        rpr_float y = info[3]->NumberValue();
        rpr_float z = info[4]->NumberValue();
        rpr_float w = info[5]->NumberValue();

        rpr_int status = rprPostEffectSetParameter4f(effect, name, x, y, z, w);

        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("status").ToLocalChecked(),
            New<v8::Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    } 
    
    NAN_METHOD(debugString)
    {
        const char * debug_str = ToCString(info[0]);
        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("result").ToLocalChecked(),
            New<v8::String>(debug_str).ToLocalChecked()
        );
        info.GetReturnValue().Set(result);
    }
    NAN_METHOD(debugTypedArray)
    {
        TypedArrayContents<float> data(info[0]);
        v8::Local<v8::Array> array = New<v8::Array>(data.length());
        for (size_t i=0; i<data.length(); i++) {
            Set(array, i, New<v8::Number>((*data)[i]));
        }
        v8::Local<v8::Object> result = New<v8::Object>();
        result->Set(
            New<v8::String>("result").ToLocalChecked(),
            array
        );
        info.GetReturnValue().Set(result);
    }

    NAN_MODULE_INIT(Initialize) {  
        NAN_EXPORT(target, debugString);
        NAN_EXPORT(target, debugTypedArray);
        NAN_EXPORT(target, RegisterPlugin);
        NAN_EXPORT(target, CreateContext);
        NAN_EXPORT(target, ContextSetActivePlugin);
        NAN_EXPORT(target, ContextGetInfo);
        NAN_EXPORT(target, ContextGetParameterInfo);
        NAN_EXPORT(target, ContextGetAOV);
        NAN_EXPORT(target, ContextSetAOV);
        NAN_EXPORT(target, ContextSetScene);
        NAN_EXPORT(target, ContextGetScene);
        NAN_EXPORT(target, ContextSetParameter1u);
        NAN_EXPORT(target, ContextSetParameter1f);
        NAN_EXPORT(target, ContextSetParameter3f);
        NAN_EXPORT(target, ContextSetParameter4f);
        NAN_EXPORT(target, ContextSetParameterString);
        NAN_EXPORT(target, ContextRender);
        NAN_EXPORT(target, ContextRenderTile);
        NAN_EXPORT(target, ContextClearMemory);
        NAN_EXPORT(target, ContextCreateImage);
        NAN_EXPORT(target, ContextCreateImageFromFile);
        NAN_EXPORT(target, ContextCreateScene);
        NAN_EXPORT(target, ContextCreateInstance);
        NAN_EXPORT(target, ContextCreateMesh);
        // NAN_EXPORT(target, ContextCreateMeshEx);
        NAN_EXPORT(target, ContextCreateCamera);
        NAN_EXPORT(target, ContextCreateFrameBuffer);
        NAN_EXPORT(target, CameraGetInfo);
        NAN_EXPORT(target, CameraSetFocalLength);
        NAN_EXPORT(target, CameraSetFocusDistance);
        NAN_EXPORT(target, CameraSetTransform);
        NAN_EXPORT(target, CameraSetSensorSize);
        NAN_EXPORT(target, CameraLookAt);
        NAN_EXPORT(target, CameraSetFStop);
        NAN_EXPORT(target, CameraSetApertureBlades);
        NAN_EXPORT(target, CameraSetExposure);
        NAN_EXPORT(target, CameraSetMode);
        NAN_EXPORT(target, CameraSetOrthoWidth);
        NAN_EXPORT(target, CameraSetFocalTilt);
        NAN_EXPORT(target, CameraSetIPD);
        NAN_EXPORT(target, CameraSetLensShift);
        NAN_EXPORT(target, CameraSetOrthoHeight);
        NAN_EXPORT(target, ImageGetInfo);
        NAN_EXPORT(target, ImageSetWrap);
        NAN_EXPORT(target, ShapeSetTransform);
        NAN_EXPORT(target, ShapeSetSubdivisionFactor);
        NAN_EXPORT(target, ShapeSetSubdivisionCreaseWeight);
        NAN_EXPORT(target, ShapeSetSubdivisionBoundaryInterop);
        NAN_EXPORT(target, ShapeSetDisplacementScale);
        NAN_EXPORT(target, ShapeSetObjectGroupID);
        NAN_EXPORT(target, ShapeSetDisplacementImage);
        NAN_EXPORT(target, ShapeSetMaterial);
        NAN_EXPORT(target, ShapeSetMaterialOverride);
        NAN_EXPORT(target, ShapeSetVolumeMaterial);
        NAN_EXPORT(target, ShapeSetLinearMotion);
        NAN_EXPORT(target, ShapeSetAngularMotion);
        NAN_EXPORT(target, ShapeSetVisibility);
        NAN_EXPORT(target, ShapeSetVisibilityInSpecular);
        NAN_EXPORT(target, ShapeSetShadowCatcher);
        NAN_EXPORT(target, ShapeSetShadow);
        NAN_EXPORT(target, LightSetTransform);
        NAN_EXPORT(target, ShapeGetInfo);
        NAN_EXPORT(target, MeshGetInfo);
        NAN_EXPORT(target, MeshPolygonGetInfo);
        NAN_EXPORT(target, InstanceGetBaseShape);
        NAN_EXPORT(target, ContextCreatePointLight);
        NAN_EXPORT(target, PointLightSetRadiantPower3f);
        NAN_EXPORT(target, ContextCreateSpotLight);
        NAN_EXPORT(target, SpotLightSetRadiantPower3f);
        NAN_EXPORT(target, SpotLightSetConeShape);
        NAN_EXPORT(target, ContextCreateDirectionalLight);
        NAN_EXPORT(target, DirectionalLightSetRadiantPower3f);
        NAN_EXPORT(target, DirectionalLightSetShadowSoftness);
        NAN_EXPORT(target, ContextCreateEnvironmentLight);
        NAN_EXPORT(target, EnvironmentLightSetImage);
        NAN_EXPORT(target, EnvironmentLightSetIntensityScale);
        NAN_EXPORT(target, EnvironmentLightAttachPortal);
        NAN_EXPORT(target, EnvironmentLightDetachPortal);
        NAN_EXPORT(target, ContextCreateSkyLight);
        NAN_EXPORT(target, SkyLightSetTurbidity);
        NAN_EXPORT(target, SkyLightSetAlbedo);
        NAN_EXPORT(target, SkyLightSetScale);
        NAN_EXPORT(target, SkyLightAttachPortal);
        NAN_EXPORT(target, SkyLightDetachPortal);
        NAN_EXPORT(target, ContextCreateIESLight);
        NAN_EXPORT(target, IESLightSetRadiantPower3f);
        NAN_EXPORT(target, IESLightSetImageFromFile);
        NAN_EXPORT(target, IESLightSetImageFromIESdata);
        NAN_EXPORT(target, LightGetInfo);
        NAN_EXPORT(target, SceneClear);
        NAN_EXPORT(target, SceneAttachShape);
        NAN_EXPORT(target, SceneDetachShape);
        NAN_EXPORT(target, SceneAttachLight);
        NAN_EXPORT(target, SceneDetachLight);
        NAN_EXPORT(target, SceneGetInfo);
        NAN_EXPORT(target, SceneGetEnvironmentOverride);
        NAN_EXPORT(target, SceneSetEnvironmentOverride);
        NAN_EXPORT(target, SceneSetBackgroundImage);
        NAN_EXPORT(target, SceneGetBackgroundImage);
        NAN_EXPORT(target, SceneSetCamera);
        NAN_EXPORT(target, SceneGetCamera);
        // NAN_EXPORT(target, CompileScene);
        NAN_EXPORT(target, FrameBufferGetInfo);
        NAN_EXPORT(target, FrameBufferClear);
        NAN_EXPORT(target, FrameBufferSaveToFile);
        NAN_EXPORT(target, ContextResolveFrameBuffer);
        NAN_EXPORT(target, ContextCreateMaterialSystem);
        NAN_EXPORT(target, MaterialSystemCreateNode);
        NAN_EXPORT(target, MaterialNodeSetInputN);
        NAN_EXPORT(target, MaterialNodeSetInputF);
        NAN_EXPORT(target, MaterialNodeSetInputU);
        NAN_EXPORT(target, MaterialNodeSetInputImageData);
        NAN_EXPORT(target, MaterialNodeGetInfo);
        NAN_EXPORT(target, MaterialNodeGetInputInfo);
        NAN_EXPORT(target, ObjectDelete);
        NAN_EXPORT(target, ObjectSetName);
        NAN_EXPORT(target, ContextCreatePostEffect);
        NAN_EXPORT(target, ContextAttachPostEffect);
        NAN_EXPORT(target, ContextDetachPostEffect);
        NAN_EXPORT(target, PostEffectSetParameter1u);
        NAN_EXPORT(target, PostEffectSetParameter1f);
        NAN_EXPORT(target, PostEffectSetParameter3f);
        NAN_EXPORT(target, PostEffectSetParameter4f);
    }

    NODE_MODULE(module_name, Initialize)
}
