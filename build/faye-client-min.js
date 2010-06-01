if(!this.Faye)Faye={};Faye.extend=function(a,b,c){if(!b)return a;for(var d in b){if(!b.hasOwnProperty(d))continue;if(a.hasOwnProperty(d)&&c===false)continue;if(a[d]!==b[d])a[d]=b[d]}return a};Faye.extend(Faye,{VERSION:'0.3.2',BAYEUX_VERSION:'1.0',ID_LENGTH:128,JSONP_CALLBACK:'jsonpcallback',CONNECTION_TYPES:["long-polling","callback-polling"],ENV:this,random:function(a){a=a||this.ID_LENGTH;if(a>32){var b=Math.ceil(a/32),c='';while(b--)c+=this.random(32);return c}var d=Math.pow(2,a);return Math.floor(Math.random()*d).toString(16)},Grammar:{LOWALPHA:/^[a-z]$/,UPALPHA:/^[A-Z]$/,ALPHA:/^([a-z]|[A-Z])$/,DIGIT:/^[0-9]$/,ALPHANUM:/^(([a-z]|[A-Z])|[0-9])$/,MARK:/^(\-|\_|\!|\~|\(|\)|\$|\@)$/,STRING:/^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*$/,TOKEN:/^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+$/,INTEGER:/^([0-9])+$/,CHANNEL_SEGMENT:/^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+$/,CHANNEL_SEGMENTS:/^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*$/,CHANNEL_NAME:/^\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*$/,WILD_CARD:/^\*{1,2}$/,CHANNEL_PATTERN:/^(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*\/\*{1,2}$/,VERSION_ELEMENT:/^(([a-z]|[A-Z])|[0-9])(((([a-z]|[A-Z])|[0-9])|\-|\_))*$/,VERSION:/^([0-9])+(\.(([a-z]|[A-Z])|[0-9])(((([a-z]|[A-Z])|[0-9])|\-|\_))*)*$/,CLIENT_ID:/^((([a-z]|[A-Z])|[0-9]))+$/,ID:/^((([a-z]|[A-Z])|[0-9]))+$/,ERROR_MESSAGE:/^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*$/,ERROR_ARGS:/^(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*(,(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)*$/,ERROR_CODE:/^[0-9][0-9][0-9]$/,ERROR:/^([0-9][0-9][0-9]:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*(,(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)*:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*|[0-9][0-9][0-9]::(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)$/},commonElement:function(a,b){for(var c=0,d=a.length;c<d;c++){if(this.indexOf(b,a[c])!==-1)return a[c]}return null},indexOf:function(a,b){for(var c=0,d=a.length;c<d;c++){if(a[c]===b)return c}return-1},each:function(a,b,c){if(a instanceof Array){for(var d=0,f=a.length;d<f;d++){if(a[d]!==undefined)b.call(c||null,a[d],d)}}else{for(var g in a){if(a.hasOwnProperty(g))b.call(c||null,g,a[g])}}},filter:function(a,b,c){var d=[];this.each(a,function(){if(b.apply(c,arguments))d.push(arguments[0])});return d},size:function(a){var b=0;this.each(a,function(){b+=1});return b},enumEqual:function(c,d){if(d instanceof Array){if(!(c instanceof Array))return false;var f=c.length;if(f!==d.length)return false;while(f--){if(c[f]!==d[f])return false}return true}else{if(!(c instanceof Object))return false;if(this.size(d)!==this.size(c))return false;var g=true;this.each(c,function(a,b){g=g&&(d[a]===b)});return g}},toJSON:function(a){if(this.stringify)return this.stringify(a,function(key,value){return(this[key]instanceof Array)?this[key]:value});return JSON.stringify(a)},timestamp:function(){var b=new Date(),c=b.getFullYear(),d=b.getMonth()+1,f=b.getDate(),g=b.getHours(),j=b.getMinutes(),i=b.getSeconds();var h=function(a){return a<10?'0'+a:String(a)};return h(c)+'-'+h(d)+'-'+h(f)+' '+h(g)+':'+h(j)+':'+h(i)}});Faye.Class=function(a,b){if(typeof a!=='function'){b=a;a=Object}var c=function(){if(!this.initialize)return this;return this.initialize.apply(this,arguments)||this};var d=function(){};d.prototype=a.prototype;c.prototype=new d();Faye.extend(c.prototype,b);return c};Faye.Deferrable={callback:function(a,b){if(this._x==='succeeded')return a.apply(b,this._q);this._a=this._a||[];this._a.push([a,b])},setDeferredStatus:function(){var b=Array.prototype.slice.call(arguments),c=b.shift();this._x=c;this._q=b;if(c!=='succeeded')return;if(!this._a)return;Faye.each(this._a,function(a){a[0].apply(a[1],this._q)},this);this._a=[]}};Faye.Observable={on:function(a,b,c){this._2=this._2||{};var d=this._2[a]=this._2[a]||[];d.push([b,c])},stopObserving:function(a,b,c){if(!this._2||!this._2[a])return;if(!b){delete this._2[a];return}var d=this._2[a],f=d.length;while(f--){if(b&&d[f][0]!==b)continue;if(c&&d[f][1]!==c)continue;d.splice(f,1)}},trigger:function(){var b=Array.prototype.slice.call(arguments),c=b.shift();if(!this._2||!this._2[c])return;Faye.each(this._2[c],function(a){a[0].apply(a[1],b.slice())})}};Faye.Logging={LOG_LEVELS:{error:3,warn:2,info:1,debug:0},logLevel:'error',log:function(a,b){if(!Faye.logger)return;var c=Faye.Logging.LOG_LEVELS;if(c[Faye.Logging.logLevel]>c[b])return;var a=Array.prototype.slice.apply(a),d=' ['+b.toUpperCase()+'] [Faye',f=null,g=a.shift().replace(/\?/g,function(){return Faye.toJSON(a.shift())});for(var j in Faye){if(f)continue;if(typeof Faye[j]!=='function')continue;if(this instanceof Faye[j])f=j}if(f)d+='.'+f;d+='] ';Faye.logger(Faye.timestamp()+d+g)}};Faye.each(Faye.Logging.LOG_LEVELS,function(a,b){Faye.Logging[a]=function(){this.log(arguments,a)}});Faye.Timeouts={addTimeout:function(a,b,c,d){this._6=this._6||{};if(this._6.hasOwnProperty(a))return;var f=this;this._6[a]=setTimeout(function(){delete f._6[a];c.call(d)},1000*b)},removeTimeout:function(a){this._6=this._6||{};var b=this._6[a];if(!b)return;clearTimeout(b);delete this._6[a]}};Faye.Extensible={addExtension:function(a){this._7=this._7||[];this._7.push(a)},removeExtension:function(a){if(!this._7)return;var b=this._7.length;while(b--){if(this._7[b]===a)this._7.splice(b,1)}},pipeThroughExtensions:function(c,d,f,g){if(!this._7)return f.call(g,d);var j=this._7.slice();var i=function(a){if(!a)return;var b=j.shift();if(!b)return f.call(g,a);if(b[c])b[c](a,i);else i(a)};i(d)}};Faye.Channel=Faye.Class({initialize:function(a){this.__id=this.name=a},push:function(a){this.trigger('message',a)}});Faye.extend(Faye.Channel.prototype,Faye.Observable);Faye.extend(Faye.Channel,{HANDSHAKE:'/meta/handshake',CONNECT:'/meta/connect',SUBSCRIBE:'/meta/subscribe',UNSUBSCRIBE:'/meta/unsubscribe',DISCONNECT:'/meta/disconnect',META:'meta',SERVICE:'service',isValid:function(a){return Faye.Grammar.CHANNEL_NAME.test(a)||Faye.Grammar.CHANNEL_PATTERN.test(a)},parse:function(a){if(!this.isValid(a))return null;return a.split('/').slice(1)},isMeta:function(a){var b=this.parse(a);return b?(b[0]===this.META):null},isService:function(a){var b=this.parse(a);return b?(b[0]===this.SERVICE):null},isSubscribable:function(a){if(!this.isValid(a))return null;return!this.isMeta(a)&&!this.isService(a)},Tree:Faye.Class({initialize:function(a){this._3=a;this._8={}},eachChild:function(c,d){Faye.each(this._8,function(a,b){c.call(d,a,b)})},each:function(c,d,f){this.eachChild(function(a,b){a=c.concat(a);b.each(a,d,f)});if(this._3!==undefined)d.call(f,c,this._3)},getKeys:function(){return this.map(function(a,b){return'/'+a.join('/')})},map:function(c,d){var f=[];this.each([],function(a,b){f.push(c.call(d,a,b))});return f},get:function(a){var b=this.traverse(a);return b?b._3:null},set:function(a,b){var c=this.traverse(a,true);if(c)c._3=b},traverse:function(a,b){if(typeof a==='string')a=Faye.Channel.parse(a);if(a===null)return null;if(a.length===0)return this;var c=this._8[a[0]];if(!c&&!b)return null;if(!c)c=this._8[a[0]]=new Faye.Channel.Tree();return c.traverse(a.slice(1),b)},findOrCreate:function(a){var b=this.get(a);if(b)return b;b=new Faye.Channel(a);this.set(a,b);return b},glob:function(f){if(typeof f==='string')f=Faye.Channel.parse(f);if(f===null)return[];if(f.length===0)return(this._3===undefined)?[]:[this._3];var g=[];if(Faye.enumEqual(f,['*'])){Faye.each(this._8,function(a,b){if(b._3!==undefined)g.push(b._3)});return g}if(Faye.enumEqual(f,['**'])){g=this.map(function(a,b){return b});if(this._3!==undefined)g.pop();return g}Faye.each(this._8,function(b,c){if(b!==f[0]&&b!=='*')return;var d=c.glob(f.slice(1));Faye.each(d,function(a){g.push(a)})});if(this._8['**'])g.push(this._8['**']._3);return g}})});Faye.Namespace=Faye.Class({initialize:function(){this._r={}},generate:function(){var a=Faye.random();while(this._r.hasOwnProperty(a))a=Faye.random();return this._r[a]=a}});Faye.Transport=Faye.extend(Faye.Class({initialize:function(a,b){this.debug('Created new transport for ?',b);this._b=a;this._4=b},send:function(f,g,j){if(!(f instanceof Array)&&!f.id)f.id=this._b._s.generate();this.debug('Client ? sending message to ?: ?',this._b._0,this._4,f);this.request(f,function(b){this.debug('Client ? received from ?: ?',this._b._0,this._4,b);if(!g)return;var c=[],d=true;Faye.each([].concat(b),function(a){if(a.id===f.id){if(g.call(j,a)===false)d=false}if(a.advice)this._b.handleAdvice(a.advice);if(a.data&&a.channel)c.push(a)},this);if(d)this._b.deliverMessages(c)},this)}}),{get:function(c,d){var f=c._4;if(d===undefined)d=this.supportedConnectionTypes();var g=null;Faye.each(this._k,function(a,b){if(Faye.indexOf(d,a)<0)return;if(g)return;if(b.isUsable(f))g=b});if(!g)throw'Could not find a usable connection type for '+f;return new g(c,f)},register:function(a,b){this._k[a]=b;b.prototype.connectionType=a},_k:{},supportedConnectionTypes:function(){var c=[],d;Faye.each(this._k,function(a,b){c.push(a)});return c}});Faye.extend(Faye.Transport.prototype,Faye.Logging);Faye.Client=Faye.Class({UNCONNECTED:1,CONNECTING:2,CONNECTED:3,DISCONNECTED:4,HANDSHAKE:'handshake',RETRY:'retry',NONE:'none',CONNECTION_TIMEOUT:60.0,DEFAULT_ENDPOINT:'/bayeux',MAX_DELAY:0.1,INTERVAL:1000.0,initialize:function(a,b){this.info('New client created for ?',a);this._4=a||this.DEFAULT_ENDPOINT;this._y=b||{};this._t=this._y.timeout||this.CONNECTION_TIMEOUT;this._e=Faye.Transport.get(this);this._1=this.UNCONNECTED;this._s=new Faye.Namespace();this._l=[];this._c=new Faye.Channel.Tree();this._9={reconnect:this.RETRY,interval:this.INTERVAL};if(Faye.Event)Faye.Event.on(Faye.ENV,'beforeunload',this.disconnect,this)},handshake:function(b,c){if(this._9.reconnect===this.NONE)return;if(this._1!==this.UNCONNECTED)return;this._1=this.CONNECTING;var d=this;this.info('Initiating handshake with ?',this._4);this._d({channel:Faye.Channel.HANDSHAKE,version:Faye.BAYEUX_VERSION,supportedConnectionTypes:Faye.Transport.supportedConnectionTypes()},function(a){if(a.successful){this._1=this.CONNECTED;this._0=a.clientId;this._e=Faye.Transport.get(this,a.supportedConnectionTypes);this.info('Handshake successful: ?',this._0);if(b)b.call(c)}else{this.info('Handshake unsuccessful');setTimeout(function(){d.handshake(b,c)},this._9.interval);this._1=this.UNCONNECTED}},this)},connect:function(b,c){if(this._9.reconnect===this.NONE)return;if(this._1===this.DISCONNECTED)return;if(this._9.reconnect===this.HANDSHAKE||this._1===this.UNCONNECTED){this._u();return this.handshake(function(){this.connect(b,c)},this)}if(this._1===this.CONNECTING)return this.callback(b,c);if(this._1!==this.CONNECTED)return;this.info('Calling deferred actions for ?',this._0);this.setDeferredStatus('succeeded');this.setDeferredStatus('deferred');if(b)b.call(c);if(this._f)return;this._f=this._s.generate();var d=this;this.info('Initiating connection for ?',this._0);this._d({channel:Faye.Channel.CONNECT,clientId:this._0,connectionType:this._e.connectionType,id:this._f},this._m(function(a){this._f=null;this.removeTimeout('reconnect');this.info('Closed connection for ?',this._0);setTimeout(function(){d.connect()},this._9.interval)}));this._u()},disconnect:function(){if(this._1!==this.CONNECTED)return;this._1=this.DISCONNECTED;this.info('Disconnecting ?',this._0);this._d({channel:Faye.Channel.DISCONNECT,clientId:this._0});this.info('Clearing channel listeners for ?',this._0);this._c=new Faye.Channel.Tree();this.removeTimeout('reconnect')},subscribe:function(c,d,f){this.connect(function(){c=[].concat(c);this._n(c);this.info('Client ? attempting to subscribe to ?',this._0,c);this._d({channel:Faye.Channel.SUBSCRIBE,clientId:this._0,subscription:c},this._m(function(b){if(!b.successful||!d)return;this.info('Subscription acknowledged for ? to ?',this._0,c);c=[].concat(b.subscription);Faye.each(c,function(a){this._c.set(a,[d,f])},this)}))},this)},unsubscribe:function(c,d,f){this.connect(function(){c=[].concat(c);this._n(c);this.info('Client ? attempting to unsubscribe from ?',this._0,c);this._d({channel:Faye.Channel.UNSUBSCRIBE,clientId:this._0,subscription:c},this._m(function(b){if(!b.successful)return;this.info('Unsubscription acknowledged for ? from ?',this._0,c);c=[].concat(b.subscription);Faye.each(c,function(a){this._c.set(a,undefined)},this)}))},this)},publish:function(a,b){this.connect(function(){this._n([a]);this.info('Client ? queueing published message to ?: ?',this._0,a,b);this._z({channel:a,data:b,clientId:this._0},function(){this.addTimeout('publish',this.MAX_DELAY,this._A,this)})},this)},handleAdvice:function(a){Faye.extend(this._9,a);if(this._9.reconnect===this.HANDSHAKE)this._0=null},deliverMessages:function(f){Faye.each(f,function(d){this.pipeThroughExtensions('incoming',d,function(b){this.info('Client ? calling listeners for ? with ?',this._0,b.channel,b.data);var c=this._c.glob(b.channel);Faye.each(c,function(a){a[0].call(a[1],b.data)})},this)},this)},_u:function(){this.addTimeout('reconnect',this._t,function(){this._f=null;this._0=null;this._1=this.UNCONNECTED;this.info('Server took >?s to reply to connection for ?: attempting to reconnect',this._t,this._0);this.subscribe(this._c.getKeys())},this)},_d:function(b,c,d){this.pipeThroughExtensions('outgoing',b,function(a){this._e.send(a,c,d)},this)},_z:function(b,c){this.pipeThroughExtensions('outgoing',b,function(a){this._l.push(a);c.call(this)},this)},_A:function(){this._e.send(this._l);this._l=[]},_n:function(b){Faye.each(b,function(a){if(!Faye.Channel.isValid(a))throw'"'+a+'" is not a valid channel name';if(!Faye.Channel.isSubscribable(a))throw'Clients may not subscribe to channel "'+a+'"';})},_m:function(b){var c=this;return function(a){if(a.clientId!==c._0)return false;b.call(c,a);return true}}});Faye.extend(Faye.Client.prototype,Faye.Deferrable);Faye.extend(Faye.Client.prototype,Faye.Timeouts);Faye.extend(Faye.Client.prototype,Faye.Logging);Faye.extend(Faye.Client.prototype,Faye.Extensible);Faye.Event={_g:[],on:function(a,b,c,d){var f=function(){c.call(d)};if(a.addEventListener)a.addEventListener(b,f,false);else a.attachEvent('on'+b,f);this._g.push({_h:a,_o:b,_B:c,_i:d,_v:f})},detach:function(a,b,c,d){var f=this._g.length,g;while(f--){g=this._g[f];if((a&&a!==g._h)||(b&&b!==g._o)||(c&&c!==g._B)||(d&&d!==g._i))continue;if(g._h.removeEventListener)g._h.removeEventListener(g._o,g._v,false);else g._h.detachEvent('on'+g._o,g._v);this._g.splice(f,1);g=null}}};Faye.Event.on(Faye.ENV,'unload',Faye.Event.detach,Faye.Event);Faye.URI=Faye.extend(Faye.Class({queryString:function(){var c=[],d;Faye.each(this.params,function(a,b){c.push(encodeURIComponent(a)+'='+encodeURIComponent(b))});return c.join('&')},isLocal:function(){var a=Faye.URI.parse(Faye.ENV.location.href);var b=(a.hostname!==this.hostname)||(a.port!==this.port)||(a.protocol!==this.protocol);return!b},toURL:function(){return this.protocol+this.hostname+':'+this.port+this.pathname+'?'+this.queryString()}}),{parse:function(d,f){if(typeof d!=='string')return d;var g=new this();var j=function(b,c){d=d.replace(c,function(a){if(a)g[b]=a;return''})};j('protocol',/^https?\:\/+/);j('hostname',/^[^\/\:]+/);j('port',/^:[0-9]+/);Faye.extend(g,{protocol:'http://',hostname:Faye.ENV.location.hostname,port:Faye.ENV.location.port},false);if(!g.port)g.port=(g.protocol==='https://')?'443':'80';g.port=g.port.replace(/\D/g,'');var i=d.split('?'),h=i.shift(),l=i.join('?'),n=l?l.split('&'):[],o=n.length,k={};while(o--){i=n[o].split('=');k[decodeURIComponent(i[0]||'')]=decodeURIComponent(i[1]||'')}if(typeof f==='object')Faye.extend(k,f);g.pathname=h;g.params=k;return g}});Faye.XHR={request:function(a,b,c,d,f){var g=new this.Request(a,b,c,d,f);g.send();return g},getXhrObject:function(){return Faye.ENV.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest()},Request:Faye.Class({initialize:function(a,b,c,d,f){this._j=a.toUpperCase();this._4=Faye.URI.parse(b,c);this._C=(typeof c==='string')?c:null;this._D=(typeof d==='function')?{success:d}:d;this._i=f||null;this._5=null},send:function(){if(this._p)return;var a=this._4.pathname,b=this._4.queryString();if(this._j==='GET')a+='?'+b;var c=(this._j==='POST')?(this._C||b):'';this._p=true;this._5=Faye.XHR.getXhrObject();this._5.open(this._j,a,true);if(this._j==='POST')this._5.setRequestHeader('Content-Type','application/json');var d=this,f=function(){if(d._5.readyState!==4)return;if(g){clearInterval(g);g=null}Faye.Event.detach(Faye.ENV,'beforeunload',d.abort,d);d._p=false;d._E();d=null};var g=setInterval(f,10);Faye.Event.on(Faye.ENV,'beforeunload',this.abort,this);this._5.send(c)},abort:function(){this._5.abort()},_E:function(){var a=this._D;if(!a)return;return this.success()?a.success&&a.success.call(this._i,this):a.failure&&a.failure.call(this._i,this)},waiting:function(){return!!this._p},complete:function(){return this._5&&!this.waiting()},success:function(){if(!this.complete())return false;var a=this._5.status;return(a>=200&&a<300)||a===304||a===1223},failure:function(){if(!this.complete())return false;return!this.success()},text:function(){if(!this.complete())return null;return this._5.responseText},status:function(){if(!this.complete())return null;return this._5.status}})};if(!this.JSON){JSON={}}(function(){function l(a){return a<10?'0'+a:a}if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(a){return this.getUTCFullYear()+'-'+l(this.getUTCMonth()+1)+'-'+l(this.getUTCDate())+'T'+l(this.getUTCHours())+':'+l(this.getUTCMinutes())+':'+l(this.getUTCSeconds())+'Z'};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()}}var n=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,o=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,k,p,s={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},m;function r(c){o.lastIndex=0;return o.test(c)?'"'+c.replace(o,function(a){var b=s[a];return typeof b==='string'?b:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+c+'"'}function q(a,b){var c,d,f,g,j=k,i,h=b[a];if(h&&typeof h==='object'&&typeof h.toJSON==='function'){h=h.toJSON(a)}if(typeof m==='function'){h=m.call(b,a,h)}switch(typeof h){case'string':return r(h);case'number':return isFinite(h)?String(h):'null';case'boolean':case'null':return String(h);case'object':if(!h){return'null'}k+=p;i=[];if(Object.prototype.toString.apply(h)==='[object Array]'){g=h.length;for(c=0;c<g;c+=1){i[c]=q(c,h)||'null'}f=i.length===0?'[]':k?'[\n'+k+i.join(',\n'+k)+'\n'+j+']':'['+i.join(',')+']';k=j;return f}if(m&&typeof m==='object'){g=m.length;for(c=0;c<g;c+=1){d=m[c];if(typeof d==='string'){f=q(d,h);if(f){i.push(r(d)+(k?': ':':')+f)}}}}else{for(d in h){if(Object.hasOwnProperty.call(h,d)){f=q(d,h);if(f){i.push(r(d)+(k?': ':':')+f)}}}}f=i.length===0?'{}':k?'{\n'+k+i.join(',\n'+k)+'\n'+j+'}':'{'+i.join(',')+'}';k=j;return f}}Faye.stringify=function(a,b,c){var d;k='';p='';if(typeof c==='number'){for(d=0;d<c;d+=1){p+=' '}}else if(typeof c==='string'){p=c}m=b;if(b&&typeof b!=='function'&&(typeof b!=='object'||typeof b.length!=='number')){throw new Error('JSON.stringify');}return q('',{'':a})};if(typeof JSON.stringify!=='function'){JSON.stringify=Faye.stringify}if(typeof JSON.parse!=='function'){JSON.parse=function(g,j){var i;function h(a,b){var c,d,f=a[b];if(f&&typeof f==='object'){for(c in f){if(Object.hasOwnProperty.call(f,c)){d=h(f,c);if(d!==undefined){f[c]=d}else{delete f[c]}}}}return j.call(a,b,f)}n.lastIndex=0;if(n.test(g)){g=g.replace(n,function(a){return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(g.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){i=eval('('+g+')');return typeof j==='function'?h({'':i},''):i}throw new SyntaxError('JSON.parse');}}}());Faye.XHRTransport=Faye.Class(Faye.Transport,{request:function(b,c,d){Faye.XHR.request('post',this._4,Faye.toJSON(b),function(a){if(c)c.call(d,JSON.parse(a.text()))})}});Faye.XHRTransport.isUsable=function(a){return Faye.URI.parse(a).isLocal()};Faye.Transport.register('long-polling',Faye.XHRTransport);Faye.JSONPTransport=Faye.extend(Faye.Class(Faye.Transport,{request:function(b,c,d){var f={message:Faye.toJSON(b)},g=document.getElementsByTagName('head')[0],j=document.createElement('script'),i=Faye.JSONPTransport.getCallbackName(),h=Faye.URI.parse(this._4,f);Faye.ENV[i]=function(a){Faye.ENV[i]=undefined;try{delete Faye.ENV[i]}catch(e){}g.removeChild(j);if(c)c.call(d,a)};h.params.jsonp=i;j.type='text/javascript';j.src=h.toURL();g.appendChild(j)}}),{_w:0,getCallbackName:function(){this._w+=1;return'__jsonp'+this._w+'__'}});Faye.JSONPTransport.isUsable=function(a){return true};Faye.Transport.register('callback-polling',Faye.JSONPTransport);