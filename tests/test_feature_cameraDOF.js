const RPR = require("./../src/core/wrapper/radeon-pro-render").default
const rpr = require("../build/Debug/radeonrays.node")
const assert = require("./../src/utils/assert").default
const fs = require("fs");
const saveAsPNG = require('./save-as-png');
const createDOFMesh = require('./create-dof-mesh');
const glmatrix = require("gl-matrix")
const mat4 = glmatrix.mat4;

const M_PI_2 = 1.57079632679489661923 // pi/2
const M_PI_4 = 0.785398163397448309616; // pi/4

function test_feature_cameraDOF()
{
    let context, matsys, scene;
    console.time("CreateContext");
    let result = rpr.CreateContext(RPR.RPR_CREATION_FLAGS_ENABLE_GPU0)
    console.timeEnd("CreateContext");
    console.log(result)
    if (result.status !== RPR.RPR_SUCCESS) {
        return false;
    }
    context = result.context;

    // result = rpr.ContextCreateMaterialSystem(context, 0);
    // console.log(result);
    // if (result.status !== RPR.RPR_SUCCESS) {
    //     return false;
    // }
    // matsys = result.material_system;

    result = rpr.ContextCreateScene(context);
    console.log(result);
    if (result.status !== RPR.RPR_SUCCESS) {
        return false;
    }
    scene = result.scene;

    let mesh = createDOFMesh(context);

    result = rpr.SceneAttachShape(scene, mesh);
    assert(result.status == RPR.RPR_SUCCESS);
    console.log(result);

    //set camera
    let camera; 
    result = rpr.ContextCreateCamera(context);
    assert(result.status == RPR.RPR_SUCCESS);
    console.log(result);
    camera = result.camera;
    result = rpr.CameraLookAt(camera, 0.0, +0.6, 4.0, 0.0, +0.6, 0.0, 0.0, 1.0, 0.0);
    assert(result.status == RPR.RPR_SUCCESS);
    console.log(result);
    result = rpr.CameraSetFocalLength(camera, 200.0);
    assert(result.status == RPR.RPR_SUCCESS);
    console.log(result);
    result = rpr.CameraSetFStop(camera, 1.0);
    assert(result.status == RPR.RPR_SUCCESS);
    console.log(result);
    result = rpr.CameraSetFocusDistance(camera, 25.0);
    assert(result.status == RPR.RPR_SUCCESS);
    console.log(result);
    result = rpr.CameraSetMode(camera, RPR.RPR_CAMERA_MODE_PERSPECTIVE);
    assert(result.status == RPR.RPR_SUCCESS);
    console.log(result);
    result = rpr.SceneSetCamera(scene, camera);
    assert(result.status == RPR.RPR_SUCCESS);
    console.log(result);

    //output
    const fb_width = 800;
    const fb_height = 600;
    result = rpr.ContextCreateFrameBuffer(context, 4, RPR.RPR_COMPONENT_TYPE_FLOAT32, fb_width, fb_height);
    assert(result.status == RPR.RPR_SUCCESS);
    console.log(result);
    let frame_buffer = result.frame_buffer;
    // result = rpr.ContextSetAOV(context, RPR.RPR_AOV_COLOR, frame_buffer);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.ContextSetParameter1u(context, "rendermode", RPR.RPR_RENDER_MODE_GLOBAL_ILLUMINATION);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);

    //light
    // result = rpr.ContextCreatePointLight(context);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);
    // let light = result.light;
    // let lightm = mat4.fromTranslation(mat4.create(), [0.0, +0.6, 4.0]);
    // result = rpr.LightSetTransform(light, true, lightm);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.PointLightSetRadiantPower3f(light, 1000, 1000, 1000);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.SceneAttachLight(scene, light);
    // assert(result.status == RPR.RPR_SUCCESS);
    // console.log(result);

    result = rpr.FrameBufferClear(frame_buffer);
    assert(result.status == RPR.RPR_SUCCESS);
    console.log(result);

    // result = rpr.CompileScene(context);  
    // assert(result.status == RPR.RPR_SUCCESS);
    const kRenderIterations = 10;
    //render
    for (let i = 0; i < kRenderIterations; ++i)
    {
        console.log("rendering context... iteration #" + i)
        result = rpr.ContextRender(context);
        console.log(result);
        assert(result.status == RPR.RPR_SUCCESS);
    }

    // rprFrameBufferSaveToFile(frame_buffer, "Output/feature_cameraDOF.png");
    const bufferSize = fb_width * fb_height * 4 * 4;
    const output1 = Buffer.alloc(bufferSize);

    result = rpr.FrameBufferGetInfo(frame_buffer, output1, bufferSize);
    console.log(result);
    assert(result.status == RPR.RPR_SUCCESS);

    fs.writeFileSync(`output/feature_cameraDOF.bmp`, output1);
    saveAsPNG(output1, fb_width, fb_height, "feature_cameraDOF");

    //cleanup
    result = rpr.SceneDetachLight(scene, light);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.ObjectDelete(light); light = null;
    assert(result.status == RPR.RPR_SUCCESS);
    //FR_MACRO_CLEAN_SHAPE_RELEASE(mesh, scene);
    result = rpr.SceneSetCamera(scene, null);
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.ObjectDelete(scene); scene = null;
    assert(result.status == RPR.RPR_SUCCESS);

    result = rpr.ObjectDelete(camera); camera = null;
    assert(result.status == RPR.RPR_SUCCESS);
    result = rpr.ObjectDelete(frame_buffer); frame_buffer = null;
    assert(result.status == RPR.RPR_SUCCESS);

}

test_feature_cameraDOF();