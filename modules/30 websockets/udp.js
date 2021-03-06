//
// UDP server module
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2016
// Modified by Francisco Sanchez 4th May 2020
//
// This work may be reproduced, modified, distributed, performed, and
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is
// provided as is; no warranty is provided, and users accept all
// liability.
//
// closure
//
(function() {
    //
    // module globals
    //
    var mod = {}
    //
    // name
    //
    var name = 'WebSocket UDP'
    //
    // initialization
    //
    var init = function() {
        mod.address.value = '127.0.0.1'
        mod.port.value = '1238'
        mod.localhost.value = '127.0.0.1,192.168.1.63'
        mod.localport.value = '2345'
        mod.remotehost.value = '127.0.0.1'
        mod.remoteport.value = '3456'
        mod.socket = null
        socket_open()
    }
    //
    // inputs
    //
    var inputs = {
        transmit: {
            type: 'string',
            event: function(evt) {
                send_string(evt.detail)
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
        receive: {
            type: 'string',
            event: function(str) {
                mods.output(mod, 'receive', str)
            }
        }
    }
    //

    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        //
        // server
        //
        var a = document.createElement('a')
        a.href = './js/udpserver.js'
        a.innerHTML = 'udpserver.js'
        a.target = '_blank'
        div.appendChild(a)
        div.appendChild(document.createElement('br'))
        //
        // status
        //
        input = document.createElement('input')
        input.classList.add("marquee")
        input.disabled = true
        input.type = 'text'
        input.size = 19
        div.appendChild(input)
        mod.status = input
        div.appendChild(document.createElement('br'))
        //
        // address
        //
        div.appendChild(document.createTextNode('address: '))
        input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.address = input
        div.appendChild(document.createElement('br'))
        //
        // port
        //
        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0port: '))
        input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.port = input
        div.appendChild(document.createElement('br'))
        //
        // open/close
        //
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('open socket'))
        btn.addEventListener('click', function() {
            socket_open()
        })
        div.appendChild(btn)
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('close socket'))
        btn.addEventListener('click', function() {
            socket_close()
        })
        div.appendChild(btn)
        div.appendChild(document.createElement('hr'))

        //
        // local
        //
        div.appendChild(document.createTextNode('local UDP:'))
        div.appendChild(document.createElement('br'))
        //
        // host
        //
        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0host: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.localhost = input
        div.appendChild(document.createElement('br'))
        //
        // port
        //
        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0port: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.localport = input
        div.appendChild(document.createElement('hr'))
        //
        // remote
        //
        div.appendChild(document.createTextNode('remote UDP:'))
        div.appendChild(document.createElement('br'))
        //
        // host
        //
        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0host: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.remotehost = input
        div.appendChild(document.createElement('br'))
        //
        // port
        //
        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0port: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.remoteport = input
    }
    //
    // local functions
    //
    function socket_open() {
        var url = "ws://" + mod.address.value + ':' + mod.port.value
        mod.socket = new WebSocket(url)
        mod.socket.onopen = function(event) {
            mod.status.value = "socket opened"
            open_local()
        }
        mod.socket.onerror = function(event) {
            mod.status.value = "can not open"
            mod.socket = null
        }
        mod.socket.onmessage = function(event) {
            var msg = JSON.parse(event.data)
            if (msg.type == 'status')
                mod.status.value = msg.status
            else if (msg.type == 'listening') {
                mod.status.value = msg.status
                mod.localhost.value = msg.addresses
            } else if (msg.type == 'message') {
                outputs.receive.event(msg.message)
                mod.status.value = 'receive ' + JSON.stringify(msg.info)
            }
        }
    }

    function socket_close() {
        mod.socket.close()
        mod.status.value = "socket closed"
        mod.socket = null
    }

    function socket_send(msg) {
        if (mod.socket != null) {
            mod.status.value = "send"
            mod.socket.send(msg)
        } else {
            mod.status.value = "can't send, not open"
        }
    }

    function open_local() {
        if (mod.socket == null) {
            mod.status.value = "socket not open"
        } else {
            var msg = {}
            msg.type = 'open local'
            msg.port = parseInt(mod.localport.value)
            mod.socket.send(JSON.stringify(msg))
        }
    }

    function send_string(str) {
        if (mod.socket == null) {
            mod.status.value = "socket not open"
        } else {
            var msg = {}
            msg.type = 'send string'
            msg.host = mod.remotehost.value
            msg.port = parseInt(mod.remoteport.value)
            msg.string = str
            mod.socket.send(JSON.stringify(msg))
            mod.status.value = 'transmit'
        }
    }
    //
    // return values
    //
    return ({
        mod: mod,
        name: name,
        init: init,
        inputs: inputs,
        outputs: outputs,
        interface: interface
    })
}())
