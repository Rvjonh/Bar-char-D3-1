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

    const tooltip = d3.select("#graph")
        .append("div")
        .attr('id', 'tooltip')
        .style('height', '80px')
        .style('width', '140px')
        .attr("class", "car-tooltip")
        .style('position', 'absolute')
        .style('opacity', 0)
        .style('font-size', '18px')

    const toolTime = d3.select("#tooltip").append("time")
    const toolMoney = d3.select("#tooltip").append("span")


    /* X axis */
    const xPositionScale = d3.scaleTime()
        .domain([
            d3.min(dataset, (d) => new Date(d[0])),
            d3.max(dataset, (d) => new Date(d[0])),
        ])
        .range([P, W - P]);

    const xAxis = d3
        .axisBottom(xPositionScale)
        .tickFormat((val) => new Date(val).getFullYear())
        .ticks(W / 60);

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
        .attr("x", (d, i) => xPositionScale(new Date(dataset[i][0])))
        .attr('y', function (d) {
            return H - d - P;
        })
        .attr('width', barWidth)
        .attr('height', function (d) {
            return d;
        })
        .attr('index', (d, i) => i)
        .attr('fill', '#33adff')
        .style("cursor", "pointer")
        .on('mouseover', function (e, d) {
            let i = this.getAttribute('index');

            const h = i / dataset.length
            e.target.style.fill = "rgba(11, 96, 12," + h + ")";

            tooltip.style("opacity", "1")
                .attr("data-date", () => {
                    return dataset[i][0];
                })
                .style("top", (e.clientY - 85) + "px")
                .style("left", d => {
                    new_x = e.clientX;
                    if (new_x > W / 2) {
                        new_x -= 140
                    }
                    return new_x + "px"
                })
            toolTime.text(dataset[i][0])
            toolMoney.text(dataset[i][1] + "$ Billion")
        })
        .on('mouseout', function (event, d) {
            event.target.style.fill = "#33adff";
            tooltip.style("opacity", "0")
        })

}