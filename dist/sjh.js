!function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){t.exports=n(1)},function(t,e,n){n(2).polyfill(),SJH={},SJH.Config={errorAlerts:!0},SJH.Utils={},SJH.Utils.getContext=function(t){return t?new SP.ClientContext(t):new SP.ClientContext.get_current},SJH.spread=function(t){return function(e){t.apply(null,e)}},SJH.all=function(t){return Promise.all(t)},SJH.addListItem=function(t){return new Promise(function(e,n){var r=SJH.Utils.getContext(t.site),i=r.get_web().get_lists().getByTitle(t.list),o=new SP.ListItemCreationInformation,u=i.addItem(o);for(var s in t.data)t.data.hasOwnProperty(s)&&u.set_item(s,t.data[s]);u.update(),r.load(u),r.executeQueryAsync(function(){e(u.get_id())},SJH.error.bind(this))})},SJH.getListItems=function(t){return new Promise(function(e,n){var r=SJH.Utils.getContext(t.site),i=r.get_web(),o=i.get_lists().getByTitle(t.list),u=new SP.CamlQuery;u.set_viewXml(t.query);var s=o.getItems(u);r.load(s,"Include("+t.fields+")"),r.executeQueryAsync(function(){for(var n=[],r=s.getEnumerator();r.moveNext();){var i=r.get_current(),o={};for(index=0;index<t.fields.length;++index)"id"==t.fields[index].toLowerCase()?o[t.fields[index]]=i.get_id():"displayname"==t.fields[index].toLowerCase()?o[t.fields[index]]=i.get_displayName():o[t.fields[index]]=i.get_item(t.fields[index]);o.object=i,n.push(o)}e(n)},SJH.error.bind(this))})},SJH.updateListItem=function(t){return new Promise(function(e,n){var r=SJH.Utils.getContext(t.site),i=r.get_web().get_lists().getByTitle(t.list),o=i.getItemById(t.id);for(var u in t.data)t.data.hasOwnProperty(u)&&o.set_item(u,t.data[u]);o.update(),r.executeQueryAsync(function(){e()},SJH.error.bind(this))})},SJH.deleteListItem=function(t){return new Promise(function(e,n){var r=SJH.Utils.getContext(t.site),i=r.get_web().get_lists().getByTitle(t.list),o=i.getItemById(t.id);o.deleteObject(),r.executeQueryAsync(function(){e()},SJH.error.bind(this))})},SJH.getCurrentUserEmail=function(t){return new Promise(function(e,n){var r=SJH.Utils.getContext(t&&t.site||null),i=r.get_web(),o=i.get_currentUser();r.load(o),r.executeQueryAsync(function(t,n){e(o.get_email())},SJH.error.bind(this))})},SJH.error=function(t,e){var n=e&&e.get_message()||"",r=e&&e.get_stackTrace()||"";SJH.Config.errorAlerts&&alert("An error has occurred.\n\n"+n+r),this.reject&&this.reject(n,r)}},function(t,e,n){var r;(function(t,i,o,u){/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
	 * @version   2.3.0
	 */
(function(){"use strict";function s(t){return"function"==typeof t||"object"==typeof t&&null!==t}function c(t){return"function"==typeof t}function a(t){return"object"==typeof t&&null!==t}function l(t){$=t}function f(t){V=t}function d(){var e=t.nextTick,n=t.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);return Array.isArray(n)&&"0"===n[1]&&"10"===n[2]&&(e=i),function(){e(v)}}function p(){return function(){X(v)}}function m(){var t=0,e=new et(v),n=document.createTextNode("");return e.observe(n,{characterData:!0}),function(){n.data=t=++t%2}}function h(){var t=new MessageChannel;return t.port1.onmessage=v,function(){t.port2.postMessage(0)}}function _(){return function(){setTimeout(v,1)}}function v(){for(var t=0;R>t;t+=2){var e=it[t],n=it[t+1];e(n),it[t]=void 0,it[t+1]=void 0}R=0}function y(){try{var t=n(6);return X=t.runOnLoop||t.runOnContext,p()}catch(e){return _()}}function g(){}function w(){return new TypeError("You cannot resolve a promise with itself")}function b(){return new TypeError("A promises callback cannot return that same promise.")}function x(t){try{return t.then}catch(e){return ct.error=e,ct}}function S(t,e,n,r){try{t.call(e,n,r)}catch(i){return i}}function T(t,e,n){V(function(t){var r=!1,i=S(n,e,function(n){r||(r=!0,e!==n?C(t,n):J(t,n))},function(e){r||(r=!0,P(t,e))},"Settle: "+(t._label||" unknown promise"));!r&&i&&(r=!0,P(t,i))},t)}function A(t,e){e._state===ut?J(t,e._result):e._state===st?P(t,e._result):E(e,void 0,function(e){C(t,e)},function(e){P(t,e)})}function I(t,e){if(e.constructor===t.constructor)A(t,e);else{var n=x(e);n===ct?P(t,ct.error):void 0===n?J(t,e):c(n)?T(t,e,n):J(t,e)}}function C(t,e){t===e?P(t,w()):s(e)?I(t,e):J(t,e)}function H(t){t._onerror&&t._onerror(t._result),j(t)}function J(t,e){t._state===ot&&(t._result=e,t._state=ut,0!==t._subscribers.length&&V(j,t))}function P(t,e){t._state===ot&&(t._state=st,t._result=e,V(H,t))}function E(t,e,n,r){var i=t._subscribers,o=i.length;t._onerror=null,i[o]=e,i[o+ut]=n,i[o+st]=r,0===o&&t._state&&V(j,t)}function j(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var r,i,o=t._result,u=0;u<e.length;u+=3)r=e[u],i=e[u+n],r?k(n,r,i,o):i(o);t._subscribers.length=0}}function L(){this.error=null}function U(t,e){try{return t(e)}catch(n){return at.error=n,at}}function k(t,e,n,r){var i,o,u,s,a=c(n);if(a){if(i=U(n,r),i===at?(s=!0,o=i.error,i=null):u=!0,e===i)return void P(e,b())}else i=r,u=!0;e._state!==ot||(a&&u?C(e,i):s?P(e,o):t===ut?J(e,i):t===st&&P(e,i))}function O(t,e){try{e(function(e){C(t,e)},function(e){P(t,e)})}catch(n){P(t,n)}}function B(t,e){var n=this;n._instanceConstructor=t,n.promise=new t(g),n._validateInput(e)?(n._input=e,n.length=e.length,n._remaining=e.length,n._init(),0===n.length?J(n.promise,n._result):(n.length=n.length||0,n._enumerate(),0===n._remaining&&J(n.promise,n._result))):P(n.promise,n._validationError())}function M(t){return new lt(this,t).promise}function Q(t){function e(t){C(i,t)}function n(t){P(i,t)}var r=this,i=new r(g);if(!G(t))return P(i,new TypeError("You must pass an array to race.")),i;for(var o=t.length,u=0;i._state===ot&&o>u;u++)E(r.resolve(t[u]),void 0,e,n);return i}function F(t){var e=this;if(t&&"object"==typeof t&&t.constructor===e)return t;var n=new e(g);return C(n,t),n}function N(t){var e=this,n=new e(g);return P(n,t),n}function Y(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function q(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function D(t){this._id=ht++,this._state=void 0,this._result=void 0,this._subscribers=[],g!==t&&(c(t)||Y(),this instanceof D||q(),O(this,t))}function K(){var t;if("undefined"!=typeof o)t=o;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(e){throw new Error("polyfill failed because global object is unavailable in this environment")}var n=t.Promise;(!n||"[object Promise]"!==Object.prototype.toString.call(n.resolve())||n.cast)&&(t.Promise=_t)}var W;W=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var X,$,z,G=W,R=0,V=({}.toString,function(t,e){it[R]=t,it[R+1]=e,R+=2,2===R&&($?$(v):z())}),Z="undefined"!=typeof window?window:void 0,tt=Z||{},et=tt.MutationObserver||tt.WebKitMutationObserver,nt="undefined"!=typeof t&&"[object process]"==={}.toString.call(t),rt="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,it=new Array(1e3);z=nt?d():et?m():rt?h():void 0===Z?y():_();var ot=void 0,ut=1,st=2,ct=new L,at=new L;B.prototype._validateInput=function(t){return G(t)},B.prototype._validationError=function(){return new Error("Array Methods must be provided an Array")},B.prototype._init=function(){this._result=new Array(this.length)};var lt=B;B.prototype._enumerate=function(){for(var t=this,e=t.length,n=t.promise,r=t._input,i=0;n._state===ot&&e>i;i++)t._eachEntry(r[i],i)},B.prototype._eachEntry=function(t,e){var n=this,r=n._instanceConstructor;a(t)?t.constructor===r&&t._state!==ot?(t._onerror=null,n._settledAt(t._state,e,t._result)):n._willSettleAt(r.resolve(t),e):(n._remaining--,n._result[e]=t)},B.prototype._settledAt=function(t,e,n){var r=this,i=r.promise;i._state===ot&&(r._remaining--,t===st?P(i,n):r._result[e]=n),0===r._remaining&&J(i,r._result)},B.prototype._willSettleAt=function(t,e){var n=this;E(t,void 0,function(t){n._settledAt(ut,e,t)},function(t){n._settledAt(st,e,t)})};var ft=M,dt=Q,pt=F,mt=N,ht=0,_t=D;D.all=ft,D.race=dt,D.resolve=pt,D.reject=mt,D._setScheduler=l,D._setAsap=f,D._asap=V,D.prototype={constructor:D,then:function(t,e){var n=this,r=n._state;if(r===ut&&!t||r===st&&!e)return this;var i=new this.constructor(g),o=n._result;if(r){var u=arguments[r-1];V(function(){k(r,i,u,o)})}else E(n,i,t,e);return i},"catch":function(t){return this.then(null,t)}};var vt=K,yt={Promise:_t,polyfill:vt};n(7).amd?(r=function(){return yt}.call(e,n,e,u),!(void 0!==r&&(u.exports=r))):"undefined"!=typeof u&&u.exports?u.exports=yt:"undefined"!=typeof this&&(this.ES6Promise=yt),vt()}).call(this)}).call(e,n(3),n(4).setImmediate,function(){return this}(),n(5)(t))},function(t,e){function n(){a=!1,u.length?c=u.concat(c):l=-1,c.length&&r()}function r(){if(!a){var t=setTimeout(n);a=!0;for(var e=c.length;e;){for(u=c,c=[];++l<e;)u[l].run();l=-1,e=c.length}u=null,a=!1,clearTimeout(t)}}function i(t,e){this.fun=t,this.array=e}function o(){}var u,s=t.exports={},c=[],a=!1,l=-1;s.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];c.push(new i(t,e)),1!==c.length||a||setTimeout(r,0)},i.prototype.run=function(){this.fun.apply(null,this.array)},s.title="browser",s.browser=!0,s.env={},s.argv=[],s.version="",s.versions={},s.on=o,s.addListener=o,s.once=o,s.off=o,s.removeListener=o,s.removeAllListeners=o,s.emit=o,s.binding=function(t){throw new Error("process.binding is not supported")},s.cwd=function(){return"/"},s.chdir=function(t){throw new Error("process.chdir is not supported")},s.umask=function(){return 0}},function(t,e,n){(function(t,r){function i(t,e){this._id=t,this._clearFn=e}var o=n(3).nextTick,u=Function.prototype.apply,s=Array.prototype.slice,c={},a=0;e.setTimeout=function(){return new i(u.call(setTimeout,window,arguments),clearTimeout)},e.setInterval=function(){return new i(u.call(setInterval,window,arguments),clearInterval)},e.clearTimeout=e.clearInterval=function(t){t.close()},i.prototype.unref=i.prototype.ref=function(){},i.prototype.close=function(){this._clearFn.call(window,this._id)},e.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e},e.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1},e._unrefActive=e.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout()},e))},e.setImmediate="function"==typeof t?t:function(t){var n=a++,r=arguments.length<2?!1:s.call(arguments,1);return c[n]=!0,o(function(){c[n]&&(r?t.apply(null,r):t.call(null),e.clearImmediate(n))}),n},e.clearImmediate="function"==typeof r?r:function(t){delete c[t]}}).call(e,n(4).setImmediate,n(4).clearImmediate)},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children=[],t.webpackPolyfill=1),t}},function(t,e){},function(t,e){t.exports=function(){throw new Error("define cannot be used indirect")}}]);