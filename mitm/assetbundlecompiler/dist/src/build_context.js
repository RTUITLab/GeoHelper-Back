"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const unity_project_1 = require("./unity_project");
const os = require("os");
class BuildContext {
    constructor(assetBundleName) {
        const ProjectDirectory = path.join(os.tmpdir(), assetBundleName.split('.assetbundle')[0]);

        console.log('PROJECT_DIRECTORY: ' + ProjectDirectory);

        this.assetBundleName = assetBundleName;
        this.projectRootDir = ProjectDirectory;
        this.assetsDir = path.resolve(`${ProjectDirectory}/Assets/CopiedAssets`);
        this.editorScriptsDir = path.resolve(`${ProjectDirectory}/Assets/Editor/CopiedScripts`);
        this.assetBundleDir = path.resolve(`${ProjectDirectory}/GeneratedAssetBundles`);
        this.assetBundlePath = path.resolve(`${this.assetBundleDir}/${assetBundleName}`);
        this.assetBundleManifestPath = path.resolve(`${this.assetBundlePath}.manifest`);
    }
}
exports.BuildContext = BuildContext;
