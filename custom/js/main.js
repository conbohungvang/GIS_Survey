
// All Global Variable

var draw;
var tf='';
var geo;
var flagIsDrawingOn = false;
var selectedGeomType;
var clickdraw='false';
var account; 
var listfarm=[];
var datafarm=[];
var dataaonuoi=[];
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}
(function checkCookie() {
    var username=getCookie("usergis");
    if (username!="") { 
        account = username;
        loadck(account);
        
        var inn='<div class="btn-group"><button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+account+'</button><div class="dropdown-menu"><a class="dropdown-item" onclick="startclicklogout()" href="#">Đăng xuất</a></div></div>'
        document.getElementById('login').innerHTML = inn
        console.log("Welcome again " + username);
    }
})();


var rome = [105.4273222,10.5183484];
console.log(ol.proj.fromLonLat(rome));

function convertCoordinates(lon, lat) {
    var x = (lon * 20037508.34) / 180;
    var y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
    y = (y * 20037508.34) / 180;
    return [x, y];
  }
console.log(convertCoordinates(105.4273222,10.5183484));
console.log(ol.proj.transform([11713042.053424716,1201360.773324848], 'EPSG:3857','EPSG:4326'));
var ip=self.location.hostname;
if(ip=="localhost"){
    ip=ip+":8080";
}
console.log(ip);
function ipcood(string1){
    return temp1 = [parseFloat(string1.substr(0,string1.indexOf(","))),parseFloat(string1.substr(string1.indexOf(",")+1,20))];
}
// Custom popup
// Popup overlay with popupClass=anim
var popup = new ol.Overlay.Popup ({
    popupClass: "default anim", //"tooltips", "warning" "black" "default", "tips", "shadow",
    closeBox: true,
    onclose: function(){ console.log("You close the box"); },
    positioning: 'auto',
    autoPan: true,
    autoPanAnimation: { duration: 100 }
  });
// Custom Control
 /**
       * Define a namespace for the application.
       */
      window.app = {};
      var app = window.app;


      //
      // Define rotate to north control.
      //


      /**
       * @constructor
       * @extends {ol.control.Control}
       * @param {Object=} opt_options Control options.
       */
      app.DrawingApp = function(opt_options) {

        var options = opt_options || {};

        var button = document.createElement('button');
        button.id = 'drawbtn'
        button.innerHTML = '<i class="fas fa-pencil-ruler"></i>';

        var this_ = this;
        var startStopApp = function() {
           
           if(account != null){
                if (flagIsDrawingOn == false){
                    startDraw('Polygon')
    //    $('#startdrawModal').modal('show')
       
                } else {
                    map.removeInteraction(draw)
                    flagIsDrawingOn = false
                    document.getElementById('drawbtn').innerHTML = '<i class="fas fa-pencil-ruler"></i>'
                     defineTypeofFeature('listfarming1')
                    $("#enterInformationModal").modal('show')

                }
            } else{
                startclicklogin();
            }
        };

        button.addEventListener('click', startStopApp, false);
        button.addEventListener('touchstart', startStopApp, false);

        var element = document.createElement('div');
        element.className = 'draw-app ol-unselectable ol-control';
        element.appendChild(button);

        ol.control.Control.call(this, {
          element: element,
          target: options.target
        });

      };
      ol.inherits(app.DrawingApp, ol.control.Control);


      //
      // Create map, giving it a rotate to north control.
      //



// View
var myview = new ol.View({
    center : [11736119.062399568, 1177530.2727850643],
    zoom: 18
})

// OSM Layer
var baseLayer = new ol.layer.Tile({
    source : new ol.source.OSM({
    })
})

var featureLayersourse = new ol.source.TileWMS({
    url:'http://'+ip+'/geoserver/survey_app/wms',
    params:{'LAYERS':'survey_app:drawnFeature', 'tiled' : true},
    serverType:'geoserver'
})
// Geoserver Layer

var featureLayer = new ol.layer.Tile({
    source:new ol.source.TileWMS({
        url:'http://'+ip+'/geoserver/survey_app/wms?cql_filter=user=%27""%27',
        params:{'LAYERS':'survey_app:drawnFeature', 'tiled' : true},
        serverType:'geoserver'
        
    })
})


