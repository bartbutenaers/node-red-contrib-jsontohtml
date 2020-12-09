/**
 * Copyright 2020 Bart Butenaers
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
 module.exports = function(RED) {
    var settings = RED.settings;  
    var json2html = require('node-json2html');

    function JsonToHtmlNode(n) {
        RED.nodes.createNode(this,n);
        this.transform = n.transform;
        this.name = n.name;
            
        var node = this;       

        node.on("input", function(msg) {      
            var jsonTransformed = {};
        
            node.status({fill: "blue", shape: "dot", text: "Converting"});
            
            try {
                // The json transformation itself is in json format.  The jsontohtml library allows javascript callback functions 
                // to be included inside that transformation.  However, the json standard doesn't allow javascript functions to be
                // included.  Therefore the javascript functions are passed as string, which is converted back to a function here.
                // (see http://ovaraksin.blogspot.be/2013/10/pass-javascript-function-via-json.html)
                jsonTransformed = JSON.parse(n.transform, function (key, value) {
                    if (value && (typeof value === 'string') && value.indexOf("function") === 0) {
                        var jsFunc = new Function('return ' + value)();
                        return jsFunc;
                    }
                          
                    return value;
                });
            }
            catch(err) {
                 node.status({fill: "red", shape: "ring", text: "Invalid transform"});
                 return;
            }                
        
            try {
                // Transform the json payload to an html string, based on the supplied (json formatted) transformation.
                // The payload can be a json string or object.  But the transformation should be a json object (no json string allowed)!
                msg.payload = json2html.transform(msg.payload, jsonTransformed);
                node.send(msg);
                node.status({});       
            }
            catch(err) {
                 node.status({fill: "red", shape: "ring", text: "Transform error"});
                 return;
            }
        });
    }

    RED.nodes.registerType("jsontohtml",JsonToHtmlNode);
}