//
// frep 2D function
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2018
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
    var name = 'frep 2D function'
    //
    // initialization
    //
    var init = function() {
        mod.fn.value = 'Math.sin(10*X)-10*Y'
        mod.xmin.value = '-1'
        mod.ymin.value = '-1'
        mod.xmax.value = '1'
        mod.ymax.value = '1'
    }
    //
    // inputs
    //
    var inputs = {
        variables: {
            type: '',
            event: function(evt) {
                for (var p in evt.detail)
                    mod[p].value = evt.detail[p]
                outputs.variables.event()
                outputs.shape.event()
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
        shape: {
            type: '',
            event: function() {
                var func = mod.fn.value
                var xmin = parseFloat(mod.xmin.value)
                var xmax = parseFloat(mod.xmax.value)
                var ymin = parseFloat(mod.ymin.value)
                var ymax = parseFloat(mod.ymax.value)
                var fn = `Math.min(X-(${xmin}),(${xmax})-X)`
                var fn = `Math.min(Y-(${ymin}),${fn})`
                var fn = `Math.min((${ymax})-Y,${fn})`
                var fn = `Math.min((${func}),${fn})`
                var variables = ['X', 'Y']
                var limits = [
                    [xmin, xmax],
                    [ymin, ymax]
                ]
                var type = 'Magnitude'
                var shape = {
                    function: fn,
                    variables: variables,
                    limits: limits,
                    type: type
                }
                mods.output(mod, 'shape', shape)
            }
        },
        variables: {
            type: '',
            event: function() {
                var fn = parseFloat(mod.fn.value)
                var xmin = parseFloat(mod.xmin.value)
                var xmax = parseFloat(mod.xmax.value)
                var ymin = parseFloat(mod.ymin.value)
                var ymax = parseFloat(mod.ymax.value)
                var vars = {
                    fn: fn,
                    xmin: xmin,
                    ymin: ymin,
                    xmax: xmax,
                    ymax: ymax
                }
                mods.output(mod, 'variables', vars)
            }
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        //
        // function
        //
        div.appendChild(document.createTextNode('function: '))
        div.appendChild(document.createElement('br'))
        var text = document.createElement('textarea')
        text.setAttribute('rows', 1)
        text.setAttribute('cols', mods.ui.cols)
        div.appendChild(text)
        mod.fn = text
        div.appendChild(document.createElement('br'))
        //
        // xmin
        //
        div.appendChild(document.createTextNode('xmin: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 3
        div.appendChild(input)
        mod.xmin = input
        //
        // xmax
        //
        div.appendChild(document.createTextNode(' xmax: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 3
        div.appendChild(input)
        mod.xmax = input
        div.appendChild(document.createElement('br'))
        //
        // ymin
        //
        div.appendChild(document.createTextNode('ymin: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 3
        div.appendChild(input)
        mod.ymin = input
        //
        // ymax
        //
        div.appendChild(document.createTextNode(' ymax: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 3
        div.appendChild(input)
        mod.ymax = input
        div.appendChild(document.createElement('br'))
        //
        // output button
        //
        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('output'))
        btn.addEventListener('click', function() {
            outputs.variables.event()
            outputs.shape.event()
        })
        div.appendChild(btn)
    }
    //
    // local functions
    //
    ;
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
