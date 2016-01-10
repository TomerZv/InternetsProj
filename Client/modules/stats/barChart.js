function loadBarGraph() {
    var margin = { top: 40, right: 20, bottom: 30, left: 40 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var format = d3.format("d");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear().
    range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(2, format);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>Seconds:</strong> <span style='color:red'>" + d.duration + "</span>";
        })

    var svg = d3.select("#barChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    $.ajax({
        url: '/ads',
        type: 'GET',
        contentType: 'application/json',
    }).done(function (ads) {
        x.domain(ads.map(function (d) { return d.title; }));
        y.domain([0, d3.max(ads, function (d) { return d.duration; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Amount");

        svg.selectAll(".bar")
            .data(ads)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d.title); })
            .attr("width", x.rangeBand())
            .attr("y", function (d) { return y(d.duration); })
            .attr("height", function (d) { return height - y(d.duration); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
    });
}