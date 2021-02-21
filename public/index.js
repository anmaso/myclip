var get = function(el){
  return document.getElementById(el);
}

var decode = function(value, secret){
  get('_value').value=CryptoJS.AES.decrypt(value, secret).toString(CryptoJS.enc.Utf8);
}

window.onload = function(){
  

  var value = get('_value').value;
  var secret = get('_secret').value;
  if(value){
    decode(value, secret)
  }
  
  get('send').onclick = function(){
  

    var value = get('_value').value;
    var secret = get('_secret').value;
    var key = get('_key').value;
    var encrypted = CryptoJS.AES.encrypt(value, secret);
    get('value').value=encrypted;
    get('key').value=key;
    get('form').submit();
  }
}   