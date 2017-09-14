
var pageOne = {
	template: "	<div class='ui-page ui-page-active'>\
					<header class='ui-header'>\
						<h2 class='ui-title'>Page 1</h2>\
					</header>\
					<div class='ui-content content-padding'>\
						<p>Hello Page 1!</p><p> Vuex Init: {{vuex_init}} </p><router-link to='/two'>Two</router-link>\
					</div>\
				</div>",
	computed: {
		vuex_init: function() {
			return this.$store.getters.init;
		}
	}
};

var pageTwo = {
		template: "	<div class='ui-page ui-page-active'>\
						<header class='ui-header'>\
							<h2 class='ui-title'>Page 2</h2>\
						</header>\
						<div class='ui-content content-padding'>\
							<p>Hello Page 2!</p><router-link to='/one'>One</router-link>\
						</div>\
					</div>"
};

const __VueZenStore = new Vuex.Store({
	state: {
		list: [],
		vuex_init: true
	},
	getters: {
		list_length: function(state) {return state.list.count;},
		init: function(state) {return state.vuex_init;}
	},
	mutations: {
		add_list_item: function(state, item) {state.list.push(item);}
	}
});

const __VueZenRouter = new VueRouter({routes: [		
     {path: '/one', component: pageOne},
     {path: '/two', component: pageTwo},
     {path: '*', redirect: '/one'}
]});

const __VueZenApp = new Vue({
	el: "#app-mount",
	store: __VueZenStore,
	router: __VueZenRouter
});

