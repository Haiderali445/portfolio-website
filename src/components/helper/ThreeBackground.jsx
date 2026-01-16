import React, { useEffect, useRef } from 'react';

const ThreeBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');

    if (!gl) return;

    const vsSource = `
      attribute vec4 aVertexPosition;
      void main() {
        gl_Position = aVertexPosition;
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        float time = uTime * 0.2;
        
        // Premium Mesh / Nebula Effect
        float color1 = sin(uv.x * 10.0 + time) * 0.5 + 0.5;
        float color2 = cos(uv.y * 8.0 - time * 1.2) * 0.5 + 0.5;
        float color3 = sin((uv.x + uv.y) * 12.0 + time * 0.5) * 0.5 + 0.5;

        vec3 baseColor = vec3(0.02, 0.04, 0.06); // Deep slate/black base
        vec3 accentColor = vec3(0.0, 0.9, 1.0); // Sharp Cyan accent

        float mixFactor = (color1 * color2 * color3);
        vec3 finalColor = mix(baseColor, accentColor * 0.15, mixFactor);
        
        // Add subtle vignetting
        float dist = distance(uv, vec2(0.5));
        finalColor *= 1.0 - dist * 0.5;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1.0,  1.0,
       1.0,  1.0,
      -1.0, -1.0,
       1.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'aVertexPosition');
    const timeUniformLocation = gl.getUniformLocation(program, 'uTime');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'uResolution');

    function render(time) {
      time *= 0.001; 

      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeUniformLocation, time);
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    return () => {
      // Cleanup
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ThreeBackground;
