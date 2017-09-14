const pageOne = {
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