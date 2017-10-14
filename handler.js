var fs = require("fs");
var path = require("path");
var urlM = require("url");

var cookie = require("cookie");

var querystring = require("querystring");

//引用formidable(用来帮助我们进行上传文件的第三方包)
var formidable = require("formidable");

var heros = require("./modules.js");

//用来处理具体的请求逻辑：用来得到所有的数据
module.exports.getIndex = function(req,res){
    console.log(11);
    //得到数据库中的所有数据，我们需要通过heros对象，得到所有的数据
    heros.find({},(err,docs)=>{
        if(err) {
             return res.send("404 not find");
        }
        res.render("index.html",{
            heros: docs
        });
    });
}
module.exports.getAdd = function(req,res){
    res.render("add.html");
}
module.exports.postAdd = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if(err) {
            return res.end(returnObj(1,"fail"));
        }
        //去掉名称前面的img
        fields.img = path.basename(fields.img);
        //通过heros来向数据库中添加一个对象
        //如果要向数据库中添加对象，需要先new一个heros对象，然后调用对象的save方法将数据保存到数据库
        var h = new heros();
        h.id = 1;
        h.name = fields.name;
        h.gender = fields.gender;
        h.img = fields.img;
        h.save(function(err,reslut){
            if(err) {
                // return res.end(returnObj(1,"fail"))
                return res.json({
                    statu: 1,
                    msg: "fail"
                });
            }
            res.json({
                statu:0,
                msg: "success"
            });
        });

        // var isTrue = mmodule.add(fields,function(err){
        //     if(err) {
        //         return res.end(returnObj(1,"fail"));
        //     }
        //     res.end(returnObj());
        // });
    });
}
module.exports.postUpload = function(req,res){
    //2.0接收上传过来看文件
     //创建一个formideble对象
     var form = new formidable.IncomingForm();
     
         //由于formideble会自动将文件保存在一个临时目录下，所以我们需要将保存的路径进行修改：/img
         form.uploadDir = "./img/";
         //保留文件的扩展名
         form.keepExtensions = true;
         //这个对象调用parse方法时，会自动帮助我们接收从浏览器传递过来的文件和属性（字段）
         //parse方法：
         //  参数一：请求对象
         //  参数二：回调函数
         //      err:接收参数时错误的情况
         //      fields：得到浏览器上传过来的所有的字段（键值对）
         //      files：得到上传过来的文件的的集合
         var obj = {};
         form.parse(req, function(err, fields, files) {
             //将文件的名称返回到浏览器
             if(err) {
                // return res.end(returnObj(1,"fail"));
                 return res.json({
                    statu: 1,
                    msg: 'fail'
                 });
             } 
            else {
               res.json({
                    statu: 0,
                    msg: "success",
                    src: path.basename(files.img.path)
               });
            }
             
         });
}
module.exports.getEdit = function(req,res){
    //得到修改页面
    var url = req.url;//http://localhost:3000/edit.html?id=59df130b94b2b14bffe54094  url
    var aa = urlM.parse(url,true).query.id;
    // var aa = "59df130b94b2b14bffe54094";
    console.log(aa);
    aa = aa.substring(1);
    console.log(aa);
    aa = aa.substring(0,aa.length-1)
    console.log(aa);
    heros.findById(aa,(err,docs)=>{
        if(err) {
            return res.end(err.message);
        }
        // console.log(docs);
    });
    // heros.find({_id:id},function(err,doc){
    //     if(err) {
    //         return res.send("404");
    //     }
    //     console.log(doc);
    // });
    
    // mmodule.getDataById(id,function(err,obj){
    //     if(err) {
    //         return res.end("404");
    //     }
    //     res.render("edit.html",obj);
    // });    
}
module.exports.postEdit = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if(err) {
            return res.end(returnObj(1,"fail"));
        }
        fields.img = path.basename(fields.img);
        mmodule.edit(fields,function(err){
            if(err) {
                return res.json({
                    statu: 1,
                    msg: 'fail'
                });
            }
            //res.json方法是由express框架来提供的
            res.json({
                statu: 0,
                msg: "success"
            });
        });
    });
    //接收参数
    // var form = new formidable.IncomingForm();
    // form.parse(req, function(err, fields, files) {
    //    //根据id找到原本的数据
    //    fs.readFile("./data.json",function(err,data){
    //        var arr = JSON.parse(data.toString()).heros;
    //        fields.img = path.basename(fields.img);
    //        for(var i = 0 ; i < arr.length; i++) {
    //            if(arr[i].id == fields.id) {
    //             //    for(key in fields) {//forin在遍历数组时key 对应 元素的下标，遍历对象时key对应的是对象的属性
    //             //        arr[i][key] = fields[key];//id name gender img
    //             //    }
    //             arr[i] = fields;
    //             break;
    //            }
    //        }
    //        //重新将数组转为一个对象
    //        var resObj = {
    //            heros: arr
    //        }
    //        //重新将数据提交到data.json
        
    //        var returnObj = {};

    //        fs.writeFile("./data.json",JSON.stringify(resObj,null,"  "),function(err){
    //            if(err) { 
    //             returnObj.statu = 1;
    //             returnObj.msg = "修改失败";
    //            } else {
    //             returnObj.statu = 0;
    //             returnObj.msg = "修改成功";
    //            }
    //            res.end(JSON.stringify(returnObj));
    //        });
           
    //    })
    // });
}
module.exports.getDel = function(req,res) {
    var url = req.url;
    var id = urlM.parse(url,true).query.id;
   //根据id找到数据并且删除
   fs.readFile("./data.json",function(err,data){
       var obj = JSON.parse(data.toString());
       for(var i = 0 ; i < obj.heros.length ; i ++) {
           if(obj.heros[i].id == id) {
                //删除元素
                obj.heros.splice(i,1);
                break;
           }
       }
       var returnObj = {};
       //重新将对象写入到data.json中
       fs.writeFile("./data.json",JSON.stringify(obj,null,"  "),function(err){
           if(err) {  
            returnObj.statu = 1;
            returnObj.msg = "删除失败";
           }else {
            returnObj.statu = 0;
            returnObj.msg = "删除成功";
           }
           res.end(JSON.stringify(returnObj));
       });
   });
}
module.exports.getStatic = function(req,res){
    //单独处理静态资源
    var url = "." + req.url;
    fs.readFile(url,function(err,data){
        if(err) {
            return res.end("404 not found");
        }
        res.end(data);
    });
}
module.exports.get404 = function(req,res){
    res.end("404 not found");
}
module.exports.getLogin = function(req,res) {
    res.render("login.html");
}

module.exports.postLogin = function(req,res) {
    console.log("login");
    var str = "";
    req.on("data",function(chuck){
        str += chuck;
    });
    req.on("end",function(){
        //验证参数：
        var query = querystring.parse(str);
        // console.log(query);
        if(query.uName == "admin" && query.pwd == "888") {
            //如果用户名和密码正确，需要将用户名和密码保存到cookie
            //保存用户信息应该作用session
            req.session.views = query.uName;
            // // console.log(req.session.views);
            
            //判断参数中是否有isremember，如果有说明用户设置七天免登录，
            //如果没有不用理会
            if(query.isRemember) {
                //做免登录
                //将用户信息保存到cookie中
                res.writeHeader(200,{
                    "content-type": "text/html;charset=utf-8",
                    "set-cookie": cookie.serialize('uName', String(query.uName), {
                      maxAge: 60 * 60 * 24 * 7 // 1 week 
                    })
                });
            }
            res.end("<script>alert('登录成功');window.location='/'</script>");
        } else {
            res.writeHeader(200,{
                "content-type": "text/html;charset=utf-8"
            });
            res.end("<script>alert('登录失败');window.location='/login'</script>");
        }
    });
}