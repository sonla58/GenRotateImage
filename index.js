#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const Jimp = require('jimp');

program
  .version('1.0.0')
  .command('rotate <dir>')
  .option('-s,--scale <n>', 'Scale before rotate')
  .option('-c,--color [color]')
  .action(function (dir, cmd) {
      console.log("rotate " + dir + " with: " + cmd.scale + " " + cmd.color);
      rotateImage(dir, cmd.scale, cmd.color);
  });
  program.parse(process.argv);

function rotateImage(path, scale, color) {
    console.log("👹 Starting rotate image: %j", path);
    fs.readFile(path, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            let name = path.split(".")[0];
            for (let i = 0; i < 2; i++) {
                Jimp.read(path).then(image =>{
                    var _scale = 1;
                    var rollBackScale = 1;
                    if (scale !== 'undefined') {
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
                    console.log(_scale + "\n" + rollBackScale);
                    var result = image.scale(_scale).rotate(-i, true).scale(1/rollBackScale);
                    // if (color !== 'undefined') {
                        
                    // }
                    return result.write(name + i + ".png");
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    });
}