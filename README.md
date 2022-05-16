# GeoHelper Back

> Node.js application having [GeoHelper-Front](https://github.com/RTUITLab/GeoHelper-Front) as a frontend

## Development run

### Configuration

First of all, you need to install MongoDB with enabled authorization and Node.js (opt. v14.17.6).

After setting up database, you have to define env variables:
+ `M_USER`: mongodb username
+ `M_PASS`: mongodb password
+ `M_HOST`: mongodb host name or IP address
+ `M_PORT`: port that mongodb is listening
+ `M_DB`: batabase name
+ `M_SECRET`: secret string that is used inside app
+ `PORT`: port where application will be launched
+ `A_USER`: name of default user
+ `A_PASS`: default user password
+ `UPLOAD_DIR`: directory for saving uploaded files
+ `GOOGLE_API_KEY`: Google Maps API key to access for DirectionsAPI

Another way to set up database is to define `M_URL` variable.

For correct work your also have to define `UNITY_PATH` env variable with path to Unity Editor.

In the end, run `npm install` to install all required dependencies.

### Running

To run this application run `npm start`.

## Run production build

Follow the steps from [Configuration](https://github.com/RTUITLab/GeoHelper-Back#configuration)

Execute `docker up --build -d` to run production build.

## Application setup

There are some simple steps to setup backend after run:

### Admin setup

Execute POST request `http://<backend_url>/api/v1/auth/setup` to create default user with credentials from `A_USER` and `A_PASS`.

### Unity setup

1. Use `https://<backend_url>/api/v1/license/unity.alf` to get generated license activation file.
2. Use `.alf` file to request a Unity license file (.ulf) from [Unity’s license server](https://license.unity3d.com/manual). 
3. Send POST request to `https://geohelper.rtuitlab.dev/api/v1/license/ulf` to activate Unity. Your request must have form-data with field `file` with `.ulf` file. **Don`t forget about your auth token**

## API Documentation

Description of GeoHelper Backend API is available [here](https://documenter.getpostman.com/view/8340120/T1LQfQfY).

## Unity usage

This service uses Unity3d to build Android and iOS AssetBundles from [glTG](https://www.khronos.org/gltf/) models in runtime. 

**Sources:**
1. [Unity Hub in Docker](https://hub.docker.com/r/unityci/hub) - parent Docker image used to install Unity Editor and modules inside Docker image
2. [Mitmadness](https://github.com/mitmadness) created js unity invoker that formed the basis of the AssetBundle building solution
3. [GLTFast](https://github.com/atteneder/glTFast) - unitypackage importing glTf models to Unity Editor

## Docker run
1. Build image
    ```bash
    docker build -t geohelper-back -f deploy/Dockerfile .
    ```
    or
    ```bash
    docker compose -f docker-compose.override.yml build
    ```
1. Run image
    ```bash
    docker run -d -p 3001:3001 geohelper-back
    ```
    or
    ```bash
    docker compose -f docker-compose.override.yml up -d
    ```
