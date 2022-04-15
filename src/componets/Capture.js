
import { useEffect, useState } from "react";
// import * as faceapi from 'face-api.js';
const Capture = () => {
   
    function startup() {
        if (showViewLiveResultButton()) { return; }
        photo = document.getElementById('photo');
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function (stream) {
                video.srcObject = stream;
                video.play().catch(e => {
                    console.log(e);
                });
            })
            .catch(function (err) {
                console.log("An error occurred: " + err);
            });
       
        video.addEventListener('canplay', function (ev) {
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
        }, false);

        clearphoto();
    }
   

    let width = 320;
    let height = 0;
    let streaming = false;
    let video = null;
    let canvas = null;
    let photo = null;
    const [displayed, setDisplayed] = useState("none");


    function takepicture() {
        let context = canvas.getContext('2d');
        if (width && height) {

            canvas.width = width;
            canvas.height = height;
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

   
    useEffect(()=>{

        startup();
    });

    return (
        <div className="Container d-flex justify-content-center p-3 bg-secondary row">
            <div className=" card col-6" style={{ width: "18rem" }} >
                <video className=" card-img-top" id="video">Video stream not available.</video>
                <canvas id="canvas" style={{ display: "none" }}></canvas>
                <div className="output">
                    <img id="photo" className="card-img-top " alt="The screen capture will appear in this box." />
                </div>
                <div className="card-body ">
                    <h5 className="card-title">Preview</h5>
                    <p className="card-text">This window is used to capture image for storage as refernece for the recongizition process</p>
                    <button id="startbutton" type="button" className="btn btn-sm btn-primary col-6 " onClick={takepicture} >Capture</button>
                </div>
            </div>
        </div>
    );
}

export default Capture;