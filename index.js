#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const Jimp = require('jimp');

program
  .version('1.0.0')
  .command('rotate <dir>')
  .option('-s,--scale <n>', 'Scale before rotate')
  .option('-d,--distance <n>', 'Distance degree rotate')
  .option('-c,--color [color]')
  .action(function (dir, cmd) {
      rotateImage(dir, cmd.scale, cmd.color, cmd.distance);
  });
  program.parse(process.argv);

function rotateImage(path, scale, color, distance) {
    console.log(">>> Starting rotate image: %j", path);
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
                    // if (color !== 'undefined') {
                        
                    // }
                    return result.write(name + i + ".png");
                }).catch(err => {
                    console.log(err);
                });
            }
            console.log(">>> Done");
        }
    });
}