#include <nan.h>
#include "Rpr/RadeonProRender.h"

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

    NAN_METHOD(RegisterPlugin)
    {
        //(rpr_char const * path)
        rpr_char const * path = info[0]->StringValue();
        
        rpr_int status = rprRegisterPlugin(path);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );

        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CreateContext)
    {
        //(rpr_int api_version, rpr_int * pluginIDs, size_t pluginCount, rpr_creation_flags creation_flags, rpr_context_properties const * props, rpr_char const * cache_path, rpr_context * out_context)
        rpr_int api_version = RPR_API_VERSION;
        rpr_int * pluginIDs = nullptr;
        size_t pluginCount = 0;
        rpr_creation_flags creation_flags = info[0]->Uint32Value();
        rpr_context_properties const * props = NULL;
        rpr_char const * cache_path = NULL;
        rpr_context * out_context = nullptr;

        rpr_int status = rprCreateContext(api_version, pluginIDs, pluginCount, creation_flags, props, cache_path, &out_context);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        if(status == RPR_SUCCESS) {
            result->Set(
                New<String>("context").ToLocalChecked(),
                New<Number>(static_cast<double>((long) out_context))
            );
        } else {
            obj->Set(
                New<String>("message").ToLocalChecked(),
                New<String>("RadeonProRender context creation failed!").ToLocalChecked()
            );
        }

        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextSetActivePlugin)
    {
        rpr_context context = (void*) info[0]->Uint32Value();
        rpr_int pluginID = info[1]->Int32Value();

        rpr_int status = rprContextSetActivePlugin(context, pluginID);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextGetInfo)
    {
        //(rpr_context context, rpr_context_info context_info, size_t size, void * data, size_t * size_ret)
        rpr_context context = (void*) info[0]->Uint32Value();
        // rpr_context_info context_info = info[1]->Uint32Value();
        // size_t size = info[1]->Uint32Value();
        // void * data
        rpr_context_info context_info = RPR_CONTEXT_RENDER_STATISTICS;
        rpr_render_statistics data;
        size_t size = sizeof(rpr_render_statistics);
        size_t * size_ret = NULL;
        
        rpr_int status = rprContextGetInfo(context, context_info, size, &data, size_ret);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        result->Set(
            New<String>("data").ToLocalChecked(),
            New<Number>(static_cast<double>((long) data))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextGetParameterInfo)
    {
        rpr_context context = (void*) info[0]->Uint32Value();
        int param_idx = info[1]->Int32Value();
        rpr_parameter_info parameter_info = info[2]->Uint32Value();
        size_t size = (size_t) info[3]->Uint32Value();
        void * data = (void*) info[4]->Uint32Value();
        size_t * size_ret = NULL;

        rpr_int status = rprContextGetParameterInfo(context, param_idx, parameter_info, size, &data, size_ret);
        
        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        result->Set(
            New<String>("data").ToLocalChecked(),
            New<Number>(static_cast<double>((long) data))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextGetAOV)
    {
        rpr_context context = (void*) info[0]->Uint32Value();
        rpr_aov aov = info[1]->Int32Value();
        rpr_framebuffer out_fb = NULL; 

        rpr_int status = rprContextGetAOV(context, aov, &out_fb);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        result->Set(
            New<String>("framebuffer").ToLocalChecked(),
            New<Number>(static_cast<double>((long) out_fb))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextSetAOV)
    {
        rpr_context context = (void*) info[0]->Uint32Value();
        rpr_aov aov = info[1]->Int32Value();
        rpr_framebuffer frame_buffer = (void*) info[2]->Uint32Value();
        
        rpr_int status = rprContextSetAOV(context, aov, frame_buffer);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );

        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextSetScene)
    {
        rpr_context context = (void*) info[0]->Uint32Value();
        rpr_scene scene = (void*) info[1]->Uint32Value();

        rpr_int status = rprContextSetScene(context, scene);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextGetScene)
    {
        rpr_context context = (void*) info[0]->Uint32Value();
        rpr_scene * out_scene = NULL:
        rpr_int status = rprContextGetScene(context, &out_scene);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextSetParameter1u)
    {
        rpr_context context = (void*) info[0]->Uint32Value();
        rpr_char const * name = (char*) info[1]->StringValue();
        rpr_uint x = info[2]->Uint32Value();

        rpr_int status = rprContextSetParameter1u(context, name, x);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextSetParameter1f)
    {
        rpr_context context = (void*) info[0]->Uint32Value();
        rpr_char const * name = info[1]->StringValue();
        rpr_float x = (float) info[2]->NumberValue();

        rpr_int status = rprContextSetParameter1f(context, name, x);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextSetParameter3f)
    {
        rpr_context context = (void*) info[0]->Uint32Value();
        rpr_char const * name = info[1]->StringValue();
        rpr_float x = (float) info[2].NumberValue();
        rpr_float y = (float) info[3].NumberValue();
        rpr_float z = (float) info[4].NumberValue();

        rpr_int status = rprContextSetParameter3f(context, name, x, y, z);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextSetParameter4f)
    {
        rpr_context context = (void*) info[0]->Uint32Value();
        rpr_char const * name = info[1]->StringValue();
        rpr_float x = (float) info[2].NumberValue();
        rpr_float y = (float) info[3].NumberValue();
        rpr_float z = (float) info[4].NumberValue();
        rpr_float w = (float) info[5].NumberValue();

        rpr_int status = rprContextSetParameter4f(context, name, x, y, z, w);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextSetParameterString)
    {
        rpr_context context = (void*) info[0]->Uint32Value();
        rpr_char const * name = info[1]->StringValue();
        rpr_char const * value = info[2]->StringValue();

        rpr_int status = rprContextSetParameterString(context, name, value);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextRender)
    {
        rpr_context context = (void*) info[0]->Uint32Value();

        rpr_int status = rprContextRender(context);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextRenderTile)
    {
        rpr_context context = (void*) info[0]->Uint32Value();
        rpr_uint xmin = info[1]->Uint32Value();
        rpr_uint xmax = info[2]->Uint32Value();
        rpr_uint ymin = info[3]->Uint32Value();
        rpr_uint ymax = info[4]->Uint32Value();

        rpr_int status = rprContextRenderTile(context, xmin, xmax, ymin, ymax);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextClearMemory)
    {
        rpr_context context = (void*) info[0]->Uint32Value();

        rpr_int status = rprContextClearMemory(context);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateImage)
    {
        rpr_context context = (void*) info[0]->Uint32Value();
        rpr_image_format const format, rpr_image_desc const * image_desc, void const * data, rpr_image * out_image
        rpr_int status = rprContextCreateImage(context, format, image_desc, data, out_image);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateImageFromFile)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_char const * path, rpr_image * out_image
        rpr_int status = rprContextCreateImageFromFile(context, path, out_image);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateScene)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_scene * out_scene
        rpr_int status = rprContextCreateScene(context, out_scene);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateInstance)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_shape shape, rpr_shape * out_instance
        rpr_int status = rprContextCreateInstance(context, shape, out_instance);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateMesh)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_float const * vertices, size_t num_vertices, rpr_int vertex_stride, rpr_float const * normals, size_t num_normals, rpr_int normal_stride, rpr_float const * texcoords, size_t num_texcoords, rpr_int texcoord_stride, rpr_int const * vertex_indices, rpr_int vidx_stride, rpr_int const * normal_indices, rpr_int nidx_stride, rpr_int const * texcoord_indices, rpr_int tidx_stride, rpr_int const * num_face_vertices, size_t num_faces, rpr_shape * out_mesh
        rpr_int status = rprContextCreateMesh(context, vertices, num_vertices, vertex_stride, normals, num_normals, normal_stride, texcoords, num_texcoords, texcoord_stride, vertex_indices, vidx_stride, normal_indices, nidx_stride, texcoord_indices, tidx_stride, num_face_vertices, num_faces, out_mesh);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateMeshEx)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_float const * vertices, size_t num_vertices, rpr_int vertex_stride, rpr_float const * normals, size_t num_normals, rpr_int normal_stride, rpr_int const * perVertexFlag, size_t num_perVertexFlags, rpr_int perVertexFlag_stride, rpr_int numberOfTexCoordLayers, rpr_float const ** texcoords, size_t * num_texcoords, rpr_int * texcoord_stride, rpr_int const * vertex_indices, rpr_int vidx_stride, rpr_int const * normal_indices, rpr_int nidx_stride, rpr_int const ** texcoord_indices, rpr_int * tidx_stride, rpr_int const * num_face_vertices, size_t num_faces, rpr_shape * out_mesh
        rpr_int status = rprContextCreateMeshEx(context, vertices, num_vertices, vertex_stride, normals, num_normals, normal_stride, perVertexFlag, num_perVertexFlags, perVertexFlag_stride, numberOfTexCoordLayers, texcoords, num_texcoords, texcoord_stride, vertex_indices, vidx_stride, normal_indices, nidx_stride, texcoord_indices, tidx_stride, num_face_vertices, num_faces, out_mesh);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateCamera)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_camera * out_camera
        rpr_int status = rprContextCreateCamera(context, out_camera);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateFrameBuffer)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_framebuffer_format const format, rpr_framebuffer_desc const * fb_desc, rpr_framebuffer * out_fb
        rpr_int status = rprContextCreateFrameBuffer(context, format, fb_desc, out_fb);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraGetInfo)
    {
        //(rpr_camera camera, rpr_camera_info camera_info, size_t size, void * data, size_t * size_ret
        rpr_int status = rprCameraGetInfo(camera, camera_info, size, data, size_ret);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetFocalLength)
    {
        //(rpr_camera camera, rpr_float flength
        rpr_int status = rprCameraSetFocalLength(camera, flength);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetFocusDistance)
    {
        //(rpr_camera camera, rpr_float fdist
        rpr_int status = rprCameraSetFocusDistance(camera, fdist);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetTransform)
    {
        //(rpr_camera camera, rpr_bool transpose, rpr_float * transform
        rpr_int status = rprCameraSetTransform(camera, transpose, transform);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetSensorSize)
    {
        //(rpr_camera camera, rpr_float width, rpr_float height
        rpr_int status = rprCameraSetSensorSize(camera, width, height);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraLookAt)
    {
        //(rpr_camera camera, rpr_float posx, rpr_float posy, rpr_float posz, rpr_float atx, rpr_float aty, rpr_float atz, rpr_float upx, rpr_float upy, rpr_float upz
        rpr_int status = rprCameraLookAt(camera, posx, posy, posz, atx, aty, atz, upx, upy, upz);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetFStop)
    {
        //(rpr_camera camera, rpr_float fstop
        rpr_int status = rprCameraSetFStop(camera, fstop);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetApertureBlades)
    {
        //(rpr_camera camera, rpr_uint num_blades
        rpr_int status = rprCameraSetApertureBlades(camera, num_blades);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetExposure)
    {
        //(rpr_camera camera, rpr_float exposure
        rpr_int status = rprCameraSetExposure(camera, exposure);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetMode)
    {
        //(rpr_camera camera, rpr_camera_mode mode
        rpr_int status = rprCameraSetMode(camera, mode);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetOrthoWidth)
    {
        //(rpr_camera camera, rpr_float width
        rpr_int status = rprCameraSetOrthoWidth(camera, width);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetFocalTilt)
    {
        //(rpr_camera camera, rpr_float tilt
        rpr_int status = rprCameraSetFocalTilt(camera, tilt);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetIPD)
    {
        //(rpr_camera camera, rpr_float ipd
        rpr_int status = rprCameraSetIPD(camera, ipd);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetLensShift)
    {
        //(rpr_camera camera, rpr_float shiftx, rpr_float shifty
        rpr_int status = rprCameraSetLensShift(camera, shiftx, shifty);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(CameraSetOrthoHeight)
    {
        //(rpr_camera camera, rpr_float height
        rpr_int status = rprCameraSetOrthoHeight(camera, height);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ImageGetInfo)
    {
        //(rpr_image image, rpr_image_info image_info, size_t size, void * data, size_t * size_ret
        rpr_int status = rprImageGetInfo(image, image_info, size, data, size_ret);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ImageSetWrap)
    {
        //(rpr_image image, rpr_image_wrap_type type
        rpr_int status = rprImageSetWrap(image, type);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetTransform)
    {
        //(rpr_shape shape, rpr_bool transpose, rpr_float const * transform
        rpr_int status = rprShapeSetTransform(shape, transpose, transform);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetSubdivisionFactor)
    {
        //(rpr_shape shape, rpr_uint factor
        rpr_int status = rprShapeSetSubdivisionFactor(shape, factor);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetSubdivisionCreaseWeight)
    {
        //(rpr_shape shape, rpr_float factor
        rpr_int status = rprShapeSetSubdivisionCreaseWeight(shape, factor);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetSubdivisionBoundaryInterop)
    {
        //(rpr_shape shape, rpr_subdiv_boundary_interfop_type type
        rpr_int status = rprShapeSetSubdivisionBoundaryInterop(shape, type);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetDisplacementScale)
    {
        //(rpr_shape shape, rpr_float minscale, rpr_float maxscale
        rpr_int status = rprShapeSetDisplacementScale(shape, minscale, maxscale);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetObjectGroupID)
    {
        //(rpr_shape shape, rpr_uint objectGroupID
        rpr_int status = rprShapeSetObjectGroupID(shape, objectGroupID);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetDisplacementImage)
    {
        //(rpr_shape shape, rpr_image image
        rpr_int status = rprShapeSetDisplacementImage(shape, image);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetMaterial)
    {
        //(rpr_shape shape, rpr_material_node node
        rpr_int status = rprShapeSetMaterial(shape, node);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetMaterialOverride)
    {
        //(rpr_shape shape, rpr_material_node node
        rpr_int status = rprShapeSetMaterialOverride(shape, node);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetVolumeMaterial)
    {
        //(rpr_shape shape, rpr_material_node node
        rpr_int status = rprShapeSetVolumeMaterial(shape, node);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetLinearMotion)
    {
        //(rpr_shape shape, rpr_float x, rpr_float y, rpr_float z
        rpr_int status = rprShapeSetLinearMotion(shape, x, y, z);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetAngularMotion)
    {
        //(rpr_shape shape, rpr_float x, rpr_float y, rpr_float z, rpr_float w
        rpr_int status = rprShapeSetAngularMotion(shape, x, y, z, w);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetVisibility)
    {
        //(rpr_shape shape, rpr_bool visible
        rpr_int status = rprShapeSetVisibility(shape, visible);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetVisibilityPrimaryOnly)
    {
        //(rpr_shape shape, rpr_bool visible
        rpr_int status = rprShapeSetVisibilityPrimaryOnly(shape, visible);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetVisibilityInSpecular)
    {
        //(rpr_shape shape, rpr_bool visible
        rpr_int status = rprShapeSetVisibilityInSpecular(shape, visible);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetShadowCatcher)
    {
        //(rpr_shape shape, rpr_bool shadowCatcher
        rpr_int status = rprShapeSetShadowCatcher(shape, shadowCatcher);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeSetShadow)
    {
        //(rpr_shape shape, rpr_bool casts_shadow
        rpr_int status = rprShapeSetShadow(shape, casts_shadow);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(LightSetTransform)
    {
        //(rpr_light light, rpr_bool transpose, rpr_float const * transform
        rpr_int status = rprLightSetTransform(light, transpose, transform);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ShapeGetInfo)
    {
        //(rpr_shape arg0, rpr_shape_info arg1, size_t arg2, void * arg3, size_t * arg4
        rpr_int status = rprShapeGetInfo(arg0, arg1, arg2, arg3, arg4);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MeshGetInfo)
    {
        //(rpr_shape mesh, rpr_mesh_info mesh_info, size_t size, void * data, size_t * size_ret
        rpr_int status = rprMeshGetInfo(mesh, mesh_info, size, data, size_ret);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MeshPolygonGetInfo)
    {
        //(rpr_shape mesh, size_t polygon_index, rpr_mesh_polygon_info polygon_info, size_t size, void * data, size_t * size_ret
        rpr_int status = rprMeshPolygonGetInfo(mesh, polygon_index, polygon_info, size, data, size_ret);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(InstanceGetBaseShape)
    {
        //(rpr_shape shape, rpr_shape * out_shape
        rpr_int status = rprInstanceGetBaseShape(shape, out_shape);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreatePointLight)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_light * out_light
        rpr_int status = rprContextCreatePointLight(context, out_light);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(PointLightSetRadiantPower3f)
    {
        //(rpr_light light, rpr_float r, rpr_float g, rpr_float b
        rpr_int status = rprPointLightSetRadiantPower3f(light, r, g, b);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateSpotLight)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_light * light
        rpr_int status = rprContextCreateSpotLight(context, light);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SpotLightSetRadiantPower3f)
    {
        //(rpr_light light, rpr_float r, rpr_float g, rpr_float b
        rpr_int status = rprSpotLightSetRadiantPower3f(light, r, g, b);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SpotLightSetConeShape)
    {
        //(rpr_light light, rpr_float iangle, rpr_float oangle
        rpr_int status = rprSpotLightSetConeShape(light, iangle, oangle);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateDirectionalLight)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_light * out_light
        rpr_int status = rprContextCreateDirectionalLight(context, out_light);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(DirectionalLightSetRadiantPower3f)
    {
        //(rpr_light light, rpr_float r, rpr_float g, rpr_float b
        rpr_int status = rprDirectionalLightSetRadiantPower3f(light, r, g, b);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(DirectionalLightSetShadowSoftness)
    {
        //(rpr_light light, rpr_float coeff
        rpr_int status = rprDirectionalLightSetShadowSoftness(light, coeff);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateEnvironmentLight)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_light * out_light
        rpr_int status = rprContextCreateEnvironmentLight(context, out_light);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(EnvironmentLightSetImage)
    {
        //(rpr_light env_light, rpr_image image
        rpr_int status = rprEnvironmentLightSetImage(env_light, image);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(EnvironmentLightSetIntensityScale)
    {
        //(rpr_light env_light, rpr_float intensity_scale
        rpr_int status = rprEnvironmentLightSetIntensityScale(env_light, intensity_scale);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(EnvironmentLightAttachPortal)
    {
        //(rpr_light env_light, rpr_shape portal
        rpr_int status = rprEnvironmentLightAttachPortal(env_light, portal);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(EnvironmentLightDetachPortal)
    {
        //(rpr_light env_light, rpr_shape portal
        rpr_int status = rprEnvironmentLightDetachPortal(env_light, portal);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateSkyLight)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_light * out_light
        rpr_int status = rprContextCreateSkyLight(context, out_light);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SkyLightSetTurbidity)
    {
        //(rpr_light skylight, rpr_float turbidity
        rpr_int status = rprSkyLightSetTurbidity(skylight, turbidity);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SkyLightSetAlbedo)
    {
        //(rpr_light skylight, rpr_float albedo
        rpr_int status = rprSkyLightSetAlbedo(skylight, albedo);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SkyLightSetScale)
    {
        //(rpr_light skylight, rpr_float scale
        rpr_int status = rprSkyLightSetScale(skylight, scale);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SkyLightAttachPortal)
    {
        //(rpr_light skylight, rpr_shape portal
        rpr_int status = rprSkyLightAttachPortal(skylight, portal);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SkyLightDetachPortal)
    {
        //(rpr_light skylight, rpr_shape portal
        rpr_int status = rprSkyLightDetachPortal(skylight, portal);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateIESLight)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_light * light
        rpr_int status = rprContextCreateIESLight(context, light);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(IESLightSetRadiantPower3f)
    {
        //(rpr_light light, rpr_float r, rpr_float g, rpr_float b
        rpr_int status = rprIESLightSetRadiantPower3f(light, r, g, b);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(IESLightSetImageFromFile)
    {
        //(rpr_light env_light, rpr_char const * imagePath, rpr_int nx, rpr_int ny
        rpr_int status = rprIESLightSetImageFromFile(env_light, imagePath, nx, ny);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(IESLightSetImageFromIESdata)
    {
        //(rpr_light env_light, rpr_char const * iesData, rpr_int nx, rpr_int ny
        rpr_int status = rprIESLightSetImageFromIESdata(env_light, iesData, nx, ny);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(LightGetInfo)
    {
        //(rpr_light light, rpr_light_info info, size_t size, void * data, size_t * size_ret
        rpr_int status = rprLightGetInfo(light, info, size, data, size_ret);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneClear)
    {
        //(rpr_scene scene
        rpr_int status = rprSceneClear(scene);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneAttachShape)
    {
        //(rpr_scene scene, rpr_shape shape
        rpr_int status = rprSceneAttachShape(scene, shape);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneDetachShape)
    {
        //(rpr_scene scene, rpr_shape shape
        rpr_int status = rprSceneDetachShape(scene, shape);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneAttachLight)
    {
        //(rpr_scene scene, rpr_light light
        rpr_int status = rprSceneAttachLight(scene, light);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneDetachLight)
    {
        //(rpr_scene scene, rpr_light light
        rpr_int status = rprSceneDetachLight(scene, light);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneGetInfo)
    {
        //(rpr_scene scene, rpr_scene_info info, size_t size, void * data, size_t * size_ret
        rpr_int status = rprSceneGetInfo(scene, info, size, data, size_ret);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneGetEnvironmentOverride)
    {
        //(rpr_scene scene, rpr_environment_override overrride, rpr_light * out_light
        rpr_int status = rprSceneGetEnvironmentOverride(scene, overrride, out_light);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneSetEnvironmentOverride)
    {
        //(rpr_scene scene, rpr_environment_override overrride, rpr_light light
        rpr_int status = rprSceneSetEnvironmentOverride(scene, overrride, light);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneSetBackgroundImage)
    {
        //(rpr_scene scene, rpr_image image
        rpr_int status = rprSceneSetBackgroundImage(scene, image);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneGetBackgroundImage)
    {
        //(rpr_scene scene, rpr_image * out_image
        rpr_int status = rprSceneGetBackgroundImage(scene, out_image);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneSetCamera)
    {
        //(rpr_scene scene, rpr_camera camera
        rpr_int status = rprSceneSetCamera(scene, camera);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(SceneGetCamera)
    {
        //(rpr_scene scene, rpr_camera * out_camera
        rpr_int status = rprSceneGetCamera(scene, out_camera);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(FrameBufferGetInfo)
    {
        //(rpr_framebuffer framebuffer, rpr_framebuffer_info info, size_t size, void * data, size_t * size_ret
        rpr_int status = rprFrameBufferGetInfo(framebuffer, info, size, data, size_ret);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(FrameBufferClear)
    {
        //(rpr_framebuffer frame_buffer
        rpr_int status = rprFrameBufferClear(frame_buffer);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(FrameBufferSaveToFile)
    {
        //(rpr_framebuffer frame_buffer, rpr_char const * file_path
        rpr_int status = rprFrameBufferSaveToFile(frame_buffer, file_path);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextResolveFrameBuffer)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_framebuffer src_frame_buffer, rpr_framebuffer dst_frame_buffer, rpr_bool normalizeOnly
        rpr_int status = rprContextResolveFrameBuffer(context, src_frame_buffer, dst_frame_buffer, normalizeOnly);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreateMaterialSystem)
    {
        //(rpr_context in_context, rpr_material_system_type type, rpr_material_system * out_matsys
        rpr_int status = rprContextCreateMaterialSystem(in_context, type, out_matsys);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MaterialSystemCreateNode)
    {
        //(rpr_material_system in_matsys, rpr_material_node_type in_type, rpr_material_node * out_node
        rpr_int status = rprMaterialSystemCreateNode(in_matsys, in_type, out_node);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MaterialNodeSetInputN)
    {
        //(rpr_material_node in_node, rpr_char const * in_input, rpr_material_node in_input_node
        rpr_int status = rprMaterialNodeSetInputN(in_node, in_input, in_input_node);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MaterialNodeSetInputF)
    {
        //(rpr_material_node in_node, rpr_char const * in_input, rpr_float in_value_x, rpr_float in_value_y, rpr_float in_value_z, rpr_float in_value_w
        rpr_int status = rprMaterialNodeSetInputF(in_node, in_input, in_value_x, in_value_y, in_value_z, in_value_w);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MaterialNodeSetInputU)
    {
        //(rpr_material_node in_node, rpr_char const * in_input, rpr_uint in_value
        rpr_int status = rprMaterialNodeSetInputU(in_node, in_input, in_value);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MaterialNodeSetInputImageData)
    {
        //(rpr_material_node in_node, rpr_char const * in_input, rpr_image image
        rpr_int status = rprMaterialNodeSetInputImageData(in_node, in_input, image);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MaterialNodeGetInfo)
    {
        //(rpr_material_node in_node, rpr_material_node_info in_info, size_t in_size, void * in_data, size_t * out_size
        rpr_int status = rprMaterialNodeGetInfo(in_node, in_info, in_size, in_data, out_size);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(MaterialNodeGetInputInfo)
    {
        //(rpr_material_node in_node, rpr_int in_input_idx, rpr_material_node_input_info in_info, size_t in_size, void * in_data, size_t * out_size
        rpr_int status = rprMaterialNodeGetInputInfo(in_node, in_input_idx, in_info, in_size, in_data, out_size);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ObjectDelete)
    {
        //(void * obj
        rpr_int status = rprObjectDelete(obj);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ObjectSetName)
    {
        //(void * node, rpr_char const * name
        rpr_int status = rprObjectSetName(node, name);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextCreatePostEffect)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_post_effect_type type, rpr_post_effect * out_effect
        rpr_int status = rprContextCreatePostEffect(context, type, out_effect);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextAttachPostEffect)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_post_effect effect
        rpr_int status = rprContextAttachPostEffect(context, effect);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(ContextDetachPostEffect)
    {
        rpr_context context = (void*) info[0]->Uint32Value();, rpr_post_effect effect
        rpr_int status = rprContextDetachPostEffect(context, effect);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(PostEffectSetParameter1u)
    {
        //(rpr_post_effect effect, rpr_char const * name = info[1]->StringValue(); rpr_uint x
        rpr_int status = rprPostEffectSetParameter1u(effect, name, x);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(PostEffectSetParameter1f)
    {
        //(rpr_post_effect effect, rpr_char const * name = info[1]->StringValue(); rpr_float x
        rpr_int status = rprPostEffectSetParameter1f(effect, name, x);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(PostEffectSetParameter3f)
    {
        //(rpr_post_effect effect, rpr_char const * name = info[1]->StringValue(); rpr_float x, rpr_float y, rpr_float z
        rpr_int status = rprPostEffectSetParameter3f(effect, name, x, y, z);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_METHOD(PostEffectSetParameter4f)
    {
        //(rpr_post_effect effect, rpr_char const * name = info[1]->StringValue(); rpr_float x, rpr_float y, rpr_float z, rpr_float w
        rpr_int status = rprPostEffectSetParameter4f(effect, name, x, y, z, w);

        Local<Object> result = New<Object>();
        result->Set(
            New<String>("status").ToLocalChecked(),
            New<Number>(static_cast<int>(status))
        );
        info.GetReturnValue().Set(result);
    }

    NAN_MODULE_INIT(Initialize) {  
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
      NAN_EXPORT(target, ContextCreateMeshEx);
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
