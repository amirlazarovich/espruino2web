# Espruino to web
Sample code for espruino, web server and a web socket


### Install
```javascript
sudo npm install
```

### Usage
```javascript
node app [options]

options:
-h,--help			 print usage
-p, --port			 set serial port [default: tty.usb*]
-w, --webport		 set web port [default: 8000]
```

### Example
```javascript 
node app
```

###### Note
After running the web server, try sending the following command:
```javascript
LED1.write(1)
```

To find all available commands see [Espruino documentation](http://www.espruino.com/Reference)