
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;


void main() {

	vTextureCoord = aTextureCoord;
	vec3 offset=vec3(0.0,texture2D(uSampler2, vTextureCoord).b,0.0);
		
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}

