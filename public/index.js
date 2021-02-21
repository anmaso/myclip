var get = function(el){
  return document.getElementById(el);
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