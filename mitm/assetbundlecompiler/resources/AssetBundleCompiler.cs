using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;

public class AssetBundleCompiler : MonoBehaviour
{
    private static GLTFast.GltfImport gltf;

    [MenuItem("Assets/Build AssetBundle")]
    public static void Convert()
    {
        //=> Retrieve CLI arguments
        var args = GetCommandLineArgs();

        var assetBundleDirectory = args["cAssetBundleDirectory"][0];
        var assetBundleName = args["cAssetBundleName"][0];

        //=> Parametrize our build
        var ds = Path.DirectorySeparatorChar;

        var dirInfo = new DirectoryInfo($"Assets/Generated");

        var files = dirInfo.GetFiles("*.*", SearchOption.AllDirectories).ToList().FindAll(file => file.Extension != ".meta");
        LinkedList<string> paths = new LinkedList<string>();

        foreach (var file in files)
        {
            paths.AddLast("Assets" + file.FullName.Split(new string[] { "Assets" }, StringSplitOptions.None)[1]);
        }

        // Create assetbundles build maps for different platforms
        AssetBundleBuild[] andriodBuildMap = createBuildMap(assetBundleName + ".android", paths);
        AssetBundleBuild[] iosBuildMap = createBuildMap(assetBundleName + ".ios", paths);

        Debug.Log("Build android");
        BuildPipeline.BuildAssetBundles(assetBundleDirectory, andriodBuildMap, BuildAssetBundleOptions.None, BuildTarget.Android);
        Debug.Log("Build android");
        BuildPipeline.BuildAssetBundles(assetBundleDirectory, iosBuildMap, BuildAssetBundleOptions.None, BuildTarget.iOS);

        Debug.Log("FINISHED_BUILDING");
    }

    private static Dictionary<string, List<string>> GetCommandLineArgs()
    {
        var args = Environment.GetCommandLineArgs();
        var argsDict = new Dictionary<string, List<string>>();

        for (var i = 0; i < args.Length; i++)
        {
            if (!args[i].StartsWith("-")) continue;

            var argName = args[i].Substring(1);
            var argValues = new List<string>();

            argsDict[argName] = argValues;

            while (i + 1 < args.Length && !args[i + 1].StartsWith("-"))
            {
                argValues.Add(args[++i]);
            }
        }

        return argsDict;
    }

    public static AssetBundleBuild[] createBuildMap(string title, LinkedList<string> paths)
    {
        AssetBundleBuild[] buildMap = new AssetBundleBuild[1];
        buildMap[0].assetBundleName = title;
        buildMap[0].assetNames = paths.ToArray();
        return buildMap;
    }
}
