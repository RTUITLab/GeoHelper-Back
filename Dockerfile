FROM parker1331/unity3d

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
