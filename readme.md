# SharePoint JavaScript Helpers

**IN DEVELOPMENT, NOT READY FOR PRODUCTION USE**

SharePoint JavaScript Helpers (SJH) makes it easier to work with SharePoint lists through JavaScript.

SJH returns promises* and then standard JavaScript objects, not SharePoint enumerators or other exotic creatures, so it's easy to incorporate into your code.

This was built to be fully compatible with popular front-end libraries like React JS. Join the future of SharePoint front-end development.

## * Promise, what?

When you query the SharePoint API, the response is not immediate. Once the response comes back, you'll want to do something with it.

A promise tells SJH what to do once the response comes back.

## Compatibility

SharePoint:

- SharePoint 2010, 2013, or Office 365

JavaScript Libraries:

- jQuery

## Easy Setup

These steps work in SharePoint 2010, 2013, and Office 365.

If you're using SharePoint 2013 or Office 365, disable the Minimal Download Strategy site feature on any sites using this script.

Copy sharepoint-javascript-helpers.js in SiteAssets.

Create an HTML file in SiteAssets, and link it to a content editor web part on a page. In that HTML file, place the following code:

```html
<!-- Begin SJH initialization -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="../SiteAssets/sharepoint-javascript-helpers.js"></script>
<!-- End SJH initialization -->
```

You may need to adjust the path to sharepoint-javascript-helpers.js. The path above assumes the content editor web part is in SitePages or Pages.

## Testing

You can test that SJH is functioning by adding this to the end of the HTML file created in Easy Setup.

```html
<div id="sjh-test"></div>
<script>
SP.SOD.executeFunc("sp.js");
ExecuteOrDelayUntilScriptLoaded(sjhTest, "sp.js");
function sjhTest() {
	SharePoint.GetCurrentUserEmail().done(function(user) {
    $("#sjh-test").html("<p>Test succeeded. Hello, " + user + "!</p>");
    });
}
</script>
```

You should see a message inside the content editor web part with your e-mail address.

## Uses

SJH focuses on certain use cases. To request another, file an Issue on this GitHub repo.

### Get list items

```javascript
SharePoint.GetListItems(options)
```

#### Options
**list** (required)
  The name of the list on SharePoint, as it appears in the list URL.

  ex. "Documents"

**fields** (required)
  An array of fields to retrieve from the list.

  ex. ["Title", "Description"]

**query**
  A query to filter, sort, or limit the list items returned. It is written in CAML, Microsoft's preferred method for querying SharePoint lists.

  Example:

  ```
  '<View><Query><Where><Eq><FieldRef Name=\'Active\'/>' +
    '<Value Type=\'Boolean\'>1</Value></Eq></Where></Query></View>'"
  ```

  See [more examples of CAML](http://sharepoint-works.blogspot.com/2012/05/caml-query-tutorial-for-sharepoint.html).

  To return all items, don't specify this parameter or use null.

**site**
  The relative URL of the SharePoint site containing the list. If not specified, it defaults to the current site.

  ex. "/CoolStuff"

#### In practice:

Create a custom list called Test. It will start with just one column, Title. Add a couple of items to the list.

```javascript
SharePoint.GetListItems({list: "Test", fields: ["Title"]}).done(function(items) {
		var itemsAsList =  $.map(items, function(item) { return item["Title"]; }).join(", ");
		$("#sjh-test-getListItems").html("<p>Read list item test succeed. Here are the items from Test: " + itemsAsList);
	});
```
### Add an item to a list

```javascript
SharePoint.AddItem(options)
```

#### Options

**list** (required)
  The name of the list on SharePoint to which you'd like to add an item, as it appears in the list URL.

**data** (required)
  The data you'd like to add, as a JavaScript object.

  ex. {Title: "my new item", Description: "this is my new item"}

#### In practice:

Create a custom list called Test. It will start with just one column, Title.

```javascript
SharePoint.AddItem({list: "Test", data: {Title: "my new item"}}).done(function() {
    alert('success');
  });
```

### Get the current user's e-mail address

#### Options

**site**
  The relative URL of the SharePoint site containing the list. If not specified, it defaults to the current site.

  ex. "/CoolStuff"

#### In practice:

```javascript
SharePoint.GetCurrentUserEmail().done(function(email) {
    alert("Your e-mail address is " + email);
  });
```

## Inspirations

- Microsoft's [quick reference to SharePoint's JavaScript Client Side Object Model](https://msdn.microsoft.com/en-us/library/office/jj163201.aspx), which powers SJH.
- [SPServices](https://spservices.codeplex.com/), for pioneering and continuing to provide excellent JavaScript helpers for SharePoint.
