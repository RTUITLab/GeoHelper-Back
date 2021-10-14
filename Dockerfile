FROM unityci/hub

RUN unity-hub install -v 2019.4.31f1
RUN yes y | unity-hub install-modules -v 2019.4.31f1 -m ios
RUN yes y | unity-hub install-modules -v 2019.4.31f1 -m android

RUN apt-get update
RUN apt-get install libgnutls30 curl gnupg -y
RUN curl -fsSLk https://deb.nodesource.com/setup_14.x | bash -

ENV UNITY_PATH=/opt/unity/editors/2019.4.31f1/Editor/Unity

# Unity activation
WORKDIR /usr/src/app

RUN ${UNITY_PATH} -batchmode -createManualActivationFile -logfile /dev/stdout -nographics; exit 0
ENV UNITY_ALF=/usr/src/app/Unity_v2019.4.31f1.alf

# Backend
RUN apt-get install nodejs -y

COPY package*.json ./

RUN npm ci

COPY . .
COPY mitm node_modules/@mitm

RUN mkdir uploads

EXPOSE 3001
CMD [ "npm", "start" ]
