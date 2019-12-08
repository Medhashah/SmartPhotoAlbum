var name = '';
var encoded = null;
var fileExt = null;

function previewFile(input){
  var reader  = new FileReader();
  name = input.files[0].name;
  fileExt = name.split(".").pop();
  var onlyname = name.replace(/\.[^/.]+$/, "");
  var finalName = onlyname + "_" + Date.now() + "." + fileExt;
  name = finalName;

  reader.onload = function (e) {
  var src = e.target.result;
  var newImage = document.createElement("img");
  newImage.src = src;
  encoded = newImage.outerHTML;
  }
  reader.readAsDataURL(input.files[0]);
}

function upload(){
  console.log(encoded)
  last_index_quote = encoded.lastIndexOf('"');
  if(fileExt == 'jpg' || fileExt == 'jpeg'){
    encodedStr = encoded.substring(33, last_index_quote);  
  }
  else{
      encodedStr = encoded.substring(32, last_index_quote);
  }
  var apigClient = apigClientFactory.newClient({apiKey: "wMXy986lUT8zshvOUKg4D3h684vSQBpu6kaFO8KW"});

  let params = { "bucket":"uploadphotohw3cc", "key": name, "Content-Type": "image/jpg;base64" };
    
    let additionalParams = {
        headers: {
            "Content-Type": "image/jpg;base64"
        }
    };

  apigClient.uploadBucketKeyPut(params, encodedStr, additionalParams)
  .then(function(result){
  console.log('success OK');
  alert ("Photo uploaded successfully!");
  }).catch( function(result){
  console.log(result);
  });
}
document.getElementById("displaytext").style.display = "none";

function searchPhoto()
{

  var apigClient = apigClientFactory.newClient({
                     apiKey: "wMXy986lUT8zshvOUKg4D3h684vSQBpu6kaFO8KW"
        });

    var searchTerm = document.getElementById('note-textarea').value;
    console.log(searchTerm)
    
    var user_message = document.getElementById('note-textarea').value;

    var params = {
  "q":searchTerm
  };
  var body = {
  "q":searchTerm
  };

  var additionalParams = {
  queryParams: {
  q: searchTerm
  },
 // headers: {
   // 'Access-Control-Allow-Origin': '9fn1x13h21.execute-api.us-east-1.amazonaws.com',
     // 'Access-Control-Allow-Credentials': true
  //}
  };
    
 
  
  console.log(params);
    apigClient.searchGet(params, body , additionalParams).then(function(res){
        console.log(res)
        var data = {}
        var data_array = []
        console.log(res.data == "")
        resp_data  = res.data.split(",")
        length_of_response = resp_data.length;
        if(res.data == "")
        {
          document.getElementById("displaytext").innerHTML = "No Images Found !!!"
          document.getElementById("displaytext").style.display = "block";

        }else{
        console.log(resp_data)
        console.log(resp_data.length)
        resp_data.forEach(function(obj) {
                  var json = {}
                  console.log(obj)
                  json["bannerImg1"] = obj;
                  data_array.push(json) }
                );

        data["images"] = data_array;
        console.log(data);
        data.images.forEach( function(obj) {

            var img = new Image();
            img.src = obj.bannerImg1;
            img.setAttribute("class", "banner-img");
            img.setAttribute("alt", "effy");
            document.getElementById("displaytext").innerHTML = "Images returnes are : "
            document.getElementById("img-container").appendChild(img);
            document.getElementById("displaytext").style.display = "block";

          });
      }
      }).catch( function(result){
          console.log("inside catch")
          console.log(result)

      });



}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // reader.onload = () => resolve(reader.result)
    reader.onload = () => {
      let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
}



function uploadPhoto()
{
   console.log("HERE")
   // var file_data = $("#file_path").prop("files")[0];
   var file = document.getElementById('file_path').files[0];
   console.log(file)
   const reader = new FileReader();
   var file_data;
   // var file = document.querySelector('#file_path > input[type="file"]').files[0];
   var encoded_image = getBase64(file).then(
     data => {
     var apigClient = apigClientFactory.newClient({
                     apiKey: "wMXy986lUT8zshvOUKg4D3h684vSQBpu6kaFO8KW"
     });
     console.log(data)
     // var data = document.getElementById('file_path').value;
     // var x = data.split("\\")
     // var filename = x[x.length-1]
     let params = { "bucket":"uploadphotohw3cc", "key": file.name, "Content-Type": "image/jpg;base64" };
    
    let additionalParams = {
        headers: {
            "Content-Type": "image/jpg;base64",
            "Access-Control-Allow-Origin" : '*'
        }
    };

    let body = data

    apigClient.uploadBucketKeyPut(params, body , additionalParams).then(function(res){
       print(res)
       if (res.status == 200)
       {
         document.getElementById("uploadText").innerHTML = "Image Uploaded  !!!"
         document.getElementById("uploadText").style.display = "block";
       }
     }).catch( function(res){
          console.log("inside catch")
          console.log(res)
      });
   });

}
