'use strict';
const listenPort = 12345,
    XEvilPort = 12344,
    captchasPerSecond = 5;

const http = require('http'),
    httpProxy = require('http-proxy'),
    proxy = httpProxy.createProxyServer();

let lastUploadTime = 0,
    capthasCount = 0;

http.createServer((req, res) => {
    let currentTime = Math.floor(new Date() / 1000);

    if(req.method == 'POST') {
        if(currentTime != lastUploadTime || capthasCount < captchasPerSecond) {
            console.log('POST', req.url, currentTime, 'proxied');
            capthasCount = lastUploadTime == currentTime ? capthasCount + 1 : 1;
            lastUploadTime = currentTime;
            proxy.web(req, res, {
                target: 'http://localhost:' + XEvilPort,
            });
        }
        else {
            console.log('POST', req.url, currentTime, 'NO_SLOT');
            res.writeHead(200);
            res.write('ERROR_NO_SLOT_AVAILABLE');
            res.end();
        }
    }
    else {
        console.log('GET', req.url, currentTime, 'proxied');
        proxy.web(req, res, {
            target: 'http://localhost:' + XEvilPort
        });
    };
}).listen(listenPort);