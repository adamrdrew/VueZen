(function(){
	
	var pageOne = {
		template: "	<div class='ui-page ui-page-active'>\
						<header class='ui-header'>\
							<h2 class='ui-title'>Page 1</h2>\
						</header>\
						<div class='ui-content content-padding'>\
							<p>Hello Page 1!</p><router-link to='/two'>Two</router-link>\
						</div>\
					</div>"
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
	
	var pageRouter = new VueRouter({routes: [		
         {path: '/one', component: pageOne},
         {path: '/two', component: pageTwo},
         {path: '*', redirect: '/one'}
	]});
	
	var vueApp = new Vue({
		el: "#app-mount",
		router: pageRouter
	});
	
}())