// Draw vector layer 
// 1 . Define source
var drawSource = new ol.source.Vector()
// 2. Define layer
var drawLayer = new ol.layer.Vector({
    source : drawSource
})
// Layer Array
var layerArray = [baseLayer,featureLayer,drawLayer]
// var layerArray = [baseLayer,drawLayer]
// Map
var map = new ol.Map({
    controls: ol.control.defaults({
        attributionOptions: {
          collapsible: false
        }
      }).extend([
        new app.DrawingApp()
      ]),
    target : 'mymap',
    view: myview,
    layers:[baseLayer,featureLayer,drawLayer],
    overlays: [popup]
})
// var tab=new ol.layer.VectorImage({
//     source: new ol.source.Vector({
//             url: 'https://geoserver.ctu.edu.vn/geoserver/ctu/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ctu%3AdrawnFeature&maxFeatures=50&outputFormat=application%2Fjson',
//             format: new ol.format.GeoJSON()
//         }),
//     visible: true,
//     title: 'tabCTU'
// })
// map.addLayer(tab);

if(account!=null){
    var newsourse = new ol.source.TileWMS({
        url:'http://'+ip+'/geoserver/survey_app/wms?cql_filter=user=%27'+account+'%27',
        params:{'LAYERS':'survey_app:drawnFeature', 'tiled' : true},
        serverType:'geoserver'
    })
    featureLayer.setSource(newsourse)
}
function addInteraction() {
    var type = 'Polygon'
    draw = new ol.interaction.Draw({
      source: drawSource,
      type: type,
    });
    map.addInteraction(draw);
    var listener;
    draw.on('drawstart',
        function(evt) {
          // set sketch
          var sketch = evt.feature;

          /** @type {ol.Coordinate|undefined} */
          var tooltipCoord = evt.coordinate;

          listener = sketch.getGeometry().on('change', function(evt) {
            var geom = evt.target;
            console.log("du lieu: "+geom)
            var output;
              output = formatArea(geom);
              tooltipCoord = geom.getInteriorPoint().getCoordinates();
              dt=output;
          console.log(dt)
          });
        }, this);
        draw.on('drawend',
        function() {
              map.removeInteraction(draw);
              flagIsDrawingOn = false
                    document.getElementById('drawbtn').innerHTML = '<i class="fas fa-pencil-ruler"></i>'
                    defineTypeofFeature('listfarming1')
                    $("#enterInformationModal").modal('show')
        }, this);
        // map.removeInteraction(draw)
  }
// draw.on('drawstart',function(evt) {
//     alert("111111111111")
//      map.removeInteraction(draw)
//      geeom=evt.target
//      geeom instanceof ol.geom.Polygon
//      formatArea(geeom)
//      flagIsDrawingOn = false
//      document.getElementById('drawbtn').innerHTML = '<i class="fas fa-pencil-ruler"></i>'
//      defineTypeofFeature()
     
//      $("#enterInformationModal").modal('show')
 
//      // map.removeInteraction(draw)
//  },this)

// baseLayer.setSource(null)
// map.removeLayer(layerArray);
// a normal select interaction to handle click
      var select = new ol.interaction.Select();
      map.addInteraction(select);

      var selectedFeatures = select.getFeatures();

      // a DragBox interaction used to select features by drawing boxes
      var dragBox = new ol.interaction.DragBox({
        condition: ol.events.condition.platformModifierKeyOnly
      });

      map.addInteraction(dragBox);

      dragBox.on('boxend', function() {
        // features that intersect the box are added to the collection of
        // selected features
        var extent = dragBox.getGeometry().getExtent();
        vectorSource.forEachFeatureIntersectingExtent(extent, function(feature) {
          selectedFeatures.push(feature);
        });
      });

      // clear selection when drawing a new box and when clicking on the map
      dragBox.on('boxstart', function() {
        selectedFeatures.clear();
      });

      var infoBox = document.getElementById('info');

      selectedFeatures.on(['add', 'remove'], function() {
        var names = selectedFeatures.getArray().map(function(feature) {
          return feature.get('name');
        });
        try {
            if (names.length > 0) {
                infoBox.innerHTML = names.join(', ');
              } else {
                infoBox.innerHTML = 'No countries selected';
              }
        } catch (error) {
            console.log("No box");
        }
        
      });


// Function to start Drawing
function startDraw(geomType){
    selectedGeomType = geomType
    
    // draw = new ol.interaction.Draw({
    //     type:geomType,
    //     source:drawSource
    // })
    // // $('#startdrawModal').modal('hide')
   
    // map.addInteraction(draw)
    addInteraction()

    flagIsDrawingOn = true
    document.getElementById('drawbtn').innerHTML = '<i class="far fa-stop-circle"></i>'
}


