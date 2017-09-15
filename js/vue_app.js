// This file is the central Vue stack code
// You will need to update this file in order to register
// new page components with the router, or when you want
// to make data model changes by extending the store


// Vuex global application store and state manager
// See https://vuex.vuejs.org/en/intro.html for more info
// This global store ensures that all of your app pages can
// share data, but in a controlled and safe way
const __VueZenStore = new Vuex.Store({
	state: {
		list: [],
		vuex_init: true,
		persistence: {
			directory: "documents",
			name: "vue_zen.json"
		}
	},
	getters: {
		list_length: function(state) {return state.list.count;},
		init: function(state) {return state.vuex_init;}
	},
	mutations: {
		add_list_item: function(state, item) {state.list.push(item);}
	}
});

// VueRouter page to route manager
// Allows for multi-page apps with easy view transitions and back button integration
// See https://router.vuejs.org/en/ for more information
// When you add new page components you need to add them here
const __VueZenRouter = new VueRouter({routes: [		
     {path: '/one', component: pageOne},
     {path: '/two', component: pageTwo},
     {path: '*', redirect: '/one'}
]});

// The top level Vue app. Mounted to #app-mount in index.html
// integrates with VueRouter and Vuex, allowing all
// child page components to share them
// See https://vuejs.org/v2/guide/ for more info
// Also handles top level events available to all pages
const __VueZenApp = new Vue({
	el: "#app-mount",
	store: __VueZenStore,
	router: __VueZenRouter,
	methods: {
		loadStateFile: function() {
			//TODO: Load the vuex state from a file
		},
		saveStateFile: function() {
			//TODO: Save the vuex state from a file
		}
	}
});

