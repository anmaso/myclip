var get = function(el){
  return document.getElementById(el);
}

var decode = function(){
  var value = get('value').value;
  var secret = get('_secret').value;
  get('_value').value=CryptoJS.AES.decrypt(value, secret).toString(CryptoJS.enc.Utf8);
}

window.onload = function(){

  var value = get('value').value;
  
  if(value){
    decode()
  }
  
  get('_secret').onkeyup=decode;
  
  get('send').onclick = function(){
  

    var value = get('_value').value;
    var secret = get('_secret').value;
    var key = get('key').value;
    var encrypted = CryptoJS.AES.encrypt(value, secret);
    get('value').value=encrypted;
    get('key').value=key;
    get('form').submit();
  }
}   