
import * as faceapi from 'face-api.js';
import { useEffect} from "react";



const useDetection =()=>{
    useEffect(() => {
        const loadModles = async () => {
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.faceExpressionNet.loadFromUri('/models')
            ])
        }
        loadModles().then(async()=>{
            // console.log(imageRef);
            const image= await faceapi.fetchImage("https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/Black Widow/2.jpg");

            // await faceapi.bufferToImage(imageRef);
            // // Detect all faces from buffered image
            const detections =await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
            console.log(detections.length);
        });
    }
    , []);

}

export default useDetection;