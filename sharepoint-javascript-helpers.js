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

SharePoint.AddListItem = function (list, data, site) {
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
      SharePoint.Error
  );
  return dfd.promise();
};

SharePoint.Error = function(sender, args) {
  var message = args.get_message() || "";
  var stackTrace = args.get_stackTrace() || "";
  alert('An error has occurred.' + '\n\n' + message +
  stackTrace);
};

SharePoint.GetListItems = function(options) {
  var dfd = $.Deferred();
  var SPContext = SharePoint.Utils.GetContext(options.site);
  var web = SPContext.get_web();
  var listObject = web.get_lists().getByTitle(options.list);
  var camlQuery = new SP.CamlQuery();
  camlQuery.set_viewXml(query);
  var ListItems = listObject.getItems(camlQuery);
  SPContext.load(ListItems, 'Include(' + options.fields + ')');
  SPContext.executeQueryAsync(function() {
    var listItemArray = [];
    var listItemEnumerator = ListItems.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();
      var listItemAsObject = {};
      $.each(options.fields, function(index, field) {
        listItemAsObject[field] = oListItem.get_item(field);
      });
      listItemArray.push(listItemAsObject);
    }
    dfd.resolve(listItemArray);
  }, SharePoint.Error);
  return dfd.promise();
};

SharePoint.GetCurrentUserEmail = function(site) {
  var dfd = $.Deferred();
  var SPContext = SharePoint.Utils.GetContext(site);
  var web = SPContext.get_web();
  var currentUser = web.get_currentUser();
  SPContext.load(currentUser);
  SPContext.executeQueryAsync(
    function(sender, args) {
      dfd.resolve(currentUser.get_email());
    },
    SharePoint.Error);
  return dfd.promise();
};
