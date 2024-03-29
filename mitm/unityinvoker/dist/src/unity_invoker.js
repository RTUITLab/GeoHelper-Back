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
const child_process_1 = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const pify = require("pify");
const unity_finder_1 = require("./unity_finder");

function runUnityProcess(options, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        //=> Generating an argv array from the arguments object
        const argv = toArgv(options);
        console.log(argv.join(' '));
        //=> Spawn Unity process
        const unityProcess = child_process_1.spawn(yield unity_finder_1.getUnityPath(), argv);
        //=> Watch process' stdout to log in real time, and keep the complete output in case of crash
        let stdoutAggregator = '';
        function stdoutHandler(buffer) {
            const message = buffer.toString();
            stdoutAggregator += message;
            logger(message.trim());
        }
        unityProcess.stdout.on('data', stdoutHandler);
        unityProcess.stderr.on('data', stdoutHandler);
        //=> Watch for the process to terminate, check return code
        return new Promise((resolve, reject) => {
            unityProcess.once('close', (close) => __awaiter(this, void 0, void 0, function* () {
                if (close === 0) {
                    resolve(stdoutAggregator);
                }
                else {
                    const crashPath = yield logUnityCrash(stdoutAggregator);
                    reject(new UnityCrashError(`Unity process crashed! Editor log has been written to ${crashPath}`, stdoutAggregator));
                }
            }));
        });
    });
}
exports.runUnityProcess = runUnityProcess;
function toArgv(options) {
    const argv = [];
    Object.keys(options).forEach((key) => {
        const value = options[key];
        //=> Pass on false, null, undefined, etc (disabled flags).
        if (!value) {
            return;
        }
        //=> Enabled flags + options with value(s)
        argv.push(`-${key}`);
        //=> Options with value(s)
        if (Array.isArray(value)) {
            const values = value;
            values.forEach(v => argv.push(v));
        }
        else if (typeof value !== 'boolean') {
            argv.push(value);
        }
    });
    return argv;
}
exports.toArgv = toArgv;
function logUnityCrash(unityLog) {
    return __awaiter(this, void 0, void 0, function* () {
        const crashPath = path.join(os.tmpdir(), 'unity_crash.abcompiler.log');
        yield pify(fs.writeFile)(crashPath, unityLog);
        return crashPath;
    });
}
class UnityCrashError extends Error {
    constructor(message, unityLog) {
        super(message);
        this.unityLog = unityLog;
        Object.setPrototypeOf(this, UnityCrashError.prototype);
    }
}
exports.UnityCrashError = UnityCrashError;
