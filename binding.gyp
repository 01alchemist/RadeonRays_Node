{
	"targets": [
		{
      "target_name": "radeonrays",
			"includes": [
			],
      "include_dirs":[
        "./sdk/baikal",
        "<!(node -e \"require('nan')\")"
      ],
      "link_settings":{
        "libraries":[
          "-Wl,-rpath,/Users/n.vinayakan/workspace/RadeonRays_Node/sdk/baikal/Bin/Release/x64",
          "libRpr64.dylib"
        ]  
      },
      "libraries":[
        "-L/Users/n.vinayakan/workspace/RadeonRays_Node/sdk/baikal/Bin/Release/x64",
        "libRpr64.dylib"
      ],
			"sources": [
				"src/core/wrap.cc"
			]
		}
	],
	"includes": [
	]
}