// Function to add types based on feature
function defineTypeofFeature(a){
    var dropdownoftype = document.getElementById(a)
    // var dropdownoftype1 = document.getElementById('listfarming1')
    dropdownoftype.innerHTML = ''
    // dropdownoftype1.innerHTML = ''
    var opt = document.createElement('option')
            opt.value ="";
            opt.innerHTML = '<option value="">Chọn trại nuôi …</option>'
            dropdownoftype.appendChild(opt)
            // dropdownoftype1.appendChild(opt)
        for (i=0;i<listfarm.length;i++){
            var op = document.createElement('option')
            op.value = listfarm[i]
            op.innerHTML = listfarm[i]
            dropdownoftype.appendChild(op)
            // dropdownoftype1.appendChild(op)
        }
    // $("listfarming").prop("selected", false);
}
function infordata(adc,dataf,s,x){
    var dropdownoftype = document.getElementById(dataf)
    // var dropdownoftype1 = document.getElementById('listfarming1')
    dropdownoftype.innerHTML = ''
    
    var t=document.getElementById(adc)
        var bt= document.createElement('button')
        bt.id=s
        bt.addEventListener("click",function(){
            capnhat(s)
        })
        bt.value='sua'
        bt.className="btn btn-secondary"
        bt.innerHTML="Cập nhật"
        t.appendChild(bt)
        var bt1= document.createElement('button')
        bt1.id=x
        bt1.addEventListener('click',function(){
            if(x=='xoa'){
                $("#thongbaoxoa").modal('show')
            }else{
                tf='xoaao'
                $('#thongbaoxoaao').modal('show')
            }

        })
        bt1.value="xoatrai"
        bt1.className="btn btn-secondary"
        bt1.innerHTML="Đóng"
        t.appendChild(bt1)
    
    if(dataf=='datafarm'){
        var btn='<div class="input-group mb-1" style="margin-top: 10px;"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-default1">Tên trại nuôi:</span></div><input type="text" class="form-control" value="'+datafarm[0]+'" id="f0" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" style="margin-right: 8px;"></div><div class="input-group mb-1" style="margin-top: 10px;"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-default2">Quản lý/chủ hộ</span></div><input type="text" class="form-control" value="'+datafarm[1]+'" id="f1" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" style="margin-right: 8px;"></div><div class="input-group mb-1" style="margin-top: 10px;"><div class="input-group-prepend"> <span class="input-group-text" id="inputGroup-sizing-default3">Địa chỉ</span></div><input type="text" class="form-control" value="'+datafarm[2]+'" id="f2" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" style="margin-right: 8px;"></div><div class="input-group mb-1" style="margin-top: 10px;"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-default4">Điện thoại</span></div><input type="text" class="form-control" value="'+datafarm[3]+'" id="f3" a'
            dropdownoftype.innerHTML = btn+'ria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" style="margin-right: 8px;"></div><div class="input-group mb-1" style="margin-top: 10px;"><div class="input-group-prepend"> <span class="input-group-text" id="inputGroup-sizing-default5">Hình thức nuôi</span></div><input type="text" class="form-control" value="'+datafarm[4]+'" id="f4" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" style="margin-right: 8px;"></div><div class="input-group mb-1" style="margin-top: 10px;"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-default6">Đối tượng nuôi</span></div><input type="text" class="form-control" value="'+datafarm[5]+'" id="f5" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" style="margin-right: 8px;"></div><div class="input-group mb-1" style="margin-top: 10px;"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-default7">Diện tích/㎢ </span></div><input type="text" class="form-control" value="'+datafarm[6]+'" id="f6" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" style="margin-right: 8px;"></div>'
          for(i=0;i<7;i++){
              var f='f'+i
              document.getElementById(f).disabled = true
            //   console.log(i)
          }
    }else{
        dropdownoftype.innerHTML='<div class="input-group mb-1" style="margin-top: 10px;"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-default1">Tên ao nuôi:</span></div><input type="text" class="form-control" value="'+dataaonuoi[0]+'" id="a0" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" style="margin-right: 8px;"></div><div class="input-group mb-1" style="margin-top: 10px;"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-default2">Địa chỉ </span></div><input type="text" class="form-control" value="'+dataaonuoi[1]+'" id="a1" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" style="margin-right: 8px;"></div><div class="input-group mb-1" style="margin-top: 10px;"><div class="input-group-prepend"> <span class="input-group-text" id="inputGroup-sizing-default3">Diện tích ao</span></div><input type="text" class="form-control" value="'+dataaonuoi[2]+'" id="a2" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" style="margin-right: 8px;"></div>'
          for(i=0;i<3;i++){
              var a='a'+i
              document.getElementById(a).disabled = true
            //   console.log(i)
          }
    }
    
}
function xoa(){
    console.log(account)
    if(tf==''){
        var f=document.getElementById('f0').value
    console.log(f)
    $.ajax({
        url:'dangky.php',
        type:'POST',
        data :{
            check: "xoa",
            idnamefarm: f,
            user: account
        },
        success : function(dataResult){
            console.log(dataResult)
            var result = JSON.parse(dataResult)
            console.log(result)
            if (result.statusCode == 201){
                alert('Xóa Không Thành Công!')
                
            } else {
                $('#thongbaoxoa').modal('hide')
                // alert("Đã xóa thành công")
                location.reload()
            }
        }
    })
    }else{
                var f2= document.getElementById('a0').value;
                console.log(f2)
                $.ajax({
                    url:'dangky.php',
                    type:'POST',
                    data :{
                        check: "xoaao",
                        idnamefarmao: f2,
                        user: account
                    },
                    success : function(dataResult){
                        console.log(dataResult)
                        var result = JSON.parse(dataResult)
                        console.log(result)
                        if (result.statusCode == 201){
                            console.log('Cập nhật thất bài!')
                            alert("Quá trình thất bại")
                        } else {
                            for(i=0;i<3;i++){
                                var a='a'+i
                                document.getElementById(a).disabled = true
                            }
                            
                            $('#thongbaoxoaao').modal('hide')
                            // alert("Đã đóng ao thành công")
                            location.reload()
                            
                        }
                    }
                })
                tf=''
    }
    
}
function capnhat(s){
    var sua=document.getElementById(s)
    // console.log(s.value)
    
    
        if(s=='sua'){
            if(sua.value=="sua"){
                for(i=1;i<7;i++){
                    var f='f'+i
                    document.getElementById(f).disabled = false
                }
                sua.value='save'
                sua.innerHTML='Lưu'
                // console.log(s.value)
            }else
            if(sua.value=="save"){
            var f=[];
            // f[0]=document.getElementById('f0').value()
            // console.log(f[0])
        for(i=0;i<7;i++){
            var t='f'+i
            f[i]=document.getElementById(t).value;
            // console.log(f[i])
        }
        $.ajax({
            url:'dangky.php',
            type:'POST',
            data :{
                check: "edit",
                idnamefarm: f[0],
                manafarm: f[1],
                addrfarm: f[2],
                phonefarm:f[3],
                htfarm:f[4],
                dtfarm:f[5],
                area:f[6],
            },
            success : function(dataResult){
                console.log(dataResult)
                var result = JSON.parse(dataResult)
                console.log(result)
                if (result.statusCode == 201){
                    console.log('Cập nhật thất bài!')
                    
                } else {
                    sua.value='sua'
                    sua.innerHTML="Cập nhật"
                    for(i=0;i<7;i++){
                        var f='f'+i
                        document.getElementById(f).disabled = true
                    }
                    // listfarm.length=[];
                    // console.log(listfarm)
                    // result.forEach(function(array) {
                    //     listfarm.push(array[0]);
                    //   });

                    // defineTypeofFeature('listfarming')
                    // console.log(listfarm)
                    alert("Đã cập nhật thành công")
                }
            }
        })
    }
        }else{
            if(sua.value=="sua"){
                document.getElementById('a1').disabled = false
                sua.value='save'
                sua.innerHTML='Lưu'
            }else
            if(sua.value=="save"){
                var f1= document.getElementById('a1').value;
                var f2= document.getElementById('a0').value;
                console.log(f1,f2)
                $.ajax({
                    url:'dangky.php',
                    type:'POST',
                    data :{
                        check: "editao",
                        idnamefarm: f2,
                        add: f1
                    },
                    success : function(dataResult){
                        console.log(dataResult)
                        var result = JSON.parse(dataResult)
                        console.log(result)
                        if (result.statusCode == 201){
                            console.log('Cập nhật thất bài!')
                        } else {
                            sua.value='sua'
                            sua.innerHTML="Cập nhật"
                            for(i=0;i<3;i++){
                                var a='a'+i
                                document.getElementById(a).disabled = true
                            }
                            alert("Đã cập nhật thành công")
                        }
                    }
                })
            }
        }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires+";"+" path=/";
}

