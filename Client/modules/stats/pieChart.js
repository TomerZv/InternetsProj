function loadPieChart() {
    var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#ffbf00", "#cc5500", "#d2691e", "#ff3800", "#f97860"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (ad) { return ad.count; });

    var svg = d3.select("#pieChart").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    $.ajax({
        url: '/countAdsByLocation',
        type: 'GET',
        contentType: 'application/json',
    }).done(function (ads) {
        ads.forEach(function (ad) {
            ad.count = +ad.count;
        });

        var g = svg.selectAll(".arc")
            .data(pie(ads))
          .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return color(d.data._id.location);
            });

        g.append("text")
            .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(function (d) { return d.data._id.location; });
    });
}