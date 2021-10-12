#!/bin/bash

####################################################
# Copy all Lodestar eth2.0 types to SSZ's test files
#
# Why?
# - To leverage consensus spec tests before release
# - To ensure Lodestar's types definitions are compatible before releasing
# - To benchmark usage a real eth2.0 types in SSZ for fast development
####################################################

# Allow the script to be run from any folder and not break paths
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
LODESTAR_EXECUTABLE=${SCRIPT_DIR}/../../packages/cli/bin/lodestar

# Assumes your directory structure is:
# i.e. you have cloned both the lodestar and ssz monorepo in the same parent directory
# .
# ├── lodestar
# │   └── packages
# │       └── types
# └── ssz
#     └── packages
#         └── ssz
#

LODESTAR_TYPES_SRC=${SCRIPT_DIR}/../../../../lodestar/packages/types/src
TYPES_SSZ_LOCATION=${SCRIPT_DIR}/lodestarTypes

# Clean up existing directory
rm -rf $TYPES_SSZ_LOCATION
mkdir -p $TYPES_SSZ_LOCATION

# Copy from lodestar types the entire source
cp -R $LODESTAR_TYPES_SRC/. $TYPES_SSZ_LOCATION

# Replace imports
find $TYPES_SSZ_LOCATION \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i 's/@chainsafe\/ssz/\.\.\/\.\.\/\.\.\/src/g'