function loadck(acc) {
        $.ajax({
            url:'login.php',
            type:'POST',
            data :{
                typeofgeom:"",
                nameofgeom:"",
                loadaccount: acc
            },
            success : function(dataResult){
                 console.log(dataResult)
                var result = JSON.parse(dataResult)
                 console.log(result)
                if (result.statusCode == 201){
                    console.log('data not Login faill successfully')
                    
                } else {
                    listfarm.length=[];
                    //console.log(listfarm)
                    result.forEach(function(array) {
                        listfarm.push(array[0]);
                      });
                    defineTypeofFeature('listfarming')
                    // console.log(listfarm)
                }
            }
        })
}
// FUnction login
function logintodb(){
    
        var user = document.getElementById('userid').value
        var pass = document.getElementById('pwd').value
        // var geom = JSON.stringify(geojsonFeatureArray[i].geometry)
        if (user != ''){
            $.ajax({
                url:'login.php',
                type:'POST',
                data :{
                    typeofgeom : user,
                    nameofgeom : pass,
                    loadaccount: ""
                },
                success : function(dataResult){
                    console.log(dataResult.trim());
                    if( dataResult.trim()==""){
                        account = user;
                        setCookie("usergis",account,10);
                        console.log("vao 1");
                        // location.reload();
                        var inn='<div class="btn-group"><button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+account+'</button><div class="dropdown-menu"><a class="dropdown-item" onclick="startclicklogout()" href="#">Đăng xuất</a></div></div>'
        document.getElementById('login').innerHTML = inn
                    }
                    else{
                    var result= JSON.parse(dataResult);
                    console.log(result);
                    if (result != "{\"statusCode\":201}"){
                        account = user;
                        console.log("vao 2");
                        setCookie("usergis",account,10);
                        listfarm.length=[];
                    //console.log(listfarm)
                        result.forEach(function(array) {
                        listfarm.push(array[0]);
                      });
                      defineTypeofFeature('listfarming')
                        // location.reload();
                        var inn='<div class="btn-group"><button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+account+'</button><div class="dropdown-menu"><a class="dropdown-item" onclick="startclicklogout()" href="#">Đăng xuất</a></div></div>'
        document.getElementById('login').innerHTML = inn
                        console.log('selected successfully ',account);
                    } else {
                        console.log('data not Login faill successfully')
                        // $("#startlogin").modal('hide');
                        alert('Đăng nhập thất bại vui lòng kiểm tra lại!')
                    }
                    }
                    
                }
            })
        } else {
            alert('Kiểm tra lại tên tài khoản')
        }
        
    }
