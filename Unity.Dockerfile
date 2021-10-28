FROM unityci/hub

RUN unity-hub install -v 2019.4.31f1
RUN yes y | unity-hub install-modules -v 2019.4.31f1 -m ios
RUN yes y | unity-hub install-modules -v 2019.4.31f1 -m android

RUN apt-get update
RUN apt-get install libgnutls30 curl gnupg -y
RUN curl -fsSLk https://deb.nodesource.com/setup_14.x | bash -

RUN mkdir /tmp/ProjectTemplate

COPY AssetBundleCompiler/ /tmp/ProjectTemplate/

ENV UNITY_PATH=/opt/unity/editors/2019.4.31f1/Editor/Unity
