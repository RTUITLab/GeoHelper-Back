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
const unityinvoker_1 = require("@mitm/unityinvoker");
const path = require("path");
const build_context_1 = require("./build_context");
const streamMaker = require("./stream_maker");
const unityproj = require("./unity_project");
var BundlerState;
(function (BundlerState) {
    BundlerState[BundlerState["Configuring"] = 0] = "Configuring";
    BundlerState[BundlerState["Bundling"] = 1] = "Bundling";
    BundlerState[BundlerState["Dead"] = 2] = "Dead";
})(BundlerState || (BundlerState = {}));
class AssetsBundler {
    constructor() {
        this.logger = unityinvoker_1.logger.noopLogger;
        this.unityLogger = unityinvoker_1.logger.noopLogger;
        this.editorScriptsStreams = [];
        this.buildOptions = new Set();
        this.state = BundlerState.Configuring;
    }
    includingAssets(pathToAssets) {
        this.checkBundlerIsntAlreadyConfigured();
        this.assetsPath = pathToAssets;
        return this;
    }
    targeting(buildTarget) {
        this.checkBundlerIsntAlreadyConfigured();
        if (typeof buildTarget !== 'string') {
            throw new Error('buildTarget must be a string (member name of an UnityEngine.BuildTarget enum).');
        }
        this.buildTarget = buildTarget;
        return this;
    }
    withLogger(loggerFn) {
        this.checkBundlerIsntAlreadyConfigured();
        this.checkLoggerType(loggerFn);
        this.logger = loggerFn;
        return this;
    }
    withUnityLogger(unityLogger) {
        this.checkBundlerIsntAlreadyConfigured();
        this.checkLoggerType(unityLogger);
        this.unityLogger = unityLogger;
        return this;
    }
    withBuildOptions(buildOptions) {
        this.checkBundlerIsntAlreadyConfigured();
        Object.keys(buildOptions)
            .filter(key => buildOptions[key])
            .forEach(key => this.buildOptions.add(key));
        return this;
    }
    includingEditorScripts(...scripts) {
        this.checkBundlerIsntAlreadyConfigured();
        scripts.map(streamMaker.normalizeReadStream).forEach(stream => this.editorScriptsStreams.push(stream));
        return this;
    }
    to(file, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.buildTarget) {
                throw new Error('You must set a build target by calling targeting() before calling to().');
            }
            const defaultedOptions = Object.assign({ overwrite: true }, options);
            this.state = BundlerState.Bundling;
            //=> Normalize destinations to writable streams
            const fileStreamIos = streamMaker.normalizeWriteStream(file + '.ios');
            const fileStreamAnd = streamMaker.normalizeWriteStream(file + '.android');
            console.log('FILE_STREAM_IOS: ' + file + '.ios');
            //=> Create the build context (contains infos about the paths used by the current build)
            const buildContext = new build_context_1.BuildContext(path.basename(file));
            //=> Handle abrupt process terminations
            const signalCleanup = this.signalCleanup.bind(this, buildContext);
            process.on('SIGINT', signalCleanup);
            process.on('SIGTERM', signalCleanup);
            let manifest;
            try {
                //=> Create project and temporary "sub project"
                //---------------------------------------------
                this.logger(`Preparing Unity project in ${buildContext.projectRootDir}`);
                this.logger('Cleanup');
                yield unityproj.cleanupProject(buildContext);
                this.logger('Warmup');
                yield unityproj.warmupProject(buildContext);
                this.logger('Project created');

                //=> Copy original assets and scripts into the project (Unity limitation)
                //-----------------------------------------------------------------------
                this.logger(`Copying assets to ${buildContext.assetsDir}`);
                yield unityproj.copyAssetsInProject(buildContext, this.assetsPath);
                this.logger(`Copying custom editor scripts to ${buildContext.editorScriptsDir}`);
                yield unityproj.copyEditorScriptsInProject(buildContext, this.editorScriptsStreams);
                //=> Generate the asset bundle
                //----------------------------
                this.logger(`Generating asset bundle in ${buildContext.assetBundleDir}`);
                yield unityproj.generateAssetBundle(buildContext, this.buildOptions, this.buildTarget, this.unityLogger, assetPath => this.logger(`Updating resource: ${assetPath}`));
                //=> Move the generated asset bundle to the final dest
                //----------------------------------------------------
                this.logger(`Moving asset bundle to target destination`);
                yield unityproj.moveGeneratedAssetBundle(buildContext, fileStreamIos, null, defaultedOptions.overwrite, 'iOS');
                yield unityproj.moveGeneratedAssetBundle(buildContext, fileStreamAnd, null, defaultedOptions.overwrite, 'Android');
            }
            finally {
                //=> Success or error doesn't matter, we have to cleanup!
                //-------------------------------------------------------
                process.removeListener('SIGINT', signalCleanup);
                process.removeListener('SIGTERM', signalCleanup);
                // yield this.cleanup(buildContext);
            }
            //=> OK.
            //------
            this.state = BundlerState.Dead;
            this.logger('Done.');
            return manifest;
        });
    }
    cleanup(context) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger('Cleaning up the Unity project');
            yield unityproj.cleanupProject(context);
        });
    }
    signalCleanup(context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.logger('AssetBundle conversion cancelled by user!');
            yield this.cleanup(context);
            process.exit(0);
        });
    }
    checkLoggerType(loggerFn) {
        if (typeof loggerFn !== 'function') {
            throw new Error('Logger must be a function of type (message?: string) => void.');
        }
    }
    checkBundlerIsntAlreadyConfigured() {
        if (this.state !== BundlerState.Configuring) {
            throw new Error('Cannot configure the bundler after the AssetBundle build has started!');
        }
    }
}
exports.AssetsBundler = AssetsBundler;
