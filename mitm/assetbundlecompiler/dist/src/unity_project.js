"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fsx = require("fs-extra");
const os = require("os");
const path = require("path");
const unity = require("./unity_invoker");
exports.ProjectDirectory = path.join(os.tmpdir(), 'AssetBundleCompiler');
const CompilerScriptSource = path.resolve(`${__dirname}/../../resources/AssetBundleCompiler.cs`);
function shouldCreateProject(projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fsx.access(projectDir, fsx.constants.R_OK | fsx.constants.W_OK);
            return false;
        }
        catch (err) {
            return true;
        }
    });
}
exports.shouldCreateProject = shouldCreateProject;
function copyEditorScript(name) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fsx.mkdirp(path.dirname(path.resolve(`${name}/Assets/Editor/AssetBundleCompiler.cs`)));
        yield fsx.copy(CompilerScriptSource, path.resolve(`${name}/Assets/Editor/AssetBundleCompiler.cs`));
    });
}
exports.copyEditorScript = copyEditorScript;
function warmupProject(context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield shouldCreateProject(context.projectRootDir)) {
            yield fsx.mkdir(context.projectRootDir);
            yield fsx.copy(path.join(os.tmpdir(), 'ProjectTemplate'), context.projectRootDir);

            // yield unity.createProject(context.projectRootDir);
            // yield copyEditorScript(context.projectRootDir);
        }
        yield fsx.mkdir(context.editorScriptsDir);
        yield fsx.mkdir(context.assetsDir);
        yield fsx.mkdir(context.assetBundleDir);
    });
}
exports.warmupProject = warmupProject;
function copyEditorScriptsInProject(context, scriptsStreams) {
    return __awaiter(this, void 0, void 0, function* () {
        yield copyStreamsInDirectory(scriptsStreams, context.editorScriptsDir);
    });
}
exports.copyEditorScriptsInProject = copyEditorScriptsInProject;
function copyAssetsInProject(context, assetsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fsx.copy(assetsPath, context.assetsDir);
        // yield copyStreamsInDirectory(assetStreams, context.assetsDir);
    });
}
exports.copyAssetsInProject = copyAssetsInProject;
function generateAssetBundle(context, buildOptions, buildTarget, unityLogger, signalAssetProcessed) {
    return __awaiter(this, void 0, void 0, function* () {
        yield unity.generateAssetBundle(context.projectRootDir, [], context.assetBundleDir, context.assetBundleName, buildOptions, buildTarget, unityLogger, signalAssetProcessed);
        // const manifestBuf = yield fsx.readFile(context.assetBundleManifestPath);
        // return jsyaml.safeLoad(manifestBuf.toString());
    });
}
exports.generateAssetBundle = generateAssetBundle;
function moveGeneratedAssetBundle(context, finalDest, finalManifestDest, overwrite, target) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!overwrite) {
            try {
                yield fsx.access(finalDest.path);
                throw new Error(`File ${finalDest.path} already exists, overwrite option is false, aborting.`);
            }
            finally { }
        }
        const tasks = [];
        console.log('ASSET_BUNDLE_STREAM: ' + context.assetBundlePath + (target === 'iOS' ? '.ios' : '.android'));
        const assetBundleStream = fsx.createReadStream(context.assetBundlePath + (target === 'iOS' ? '.ios' : '.android'));
        tasks.push(copyReadableToWritableStream(assetBundleStream, finalDest));
        yield Promise.all(tasks);
    });
}
exports.moveGeneratedAssetBundle = moveGeneratedAssetBundle;
function cleanupProject(context) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fsx.remove(context.editorScriptsDir);
        yield fsx.remove(context.editorScriptsDir + '.meta');
        yield fsx.remove(context.assetsDir);
        yield fsx.remove(context.assetsDir + '.meta');
        yield fsx.remove(context.assetBundleDir);
    });
}
exports.cleanupProject = cleanupProject;
function copyStreamInDirectory(fileStream, directory) {
    return new Promise((resolve, reject) => {
        const fileName = path.basename(fileStream.path);
        const fileDestStream = fsx.createWriteStream(path.join(directory, fileName));
        fileStream.pipe(fileDestStream);
        fileDestStream.on('finish', resolve);
        fileDestStream.on('error', reject);
    });
}
function copyStreamsInDirectory(fileStreams, directory) {
    return __awaiter(this, void 0, void 0, function* () {
        const copyTasks = fileStreams.map(stream => copyStreamInDirectory(stream, directory));
        yield Promise.all(copyTasks);
    });
}
function copyReadableToWritableStream(readable, writable) {
    return new Promise((resolve, reject) => {
        readable.pipe(writable)
            .on('finish', () => resolve())
            .on('error', (err) => reject(err));
    });
}
