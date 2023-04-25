import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props) => {
  let config = {};
  if (props.fps) {
    config.fps = 100;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
    // config.qrbox = {
    //   width: window.screen.width < 600 ? 200 : 300,
    //   height: window.screen.width < 600 ? 100 : 100,
    // };
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

const Html5QrcodePlugin = (props) => {
  useEffect(() => {
    // when component mounts
    const config = createConfig(props);
    const verbose = props.verbose === true;
    // console.log(props.qrCodeSuccessCallback);
    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(
      props.readerId,
      config,
      verbose
    );
    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
      // html5QrcodeScanner.pause
    );

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  return <div id={props.readerId} />;
};

export default Html5QrcodePlugin;