var dt;
var formatArea = function(polygon) {
        var area = ol.Sphere.getArea(polygon);
        dt = (Math.round(area / 1000000 * 100) / 100)
        // if (area > 10000) {
        //   dt = (Math.round(area / 1000000 * 100) / 100) +
        //       ' ' + 'km';
        // } else {
        //   dt = (Math.round(area * 100) / 100) +
        //       ' ' + 'm';
        // }
        console.log(dt)
        return dt;
};
// Function to save information in db 
function savetodb(){
    // get array of all features 
    var type = document.getElementById('typeofFeatures').value
    var name = document.getElementById('listfarming1').value
    var addre = document.getElementById('addressao').value
    if(clickdraw =='false'){
        console.log(clickdraw)
        var featureArray = drawSource.getFeatures()
        // Define geojson format 
        var geogJONSformat = new ol.format.GeoJSON()
        // Use method to convert feature to geojson
        var featuresGeojson = geogJONSformat.writeFeaturesObject(featureArray)
        // Array of all geojson
        var geojsonFeatureArray = featuresGeojson.features
        for (i=0;i<geojsonFeatureArray.length;i++){
           
            var geom = JSON.stringify(geojsonFeatureArray[i].geometry)
            console.log(geom)
            // formatArea(geojsonFeatureArray[i])
            console.log(dt)
            addData(type,name,account,geom,addre,dt)
        }
    }
    if(clickdraw=='true'){
        if(account != null){
            // var g=(new ol.format.GeoJSON()).readFeatures(geo)
            var vectorSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(geo)
              });
            
            var featureArray = vectorSource.getFeatures()
            // Define geojson format 
            var geogJONSformat = new ol.format.GeoJSON()
            // Use method to convert feature to geojson
            var featuresGeojson = geogJONSformat.writeFeaturesObject(featureArray)
            // Array of all geojson
            var geojsonFeatureArray = featuresGeojson.features
            for (i=0;i<geojsonFeatureArray.length;i++){
                var geom = JSON.stringify(geojsonFeatureArray[i].geometry)
                addData(type,name,account,geom,addre,dt)
                clickdraw='false'
            }
        }else {
            startclicklogin();
        }
    }
}

