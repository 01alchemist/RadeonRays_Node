#!/usr/bin/env bash

git clone https://github.com/GPUOpen-LibrariesAndSDKs/RadeonProRender-Baikal.git baikal

cd baikal
git submodule init
git submodule update
./Tools/premake/osx/premake5 gmake --denoiser --rpr
./Tools/premake/osx/premake5 xcode4 --denoiser --rpr

make config=release_x64

# Builds all targets and places IPAs in build/

# Constants
SIGNING_IDENTITY="Nidin Vinayakan"

# Get a list of all schemes, then build each.
# xcodebuild -project PROJECT.xcodeproj -list | \
# 	sed -n '/Schemes/,/^$/p' | \
# 	grep -v "Schemes:" | \
# 	while read scheme; do
# 		echo "Building ${scheme}…"

# 		build_dir="$(pwd)/build"
# 		archivePath="${build_dir}/Archives/${scheme}.xcarchive"
# 		exportPath="${build_dir}/${scheme}.ipa"

# 		xcodebuild -project PROJECT.xcodeproj \
# 			-scheme "${scheme}" \
# 			-configuration Release \
# 			-sdk iphoneos \
# 			archive \
# 			-archivePath "${archivePath}" || exit $?

# 		xcodebuild -exportArchive \
# 			-exportFormat IPA \
# 			-archivePath "${archivePath}" \
# 			-exportPath "${exportPath}" \
# 			-exportSigningIdentity "${SIGNING_IDENTITY}" || exit $?
# 	done
    