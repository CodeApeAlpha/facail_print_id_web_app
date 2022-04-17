
import { useEffect, useState } from "react";
const Capture = () => {
    let width = 320;
    let height = 0;
    let streaming = false;
    let video = null;
    let canvas = null;
    let photo = null;
    const [captureCount,setCaptureCount]=useState(0);


    const startup=()=> {
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
        clearphoto();
    }
    const canPlay=()=>{
        // video.addEventListener('canplay', function (ev) {
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
    const takepicture=()=> {

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
    const clearphoto=()=> {
        let context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        let data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }
    const showViewLiveResultButton=()=> {
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
    const submitImage=()=>{
       let data= photo.getAttribute("src");
       console.log(data);
    }
    useEffect(()=>{
        startup();
    });
    return (
        <div className="Container d-flex justify-content-center p-3 bg-secondary row">
            <div className=" card col-12" style={{ width: "20rem" }} >
                <div className="row">
                    <video className=" card-img-top" id="video" onCanPlay={canPlay}  >Video stream not available.</video>
                    <img id="photo" className="card-img-top " alt="The screen capture will appear in this box." />
                </div>
                <div className="card-body ">
                    <h5 className="card-title">Preview</h5>
                    <p className="card-text">This window is used to capture image for storage as refernece for the recongizition process</p>
                    <div className="row">
                        <div className="col-6">
                            <button id="startbutton" type="button" className="btn btn-sm btn-primary w-100" onClick={takepicture} >Capture-{captureCount}</button>
                        </div>
                        <div className="col-6">
                            <button id="startbutton" type="button" className="btn btn-sm btn-success w-100" onClick={submitImage} >Submit</button>
                        </div>
                    </div>
                    <canvas id="canvas" style={{ display: "none" }}></canvas>
                </div>
            </div>
        </div>
    );
}
export default Capture;