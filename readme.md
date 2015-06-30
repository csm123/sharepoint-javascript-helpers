# SharePoint JavaScript Helpers

**IN DEVELOPMENT, NOT READY FOR PRODUCTION USE**

SharePoint JavaScript Helpers (SJH) makes it easier to work with SharePoint lists through JavaScript.

## Capabilities

SJH's simple features can be combined to produce complex SharePoint-based applications.

- Get list items
- Add item(s) to a list
- Get the current user's e-mail address

## Compatibility

SharePoint:

- SharePoint 2010, 2013, or Office 365

JavaScript Libraries:

- jQuery

## Easy Setup

These steps work in SharePoint 2010, 2013, and Office 365.

1. If you're using SharePoint 2013 or Office 365, disable the Minimal Download Strategy site feature on any sites using this script.

2. Copy sharepoint-javascript-helpers.js in SiteAssets.

3. Create an HTML file in SiteAssets, and link it to a content editor web part on a page. In that HTML file, place the following code:
	```html
	<!-- Begin SJH initialization -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	<script src="../SiteAssets/sharepoint-javascript-helpers.js"></script>
	<!-- End SJH initialization -->
	```
You may need to adjust the path to sharepoint-javascript-helpers.js. The path above assumes the content editor web part is in SitePages or Pages.

## Uses

SJH focuses on certain use cases. To request another, file an Issue on this GitHub repo.

**All example code below can be placed after the Easy Setup code above, within the same content editor web part.**

### Get list items

```javascript
SharePoint.GetListItems({
    list: "Test",	/* The name of the list on SharePoint, as it appears in the list URL. */
    fields: ["Title"],	/* An array of fields to retrieve from the list. */
    query: "<View><Query><Where><Eq><FieldRef Name='Active'/><Value Type='Boolean'>1</Value></Eq></Where></Query></View>",	 	/* OPTIONAL: A query to filter, sort, or limit the list items returned. It is written in CAML, Microsoft's preferred method for querying SharePoint lists. Leave this out to return all. */
    site: "/SomeSite"	/* The relative URL of the SharePoint site containing the list. Leave this out to use the current site. */
}).done(function(items) {
    /* Do something with the array 'items' */
});
```

#### Example

Create a custom list called Test. It will start with just one column, Title. Add a couple of items to the list.

```javascript
SharePoint.GetListItems({
    list: "Test",
    fields: ["Title"]
}).done(function(items) {
    var itemsAsList = $.map(items, function(item) {
        return item["Title"];
    }).join(", ");
    alert("Read list item test succeed. Here are the items from Test: " +
        itemsAsList);
});
```
### Add an item to a list

```javascript
SharePoint.AddListItem({
    list: "Test",	/* The name of the list on SharePoint, as it appears in the list URL. */
    data: {	/* The data you'd like to add, as a JavaScript object. Field names must match the system names of the fields (see section below called List and Field Names. */
        Title: "my new item",
        Description: "This item rocks"
    },
    site: "/SomeSite"	/* The relative URL of the SharePoint site containing the list. Leave this out to use the current site. */
}).done(function() {
    /* Do something once this succeeds */
});
```

#### Example

Create a custom list called Test. It will start with just one column, Title.

```javascript
SharePoint.AddListItem({
    list: "Test",
    data: {
        Title: "my new item"
    }
}).done(function() {
    alert('success');
});
```

### Update an item in a list

```javascript
SharePoint.UpdateListItem({
    list: "Test",	/* The name of the list on SharePoint, as it appears in the list URL. */
    id: 1,	/* The ID of the list item to update */
    data: {	/* The data you'd like to update, as a JavaScript object. Field names must match the system names of the fields (see section below called List and Field Names. */
        Title: "my updated item"
    },
    site: "/SomeSite"	/* The relative URL of the SharePoint site containing the list. Leave this out to use the current site. */
}).done(function() {
    /* Do something once this succeeds */
});
```

#### Example

Create a custom list called Test.

```javascript
SharePoint.AddListItem({
    list: "Test",
    data: {
        Title: "test item"
    }
}).done(function(id) {
    alert("added item");
    /* AddListItem returns the ID of the item added, which we'll use to update that item */
    SharePoint.UpdateListItem({
        list: "Test",
        id: id,	
        data: {
            Title: "updated test item"
        }
    }).done(function() {
        alert("updated item");
    });
});
```

### Get the current user's e-mail address

```javascript
SharePoint.GetCurrentUserEmail({
    site: "/SomeSite"	 /* OPTIONAL: The current site is used if this is not specified. */
}).done(function(email) {
    /* Do something with the email address in email */
});
```

#### Example

```javascript
SharePoint.GetCurrentUserEmail().done(function(email) {
    alert("Your e-mail address is " + email);
});
```

## React

SJH's simplicity makes it compatible with modern JavaScript libraries like [React](http://facebook.github.io/react/).

Here's is SJH and React combined, ready to run in a content editor web part:

```html
<!-- Place Easy Setup code here from above -->

<script src="https://fb.me/react-0.13.3.js"></script>
<script src="https://fb.me/JSXTransformer-0.13.3.js"></script>

<div id="sjh-test-react"></div>

<script type="text/jsx">
var Test = React.createClass({
  render: function() {
	var items = this.props.items.map(function(item) {
		return <li>{item.Title}</li>;
	});
	return (
	<div>
		<p>Here are the items in the list, rendered with React:</p>
		<ul>
			{items}
		</ul>
	</div>
	);
  }
});

SharePoint.GetListItems({list: "Test", fields: ["Title"]}).done(function(items) {
	React.render(<Test items={items}/>, document.getElementById("sjh-test-react"));
});
</script>
```

## List and field names

Always use a list's **current** title, as specified in List Settings.

Always use a field's **system** name, which is often different from its displayed name. To find a field's system name, go to List Settings and click on that field. The field's system name will be in the URL.

## Roadmap

For upcoming features, see the Issues tab. Feel free to submit your own!

## Inspirations

- Microsoft's [quick reference to SharePoint's JavaScript Client Side Object Model](https://msdn.microsoft.com/en-us/library/office/jj163201.aspx), which powers SJH.
- [SPServices](https://spservices.codeplex.com/), for pioneering and continuing to provide excellent JavaScript helpers for SharePoint.
