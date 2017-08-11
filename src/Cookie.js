// Cookie helper functions thanks to w3schools.com
// https://www.w3schools.com/js/js_cookies.asp
class Cookie{
    static setCookie (cname, cvalue, hours){
        let d = new Date();
        d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    
    static getCookie (cname){
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        
        return "";
    }
}
export default Cookie;
