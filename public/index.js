var get = function(el){
  return document.getElementById(el);
}

var decodeValue = function(){
  var value = get('value').value;
  var secret = get('__secret') && get('__secret').value;
  if (!secret) return;
  try {
    get('_value').value=CryptoJS.AES.decrypt(value, secret).toString(CryptoJS.enc.Utf8);  
  }catch(e){
    console.error(e);
  }
  
}

window.onload = function(){

  var decode = get('decode');
  if(decode){
    decodeValue()
    decode.onclick=decodeValue;
  }
  
  var copy =get('copy');
  if (copy){
    copy.onclick= function() {
      const el = document.createElement('textarea');
      el.value = get('_value').value;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  }
  
   const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      };
  
  get('send').onclick = function(){
  

    var value = get('_value').value;
    var secret = get('_secret').value;
    var key = get('key').value;
    get('length').value=value.length;
    try {
      if (secret!=='secret'){
        value = CryptoJS.AES.encrypt(value, secret);
      }
    get('value').value=value;
    get('key').value=key;
    
    get('secret').value=secret!=='secret';
    get('destroy').value=get('_destroy').checked;
    get('form').submit();  
    }catch(e){
      alert(e)
    }
    
  }
}   