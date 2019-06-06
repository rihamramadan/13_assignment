//create svg attributes
var svgWidth =925,
	svgHeight =680;

var margin = {
	t:50,
	r:50,
	b:100,
	l:100,
}; 

var width = svgWidth - margin.l - margin.r,
  height = svgHeight - margin.t - margin.b;
  
var svg = d3.select('#scatter')
	.classed('chart',true)
	.append('svg')
	.attr('width', svgWidth)
	.attr('height',svgHeight)

var chartGroup = svg.append('g')
	.attr('transform',`translate(${margin.l},${margin.t})`)

var userChoiceX = 'age',
  userChoiceY = 'healthcare';
  
d3.csv("./assets/data/data.csv").then( data =>{
	data.forEach( d =>{
		d.poverty = +d.poverty;
		d.age = +d.age;
		d.income = +d.income;
		d.obesity = +d.obesity;
		d.smokes = +d.smokes;
		d.healthcare = +d.healthcare;
	});

	var xScale = fetchXScaleForAxis(data,userChoiceX),
		yScale = fetchYScaleForAxis(data,userChoiceY);

	
	var xAxis = d3.axisBottom(xScale),
		yAxis = d3.axisLeft(yScale);

	var xAxis = chartGroup.append('g')
		.attr('transform',`translate(0,${height})`)
		.call(xAxis);
	var yAxis = chartGroup.append('g')
		.call(yAxis);

	var stateCircles = chartGroup.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.classed('stateCircle',true) 
		.attr('cx', d => xScale(d[userChoiceX]))
		.attr('cy', d => yScale(d[userChoiceY]))
		.attr('r' , 17)
		.attr('fill', '#89a9d3')
	
	var stateText = chartGroup.append('g').selectAll('text')
		.data(data)
		.enter()
		.append('text')
		.classed('stateText',true) 
		.attr('x', d => xScale(d[userChoiceX]))
		.attr('y', d => yScale(d[userChoiceY]))
		.attr('transform','translate(0,4.0)')
		.text(d => d.abbr) 

	var xLabels = chartGroup.append('g')
		.attr('transform', `translate(${width / 2}, ${height + 20})`);
	var povertyL = xLabels.append('text')
	    .attr('x', 0)
	    .attr('y', 20)
	    .attr('value', 'poverty')
	    .classed('aText inactive', true)
	    .text('In Poverty (%)');

	var ageL = xLabels.append('text')
	    .attr('x', 0)
	    .attr('y', 40)
	    .attr('value', 'age')
	    .classed('aText active', true)
	    .text('Age (Median)');

    var incomeL = xLabels.append('text')
	    .attr('x', 0)
	    .attr('y', 60)
	    .attr('value', 'income')
	    .classed('aText inactive', true)
	    .text('Household Income (Median)');

    var yLabels = chartGroup.append('g')
	var HealthL = yLabels.append('text')
	    .attr("transform", `translate(-40,${height / 2})rotate(-90)`)
	    .attr('value', 'healthcare')
	    .classed('aText active', true)
	    .text('Lacks Healthcare (%)');

	var smokesL = yLabels.append('text')
		.attr("transform", `translate(-60,${height / 2})rotate(-90)`)
	    .attr('value', 'smokes')
	    .classed('aText inactive', true)
	    .text('Smokes (%)');

    var obesityL = yLabels.append('text')
		.attr("transform", `translate(-80,${height / 2})rotate(-90)`)
	    .attr('value', 'obesity')
	    .classed('aText inactive', true)
	    .text('Obesse (%)');

	var stateCircles = updateToolTip(userChoiceY,userChoiceX,stateCircles,stateText),
		stateText = updateToolTip(userChoiceY,userChoiceX,stateCircles,stateText);

	xLabels.selectAll('text')
	    .on('click', function() {
		    var value = d3.select(this).attr('value');
		    if (value !== userChoiceX) { 
			    userChoiceX = value;

		        xScale = fetchXScaleForAxis(data, userChoiceX); 

		        xAxis.transition()
				    .duration(1000)
				    .ease(d3.easeBack)
					.call(d3.axisBottom(xScale));

		        stateCircles.transition()
			        .duration(1100)
			        .ease(d3.easeBack)
			        .on('start',function(){ 
			        	d3.select(this)
			        		.attr("opacity", 0.50)
							.attr('r',20)
							.attr('fill', 'blue');
			        })
			        .on('end',function(){ 
			        	d3.select(this)
			        		.attr("opacity", 1)
							.attr('r',17)
							.attr('fill', '#89a9d3');
			        })
			        .attr('cx', d => xScale(d[userChoiceX]));

			    d3.selectAll('.stateText').transition()
			    	.duration(1100)
			    	.ease(d3.easeBack)
			    	.attr('x', d => xScale(d[userChoiceX]));

	        	stateCircles = updateToolTip(userChoiceY,userChoiceX,stateCircles,stateText),
				stateText = updateToolTip(userChoiceY,userChoiceX,stateCircles,stateText);

		        if (userChoiceX === 'poverty') { 
				    povertyL
			            .classed('active', true)
			            .classed('inactive', false);
			        incomeL
			            .classed('active', false)
			            .classed('inactive', true);
		            ageL
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		        else if (userChoiceX === 'age'){ 
		        	povertyL
			            .classed('active', false)
			            .classed('inactive', true);
			        incomeL
			            .classed('active', false)
			            .classed('inactive', true);
		            ageL
			            .classed('active', true)
			            .classed('inactive', false);
		        }
		        else {                            
		        	povertyL
			            .classed('active', false)
			            .classed('inactive', true);
			        incomeL
			            .classed('active', true)
			            .classed('inactive', false);
		            ageL
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		    }
	    });
    yLabels.selectAll('text')
	    .on('click', function() {
		    var value = d3.select(this).attr('value');
		    if (value !== userChoiceY) {
			    userChoiceY = value;

		        yScale = fetchYScaleForAxis(data, userChoiceY);

		        yAxis.transition()
				    .duration(1100)
				    .ease(d3.easeBack)
					.call(d3.axisLeft(yScale));

		        stateCircles.transition()
			        .duration(1000)
			        .ease(d3.easeBack)
			        .on('start',function(){
			        	d3.select(this)
							.attr("opacity", 0.50)
							.attr('r',20)
							.attr('fill', 'blue');
			        })
			        .on('end',function(){
			        	d3.select(this)
			        		.attr("opacity", 1)
							.attr('r',17)
							.attr('fill', '#89a9d3');
			        })
			        .attr('cy', d => yScale(d[userChoiceY]));

			    d3.selectAll('.stateText').transition()
			    	.duration(1100)
			    	.ease(d3.easeBack)
			    	.attr('y', d => yScale(d[userChoiceY]));

	        	stateCircles = updateToolTip(userChoiceY,userChoiceX,stateCircles,stateText),
				stateText = updateToolTip(userChoiceY,userChoiceX,stateCircles,stateText);

		        if (userChoiceY === 'healthcare') { 
				    HealthL
			            .classed('active', true)
						.classed('inactive', false);
			        smokesL
			            .classed('active', false)
			            .classed('inactive', true);
		            obesityL
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		        else if (userChoiceY === 'obesity'){
		        	HealthL
			            .classed('active', false)
			            .classed('inactive', true);
			        smokesL
			            .classed('active', false)
			            .classed('inactive', true);
		            obesityL
			            .classed('active', true)
			            .classed('inactive', false);
		        }
		        else {
		        	HealthL
			            .classed('active', false)
			            .classed('inactive', true);
			        smokesL
			            .classed('active', true)
			            .classed('inactive', false);
		            obesityL
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		    }
	    });

});


function fetchXScaleForAxis(data,userChoiceX) { 
	var xScale = d3.scaleLinear()
	    .domain([d3.min(data, d => d[userChoiceX])*.6, 
	    		d3.max(data, d => d[userChoiceX])*1.1])
	    .range([0, width]);
    
    return xScale;
}

function fetchYScaleForAxis(data,userChoiceY) { 
	var yScale = d3.scaleLinear()
	    .domain([d3.min(data, d => d[userChoiceY])*.6, 
	    		d3.max(data, d => d[userChoiceY])*1.1])
	    .range([height, 0]);

    return yScale;
}


function updateToolTip(userChoiceY,userChoiceX,stateCircles,stateText) { 
    var toolTip = d3.tip()
        .attr('class','d3-tip')
        .offset([80, -60])
        .html( d => {
        	if(userChoiceX === "poverty")
	            return (`${d.state}<br>${userChoiceY}:${d[userChoiceY]}% 
	            		<br>${userChoiceX}:${d[userChoiceX]}%`)
        	else if (userChoiceX === 'income')
	            return (`${d.state}<br> ${userChoiceY}:${d[userChoiceY]}% 
	            		<br>${userChoiceX}:$${d[userChoiceX]}`)
	        else
	        	return (`${d.state}<br>${userChoiceY}:${d[userChoiceY]}% 
	            		<br>${userChoiceX}:${d[userChoiceX]}`)
	    });

	stateCircles.call(toolTip);
	stateCircles.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);

	d3.selectAll('.stateText').call(toolTip);
	d3.selectAll('.stateText').on('mouseover', toolTip.show).on('mouseout', toolTip.hide);


	return stateCircles;
	return stateText;
}