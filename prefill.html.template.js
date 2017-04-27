module.exports = ({ plugins, bundleCode }) => `<html>
<head>
<title>Open Codepen template</title>
</head>

<body>
<h1>Generating Codepen, please wait...</h1>
<form action="http://codepen.io/pen/define" method="POST">
	<input type="hidden" name="data" id="data">
	<input type="submit" value="Click here to manually open codepen template if not done automatically">
</form>

<script id="bundle">${bundleCode}</script>
<script>
	var bundleScript = document.getElementById("bundle").textContent;
	var data =  {
		title              : "PostCSS template with ${plugins.join(", ")}",
		description        : "You can use PostCSS syntax in the CSS panel of this codepen",
		html               : "<ul>PostCSS plugins enabled:${plugins.map(p => `<li>${p}</li>`)}</ul>",
		html_pre_processor : "none",
		css                : "/* Test your plugins here by writing some CSS that leverages the plugins */",
		css_pre_processor  : "none",
		css_starter        : "neither",
		css_prefix_free    : false,
		js                 : "/* PostCSS, ${plugins.join(', ')} */\\n" + bundleScript,
		js_pre_processor   : "none",
		js_modernizr       : false,
		js_library         : "",
		html_classes       : "",
		css_external       : "",
		js_external        : ""
	};

	var json = JSON.stringify(data)
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");

	document.getElementById("data").value = json;
	document.querySelector("form").submit();
</script>

</body>
</html>
`