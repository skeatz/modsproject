//
// path to SVG
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
    var name = 'path to SVG'
    //
    // initialization
    //
    var init = function() {
        mod.fill.checked = true
    }
    //
    // inputs
    //
    var inputs = {
        imageInfo: {
            type: '',
            event: function(evt) {
                mod.imageInfo = evt.detail
            }
        },
        path: {
            type: '',
            event: function(evt) {
                mod.path = evt.detail
                convert(evt.detail)
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
        SVG: {
            type: 'file',
            event: function(evt) {
                mods.output(mod, 'SVG', evt)
            }
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        //
        // fill
        //
        div.appendChild(document.createTextNode('fill: '))
        var input = document.createElement('input')
        input.type = 'checkbox'
        div.appendChild(input)
        mod.fill = input
        div.appendChild(document.createElement('br'))
    }
    //
    // local functions
    //
    // convert
    //
    function convert(path) {
        //
        // create SVG
        //
        var imgwidth = mod.imageInfo.width / parseFloat(mod.imageInfo.dpi)
        var imgheight = mod.imageInfo.height / parseFloat(mod.imageInfo.dpi)
        var svgNS = "http://www.w3.org/2000/svg"
        var svg = document.createElementNS(svgNS, "svg")
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/",
            "xmlns:xlink", "http://www.w3.org/1999/xlink")
        svg.setAttribute('width', imgwidth + 'in')
        svg.setAttribute('height', imgheight + 'in')
        svg.style.backgroundColor = 'rgb(255,255,255)'
        svg.setAttribute('viewBox', '0 0 ' + imgwidth + ' ' + imgheight)
        //
        // draw path
        //
        var g = document.createElementNS(svgNS, 'g')
        svg.appendChild(g)
        for (var seg = 0; seg < path.length; ++seg) {
            var points = ''
            for (var pt = 0; pt < path[seg].length; ++pt) {
                var x = imgwidth * path[seg][pt][0] / (mod.imageInfo.width - 1)
                var y = imgheight * (1 - path[seg][pt][1] / (mod.imageInfo.height - 1))
                points += x + ',' + y + ' '
            }
            var x = imgwidth * path[seg][0][0] / (mod.imageInfo.width - 1)
            var y = imgheight * (1 - path[seg][0][1] / (mod.imageInfo.height - 1))
            points += x + ',' + y + ' '
            if (mod.fill.checked == true) {
                var polyline = document.createElementNS(svgNS, 'polyline')
                polyline.setAttribute('stroke', 'none')
                polyline.setAttribute('fill', 'black')
                polyline.setAttribute('fill-rule', 'evenodd')
                polyline.setAttribute('points', points)
                g.appendChild(polyline)
            } else {
                var polyline = document.createElementNS(svgNS, 'polyline')
                polyline.setAttribute('stroke', 'black')
                polyline.setAttribute('stroke-width', '0.01')
                polyline.setAttribute('stroke-linecap', 'round')
                polyline.setAttribute('fill', 'none')
                polyline.setAttribute('points', points)
                g.appendChild(polyline)
            }
        }
        //
        // save file
        //
        var obj = {}
        obj.type = 'file'
        obj.name = mod.imageInfo.name + '.svg'
        var xml = new XMLSerializer().serializeToString(svg)
        obj.contents = xml
        outputs.SVG.event(obj)
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
