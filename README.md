<p align="center"><a href="https://vuejs.org" target="_blank"><img width="150"src="https://user-images.githubusercontent.com/6499014/30522645-9ab8063a-9ba1-11e7-8a4c-f796f4b60450.png"></a></p>

# VueZen 
VueZen brings the power and simplicity of the VueJS stack to Tizen. With VueZen you can develop Tizen apps composed of reactive Vue components while retaining the native look and feel of Tau UI elements. Additionally, VueZen provides a small library of helpful Javascript classes that make it easier to work with the Tizen web app framework as well a simplified Vue SFC compiler. VueZen comes packaged as a project template for Tizen Studio so you can easily create your own VueZen powered apps.

# Features
* [VueJS](https://vuejs.org/) component framework
* [VueX](https://vuex.vuejs.org/) state manager
* [Vue-Router](https://github.com/vuejs/vue-router) page routing with hardware back-button integration
* Vue Single File Component (SFC) compiler
* VueZen helper library

# Requirements
* [NodeJS](https://nodejs.org/en/)
* [Grunt](https://gruntjs.com/api/grunt.task)
* [Tizen Studio](https://developer.tizen.org/development/tizen-studio/download)
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
    - `$ grunt compile`
4. Modify the Ecplipse project: 
    - `$ grunt modules`
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
* `css/` CSS files
* `js/` App code
* `lib/` Vue, Tau, and VueZen library files
* `tasks/` Grunt tasks
* `index.html` App entry point and includes

# Components
Components are the building blocks of VueZen apps. They encapsulate presentation, state, and logic into individual logical units. Components are reactive, allowing UI elements to be bound to data, thus eliminating manual DOM manipulation. VueZen's component system is powered by VueJS. It is recomended that you have asolid understanding of VueJS before jumping into VueZen.

### Component Generator
To create a new component run the `add` grunt task. This task requires 3 arguments:

* Component name (String) : The name for your component. Name must be valid for Javascript symbols. 
* Top Level (Boolean) : Defines whether the component should be tied into the routing system.
* Default Route (Boolean) : Defines whether this component should be the default shown when the app launches

The arguments are positional, and all three are required. Example:

```$ grunt add:pageOne:true:false```

That will create a new component: `components/pageOne.vue`. 

### Component Files
VueZen uses component file format similar to [Vue SFCs](https://vuejs.org/v2/guide/single-file-components.html), but with some differences due to VueZen's different environment, tooling, and requirements. Example:

```html
<name>newPage</name>
<top-level>true</top-level>
<default>false</default>

<template>
	<div>
		Hello {{place}}!
	</div>
</template>

<script>
    {
        data: {
            place: "World!"
        }
    }
</script>
```

The first three elements map to the generator task arguments. The template element contains the markup for your component's UI. The script element contains the state and methods of yur component.

In the first alpha release of VueZen there are a number of shortcomings to VueZen's component files format:
- There is no `<style>` element. CSS must be defined in `css/styles.css`
- HTML and Javascript preprocessors are not supported

### Compilation
The `compile` grunt task compiles the component files into a single Javascript file that is included in your app. That means that whenever you make a change to your component files you must recompile the components before running the project:

`$ grunt compile`

# Router
Tizen Web Apps are just that: web apps. As such, Tizen apps switch between pages via links, just like normal web pages. VueZen uses Vue Router to bind components to virtual routes. Thus, you'll enable navigation in your app using links between routes that map to components. However, rather than the familiar `<a href>` element to navigate between pages VueZen uses `<router-link to="componentName">` 

Routes are defined in the component files via the elements described above: `name`, `top-level`, and `default`. Only components with `top-level` set to true will be added to the router. This is because components can be nested and reused, thus we only want components that correspond to "pages" or "screens" in our app added to the router.

### Example:

```
$ grunt add:pageOne:true:true
$ grunt add:pageTwo:true:false
$ grunt add:navList:false:false
```

#### components/navList.vue
```html
<template>
    <div class="ui-content content-padding">
        <ul class="ui-listview">
            <li v-for="route in routeList"><router-link v-bind:to='route.to'>{{route.label}}</router-link></li>
        </ul>
    </div>
</template>
<script>
{props: ['routeList']}
</script>
```

#### components/pageOne.vue
```html
<template>
<div>
    <div class='ui-page ui-page-active'>
        <navList v-bind:routeList="link"/>
    </div>
</div>
</template>
<script>
    {data: {
            link: { to: 'pageTwo', label: 'Go to 2'}
        }}
</script>
```

#### components/pageTwo.vue
```html
<template>
<div>
    <div class='ui-page ui-page-active'>
        <navList v-bind:routeList="link"/>
    </div>
</div>
</template>
<script>
    {data: {
            link: { to: 'pageOne', label: 'Go to 1'}
        }}
</script>
```
The above example contains 3 components. pageOne and pageTwo are both top level components which are hooked up to the router. pageOne is default, so it will load on app start. navList is not top level and is thus available for use anywhere else in the component graph. pageOne and pageTwo both contain their own instances of navList. Both pageOne and pageTwo use `router-link` to navigate between screens.
