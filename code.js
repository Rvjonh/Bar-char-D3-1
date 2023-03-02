/* Here it's our code to develop the application */
window.addEventListener("DOMContentLoaded", main)

const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

function main() {
    fetch(URL).then(r => r.json())
        .then((r) => {
            drawBarChar(r.data)
        })
}

function drawBarChar(dataset) {
    const c = document.getElementById("graph")
    let W = c.clientWidth;
    let H = 500;
    let barWidth = W / 275;
    let P = 50;

    const svg = d3.select("#graph").append("svg").attr("width", W).attr("height", H)

    /* X axis */
    var yearsDate = dataset.map(function (item) {
        new_date = new Date(item[0])
        console.log(new_date)
        return new_date;
    });
    var xMax = new Date(d3.max(yearsDate));
    //xMax.setMonth(xMax.getMonth() + 3);

    var xScale = d3.scaleTime()
        .domain([d3.min(yearsDate), xMax])
        .range([P, W - P]);

    var xAxis = d3.axisBottom(xScale)

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + (H - P) + ')');

    /* Y axis */
    var GDP = dataset.map(function (item) {
        return item[1];
    });
    var gdpMax = d3.max(GDP);
    var yAxisScale = d3.scaleLinear().domain([0, gdpMax]).range([H - P, 0]);
    var yAxis = d3.axisLeft(yAxisScale);
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + P + ', 0)');


    var scaledGDP = [];
    var linearScale = d3.scaleLinear().domain([0, gdpMax]).range([0, H - P]);

    scaledGDP = GDP.map(function (item) {
        return linearScale(item);
    });

    svg.selectAll('rect')
        .data(scaledGDP)
        .enter()
        .append('rect')
        .attr('data-date', function (d, i) {
            return dataset[i][0];
        })
        .attr('data-gdp', function (d, i) {
            return dataset[i][1];
        })
        .attr('class', 'bar')
        .attr('x', function (d, i) {
            return xScale(yearsDate[i]);
        })
        .attr('y', function (d) {
            return H - d - P;
        })
        .attr('width', barWidth)
        .attr('height', function (d) {
            return d;
        })
        .attr('index', (d, i) => i)
        .style('fill', '#33adff')
        .on('mouseover', function (event, d) {
            let i = this.getAttribute('index');

            svg.append("rect")
                .attr("id", "tooltip")
                .attr("x", 50)
                .attr("y", 50)
                .attr("width", 100)
                .attr("height", 100)
                .attr("fill", "red")
                .attr("data-date", () => {
                    return dataset[i][0];
                })
        })
        .on('mouseout', function (event, d) {
            const tool = d3.select("#tooltip").remove()
        })

}