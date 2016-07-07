const TOTAL_FRAMES = 100;

var init = function() {
	start(document.getElementById('my-canvas'));
};

var canvas;
var width;
var height;

var shader;

function start(_canvas) {
	if (canvas === null) {
		console.log("I couldn't find the canvas!");
		return null;
	}
	
	canvas = _canvas;
	
	gl = canvas.getContext("experimental-webgl");
	if (!gl) {
		gl = canvas.getContext("webgl");
		if (!gl) {
			console.log("I couldn't find WebGL!");
			return;
		}
	}

	// init GLSL Program
	var vertex_shader_source = getShaderSourceFromScript("vertex-shader");
	var fragment_shader_source = getShaderSourceFromScript("fragment-shader");

	var vertex_shader = createShader("vertex", gl.VERTEX_SHADER, vertex_shader_source);
	var fragment_shader = createShader("fragment", gl.FRAGMENT_SHADER, fragment_shader_source);

	shader = createShaderProgram(vertex_shader, fragment_shader);
	gl.useProgram(shader);
	
	handleTrivialVertices();
	
	shader.time = gl.getUniformLocation(shader, "time");
	shader.width = gl.getUniformLocation(shader, "width");
	shader.height = gl.getUniformLocation(shader, "height");
	
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, 
		new Float32Array([
			-1.0, -1.0, 
			 1.0, -1.0, 
			-1.0,	1.0, 
			-1.0,	1.0, 
			 1.0, -1.0, 
			 1.0,	1.0]), 
		gl.STATIC_DRAW);
	
	// render
	time = 0;
	render();
}

function render() {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	
	time++;
	if (time >= TOTAL_FRAMES)
		time -= TOTAL_FRAMES;
	
	gl.uniform1i(shader.time, time);
	gl.uniform1i(shader.width, canvas.width);
	gl.uniform1i(shader.height, canvas.height);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	
	window.requestAnimationFrame(render);
}

// Update canvas size
function updateSize(height, width) {
	height = height;
	width = width;
	canvas.height = height;
	canvas.width = width;
	gl.viewport(0, 0, canvas.width, canvas.height);
	update();
}

function createShaderProgram(vertex_shader, fragment_shader) {
	var program = gl.createProgram();
	gl.attachShader(program, vertex_shader);
	gl.attachShader(program, fragment_shader);
	gl.linkProgram(program);

	// Check link status
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.log("I couldn't link the shader!", gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
		return null;
	}

	return program;
}

function loadShaderSource(path) {
	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType("x-shader/x-fragment");
	xhr.open("get", path, false);
	xhr.send();

	var source = xhr.responseText;

	return source;
}


// Obtain the the source code of a shader from an element
function getShaderSourceFromScript(scriptId) {
	var shaderScript = document.getElementById(scriptId);
	if (!shaderScript) {
		console.log("I couldn't load shader script " + scriptId + "!");
		return;
	}

	return shaderScript.text;
}

function createShader(shader_name, shader_type, source) {
	var shader = gl.createShader(shader_type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	// check compilation status
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.log("The \"" + shader_name + "\" shader code didn't compile!", gl.getShaderInfoLog(shader));
		console.log("shader code:\n" + source);
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

function handleTrivialVertices() {
	var vertex_position = this.gl.getAttribLocation(shader, "aVertexPosition");

	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER,
		new Float32Array([
			-1.0, -1.0, 0.0,
			-1.0,  1.0, 0.0,
			1.0, -1.0, 0.0,
			1.0,  1.0, 0.0]),
		gl.STATIC_DRAW
	);
	gl.enableVertexAttribArray(vertex_position);
	gl.vertexAttribPointer(vertex_position, 3, gl.FLOAT, false, 0, 0);
}
