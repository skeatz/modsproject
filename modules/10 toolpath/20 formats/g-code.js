//
// path to G-code
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2018
// 
// Updated: Steven Chew
// Date:    Feb 20 2019
// Comments: Added option to output in inch or mm
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
    var name = 'path to G-code'
    //
    // initialization
    //
    var init = function() {
        mod.cutspeed.value = '20'
        mod.plungespeed.value = '20'
        mod.jogspeed.value = '75'
        mod.jogheight.value = '5'
        mod.spindlespeed.value = '10000'
        mod.tool.value = '1'
        mod.coolanton.checked = true
    }
    //
    // inputs
    //
    var inputs = {
        path: {
            type: '',
            event: function(evt) {
                mod.name = evt.detail.name
                mod.path = evt.detail.path
                mod.dpi = evt.detail.dpi
                mod.width = evt.detail.width
                mod.height = evt.detail.height
                make_path()
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
        file: {
            type: '',
            event: function(str) {
                obj = {}
                obj.name = mod.name + ".nc"
                obj.contents = str
                mods.output(mod, 'file', obj)
            }
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        //
        // cut speed
        //
        div.appendChild(document.createTextNode('cut speed: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.cutspeed = input
        div.appendChild(document.createTextNode(' (mm/s)'))
        div.appendChild(document.createElement('br'))
        //
        // plunge speed
        //
        div.appendChild(document.createTextNode('plunge speed: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.plungespeed = input
        div.appendChild(document.createTextNode(' (mm/s)'))
        div.appendChild(document.createElement('br'))
        //
        // jog speed
        //
        div.appendChild(document.createTextNode('jog speed: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.jogspeed = input
        div.appendChild(document.createTextNode(' (mm/s)'))
        div.appendChild(document.createElement('br'))
        //
        // jog height
        //
        div.appendChild(document.createTextNode('jog height: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.jogheight = input
        div.appendChild(document.createTextNode(' (mm)'))
        div.appendChild(document.createElement('br'))
        //
        // spindle speed
        //
        div.appendChild(document.createTextNode('spindle speed: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.spindlespeed = input
        div.appendChild(document.createTextNode(' (RPM)'))
        div.appendChild(document.createElement('br'))
        //
        // tool
        //
        div.appendChild(document.createTextNode('tool: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.tool = input
        div.appendChild(document.createElement('br'))
        //
        // coolant
        //
        div.appendChild(document.createTextNode('coolant:'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'coolant'
        input.id = mod.div.id + 'coolanton'
        div.appendChild(input)
        mod.coolanton = input
        div.appendChild(document.createTextNode('on'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'coolant'
        input.id = mod.div.id + 'coolantoff'
        div.appendChild(input)
        mod.coolantoff = input
        div.appendChild(document.createTextNode('off'))
        div.appendChild(document.createElement('br'))
        //
        // Inch or mm
        //
        div.appendChild(document.createTextNode('format:'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'format'
        input.id = mod.div.id + 'formatInch'
        input.checked = true
        div.appendChild(input)
        mod.formatInch = input
        div.appendChild(document.createTextNode('inch'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'format'
        input.id = mod.div.id + 'formatMm'
        div.appendChild(input)
        mod.formatMm = input
        div.appendChild(document.createTextNode('mm'))

    }
    //
    // local functions
    //
    function make_path() {
        var dx = 25.4 * mod.width / mod.dpi
        var cut_speed = parseFloat(mod.cutspeed.value)
        var plunge_speed = parseFloat(mod.plungespeed.value)
        var jog_speed = parseFloat(mod.jogspeed.value)
        var jog_height = parseFloat(mod.jogheight.value)
        var nx = mod.width
        var scale = dx / (nx - 1)
        var in_mm_scale = 1
        if (mod.formatInch.checked) {
            dx /= 25.4
            scale /= 25.4
            cut_speed /= 25.4
            plunge_speed /= 25.4
            jog_speed /= 25.4
            jog_height /= 25.4
        }
        var spindle_speed = parseFloat(mod.spindlespeed.value)
        var tool = parseInt(mod.tool.value)
        str = "%\n" // tape start
        str += "G17\n" // xy plane
        if (mod.formatInch.checked)
            str += "G20\n" // inches
        if (mod.formatMm.checked)
            str += "G21\n" // mm
        str += "G40\n" // cancel tool radius compensation
        str += "G49\n" // cancel tool length compensation
        str += "G54\n" // coordinate system 1
        str += "G80\n" // cancel canned cycles
        str += "G90\n" // absolute coordinates
        str += "G94\n" // feed/minute units
        str += "T" + tool + "M06\n" // tool selection, tool change
        str += "F" + cut_speed.toFixed(4) + "\n" // feed rate
        str += "S" + spindle_speed + "\n" // spindle speed
        if (mod.coolanton.checked)
            str += "M08\n" // coolant on
        str += "G00Z" + jog_height.toFixed(4) + "\n" // move up before starting spindle
        str += "M03\n" // spindle on clockwise
        str += "G04 P1\n" // give spindle 1 second to spin up
        //
        // follow segments
        //
        for (var seg = 0; seg < mod.path.length; ++seg) {
            //
            // move up to starting point
            //
            x = scale * mod.path[seg][0][0]
            y = scale * mod.path[seg][0][1]
            str += "G00Z" + jog_height.toFixed(4) + "\n"
            str += "G00X" + x.toFixed(4) + "Y" + y.toFixed(4) + "Z" + jog_height.toFixed(4) + "\n"
            //
            // move down
            //
            z = scale * mod.path[seg][0][2]
            str += "G01Z" + z.toFixed(4) + " F" + plunge_speed.toFixed(4) + "\n"
            str += "F" + cut_speed.toFixed(4) + "\n" //restore xy feed rate
            for (var pt = 1; pt < mod.path[seg].length; ++pt) {
                //
                // move to next point
                //
                x = scale * mod.path[seg][pt][0]
                y = scale * mod.path[seg][pt][1]
                z = scale * mod.path[seg][pt][2]
                str += "G01X" + x.toFixed(4) + "Y" + y.toFixed(4) + "Z" + z.toFixed(4) + "\n"
            }
        }
        //
        // finish
        //
        str += "G00Z" + jog_height.toFixed(4) + "\n" // move up before stopping spindle
        str += "M05\n" // spindle stop
        if (mod.coolanton.checked)
            str += "M09\n" // coolant off
        str += "M30\n" // program end and reset
        str += "%\n" // tape end
        //
        // output file
        //
        outputs.file.event(str)
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
