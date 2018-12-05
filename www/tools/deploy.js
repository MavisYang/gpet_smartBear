const evJson = JSON.parse(process.env.npm_config_argv)
const param = evJson.original[evJson.original.length-1].slice(2)
console.log(`env--${param}`);
var configJson = require('../configPath.json');
var _ = require('lodash')
var realobj = configJson[param]
var fs = require('fs')

// const html = (modules) => `<!doctype html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8">
//     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
//     <meta http-equiv="X-UA-Compatible" content="IE=8">
//     <meta name="viewport" content="width=750,user-scalable=no,target-densitydpi=device-dpi, user-scalable=no">
//     <meta http-equiv="Expires" content="0">
//     <meta http-equiv="Pragma" content="no-cache">
//     <meta http-equiv="Cache-control" content="no-cache">
//     <meta http-equiv="Cache" content="no-cache">
//     <meta name="viewport" content="width=750,user-scalable=no,target-densitydpi=device-dpi">
//     <link rel="icon" href="images/logo_lizicloud_web.png" type="image/x-icon"/>
//     <script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
//     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.3.3/css/swiper.min.css">
//     ${modules}
//     <title>栗子云</title>
//   </head>
//   <body>
//     <div class="app" id="root"></div>
//     <!--
//       This HTML file is a template.
//       If you open it directly in the browser, you will see an empty page.

//       You can add webfonts, meta tags, or analytics to this file.
//       The build step will place the bundled scripts into the <body> tag.

//       To begin the development, run "npm start" in this folder.
//       To create a production bundle, use "npm run build".
//     -->
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.3.3/js/swiper.min.js"></script>
//   </body>
// </html>
// `
// // 插入css
// fs.readdir(`${process.cwd()}/public/css`, (err, files) => {
// // /(?<=_)(\S*)(?=.css)/g
//     let regexp = /_(\S*)(?=.css)/gi;

//     const files_sorted = _.sortBy(files.filter(v => v != '.DS_Store'), (o) => {
//             return parseInt(o.match(regexp)[0].slice(1))
//         }
//     )
//     const cssLinks =
//         files_sorted
//             .map(v =>
//                 `<link rel="stylesheet" href="${realobj.accessPath}/css/${v}">`
//             )
//             .join('\n')

//     const wholeHtml = html(cssLinks)
//     fs.writeFile(`${process.cwd()}/public/index.html`, wholeHtml, 'utf8', (err) => {
//         if (err) return console.log(err);
//     });

//     console.log('css -- inserted');
// })
// 替换pathNam
fs.readFile(`${process.cwd()}/src/constants/OriginName.js`,
    'utf8', (err, data) => {
        if (err) {
            return console.log(err);
        }

        var regx = /ORIGIN_NAME = .*/


        var data = data.replace(regx,
            `ORIGIN_NAME = '${realobj.serverPath.originName}'`)

        fs.writeFile(`${process.cwd()}/src/constants/OriginName.js`, data, 'utf8', (err) => {

            if (err) return console.log(err);

        });

        // console.log('pathname -- changed');

    })

// 替换webpack打包path
fs.readFile(`${process.cwd()}/node_modules/react-scripts/config/paths.js`,
'utf8', (err,data) => {
  if (err) {
    return console.log(err);
  }
  var regx = /envPublicUrl = .*/
  var data = data.replace(regx,
    `envPublicUrl = '${realobj.accessPath}'`)

  fs.writeFile(`${process.cwd()}/node_modules/react-scripts/config/paths.js`,   data, 'utf8',  (err) => {

     if (err) return console.log(err);

  });
  console.log('config-path -- changed');
})
