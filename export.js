module.exports.getDate = function (){

    let today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    date = today.toLocaleDateString("en-US", options);
    return date;
}


module.exports.getDay = function (){

    let today = new Date();

    var options = {
        weekday: "long"
    }
    day = today.toLocaleDateString("en-US", options);
    return day;
}