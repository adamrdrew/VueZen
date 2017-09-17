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
* Tizen Studio
* Tizen Wearable 2.3.2

***Note**:* *VueZen currently supports Tizen wearable 2.3.2 and is distributed as a Wearable Web 2.3.2 Tizen Studio project template. The VueZen code should work fine on other versions of Tizen with little modification, but the project template is tied to 2.3.2.*

# Installation
1. Locate the Tizen Studio template directory on your system. For example, if you installed Tizen Studio to `/tizen-studio` the directory would be `/tizen-studio/platforms/tizen-2.3.2/wearable/samples/Template/Web`
2. Clone this repo into that directory
3. Go into the project directory and run npm install to pull in the node module dependencies for the SFC compiler
4. When you open Tizen Studio next VueZen will be available as a template for Wearable Web 2.3.2 