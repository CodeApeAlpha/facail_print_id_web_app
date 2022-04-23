
import { useEffect, useState, useRef } from "react";
import * as faceapi from 'face-api.js';
import useDetection from "../customHook/useDetection ";



const Capture = () => {



    // useDetection()

    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [captureVideo, setCaptureVideo] = useState(false);
    const canvasRef = useRef();
    const videoRef = useRef();
    const videoHeight = 480;
    const videoWidth = 640;
    let width = 320;
    let height = 320;
    let video=null;
    let streaming = false;
    let canvas =null;
    let photo = null;

    useEffect(() => {
        const loadModles = async () => {
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.faceExpressionNet.loadFromUri('/models')
            ]).then(() => { setModelsLoaded(true); });
        }
        loadModles().then(async()=>{

            const image= await faceapi.fetchImage("https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/Black Widow/2.jpg");

            // await faceapi.bufferToImage(imageRef);
            // // Detect all faces from buffered image
            const detections =await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
            console.log(detections);
        
        });
    }
    , []);



    function startUpCamera() {
        console.log("Camera Started");
        setCaptureVideo(true);
        if (showViewLiveResultButton()) { return; }
        photo = document.getElementById('photo');
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function (stream) {
               let video = videoRef.current;
                video.srcObject = stream;
                video.play()
            })
            .catch(function (err) {
                console.log("An error occurred: " + err);
            });
        clearphoto();

    }

    function captureDetection() {
        // video.addEventListener('canplay', function (ev) {
            console.log("Event-canplay");
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);
                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.
                if (isNaN(height)) {
                    height = width / (4 / 3);
                }
                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        // }, false);
    }


    function faceDetection() {
        if (modelsLoaded) {
            setInterval(async () => {
                if (canvasRef && canvasRef.current) {
                    canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
                    const displaySize = {
                        width: videoWidth,
                        height: videoHeight
                    }
                    faceapi.matchDimensions(canvasRef.current, displaySize);

                    const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    canvasRef && canvasRef.current && canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
                    canvasRef && canvasRef.current && faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                    canvasRef && canvasRef.current && faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
                    canvasRef && canvasRef.current && faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
                }
            }, 100)
        }

    }

    function takepicture() {
        canvas=document.getElementById("canvas")
        video=document.getElementById("video")
        photo = document.getElementById('photo');
        let context = canvas.getContext('2d');



        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            console.log(width, height);
            context.drawImage(video, 0, 0, width, height);
            let data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);

        } else {
            clearphoto();
        }
    }
    function clearphoto() {
        
        let context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        let data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }
    function showViewLiveResultButton() {
        if (window.self !== window.top) {
            // Ensure that if our document is in a frame, we get the user
            // to first open it in its own tab or window. Otherwise, it
            // won't be able to request permission for camera access.
            document.querySelector(".contentarea").remove();
            const button = document.createElement("button");
            button.textContent = "View live result";
            document.body.append(button);
            button.addEventListener('click', () => window.open(window.location.href));
            return true;
        }
        return false;
    }





    return (
        <div className="Container d-flex justify-content-center p-3 bg-primary row">
            <div className=" card col-6 " style={{ width: "18rem" }}  >
                {
                    captureVideo ?
                    modelsLoaded ?
                    <div className="position-relative p-2">
                        <video ref={videoRef} className=" card-img-top" id="video" onPlay={faceDetection} onCanPlay={captureDetection}  >Video stream not available.</video>
                        <canvas ref={canvasRef} width={320} height={240} className="card-img position-absolute  top-50 start-50 translate-middle "></canvas>
                    </div>
                      :
                      <div>loading...</div>
                    :
                    <>
                    </>
                }

                <canvas id="canvas" style={{ display: "none" }}></canvas>

                <div className="output ">
                    <img id="photo" className="card-img-top"  alt="The screen capture will appear in this box." />
                </div>
                
                <div className="card-body ">
                    <h5 className="card-title">Preview</h5>
                    <p className="card-text">This window is used to capture image for storage as refernece for the recongizition process</p>
                    
                    {
                        captureVideo?
                        <button type="button" className="btn btn-sm btn-primary col-6 " onClick={takepicture}>Opend</button>
                        :
                        <button id="startbutton" type="button" className="btn btn-sm btn-primary col-6 "  onClick={startUpCamera} >Start Camera</button>
                        
                    }
                    
                </div>
            </div>
        </div>
    );
}

export default Capture;