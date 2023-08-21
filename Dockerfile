# set the base image as the latest node image
FROM node:18-alpine

# set the working directory
WORKDIR /home/saif/fe-makan/backend 

# copy the package.json file to the working directory
COPY package*.json ./

# install the dependencies
RUN npm install

# copy the rest of the files to the working directory
COPY . .

# set the environment variables for firebase
ENV GOOGLE_APPLICATION_CREDENTIALS=/home/saif/fe-makan/backend/nextF.json
ENV GOOGLE_CLOUD_PROJECT=next-397f1

# expose port 3000
EXPOSE 3000

# run the app
CMD ["npm", "start"]
