
const CHART_WIDTH = 1000;
const CHART_HEIGHT = 500;
const FORMAT_TIME = d3.timeFormat("%M:%S");
const FORMAT_SECONDS = d => FORMAT_TIME(new Date(2016, 0, 1, 0, 0, d));

let chart = d3.select('.chart')
              .attr("width", CHART_WIDTH)
              .attr("height", CHART_HEIGHT)
              .append("g")
              .attr("transform", "translate(0,0)");

let x = d3.scaleTime().range([0, CHART_WIDTH]);
let y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

const buildXAxis = (x, callback) => {
  chart.append("g")
       .attr("transform", `translate(0,${CHART_HEIGHT})`)
       .call(d3.axisBottom(x).tickFormat(callback));

  chart.append("text")
       .attr("transform", `translate(${CHART_WIDTH/2},${CHART_HEIGHT+50})`)
       .attr("class", "axis-label")
       .text("Minutes behind Fastest Time");
}

const buildYAxis = (y) => {
  chart.append("g").attr("transform", "translate(0,0)").call(d3.axisLeft(y));

  chart.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", -75)
       .attr("x", -50)
       .attr("class", "axis-label")
       .attr("dy", "2em")
       .text("Ranking");
}

const formatTooltipText = (data) => {
  const LINE_WIDTH = 20;
  
  let text = `<tspan x=50% y=25 style="font-weight: bold;">${data.Name} ${data.Nationality}</tspan>`;
  text += `<tspan x=50% y=45 style="font-style: italic;"> ${data.Year}: ${data.Time}</tspan>`;

  let y = 75;
  let line = "";

  data.Doping.split(" ").map( (word) => {
    if (line.length + word.length > LINE_WIDTH + 1) { //1 is for the space
      text += `<tspan x=50% y=${y}>${line}</tspan>`;
      line = "";
      y += 15; // Move next line down
    }
    line += word + " ";
  });

  if (line) { 
    text += `<tspan x=50% y=${y}>${line}</tspan>`;
  }

  return text;
}

const renderTooltip = (data) => {
  d3.select("#tooltip").attr("fill-opacity", 1);
  let color = data.Doping ? "lightpink" : "lime";
  d3.select("#tooltip").attr("fill", color);
  d3.select("#tooltip text").html(formatTooltipText(data));
}

const hideTooltip = () => {
  d3.select("#tooltip").attr("fill-opacity", 0);
}


d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', (error, cyclistData) => {

  if (error) throw error;

  let lowestPlace = d3.max(cyclistData, d => d.Place);
  y.domain([lowestPlace+2, 1]);

  const MIN = d3.min(cyclistData, d => d.Seconds);
  const MAX = d3.max(cyclistData, d => d.Seconds);

  x.domain([MAX-MIN+15, -15]);

  buildYAxis(y);
  buildXAxis(x, FORMAT_SECONDS);

  let elem = chart.selectAll("cyclist").data(cyclistData);
  let elemEnter = elem.enter().append("g");

  elemEnter.append("circle")
           .attr("r", 5)
           .attr("cx", d => x(d.Seconds-MIN))
           .attr("cy", d => y(d.Place))
           .attr("fill", d => d.Doping ? "red" : "lime")
           .on("mouseout", () => hideTooltip())
           .on("mouseover", function() {
             renderTooltip(d3.select(this).datum());
           });

  elemEnter.append("text")
           .attr("dx", d => x(d.Seconds-MIN-3))
           .attr("dy", d => y(d.Place+0.25))
           .text(d => d.Name);
});
