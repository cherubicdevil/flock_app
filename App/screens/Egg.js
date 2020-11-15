import React, {useEffect} from 'react';
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector} from 'react-redux';
import {firebase} from 'App/firebase/config';
import NavBar from 'App/components/static/NavBar';
import {Constants} from 'react-native-unimodules';
import {GLView} from 'expo-gl';
import * as THREE from 'three';
//import {Renderer} from 'expo-three';
//console.log(Constants.systemFonts);

// const _onGLContextCreate = async (gl) => {
//   // Here is where we will define our scene, camera and renderer
//   // 1. Scene
//   var scene = new THREE.Scene(); // 2. Camera
//   const camera = new THREE.PerspectiveCamera(
//     75,
//     gl.drawingBufferWidth / gl.drawingBufferHeight,
//     0.1,
//     1000,
//   ); // 3. Renderer
//   const renderer = new Renderer({gl});
//   renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

//   // Define our shape (Below is a tetrahedron, but can be whatever)
//   const geometry = new THREE.TetrahedronBufferGeometry(0.1, 0); // Define the material, Below is material with hex color #00ff00
//   const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
//   // For custom material of any image, simply download any image into your project and use:// Define the full 3-D object
//   const objectToRender = new THREE.Mesh(geometry, material); // Specifying the cameras Z position will allow the object to appear in front of the camera rather that in line (which the camera which is the default)
//   camera.position.z = 2;

//   scene.add(objectToRender);

//   const animate = () => {
//     requestAnimationFrame(animate);
//     objectToRender.rotation.x += 0.01;
//     objectToRender.rotation.y += 0.01;
//     renderer.render(scene, camera);
//     gl.endFrameEXP();
//   };
//   animate();
// };

const create3dEgg = async (gl) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    gl.drawingBufferWidth / gl.drawingBufferHeight,
    0.1,
    1000,
  );

  camera.position.z = 7;
  const renderer = new Renderer({gl});
  //renderer.setClearColor(0x000000, 0.5);
  renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

  const light = new THREE.PointLight(0xffffff, 1, 0);
  light.position.set(3, 0.5, 2);
  scene.add(light);

  const floorlight = new THREE.PointLight(0xf0f0f0, 0.2, 0);
  floorlight.position.set(0, -5, 0);
  scene.add(floorlight);

  scene.add(new THREE.AmbientLight(0xffdd9e));

  const loader = new THREE.TextureLoader();
  loader.crossOrigin = '';

  const material = new THREE.MeshPhongMaterial({
    color: '#FFD700',
    //color: '#222222',
    shininess: 100,
    specular: '#FFfff0',
    //map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-4.jpg'),
    // map: loader.load(
    //   'https://threejsfundamentals.org/threejs/resources/images/flower-4.jpg',
    // ),
    //map: loader.load(require('../../../../../Desktop/dirt.jpg')),
  });
  var customMaterial = new THREE.ShaderMaterial({
    uniforms: {
      c: {type: 'f', value: 0.5},
      p: {type: 'f', value: 3.2},
      glowColor: {type: 'c', value: new THREE.Color(0xffdd9e)},
      viewVector: {type: 'v3', value: camera.position},
    },
    vertexShader: `uniform vec3 viewVector;
uniform float c;
uniform float p;
varying float intensity;
void main() 
{
    vec3 vNormal = normalize( normalMatrix * normal );
	vec3 vNormel = normalize( normalMatrix * viewVector );
	intensity = pow( c - dot(vNormal, vNormel), p );
	
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,
    fragmentShader: `uniform vec3 glowColor;
varying float intensity;
void main() 
{
	vec3 glow = glowColor;
    gl_FragColor = vec4( glow, intensity);
}`,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });

  var points = [];
  for (var deg = 0; deg <= 180; deg += 6) {
    var rad = (Math.PI * deg) / 180;
    var point = new THREE.Vector2(
      (0.72 + 0.08 * Math.cos(rad)) * Math.sin(rad) * 3,
      -Math.cos(rad) * 3,
    ); // the "egg equation"
    //console.log( point ); // x-coord should be greater than zero to avoid degenerate triangles; it is not in this formula.
    points.push(point);
  }
  var eggGeo = new THREE.LatheBufferGeometry(points, 32);
  const egg = new THREE.Mesh(eggGeo, material);

  var moonGlow = new THREE.Mesh(eggGeo.clone(), customMaterial.clone());
  moonGlow.position = egg.position;
  moonGlow.scale.multiplyScalar(1.2);

  const vertices = [];

  for (let i = 0; i < 30; i++) {
    const x = THREE.MathUtils.randFloatSpread(3);
    const y = THREE.MathUtils.randFloatSpread(3);
    const z = THREE.MathUtils.randFloatSpread(3);

    vertices.push(x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3),
  );

  const pointMaterial = new THREE.PointsMaterial({
    color: '#FFFF00',
    size: 0.05,
    sizeAttenuation: true,
    // vertexShader: vShader,
    // fragmentShader: fShader,
  });

  const particles = new THREE.Points(geometry, pointMaterial);

  scene.add(particles);

  scene.add(egg);
  scene.add(moonGlow);

  renderer.render(scene, camera);
  gl.endFrameEXP();
  //   const animate = () => {
  //     requestAnimationFrame(animate);
  //     // objectToRender.rotation.x += 0.01;
  //     // objectToRender.rotation.y += 0.01;
  //     particles.rotation.y += 0.02;
  //     renderer.render(scene, camera);
  //     gl.endFrameEXP();
  //   };
  //   animate();

  //var change = 1;
  //console.log(moonGlow.material);
};
const Egg = ({route, navigation}) => {
  const selector = useSelector((state) => state);

  const render3dEgg = () => {
    return (
      <GLView style={{width: 240, height: 360}} onContextCreate={create3dEgg} />
    );
  };
  const renderEgg = () => {
    const maxEgg = 80;

    const percent = (selector.goose.count / maxEgg) * 100;
    if (percent < 100) {
      return (
        <View style={{width: 300, height: 400}}>
          <View
            style={{
              width: '100%',
              height: `${percent}%`,
              //height: `${(height / maxEgg) * 100}%`,
              //backgroundColor: '#000',
              position: 'absolute',
              bottom: 0,
              zIndex: 1,
              overflow: 'hidden',
            }}>
            <Image
              style={{
                width: 300,
                height: 400,
                position: 'absolute',
                bottom: 0,
                //resizeMode: 'cover',
              }}
              source={require('App/Assets/Images/Egg_2.png')}
            />
          </View>
          <Image
            style={{width: 300, height: 400, zIndex: 10}}
            source={require('App/Assets/Images/Egg_1.png')}
          />
        </View>
      );
    } else {
      return (
        <Image
          style={{width: 300, height: 400}}
          source={require('App/Assets/Images/Egg_3.png')}
        />
      );
    }
  };
  //return <View />;
  return (
    <ImageBackground
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
      source={require('App/Assets/Images/UpsideDownBackground.png')}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(0,0,0,0.1)',
        }}>
        <Text
          style={{
            position: 'absolute',
            textAlign: 'center',
            top: 40,
            fontSize: 20,
            borderRadius: 4,
          }}>
          {selector.goose.count} goose egg savings
        </Text>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('ProfileMain');
          }}>
          <Image
            style={{
              height: 50,
              width: 50,
              position: 'absolute',
              right: 20,
              top: 30,
              borderRadius: 4,
            }}
            source={require('App/Assets/Images/default-profile-picture.jpg')}
          />
        </TouchableWithoutFeedback>
        {renderEgg()}
      </View>
      <NavBar route={route} navigation={navigation} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({});

export default Egg;