function addData(type1,name1,account1,geom1,addre1,dt1){
    if (type1 != '' ){
        $.ajax({
            url:'save.php',
            type:'POST',
            data :{
                typeofgeom : type1,
                nameofgeom : name1,
                userid : account1,
                stringofgeom : geom1,
                addr : addre1,
                area : dt1
            },
            success : function(dataResult){
                console.log(dataResult)
                var result = JSON.parse(dataResult)
                if (result.statusCode == 200){
                    console.log('data added successfully');
                    alert('Tạo ao nuôi thành công.')
                } else {
                    console.log('data not added successfully');
                    alert('Tạo ao nuôi thất bại!')
                }

            }
        })
    } else {

        alert('please select type')
    }
// Update layer
var params = featureLayer.getSource().getParams();
params.t = new Date().getMilliseconds();
featureLayer.getSource().updateParams(params);

// Close the Modal
$("#enterInformationModal").modal('hide')

clearDrawSource ()
}

function dangkyacc(){
        var checked='true';
        var type = document.getElementById('userid1').value
        var name = document.getElementById('fullname').value
        var sex    
        var sexs = document.getElementsByName('fav_language');
        for (var i = 0; i < sexs.length; i++){
            if (sexs[i].checked){
                sex=sexs[i].value;
            }
        }
        var birth=document.getElementById('birth').value
        var addre=document.getElementById('address').value
        var pass=document.getElementById('pwd2').value
        var rpass=document.getElementById('rpwd2').value
        console.log(sex)
        if (type != '' && rpass==pass){
            $.ajax({
                url:'dangky.php',
                type:'POST',
                data :{
                    check : checked,
                    typeofgeom : type,
                    nameofgeom : name,
                    mysex: sex,
                    mybirth: birth,
                    myaddr: addre, 
                    pwd : pass
                },
                success : function(dataResult){
                    console.log(dataResult)
                    var result = JSON.parse(dataResult)
                    if (result.statusCode == 200){
                    
                        console.log('data added successfully')
                        $("#startdangky").modal('hide');
                        setCookie("usergis",type,10);
                        location.reload();

                    } else {
                        console.log('data not added successfully')
                        alert('loi dang ky')
                    }

                }
            })
        } else {

            alert('mat khau nhap lai khong dung')
        }

}
function startdkfarm(){
    if(account==null){
        $("#startlogin").modal('show');
    }else{
        $("#startdangkyfarm").modal('show');
    }
}

function dangkyfarm(){
    var checked='false';
    var idfarmname = document.getElementById('idfarmname').value
    var manager = document.getElementById('manager').value
    var addressfarm = document.getElementById('addressfarm').value
    
    var phone=document.getElementById('phone').value
    var hinhthuc=document.getElementById('hinhthuc').value
    var doituong=document.getElementById('doituong').value
    var areafarm=document.getElementById('areafarm').value
    if (idfarmname != ''){
        $.ajax({
            url:'dangky.php',
            type:'POST',
            data :{
                check : checked,
                userid : account,
                idnamefarm : idfarmname,
                manafarm : manager,
                addrfarm: addressfarm,
                phonefarm: phone,
                htfarm: hinhthuc, 
                dtfarm : doituong,
                area : areafarm
            },
            success : function(dataResult){
                console.log(dataResult)
                var result = JSON.parse(dataResult)
                if (result.statusCode == 200){
                    console.log('data added successfully')
                    $("#startdangkyfarm").modal('hide');
                    loadck(account)
                } else {
                    console.log('data not added successfully')
                    alert('loi dang ky')
                }

            }
        })
    } else {

        alert('vui long dat ten cho trang trai')
    }

}


function clearDrawSource (){
    drawSource.clear()
}


// Geolocation 
  // set up geolocation to track our position
  var geolocation = new ol.Geolocation({
    tracking: true,
    projection : map.getView().getProjection(),
    enableHighAccuracy: true,
  });
  // bind it to the view's projection and update the view as we move
  // geolocation.bindTo('projection', myview);
  geolocation.on('change:position', function() {
    myview.setCenter(geolocation.getPosition());
    addmarker(geolocation.getPosition())
  });
