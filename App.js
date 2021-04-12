/* eslint-disable no-console */
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { RNCamera } from 'react-native-camera';


const landmarkSize = 2;

export default class CameraScreen extends React.Component {
  state = {
    type: 'front',
    canDetectFaces: 1,
    faces: [],
    jmlIterasi: 0,
  };

  componentDidMount(){
    console.log('-->>componen did mount')
  }

  componentDidUpdate(){
    // kalau ada perubahan
    setTimeout(() => {
      this.setState({
        jmlIterasi: this.state.jmlIterasi+1
      })
    },1000)
    if (this.state.jmlIterasi == 20){
      // console.log(this.state.jmlIterasi);
      this.takePicture()
      
      // nanti disini diisi sama loading waktu nge capture
    }
    else if (this.state.jmlIterasi < 20){
      console.log(this.state.faces);
    }
  }


  takePicture = async function() {
    if (this.camera) {
      const options = {
        quality: 1,
        orientation: 0,
        base64: true,
        pauseAfterCapture: true,
        fixOrientation: true,
      }
      const img = await this.camera.takePictureAsync(options);
      this.setState({img})
      console.warn('takePicture ', img);
      // membuat formdata
      const body = new FormData();
      
      // mengambil img yang disimpan di state
      body.append('img', {uri: img.uri, name: 'img.jpg', type: 'image/jpeg'});
      
      // fetch ke api untuk upload gambar
      fetch('http://192.168.8.104:5000/uploader',{
        method: 'post',
        // headers: {
        //   'Content-Type': 'undefined'
        // },
        body,
      })
      .then(a => a.text())
      .then(res => console.log(res));
      console.log(img.uri)
    }
  };

  // upload(){
  //   // membuat formdata
  //   const body = new FormData();
    
  //   // mengambil img yang disimpan di state
  //   body.append('img', {uri: this.state.img.uri, name: 'img.jpg', type: 'image/jpeg'});
    
  //   // fetch ke api untuk upload gambar
  //   fetch('http://192.168.8.104:5000/uploader',{
  //     method: 'post',
  //     // headers: {
  //     //   'Content-Type': 'undefined'
  //     // },
  //     body
  //   }).then(a => a.json()).then(res => alert(res));
  // }

  toggle = value => () => this.setState(prevState => ({ [value]: !prevState[value] }));

  facesDetected = ({ faces }) => this.setState({ faces });

  renderFace = ({ bounds, faceID, rollAngle, yawAngle }) => (
    <View
      key={faceID}
      transform={[
        { perspective: 600 },
        { rotateZ: `${rollAngle.toFixed(0)}deg` },
        { rotateY: `${yawAngle.toFixed(0)}deg` },
      ]}
      style={[
        styles.face,
        {
          ...bounds.size,
          left: bounds.origin.x,
          top: bounds.origin.y,
        },
      ]}
    >
      <Text style={styles.faceText}>ID: {faceID}</Text>
      <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
      <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
    </View>
  );

  renderLandmarksOfFace(face) {
    const renderLandmark = position =>
      position && (
        <View
          style={[
            styles.landmark,
            {
              left: position.x - landmarkSize / 2,
              top: position.y - landmarkSize / 2,
            },
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  }

  renderFaces = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderFace)}
    </View>
  );

  renderLandmarks = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderLandmarksOfFace)}
    </View>
  );


  renderCamera() {
    const { canDetectFaces, canDetectText, canDetectBarcode } = this.state;
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
        }}
        type={this.state.type}
        // flashMode={this.state.flash}
        // autoFocus={this.state.autoFocus}
        // zoom={this.state.zoom}
        // whiteBalance={this.state.whiteBalance}
        // ratio={this.state.ratio}
        // focusDepth={this.state.depth}
        trackingEnabled
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        faceDetectionLandmarks={
          RNCamera.Constants.FaceDetection.Landmarks
            ? RNCamera.Constants.FaceDetection.Landmarks.all
            : undefined
        }
        faceDetectionClassifications={
          RNCamera.Constants.FaceDetection.Classifications
            ? RNCamera.Constants.FaceDetection.Classifications.all
            : undefined
        }
        onFacesDetected={canDetectFaces ? this.facesDetected : null}
      >
        <View
          style={{
            flex: 0.5,
          }}
        >
          {/* tombol bagian atas 1 */}
          <View
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
          </View>
          {/* akhir tombol bagian atas 1 */}

          {/* tombol bagian atas 2 */}
          <View
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
          </View>
          {/* akhir tombol bagian atas 2 */}

        </View>

        {/* spacing atas dan bawah */}
        <View
          style={{
            flex: 0.4,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignSelf: 'flex-end',
          }}
        >
        </View>
        {/* akhir spacing atas dan bawah */}

        {/* tombol record */}
        <View
          style={{
            flex: 0.1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignSelf: 'flex-end',
          }}
        >
        </View>
        {/* akhir tombol record */}

        {/* bar bawah */}
        <View
          style={{
            flex: 0.15,
            backgroundColor: '#FF0000',
            flexDirection: 'row',
            // alignSelf: 'flex-end',
          }}
        >
          <Text>Halo Sayang</Text>
        </View>
        {/* akhir bar bawah */}

        {!!canDetectFaces && this.renderFaces()}
        {!!canDetectFaces && this.renderLandmarks()}
      </RNCamera>
    );
  }

  render() {
    return <View style={styles.container}>{this.renderCamera()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  zoomText: {
    position: 'absolute',
    bottom: 70,
    zIndex: 2,
    left: 2,
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'red',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  text: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#F00',
    justifyContent: 'center',
  },
  textBlock: {
    color: '#F00',
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});