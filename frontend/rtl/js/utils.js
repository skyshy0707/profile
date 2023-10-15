//Work with cookies:
function deleteCookie(cookie_name){
    var cookie_date = new Date();  // Current datetime
    cookie_date.setTime(cookie_date.getTime() - 1);
    document.cookie = `${cookie_name}=; domain=${document.domain};path=/;expires=" + cookie_date.toGMTString()`;
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function logout(){
    deleteCookie('access_token');
    deleteCookie('username');
}
