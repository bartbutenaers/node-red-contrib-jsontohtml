# node-red-contrib-jsontohtml
A Node Red node for converting json to html

## Install
Run the following npm command in your Node-RED user directory (typically ~/.node-red), to install this node directly from my Github repository:
```
npm install node-red-contrib-jsontohtml
```
:warning: The standard Node-RED *Template node* offers a similar functionality (see example below).  Thanks to [dceejay](https://github.com/dceejay) for the tip!

## Support my Node-RED developments

Please buy my wife a coffee to keep her happy, while I am busy developing Node-RED stuff for you ...

<a href="https://www.buymeacoffee.com/bartbutenaers" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy my wife a coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## Usage
Instead of writing Javascript code (in a function node) to convert a JSON object to HTML, this node uses JSON transforms to do the conversion.

Transforms are JSON templates that convert the source JSON objects into HTML.

A transform specifies a hierarchy of DOM elements (div, span, li..):
+ `<>` specifies the type of DOM element (div, span..).
+ `html` specifies the innerHTML (inlcuding all DOM children).

Example transformation:

![image](https://user-images.githubusercontent.com/14224149/101691882-a2150700-3a6f-11eb-87b4-dce76150874b.png)

When this Javacript object will be injected:
```
{"id": 1123, "name": "Jack and Jill", "year":2001}
```
Then this object will be tranformed - using the above transformation - to the following HTML:
```
<li id="1123">
    <span>Jack and Jill (2001)</span>
</li>	
```

You can find a playground an documentation on [http://www.json2html.com/](http://www.json2html.com/#getstarted).

## Use case
Suppose you leave your home and activate your alarm system, but you have forgotten to close some doors and windows.  Since those doors and windows have reed relays, you might want to get a warning about it.  A popup should automatically be displayed, which displays the sensor issues.  Then you can decide whether:
+ You want to "cancel" the alarm activation (and go back into the house to close the doors and windows).
+ You want to "continue" activating the alarm (which means that those sensors will be ignored during your absence).

Below you can find examples flows both using this node and the standard Node-RED Template node.  
Both flows will transform the following Javascript object:
```
[
    {
        "name": "Front door",
        "status": "OPEN"
    },
    {
        "name": "Kitchen door",
        "status": "CLOSED"
    },
    {
        "name": "Bathroom window",
        "status": "CLOSED"
    }
]
```
To a HTML list, which will be displayed inside a popup dialog box on the Node-RED dashboard:

![Sensor popup](https://user-images.githubusercontent.com/14224149/101696097-dd1a3900-3a75-11eb-8b8b-8c7912e155b8.png)

### Using the jsontohtml node

![Alarm flow](https://user-images.githubusercontent.com/14224149/101695678-43528c00-3a75-11eb-8907-f4999c74fc4d.png)
```
[{"id":"86841be0.685768","type":"inject","z":"d0d4f76e.209b68","name":"Simulate sensors","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"Ignore sensor issues","payload":"[{\"name\":\"Front door\",\"status\":\"OPEN\"},{\"name\":\"Kitchen door\",\"status\":\"CLOSED\"},{\"name\":\"Bathroom window\",\"status\":\"CLOSED\"}]","payloadType":"json","x":340,"y":480,"wires":[["48087d09.a0a144"]]},{"id":"d769d927.ca54b8","type":"ui_toast","z":"d0d4f76e.209b68","position":"dialog","displayTime":"3","highlight":"","sendall":true,"outputs":1,"ok":"Continue","cancel":"Cancel","raw":true,"topic":"","name":"Issues popup","x":720,"y":480,"wires":[[]]},{"id":"48087d09.a0a144","type":"jsontohtml","z":"d0d4f76e.209b68","transform":"{\"<>\":\"li\",\"html\":\"${name} - ${status}\",\"class\":\"function(){return('red');}\"}","name":"","x":530,"y":480,"wires":[["d769d927.ca54b8"]]}]
```

### Using the standard Template node

![Template flow](https://user-images.githubusercontent.com/14224149/101813134-9fbcb680-3b1c-11eb-83ed-0398f79dc5c7.png)
```
[{"id":"21d27fe8.709f9","type":"inject","z":"d0d4f76e.209b68","name":"Simulate sensors","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"Ignore sensor issues","payload":"[{\"name\":\"Front door\",\"status\":\"OPEN\"},{\"name\":\"Kitchen door\",\"status\":\"CLOSED\"},{\"name\":\"Bathroom window\",\"status\":\"CLOSED\"}]","payloadType":"json","x":360,"y":580,"wires":[["2a4f2827.5def58"]]},{"id":"2a4f2827.5def58","type":"template","z":"d0d4f76e.209b68","name":"","field":"payload","fieldType":"msg","format":"handlebars","syntax":"mustache","template":"{{#payload}}\n<li>{{name}} - <b>{{status}}</b></li>\n{{/payload}}","output":"str","x":550,"y":580,"wires":[["8dcd2d7f.40e3e"]]},{"id":"8dcd2d7f.40e3e","type":"ui_toast","z":"d0d4f76e.209b68","position":"dialog","displayTime":"3","highlight":"","sendall":true,"outputs":1,"ok":"OK","cancel":"","raw":true,"topic":"","name":"Issues popup","x":750,"y":580,"wires":[[]]}]
```
