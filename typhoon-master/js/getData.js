//ÌìÆø
function getForecastData(url, fn) {
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        success: function(data) {
            if (fn) fn(data)
        },
        error: function() {}

    });
}