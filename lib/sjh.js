require('es6-promise').polyfill();

SJH = {};

SJH.Config = {errorAlerts: true};

SJH.Utils = {};

SJH.Utils.GetContext = function(site) {
  if (site) {
    return new SP.ClientContext(site);
  } else {
    return new SP.ClientContext.get_current();
  }
};

SJH.spread = function(callback) {
  /* From Axios - https://github.com/mzabriskie/axios/ */
  return function (arr) {
    callback.apply(null, arr);
  };
}

SJH.all = function (promises) {
  /* From Axios - https://github.com/mzabriskie/axios/ */
  return Promise.all(promises);
};

SJH.UpdateListItem = function (options) {
  return new Promise(function(resolve, reject) {
    var SPContext = SJH.Utils.GetContext(options.site);
    var oList = SPContext.get_web().get_lists().getByTitle(options.list);
    var oListItem = oList.getItemById(options.id);

    for (var key in options.data) {
      if (options.data.hasOwnProperty(key)) {
        oListItem.set_item(key, options.data[key]);
      }
    }

    oListItem.update();

    SPContext.executeQueryAsync(
        function() { resolve(); },
        SJH.Error
    );
  });
};

SJH.AddListItem = function (options) {
  return new Promise(function(resolve, reject) {
    var SPContext = SJH.Utils.GetContext(options.site);
    var oList = SPContext.get_web().get_lists().getByTitle(options.list);
    var itemCreateInfo = new SP.ListItemCreationInformation();
    var oListItem = oList.addItem(itemCreateInfo);

    for (var key in options.data) {
      if (options.data.hasOwnProperty(key)) {
        oListItem.set_item(key, options.data[key]);
      }
    }

    oListItem.update();

    SPContext.load(oListItem); /* loading the item gets its ID */

    SPContext.executeQueryAsync(
        function() { resolve(oListItem.get_id()); }, /* return the ID */
        SJH.Error
    );
  });
};

SJH.Error = function(sender, args) {
  var message = args.get_message() || "";
  var stackTrace = args.get_stackTrace() || "";

  if (SJH.Config.errorAlerts) {
    alert('An error has occurred.' + '\n\n' + message +
    stackTrace);
  }

  sender.reject(message, stackTrace);
};

SJH.GetListItems = function(options) {
  return new Promise(function(resolve, reject) {
    var SPContext = SJH.Utils.GetContext(options.site);
    var web = SPContext.get_web();
    var listObject = web.get_lists().getByTitle(options.list);

    var camlQuery = new SP.CamlQuery();

    camlQuery.set_viewXml(options.query);

    var ListItems = listObject.getItems(camlQuery);

    SPContext.load(ListItems, 'Include(' + options.fields + ')');




    SPContext.executeQueryAsync(function() {
      var listItemArray = [];
      var listItemEnumerator = ListItems.getEnumerator();


      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var listItemAsObject = {};
        for (index = 0; index < options.fields.length; ++index) {
          if (options.fields[index].toLowerCase() === "id") {
            listItemAsObject[options.fields[index]] = oListItem.get_id();
          } else if (options.fields[index].toLowerCase() === "displayname") {
            listItemAsObject[options.fields[index]] = oListItem.get_displayName();
          } else {
            listItemAsObject[options.fields[index]] = oListItem.get_item(options.fields[index]);
          }        
        }
        listItemAsObject.object = oListItem;
        listItemArray.push(listItemAsObject);
      }
      resolve(listItemArray);

    }, SJH.Error);

  });
};

SJH.GetCurrentUserEmail = function(options) {
  return new Promise(function(resolve, reject) {
    var SPContext = SJH.Utils.GetContext((options && options.site) || null);
    var web = SPContext.get_web();
    var currentUser = web.get_currentUser();

    SPContext.load(currentUser);

    SPContext.executeQueryAsync(
      function(sender, args) {
        resolve(currentUser.get_email());
      },
      SJH.Error);
  });
};
