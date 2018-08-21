#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const Jimp = require('jimp');

program
  .version('1.0.4')
  .command('rotate <dir>')
  .option('-s,--scale <n>', 'Scale before rotate')
  .option('-d,--distance <n>', 'Distance degree rotate')
  .option('-c,--color <color>', 'Color with apply to PNG result')
  .action(function (dir, cmd) {
      rotateImage(dir, cmd.scale, cmd.color, cmd.distance);
  });
  program.parse(process.argv);

function rotateImage(path, scale, color, distance) {
    console.log(">>> Starting rotate image: %j with color %j", path, color);
    fs.readFile(path, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            let name = path.split(".")[0];
            var _distance = 1
            if (distance !== undefined) {
                _distance = distance
            }
            for (let i = 0; i < 360; i += Number(_distance)) {
                Jimp.read(path).then(image =>{
                    var _scale = 1;
                    var rollBackScale = 1;
                    if (scale !== undefined) {
                        if (scale > 4) {
                            _scale = Number(scale);
                            rollBackScale = 1;
                        } else {
                            _scale = 4;
                            rollBackScale = Number(4 / Number(scale));
                        }
                    } else {
                        _scale = 4;
                        rollBackScale = 4;
                    }
                    var result = image.scale(_scale).rotate(-i, true).scale(1/rollBackScale);
                    if (color !== undefined) {
                        // let rgb = hexToRgb(color);
                        result = result.color([
                            // { apply: 'red', params: rgb.r },
                            // { apply: 'green', params: rgb.g },
                            // { apply: 'blue', params: rgb.b }
                            { apply: 'mix', params: [color, 100] }
                        ]);
                    }
                    return result.write(name + i + ".png");
                }).catch(err => {
                    console.log(err);
                });
            }
            console.log(">>> Done");
        }
    });
}

function hexToRgb(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        let r = (c>>16)&255;
        let g = (c>>8)&255;
        let b = c&255;
        return {
            r: r,
            g: g,
            b: b
        }
    }
    throw new Error('Bad Hex');
}