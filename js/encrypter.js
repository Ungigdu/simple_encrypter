const BASE64_CHARS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9','+','/','=']
const EMOJI_CHARS = ['0','1','2','3','4','5','6','7','8','9','Б','Д','Ж','Ф','П','Δ','ε','Σ','Ω','ﺏ','ﺝ','ﺹ','ف','=','🤬','🤯','好','🥵','🥶','😱','a','b','-','😓','🫣','(',')','[',']',':','*','?','_','~','$','^','¥','|','&','<','>','#','%',';','@','あ','い','う','え','お','さ','し','す','せ','そ']

function base64_to_emoji(base64_text){
    let chars = Array.from(base64_text)
    return chars.map((x)=>{
        let pos = BASE64_CHARS.indexOf(x)
        return EMOJI_CHARS[pos]
    }).toString().replace(/,/g, "")
}

function emoji_to_base64(emoji){
    let chars = Array.from(emoji)
    return chars.map((x)=>{
        let pos = EMOJI_CHARS.indexOf(x)
        return BASE64_CHARS[pos]
    }).toString().replace(/,/g, "")
}

//encode & decode functions, aes cbc
function aes_cbc_encrypt(text, secretKey) {
    var keyHash = CryptoJS.SHA256(secretKey).toString()
    var keyHex = CryptoJS.enc.Base64.parse(keyHash);
    var ivHex = keyHex.clone();
    // 前16字节作为向量
    ivHex.sigBytes = 16;
    ivHex.words.splice(4);
    var messageHex = CryptoJS.enc.Utf8.parse(text);
    var encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
        "iv": ivHex,
        "mode": CryptoJS.mode.CBC,
        "padding": CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

function aes_cbc_decrypt(textBase64, secretKey) {
    var keyHash = CryptoJS.SHA256(secretKey).toString()
    var keyHex = CryptoJS.enc.Base64.parse(keyHash);
    var ivHex = keyHex.clone();
    // 前16字节作为向量
    ivHex.sigBytes = 16;
    ivHex.words.splice(4);
    var decrypt = CryptoJS.AES.decrypt(textBase64, keyHex, {
        "iv": ivHex,
        "mode": CryptoJS.mode.CBC,
        "padding": CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt);
}

function aes_cbc_encrypt_to_emoji(text, secretKey) {
    return base64_to_emoji(aes_cbc_encrypt(text, secretKey))
}

function aes_cbc_decrypt_by_emoji(emoji, secretKey) {
    return aes_cbc_decrypt(emoji_to_base64(emoji), secretKey)
}

