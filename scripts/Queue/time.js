function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    
    // return d + " days, " + h + " hours, " + m + " minutes, " + s + " seconds.";

    formatted = s + ' seconds';

    if(m > 0) {
        formatted = m + ' minutes, ' + formatted;
    }
    if(h > 0) {
        formatted = h + ' hours, ' + formatted;
    }
    if(d > 0) {
        formatted = d + ' days, ' + formatted;
    }

    return formatted;
};