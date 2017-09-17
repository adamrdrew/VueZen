<p align="center"><a href="https://vuejs.org" target="_blank"><img width="150"src="https://user-images.githubusercontent.com/6499014/30522645-9ab8063a-9ba1-11e7-8a4c-f796f4b60450.png"></a></p>

# VueZen 
VueZen brings the power and simplicity of the VueJS stack to Tizen. With VueZen you can develop Tizen apps composed of reactive Vue components while retaining the native look and feel of Tau UI elements. Additionally, VueZen provides a small library of helpful Javascript classes that make it easier to work with the Tizen web app framework as well a simplified Vue SFC compiler. VueZen comes packaged as a project template for Tizen Studio so you can easily create your own VueZen powered apps.

# Features
* VueJS component framework
* VueX state manager
* Vue-Router page routing with hardware back-button integration
* Vue Single File Component (SFC) compiler
* VueZen.Ajax simple $.ajax() replacement
* VueZen.FileManager simplified high level Tizen file IO

# Requirements
* NodeJS
* Grunt
* Tizen Studio
* Tizen Wearable 2.3.2

***Note***: *VueZen currently supports Tizen wearable 2.3.2 and is distributed as a Wearable Web 2.3.2 Tizen Studio project template. The VueZen code should work fine on other versions of Tizen with little modification, but the project template is tied to 2.3.2.*

# Installation
1. Locate the Tizen Studio template directory on your system. For example, if you installed Tizen Studio to `/tizen-studio` the directory would be `/tizen-studio/platforms/tizen-2.3.2/wearable/samples/Template/Web`
2. Clone this repo into that directory

# Creating New VueZen Projects
After installing the template you will be able to create VueZen projects from within Eclipse.

1. File -> New -> Tizen Project
2. Template
3. Wearable 2.3.2
4. Web
5. VueZen

After creating the project you will need to perform some tasks at the command line in order to complete the VueZen environment setup.

1. Go the project directory for your new project. It will be in your workspace directory.
2. Install dependencies: 
     - `$ npm install`
3. Compile the components: 
    - `$ grunt vuecompile`
4. Modify the Ecplipse project: 
    - `$ grunt project_filter`
5. If your project is already open in Eclipse right-click it in the *Project Browser* and click *Refresh*

***Note:*** *Step 4 adds a file filter to the Ecplipse project file to ignore the node_modules diretory. Without this step the Tizen project will fail to build and launch because Eclipse will attempt to include everything in node_modules. Editing Eclipse project files outside of Eclipse can be risky, so you can always skip step 4 and do it yourself via the following steps:*

### Optional Steps if you don't run the project_filter task
1. Make sure you read the above note and don't blindly follow these steps because you are in learning mode and you see an ordered list
2. In the `Project Explorer` right click the project
3. Click `Properties`
4. Expand `Resources`
5. Click `Resource Filters`
6. Click `Add Filter`
7. Set these properties:
    - Filter Type: Exclude All
    - Applies to: Folders
    - File and Folder Attributes
    - Filter Details:
        - Name
        - Matches
        - node_modules

# Project Structure
* `components/` VueJS component directory
* `components/compiled.js` Components are compiled into this js file
* `css/style.css` CSS file for your own styles
* `js/hardware_handlers.js` Sets up low battery and back button support
* `js/vue_app.js` Sets up the Vue stack and bootstraps the app
* `lib/` Vue, Tau, and VueZen library files
* `lib/vuezen.js` VueZen helper classes
* `tasks/compiler.js` VueJS SFC compiler grunt task
* `tasks/project_filter.js` Ecplipse project settings grunt task
* `config.xml` Tizen application config
* `Gruntfile.js` Grunt config
* `icon.png` Your app's icon
* `index.html` App entry point and includes
* `package.json` NPM package file

# Components