//   // add a marker to display the current location
  var marker = new ol.Overlay({
    element: document.getElementById('currentLocation'),
    positioning: 'center-center',
    // position:  geolocation
  });
  map.addOverlay(marker);
  // and bind it to the geolocation's position updates

  function addmarker(array){
  marker.setPosition(array);
//   myview.setZoom(16)
   }

  // create a new device orientation object set to track the device
  var deviceOrientation = new ol.DeviceOrientation({
    tracking: true
  });
  // when the device changes heading, rotate the view so that
  // 'up' on the device points the direction we are facing
  deviceOrientation.on('change:heading', onChangeHeading);
  function onChangeHeading(event) {
    var heading = event.target.getHeading();
    view.setRotation(-heading);
  }


// Get information about feature
map.on('click', function(evt){
    popup.hide(); 
    
    var resolution  = map.getView().getResolution();
    console.log(resolution);
    var coord = evt.coordinate
    console.log(coord);
    var projection = map.getView().getProjection()
    console.log(projection);
    try{
        var url = featureLayersourse.getGetFeatureInfoUrl(coord,resolution,projection,{'INFO_FORMAT':'application/json'})
        console.log(url)
    }
    catch(err){
        console.log(":404")
    }
    
    if (url){
        $.getJSON(url,function(data){
            try {
                var coodpoly=data.features[0].geometry.coordinates[0]
                console.log(coodpoly)
                var cpl=new ol.geom.Polygon([coodpoly],'XY')
                var areatemp=cpl.getArea()
                var output;
                if (areatemp > 10000) {
                    output= (Math.round(areatemp / 1000000 * 100) / 100) +' '+'km²';
                    } else {
                        
                        output = (Math.round(areatemp * 100) / 100) +' '+'m²';
                    }
                content = '<b>Tên ao</b> : '+data.features[0].properties.type +' <br> <b>Địa chỉ</b> : '+data.features[0].properties.add +' <br> <b> Diện tích ao </b> : '+output
                var sl= document.getElementById('listfarming').value
                dataaonuoi.length=[]
                dataaonuoi.push(data.features[0].properties.type)
                dataaonuoi.push(data.features[0].properties.add)
                dataaonuoi.push(output)
                console.log(sl)

                if(sl==""){
                   console.log(new String(data.features[0].properties.user.trim()))
                    if( data.features[0].properties.user.trim() == account){
                        console.log("chay222")
                        popshow(data.features[0].geometry.coordinates[0][0], content,data.features[0].properties.type);
                    }
                }else{
                    if (data.features[0].geometry.type == 'Polygon' && data.features[0].properties.name == sl){
                        console.log("if Tren")
                        popshow(data.features[0].geometry.coordinates[0][0], content,content,data.features[0].properties.type);  
                    }
                    else if((data.features[0].properties.name != sl) && data.feature[0].properties.user==account){
                        console.log("chay")
                    }
                }
            }
            catch(err) {
              console.log(":401")
            }
        })
    }
    
})
function popshow(a,b,c){
    popup.show(a,b)
    document.getElementById('dataaonuoi').innerHTML=''
    if(document.getElementById('suaao')!= null){
        document.getElementById('suaao').parentNode.removeChild(document.getElementById('suaao'));
        document.getElementById('xoaao').parentNode.removeChild(document.getElementById('xoaao'))
    }
        console.log("casssssssssss")
                    infordata('addfarm','dataaonuoi','suaao','xoaao')
}

document.getElementById("listfarming").addEventListener('change', function(){
    // console.log(account,farm)
    var farm=document.getElementById('listfarming').value
    var newsourse = new ol.source.TileWMS({
        url:'http://'+ip+'/geoserver/survey_app/wms?cql_filter=name=%27'+farm+'%27 and user=%27'+account+'%27',
        params:{'LAYERS':'survey_app:drawnFeature', 'tiled' : true},
        serverType:'geoserver'
    })
    featureLayer.setSource(newsourse)

    if(document.getElementById('sua')!= null){
        document.getElementById('sua').parentNode.removeChild(document.getElementById('sua'));
        document.getElementById('xoa').parentNode.removeChild(document.getElementById('xoa'))
    }
    
    console.log(farm)
    if(farm!=""){
        console.log("casssssssssss")
        $.ajax({
            url:'login.php',
            type:'POST',
            data :{
                trainuoi: farm,
                loadaccount: "infor"
            },
            success : function(dataResult){
                // console.log(dataResult)
                var result = JSON.parse(dataResult)
                console.log(result)
                if (result.statusCode == 201){
                    console.log('data not Login faill successfully')
                    
                } else {
                    datafarm.length=[]
                    result[0].forEach(function(array) {
                        datafarm.push(array);
                      });
                    infordata('adcfarm','datafarm','sua','xoa')
                    console.log(datafarm)
                }
            }
        })
    }
    else{
        document.getElementById('datafarm').innerHTML=''
        
    }
})

