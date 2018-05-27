{
	"targets": [
		{
      "target_name": "radeonrays",
			"includes": [
			],

       "conditions":[

      	["OS=='linux'", {
          "include_dirs":[
            "./amd/RadeonProRender-Baikal-linux",
            "../amd/RadeonProRender-Baikal-linux/RadeonRays/RadeonRays/include",
            "<!(node -e \"require('nan')\")"
          ],  
      	  "link_settings":{
            "libraries":[
              "../amd/RadeonProRender-Baikal-linux/build/bin/libRadeonRays.so"
            ]  
          },
          "libraries":[
            "../amd/RadeonProRender-Baikal-linux/build/bin/libRadeonRays.so"
          ],
      	  }],

      	["OS=='mac'", {
      	  "link_settings":{
            "libraries":[
              "-Wl,-rpath,./amd/RadeonProRender-Baikal/Bin/Release/x64",
              "libRpr64.dylib"
            ]  
          },
          "libraries":[
            "-L./amd/RadeonProRender-Baikal/Bin/Release/x64",
            "libRpr64.dylib"
          ],
      	}],
        
        ["OS=='win'", {
          "include_dirs":[
            "./amd/RadeonProRender-Baikal",
            "./amd/RadeonProRender-Baikal/RadeonRays/RadeonRays/include",
            "C:/Program Files (x86)/Windows Kits/10/Include/10.0.14393.0/ucrt/",
            "<!(node -e \"require('nan')\")"
          ],  
          "link_settings":{
            "libraries":[
              "../amd/RadeonProRender-Baikal/RadeonRays/RadeonRays/Release/RadeonRays.lib"
            ]  
          },
          "libraries":[
            # "../amd/RadeonProRender-Baikal/Baikal/Release/Baikal.lib",
            "../amd/RadeonProRender-Baikal/RadeonRays/RadeonRays/Release/RadeonRays.lib",
            "../amd/RadeonProRender-Baikal/Rpr/Release/RadeonProRender.lib",
            "C:/Program Files (x86)/Windows Kits/10/Lib/10.0.14393.0/ucrt/x64/libucrt.lib",
            # "C:/Program Files (x86)/Windows Kits/10/Lib/10.0.14393.0/ucrt/x64/libucrtd.lib"
          ],
      	}]
      ],  
			"sources": [
				"src/core/binding.cc"
			]
		}
	],
	"includes": [
	]
}
