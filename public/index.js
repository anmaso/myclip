var get = function(el){
  return document.getElementById(el);
}

var decode = function(){
  var value = get('value').value;
  var secret = get('_secret').value;
  try {
    get('_value').value=CryptoJS.AES.decrypt(value, secret).toString(CryptoJS.enc.Utf8);  
  }catch(e){
    console.error(e);
  }
  
}

window.onload = function(){

  var value = get('value').value;
  
  if(value){
    decode()
    get('decode').onclick=decode;
  }
  
  get('usesecret').onclick=function(){
    get('_secret').style.display =  (get('usesecret').checked==true)?'inline':'none';
  }
  
  get('send').onclick = function(){
  

    var value = get('_value').value;
    var secret = get('_secret').value;
    var key = get('key').value;
    try {
    var encrypted = CryptoJS.AES.encrypt(value, secret);
    get('value').value=encrypted;
    get('key').value=key;
    get('length').value=value.length;
    get('secret').value=secret!='secret';
    get('form').submit();  
    }catch(e){
      alert(e)
    }
    
  }
}   