document.getElementById("dodai").addEventListener('click', function () {
    // adddata(geojsonObjecttest);
    
     
    var d;
    string1 = document.getElementById("1g").value;
    string2 =document.getElementById('2g').value;
    console.log(string1);
    // string2 = [22.564166,88.311934];
    temp1 = ipcood(string1);
    // temp1 = [parseFloat(string1.substr(0,string1.indexOf(","))),parseFloat(string1.substr(string1.indexOf(",")+1,20))];
    
    temp2 = [temp1,[parseFloat(string2.substr(0,string2.indexOf(","))),parseFloat(string2.substr(string2.indexOf(",")+1,20))]];
    console.log(temp2);
    var Feature = new ol.geom.LineString(temp2);
    console.log(Feature);
    var s=new ol.source.Vector({
        feature: [Feature]
    });
    var length = ol.Sphere.getLength(Feature);
    length=length*100000;
    console.log(length);
    if (length > 100) {
      d = (Math.round(length / 1000 * 100) / 100) +
          ' ' + 'km';
    } else {
      d = (Math.round(length * 100) / 100) +
          ' ' + 'm';
    }
    
      document.getElementById('dg').value=d;
  });

document.getElementById('3g').addEventListener('keyup' , function(){
    
    var no = document.getElementById('3g').value;
    console.log(no)
    var textfield=""
    for(var i=0;i<no;i++) {  
        textfield= textfield+'<input type="text" value = "" name="form-control" id="geo'+i+'">'    
         
        // var textfield = document.createElement("input");
        // textfield.type = "text"; textfield.value = "";
        // textfield.name="form-control"; 
        // textfield.id="geo"+i;
        // document.getElementById('pills-profile').appendChild(textfield);
    }
    document.getElementById('iner').innerHTML=textfield   
})


function confirm(){
    clickdraw='true'
    var no = document.getElementById('3g').value;
    var fts1=[];
    for(var i=0;i<no;i++) { 
        var id='geo'+i
        fts1[i]=ipcood(document.getElementById(id).value);
    }
    console.log(fts1);
    var tes=new ol.geom.Polygon([fts1],'XY')
    dt = (Math.round(tes.getArea() / 1000000 * 100) / 1000)
    // console.log(tes)
    console.log(dt)
    geo={
        'type': 'FeatureCollection',
    'crs': {
      'type': 'name',
      'properties': {
        'name': 'EPSG:3857'
      }
    },
    'features': [{
        'type': 'Feature',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [fts1]
        }
    }]
    }
    // adddata(geo);
    document.getElementById("3g").value="";
    defineTypeofFeature('listfarming1')
    $("#enterInformationModal").modal('show')

}
// var geojsonobj = function(){
//     var no = document.getElementById('3g').value;
//     var fts1=[];
//     for(var i=0;i<no;i++) { 
//         fts1[i]=ipcood(document.getElementById("geo"+i).value);
//         // console.log(fts1);
//     }
//     geo={
//         'type': 'FeatureCollection',
//     'crs': {
//       'type': 'name',
//       'properties': {
//         'name': 'EPSG:3857'
//       }
//     },
//     'features': [{
//         'type': 'Feature',
//         'geometry': {
//             'type': 'Polygon',
//             'coordinates': [fts1]
//         }
//     }]
//     }
//     // adddata(geo);
//     document.getElementById("3g").value="";
//     return geo;
// }
function startclicklogin(){
    console.log("da start clicklogin");
    if(account==null){
        $("#startlogin").modal('show');
    }
}

function startclicklogout(){
    document.cookie ="usergis=minhnhat; expires=Thu, 18 Dec 2016 12:00:00 UTC;path=/";
    console.log("da start clicklogout2");
    location.reload();
}
function endclicklogin(){
console.log("da end clicklogin");
logintodb();
//      

}
    function startclickdangky(){
        console.log("da start clickdangky111");
            $("#startdangky").modal('show');
        }
        