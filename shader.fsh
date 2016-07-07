precision mediump float;

uniform int time;
uniform int width;
uniform int height;

void main() {
	// TODO TEMP
	vec3 finalColor = vec3(float(time)/100.0, float(width)/1240.0, float(height)/720.0);

	// output pixel color
	gl_FragColor = vec4(finalColor, 1.0);
}
