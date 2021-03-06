//
// path to DXF
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
    var name = 'path to DXF (unfinished)'
    //
    // initialization
    //
    var init = function() {
        mod.cutspeed.value = 20
        mod.plungespeed.value = 20
        mod.jogspeed.value = 75
        mod.jogheight.value = 5
        mod.spindlespeed.value = 10000
        mod.tool.value = 1
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
    }
    //
    // local functions
    //
    function make_path() {
        /*
        var units = 1/25.4
        var dx = mod.width/mod.dpi
        var nx = mod.width
        var scale = dx/(nx-1)
        str = "999\nDXF written by mods\n"
        str += "0\nSECTION\n"
        str += "2\nHEADER\n"
        str += "9\n$ACADVER\n1\nAC1009\n"
        str += "9\n$EXTMIN\n"
        str += "10\n%f\n",units*v->xmin
        str += "20\n%f\n",units*v->ymin
        if (v->path->dof == 3)
           str += "30\n%f\n",units*(v->zmin)
        str += "9\n$EXTMAX\n"
        str += "10\n%f\n",units*(v->xmin+v->dx)
        str += "20\n%f\n",units*(v->ymin+v->dy)
        if (v->path->dof == 3)
           str += "30\n%f\n",units*(v->zmin+v->dz)
        str += "0\nENDSEC\n"
        str += "0\nSECTION\n"
        str += "2\nTABLES\n"
        str += "0\nTABLE\n"
        str += "2\nLTYPE\n70\n1\n"
        str += "0\nLTYPE\n"
        str += "2\nCONTINUOUS\n"
        str += "70\n64\n3\n"
        str += "Solid line\n"
        str += "72\n65\n73\n0\n40\n0.000000\n"
        str += "0\nENDTAB\n"
        str += "0\nTABLE\n2\nLAYER\n70\n1\n"
        str += "0\nLAYER\n2\ndefault\n70\n64\n62\n7\n6\n"
        str += "CONTINUOUS\n0\nENDTAB\n"
        str += "0\nENDSEC\n"
        str += "0\nSECTION\n"
        str += "2\nBLOCKS\n"
        str += "0\nENDSEC\n"
        str += "0\nSECTION\n"
        str += "2\nENTITIES\n"
        //
        // follow segments
        //
        for (var seg = 0; seg < mod.path.length; ++seg) {

           x = v->path->segment->point->first->value;
           y = v->ny - v->path->segment->point->first->next->value;
           if (v->path->dof == 3)
              z = v->path->segment->point->first->next->next->value;
           x0 = units*(v->xmin+scale*x);
           y0 = units*(v->ymin+scale*y);
           if (v->path->dof == 3)
              z0 = units*(v->zmin+scale*z);

           //
           // move up to starting point
           //
           x = scale*mod.path[seg][0][0]
           y = scale*mod.path[seg][0][1]
           str += "Z"+jog_height.toFixed(4)+"\n"
           str += "G00X"+x.toFixed(4)+"Y"+y.toFixed(4)+"Z"+jog_height.toFixed(4)+"\n"
           //
           // move down
           //
           z = scale*mod.path[seg][0][2]
           str += "G01Z"+z.toFixed(4)+" F"+plunge_speed.toFixed(4)+"\n"
           str += "F"+cut_speed.toFixed(4)+"\n" //restore xy feed rate

           //
           // follow points
           //
           for (var pt = 1; pt < mod.path[seg].length; ++pt) {
           
              x = v->path->segment->point->first->value;
              y = v->ny - v->path->segment->point->first->next->value;
              if (v->path->dof == 3)
                 z = v->path->segment->point->first->next->next->value;
              x1 = units*(v->xmin+scale*x);
              y1 = units*(v->ymin+scale*y);
              if (v->path->dof == 3)
                 z1 = units*(v->zmin+scale*z);
              str += "0\nLINE\n"
              str += "10\n%f\n",x0
              str += "20\n%f\n",y0
              if (v->path->dof == 3)
                 str += "30\n%f\n",z0
              str += "11\n%f\n",x1
              str += "21\n%f\n",y1
              if (v->path->dof == 3)
                 str += "31\n%f\n",z1
              x0 = x1;
              y0 = y1;
              if (v->path->dof == 3)
                 z0 = z1;
                 
              //
              // move to next point
              //
              x = scale*mod.path[seg][pt][0]
              y = scale*mod.path[seg][pt][1]
              z = scale*mod.path[seg][pt][2]
              str += "G01X"+x.toFixed(4)+"Y"+y.toFixed(4)+"Z"+z.toFixed(4)+"\n"

              }
           }
        //
        // finish
        //
        str += "0\nENDSEC\n"
        str += "0\nEOF\n"
        //
        // output file
        //
        outputs.file.event(str)
        */
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
