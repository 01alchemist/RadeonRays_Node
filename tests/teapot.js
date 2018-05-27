global.THREE = require("../examples/threejs/node_modules/three/build/three")
const OBJLoader = require("./obj-loader")
const rpr = require("../dist")
const assert = require("./../src/utils/assert").default
const fs = require("fs")
const path = require("path")
const saveAsPNG = require("./save-as-png")
const matrix = require("./matrixutils")
const createDOFMesh = require("./create-dof-mesh")
const glmatrix = require("gl-matrix")
const mat4 = glmatrix.mat4

const M_PI = 3.141592653589793
const M_PI_2 = 1.5707963705062848 // pi/2
const M_PI_4 = 0.7853981633974483 // pi/4

async function main() {

    let geo = await loadThreeJSMesh();

    let context, matsys, scene
    console.time("CreateContext")
    let result = rpr.CreateContext(rpr.RPR_CREATION_FLAGS_ENABLE_GPU0)
    console.timeEnd("CreateContext")
    console.log(result)
    if (result.status !== rpr.RPR_SUCCESS) {
        return false
    }
    context = result.context

    result = rpr.ContextCreateMaterialSystem(context, 0)
    console.log(result)
    if (result.status !== rpr.RPR_SUCCESS) {
        return false
    }
    matsys = result.material_system
    result = rpr.ContextCreateScene(context)
    console.log(result)
    if (result.status !== rpr.RPR_SUCCESS) {
        return false
    }
    scene = result.scene

    //material
    let diffuse
    result = rpr.MaterialSystemCreateNode(matsys, rpr.RPR_MATERIAL_NODE_DIFFUSE)
    console.log(result)
    if (result.status !== rpr.RPR_SUCCESS) {
        return false
    }
    diffuse = result.node
    result = rpr.MaterialNodeSetInputF(diffuse, "color", 0.7, 0.7, 0.0, 0.0)
    console.log(result)
    if (result.status !== rpr.RPR_SUCCESS) {
        return false
    }

    //geo mesh
    result = rpr.ContextCreateMesh(
        context,
        geo.vertices,
        geo.vertices.length,
        Float32Array.BYTES_PER_ELEMENT * 3,
        geo.normals,
        geo.normals.length,
        Float32Array.BYTES_PER_ELEMENT * 3,
        geo.texcoords,
        geo.texcoords.length,
        Float32Array.BYTES_PER_ELEMENT * 2,
        indices,
        4,
        indices,
        4,
        indices,
        4,
        num_face_vertices,
        2,
    )
    let geo_mesh = result.mesh
    result = rpr.SceneAttachShape(scene, geo_mesh)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    result = rpr.ShapeSetMaterial(geo_mesh, diffuse)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)

    // let dofMesh = createDOFMesh(context);

    // result = rpr.SceneAttachShape(scene, dofMesh);
    // assert(result.status == rpr.RPR_SUCCESS);
    // console.log(result);

    //camera
    let camera
    result = rpr.ContextCreateCamera(context)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    camera = result.camera
    result = rpr.CameraLookAt(camera, 0, 3, 10, 0, 0, 0, 0, 1, 0)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    result = rpr.CameraSetFocalLength(camera, 23.0)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    result = rpr.CameraSetFStop(camera, 5.4)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    result = rpr.SceneSetCamera(scene, camera)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    //camera 2
    // let camera;
    // result = rpr.ContextCreateCamera(context);
    // assert(result.status == rpr.RPR_SUCCESS);
    // console.log(result);
    // camera = result.camera;
    // result = rpr.CameraLookAt(camera, 0.0, +0.6, 4.0, 0.0, +0.6, 0.0, 0.0, 1.0, 0.0);
    // assert(result.status == rpr.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.CameraSetFocalLength(camera, 200.0);
    // assert(result.status == rpr.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.CameraSetFStop(camera, 0.5);
    // assert(result.status == rpr.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.CameraSetFocusDistance(camera, 10.0);
    // assert(result.status == rpr.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.CameraSetMode(camera, rpr.RPR_CAMERA_MODE_PERSPECTIVE);
    // assert(result.status == rpr.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.SceneSetCamera(scene, camera);
    // assert(result.status == rpr.RPR_SUCCESS);
    // console.log(result);

    //spot light
    let spotLight
    result = rpr.ContextCreateSpotLight(context)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    spotLight = result.light

    let spotLightm = matrix.mul(
        matrix.translation([0, 16, 0]),
        matrix.rotation_x(-M_PI_2),
    )
    console.log("  matrix: [ " + spotLightm.join(", ") + " ]")
    result = rpr.LightSetTransform(spotLight, true, spotLightm)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    console.log(M_PI_4, M_PI * 2 / 3)
    result = rpr.SpotLightSetConeShape(spotLight, M_PI_4, M_PI * 2 / 3)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    result = rpr.SpotLightSetRadiantPower3f(
        spotLight,
        350 / 100,
        350 / 100,
        350 / 100,
    )
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    result = rpr.SceneAttachLight(scene, spotLight)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)

    //point light
    // result = rpr.ContextCreatePointLight(context);
    // assert(result.status == rpr.RPR_SUCCESS);
    // console.log(result);
    // let pointLight = result.light;
    // let pointLightm = mat4.fromTranslation(mat4.create(), [0.0, +0.6, 4.0]);
    // result = rpr.LightSetTransform(pointLight, true, pointLightm);
    // assert(result.status == rpr.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.PointLightSetRadiantPower3f(pointLight, 1000, 1000, 1000);
    // assert(result.status == rpr.RPR_SUCCESS);
    // console.log(result);
    // result = rpr.SceneAttachLight(scene, pointLight);
    // assert(result.status == rpr.RPR_SUCCESS);
    // console.log(result);

    // result = rpr.ContextCreateDirectionalLight(context);
    // assert(result.status == rpr.RPR_SUCCESS);
    // let lightDir = result.light;
    // result = rpr.SceneAttachLight(scene, lightDir);
    // assert(result.status == rpr.RPR_SUCCESS);
    // console.log(result);

    result = rpr.ContextSetScene(context, scene)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)

    //setup out
    let frame_buffer
    const fb_width = 800
    const fb_height = 600
    // Frame buffer format
    const num_components = 4
    const type = rpr.RPR_COMPONENT_TYPE_FLOAT32

    result = rpr.ContextCreateFrameBuffer(
        context,
        num_components,
        type,
        fb_width,
        fb_height,
    )
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    frame_buffer = result.frame_buffer

    result = rpr.ContextSetAOV(context, rpr.RPR_AOV_COLOR, frame_buffer)
    // result = rpr.ContextSetAOV(context, rpr.RPR_AOV_SHADING_NORMAL, frame_buffer);
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    result = rpr.FrameBufferClear(frame_buffer)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    const kRenderIterations = 256

    //render
    console.log("Rendering started...")
    for (let i = 0; i < kRenderIterations; ++i) {
        result = rpr.ContextRender(context)
        assert(result.status == rpr.RPR_SUCCESS)
    }

    console.log("Rendering completed!")

    const bufferSize = fb_width * fb_height * 4 * 4
    const BufferType =
        typeof SharedArrayBuffer === "undefined"
            ? ArrayBuffer
            : SharedArrayBuffer
    const sbuffer = new BufferType(bufferSize)
    const output1 = Buffer.from(sbuffer)

    result = rpr.FrameBufferGetInfo(frame_buffer, output1, bufferSize)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)

    fs.writeFileSync(`output/dof.rgba`, output1)
    // saveAsPNG(output1, fb_width, fb_height, "dof");
    return
    //change spotLight
    result = rpr.SpotLightSetConeShape(spotLight, M_PI_4 * 0.5, M_PI_4 * 0.5)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    result = rpr.FrameBufferClear(frame_buffer)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)

    console.log("Rendering started...")
    for (let i = 0; i < kRenderIterations; ++i) {
        result = rpr.ContextRender(context)
        assert(result.status == rpr.RPR_SUCCESS)
    }
    console.log("Rendering completed!")

    const output2 = Buffer.alloc(bufferSize)

    result = rpr.FrameBufferGetInfo(frame_buffer, output2, bufferSize)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    fs.writeFileSync(`output/dof-2.rgba`, output2)

    let rs
    // result = rpr.ContextGetInfo(context, RPR_CONTEXT_RENDER_STATISTICS, sizeof(rpr_render_statistics), NULL);
    result = rpr.ContextGetInfo(context)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)

    return
    //cleanup
    result = rpr.SceneDetachLight(scene, spotLight)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    result = rpr.ObjectDelete(spotLight)
    spotLight = null
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    rpr.ObjectDelete(diffuse)
    console.log(result)
    result = rpr.SceneSetCamera(scene, null)
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    result = rpr.ObjectDelete(scene)
    scene = null
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    result = rpr.ObjectDelete(camera)
    camera = null
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    result = rpr.ObjectDelete(frame_buffer)
    frame_buffer = null
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
    result = rpr.ObjectDelete(matsys)
    matsys = null
    console.log(result)
    assert(result.status == rpr.RPR_SUCCESS)
}

async function loadThreeJSMesh() {
    return new Promise(function(resolve, reject) {
        const data = fs.readFileSync("../models/teapot.obj", "utf-8")

        var loader = new OBJLoader();
        loader.basePath = path.resolve(__dirname, "../models/");
        const result = loader.loadData( data, function ( object ) {
            console.log(object)
        });
        resolve(result)
    })
}

main()
