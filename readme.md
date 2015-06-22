# SharePoint JavaScript Helpers

SharePoint JavaScript Helpers (SJH) makes it easier to work with the SharePoint API through JavaScript.

SJH returns standard JavaScript objects, not SharePoint enumerators or other exotic creatures, so it's easy to incorporate into your code.

This was built to be fully compatible with popular front-end libraries like React JS. Join the future of SharePoint front-end development.

## Compatibility

SharePoint:

- SharePoint 2010, 2013, or Office 365

JavaScript Libraries:

- jQuery
- lodash

You can load libraries locally or through CDN prior to loading the JavaScript helpers.

For example:

## Setup

There's the easy way and the hard way to add JavaScript to a SharePoint page.

First, the easy way:

If you're using SharePoint 2013, disable the Minimal Download Strategy site feature.

Create a text file in SiteAssets, using SharePoint Designer. Call it myscripts.txt.

Seed the file with what you need for SJH, then add a test.

```
<!-- Begin SJH initialization -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.9.3/lodash.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="https://rawgit.com/csm123/sharepoint-javascript-helpers/master/sharepoint-javascript-helpers.js"></script>
<!-- End SJH initialization -->

<!-- Begin SJH test -->
<div id="sjh-test"></div>
<script>
SP.SOD.executeFunc("sp.js");
ExecuteOrDelayUntilScriptLoaded(sjhTest, "sp.js");
function sjhTest() {
	SharePoint.GetCurrentUserEmail().done(function(user) { $("#sjh-test").html("<p>Test succeeded. Hello, " + user + "!</p>"); });
}
</script>
<!-- End SJH test -->
```

Add a content editor web part, and link it to the file you created in SiteAssets.

Reload your page and confirm that the test passes. You should see a message inside the content editor web part with your e-mail address.

## Uses

SJH focuses on certain use cases. To request another, file an Issue on this GitHub repo.

### Get list items

### Add an item to a list

### Get the current user's e-mail address
