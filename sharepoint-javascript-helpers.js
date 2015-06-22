/*  SharePoint JavaScript Helpers
    Dependencies: lodash, jQuery
    Compatible with: SharePoint 2010, SharePoint 2013, SharePoint on Office 365
*/

var SharePoint = {};

SharePoint.Utils = {};

SharePoint.Utils.GetContext = function(site) {
  if (site) {
    return new SP.ClientContext(site);
  } else {
    return new SP.ClientContext.get_current();
  }
};

SharePoint.AddItem = function (site, list, data) {
  /* .resolve(item) */
  var dfd = $.Deferred();
  var SPContext = SharePoint.Utils.GetContext(site);

  var oList = SPContext.get_web().get_lists().getByTitle(list);

  var itemCreateInfo = new SP.ListItemCreationInformation();
  var oListItem = oList.addItem(itemCreateInfo);

  $.each(data, function(key, value) {
    oListItem.set_item(key, value);
    });

  oListItem.update();

  SPContext.load(oListItem);
  SPContext.executeQueryAsync(
      function() { dfd.resolve(); },
      Function.createDelegate(this, SharePoint.Error)
  );

  return dfd.promise();
};

SharePoint.Error = function(sender, args) {
  var message = args.get_message() || "";
  var stackTrace = args.get_stackTrace() || "";
  alert('An error has occurred.' + '\n\n' + message +
  stackTrace);
};

SharePoint.GetListItems = function(listName, query,
  fields, site) {
  var dfd = $.Deferred(function() {
    var SPContext = SharePoint.Utils.GetContext(site);
    var web = SPContext.get_web();
    var list = web.get_lists().getByTitle(listName);
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(query);
    var ListItems = list.getItems(camlQuery);
    SPContext.load(ListItems, 'Include(' + fields + ')');
    SPContext.executeQueryAsync(function() {
      var listItemArray = [];
      var listItemEnumerator = ListItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var listItemAsObject = {};
        $.each(fields, function(index, field) {
          listItemAsObject[field] = oListItem.get_item(field);
        });
        listItemArray.push(listItemAsObject);
      }
      dfd.resolve(listItemArray);
    }, SharePoint.Error);
  });
  return dfd.promise();
};

SharePoint.GetCurrentUserEmail = function() {
  var dfd = $.Deferred();
  var context = new SP.ClientContext('/');
  var website = context.get_web();
  var currentUser = website.get_currentUser();
  context.load(currentUser);
  context.executeQueryAsync(Function.createDelegate(this,
    function(sender, args) {
      dfd.resolve(currentUser.get_email());
    }),
  Function.createDelegate(this, SharePoint.Error));
  return dfd.promise();
};
